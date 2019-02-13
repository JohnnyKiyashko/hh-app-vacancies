import React, {Component} from "react";
import "../PopupLauncher/PopupLauncher.css"
import Popup from "../Popup/Popup";

class PopupLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      text: "Выбрать город, регион"
    }
  }

  handleToggleModal() {
    this.setState({showModal: !this.state.showModal})
  }

  clearAreaValue(){
    this.props.onCityChange("")

    this.setState({
      text: "Выбрать город, регион"
    });
  }

  onCityChange = (areaId, areaName) => {
    this.setState({
      text: areaName
    })

    this.props.onCityChange(areaId);
  }

  render() {
    const {areas, cities} = this.props
    const {showModal, text} = this.state

    return (
      <div className="search-input-wrapper">
        <button
          type="button"
          className={"modal-button"}
          onClick={() => this.handleToggleModal()}
        >
          {text}
        </button>
        <button
          type="button"
          className={["modal-button", "modal-button-clear"].filter(x => !!x).join(' ')}
          onClick={() => this.clearAreaValue()}
        >
        <b>X</b>
        </button>
        {showModal && (
          <Popup areas={areas} cities={cities} onCityChange={this.onCityChange} onCloseRequest={() => this.handleToggleModal()} />
        )}
      </div>
    );
  }
}

export default PopupLauncher;
