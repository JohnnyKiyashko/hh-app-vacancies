import React, {Component} from 'react'
import Card from '../Card/Card'
import './CardListStyles.css'

export default class CardList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openCardId: null
    }
  }

  render() {
    const {currencies, cards} = this.props
    const {openCardId} = this.state

    const cardElements = (cards.length === 0) ? "Нет данных" : cards.map(
      (card) =>
        <li key={card.id} className="card-list__li">
          <Card card={card} currencies={currencies}
            isOpen={openCardId === card.id}
            onHeaderClick={this.handleClick.bind(this, card.id)}
          />
        </li>
    )

    return (
      <ul className="card-list__ul">
        {cardElements}
      </ul>
    )
  }

  handleClick = openCardId => {
    this.setState({
      openCardId: this.state.openCardId === openCardId ? null : openCardId
    })
  }
}