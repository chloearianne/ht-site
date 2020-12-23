import React, { Component } from "react";
import './App.css';
import socketIOClient from "socket.io-client";


const ENDPOINT = "https://localhost.com:443";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tag: '',
      timeAlive: '5 hours',
      recordTimeAlive: '10 days',
      socket: null
    };
}

  callAPI() {
    fetch(ENDPOINT + "/status")
        .then(res => res.text())
        .then(res => this.setState({ tag: res }))
        .catch(err => err);
  }

  componentDidMount() {
    this.callAPI();
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      console.log("resetting data tag");
      this.setState({tag: data ? "dead": "alive"});
      //this.forceUpdate()
    })
    this.state.socket = socket;
    console.log("connected to socket", socket)
  }

  componentWillUnmount() {
    this.state.socket.close()
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <div className={this.state.tag}></div>
          <div className="record-time">
            Turble has been alive for {this.state.timeAlive}.
          </div>
          <div className="record-time">
            His record is {this.state.recordTimeAlive}.
          </div>
        </div>
      </div>
    );
  }
}

export default App;
