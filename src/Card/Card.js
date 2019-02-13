import React, {Component} from 'react'
import axios from 'axios'
import './CardStyles.css'

const API = 'https://api.hh.ru/'
const DEFAULT_QUERY = 'vacancies'

class Card extends Component {
  constructor(props) {
    super(props)

    this.state = {
      count: 0,
      fullCard: {},
      isLoading: false
    }
  }

  getFullCard(cardId) {
    this.setState({isLoading: true})

    const apiUrl = API + DEFAULT_QUERY + "/" + cardId

    axios.get(apiUrl)
      .then(result => this.setState({
        fullCard: result.data,
        isLoading: false
      }))
      .catch(error => this.setState({
        error,
        isLoading: false
      }))
  }

  handleClick = (cardId) => () => {
    const {onHeaderClick} = this.props

    this.getFullCard(cardId)
    onHeaderClick()
  }

  getCurrentCurrencyAbbr(currency) {
    return this.props.currencies.filter(x => x.code === '' + currency + '').map(x => x.abbr)
  }

  contactsInfo(contacts) {

    return (contacts) ? (
      <div className="contacts-info">Контактная информация:
        <p>{(contacts.name) ? contacts.name : ""}</p>
        <p>{(contacts.email) ? contacts.email : ""}</p>
        {(contacts.phones.length !== 0) ? (contacts.phones.map((phone, id) =>
            <p key={id}>Телефон: {phone.country} ({phone.city}) {phone.number}</p>
        )) : ""}
      </div>
    ) : ""
  }

  getKeySkills(skills){
    if (skills.length === 0) return ""

    return skills.map((card, id) => <span className="card-skills-label" key={id}>{card.name}</span>)            
  }

  getSalary(salary){
    if (salary === null) return ""

    const abbr = this.getCurrentCurrencyAbbr(salary.currency)
     
    if (salary.from !== null && salary.to !== null) 
      return (salary.from + "-" + salary.to) + " " + abbr
    
    return ((salary.from !== null) ? "от " + salary.from : "до " + salary.to) + " " + abbr
  }

  render() {
    const {card, isOpen} = this.props
    const cardDescription = this.state.fullCard

    const body = isOpen && JSON.stringify(cardDescription) !== "{}" &&
      <section>
        <p>Требуемый опыт работы: {cardDescription.experience.name}</p>
        <p> {cardDescription.employment.name}</p>
        <p> {cardDescription.schedule.name}</p>
        <div dangerouslySetInnerHTML={{__html: cardDescription.description}}></div>
        <p>
          <b>Ключевые навыки:</b> {this.getKeySkills(cardDescription.key_skills)} 
        </p>
        <div> {this.contactsInfo(cardDescription.contacts)} </div>
      </section>

    return (
      <div className="card-item" >
        <div className="card-header">
          <div className="card-header-info">
            <div className="card-header-item" onClick={this.handleClick(card.id)}>{card.name}</div>
          </div>
          <div className="card-salary">
            {this.getSalary(card.salary)}
          </div>
        </div>
        <div className="card-company-info">{card.employer.name} , {card.area.name}</div>
        <div>
          {body}
          <div className="card-publish-date">
              Дата публикации: {(new Date(card.published_at).toLocaleString("ru"))}
          </div>
        </div>
      </div>
    )
  }
}

export default Card