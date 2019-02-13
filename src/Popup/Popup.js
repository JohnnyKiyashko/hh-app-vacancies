import React, {Component} from "react"
import _ from "lodash"
import "./PopupStyles.css"


class Popup extends Component {
  constructor(props) {
    super(props)

    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp, false)
    document.addEventListener("click", this.handleOutsideClick, false)
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp, false)
    document.removeEventListener("click", this.handleOutsideClick, false)
  }

  handleKeyUp(e) {
    const {onCloseRequest} = this.props
    const keys = {
      27: () => {
        e.preventDefault()
        onCloseRequest()
        window.removeEventListener("keyup", this.handleKeyUp, false)
      }
    }

    if (keys[e.keyCode]) {
      keys[e.keyCode]()
    }
  }

  handleOutsideClick(e) {
    const {onCloseRequest} = this.props

    if (!_.isNil(this.modal)) {
      if (!this.modal.contains(e.target)) {
        onCloseRequest()
        document.removeEventListener("click", this.handleOutsideClick, false)
      }
    }
  }

  handleClick = (key, name) => () => {
    this.props.onCityChange(key, name)
    this.props.onCloseRequest()
  }

  render() {
    const {cities} = this.props

    return (
      <div className="popup">
        <div className="popup-wrapper" ref={node => (this.modal = node)}>
            <div className="popup-header">Выберите город</div>
            <div className="popup-content">
              {
                _.map(cities, (name, key)=> {
                    return <div className="popup-city-item" key={key} onClick={this.handleClick(key, name)}>{name}</div>
                })
              }
            </div>
        </div>
      </div>
    )
  }
}

export default Popup
