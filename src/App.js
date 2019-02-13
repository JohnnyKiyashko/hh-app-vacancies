import React, {Component} from 'react'
import axios from 'axios'
import _ from 'lodash'
import CardList from './CardList/CardList'
import Pager from './Pager/Pager'
import PopupLauncher from './PopupLauncher/PopupLauncher'
import './App.css'

const API = 'https://api.hh.ru/'
const DEFAULT_QUERY = 'vacancies'
const DICTIONARY_QUERY = 'dictionaries'
const AREA_QUERY = 'areas/113'
const cities = {}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      text: '',
      areaId: '',
      areasDictionary: [],
      salary: null,
      currenciesDictionary: []
    }      
  }

  getCurrenciesDictionary(){
    this.setState({isLoading: true})
    const apiUrl = API + DICTIONARY_QUERY

    axios.get(apiUrl)
      .then(result => this.setState({
        currenciesDictionary: result.data.currency,
        isLoading: false
      }))
      .catch(error => this.setState({
        error, 
        isLoading: false 
      }))
  }

  getAreasDictionary(){
    this.setState({isLoading: true})
    const apiUrl = API + AREA_QUERY

    axios.get(apiUrl)
      .then(result => this.setState({
        areasDictionary: result.data,
        isLoading: false
      }))
      .catch(error => this.setState({
        error, 
        isLoading: false 
      }))
  }

  pageChangeHandler = (newPage) => {
    this.setState({
      currentPage: newPage
    }, () => {
      this.getData()
    })
  }

  cityChangeHandler = (areaId) => {
    if (areaId === ""){
      if (this.state.areaId === "") return
      this.setState({
        areaId: ""
      })
    }

    this.setState({
      currentPage: 1, 
      areaId: areaId 
    }, () => {
      this.getData()

    })
  }

  textChangeHandler = (e) => {
    this.setState({
      currentPage: 1, 
      text: e.target.value 
    }, () => {
      this.getDataDebounced()
    })
  }

  salaryChangeHandler = (e) => {
    if (e.target.value > 1e7) return

    this.setState({
      currentPage: 1, 
      salary: e.target.value 
    }, () => {
      this.getDataDebounced()
    })
  }

  getData(){
    const {currentPage, text, salary, areaId} = this.state

    var query = ''
    if (text) {query = "&no_magic=true&text=" + text}
    if (areaId) {query += "&area=" + areaId}
    if (salary) {query += "&salary=" + salary + "&only_with_salary=true"}

    const apiUrl = API + DEFAULT_QUERY + "?page=" + currentPage + query

    axios.get(apiUrl)
      .then(result => this.setState({
        items: result.data.items,
        isLoading: false
      }))
      .catch(error => this.setState({
        error, 
        isLoading: false 
      }))
  }

  getDataDebounced = _.debounce(this.getData, 500)

  componentDidMount() {
    this.getCurrenciesDictionary()
    this.getAreasDictionary()
  }

  getCities(areasDictionary) {
    for(var prop in areasDictionary) {
        if(typeof(areasDictionary[prop]) === 'object') {
            this.getCities(areasDictionary[prop])
        } else {
          if (!cities[areasDictionary.id]) {
            cities[areasDictionary.id] = areasDictionary.name
          } 
        }
    }
  }

  render (){
    const {isLoading, error, currenciesDictionary, areasDictionary, items, currentPage } = this.state
    
    Promise.all([this.getAreasDictionary]).then(() => {
      this.getCities(areasDictionary)
    })

    if (error){
      return <p>{error.message}</p>
    }

    if (isLoading) {
      return <p>Loading ...</p>
    }

    return (
      <div>
        <div className="app-header">
          <h1>
            <span>hh</span> Vacancies
          </h1>
        </div>     
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <input className="search-input-field" onChange={this.textChangeHandler} placeholder="Должность, ключевые слова.." />
          </div>
          <div className="search-input-wrapper">
            <input className="search-input-field" type="number" min="1" max="1000000" onChange={this.salaryChangeHandler} placeholder="Зарплата" />
          </div>
          <PopupLauncher areas={areasDictionary} cities={cities} onCityChange={this.cityChangeHandler} />
        </div>  
        <CardList cards = {items} currencies = {currenciesDictionary} />
        <Pager currentPage={currentPage} onPageChange={this.pageChangeHandler} />
      </div>
    )
  }
}

export default App
