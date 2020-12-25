import React, { Component } from "react";
import './App.css';
import socketIOClient from "socket.io-client";


const ENDPOINT = "http://localhost:3000";

function msToTime(duration) {
  var seconds = 0, minutes = 0, hours = 0;
  if (duration) {      
    seconds = Math.floor((duration / 1000) % 60)
    minutes = Math.floor((duration / (1000 * 60)) % 60)
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  }
  return hours + " hours, " + minutes + " minutes, and " + seconds + " seconds";
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isDead: '',
      timeAlive: '',
      recordTimeAlive: '',
      socket: null
    };
}

  fetchInitialData() {
    fetch(ENDPOINT + "/status")
        .then(res => res.json())
        .then(res => {
          this.resetStateWithData(res);
        })
        .catch(err => err);
      }
  
  resetStateWithData(res) {
    var formattedRecordTime = msToTime(res.recordTime)
    var formattedTimeAlive = msToTime(res.timeAlive)
    this.setState({ 
      isDead: res.isDead, 
      recordTimeAlive: formattedRecordTime,
      timeAlive: formattedTimeAlive 
    })
  }

  componentDidMount() {
    this.fetchInitialData();
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      this.resetStateWithData(data);
    })
    this.state.socket = socket;
  }

  componentWillUnmount() {
    this.state.socket.close()
  }

  renderText() {
    if (!this.state.isDead) {
      return <div className="text">
              Turble is alive! He's {this.state.timeAlive} old.
            </div> 
    } else {
      return <div className="text">
              Turble is dead. Maybe overwatered? He'll be back in a few seconds.
            </div> 
    }
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <div className={this.state.isDead ? "dead" : "alive"}></div>
          {this.renderText()}
          <div className="text">
            His record is {this.state.recordTimeAlive}.
          </div>
        </div>
      </div>
    );
  }
}

export default App;
