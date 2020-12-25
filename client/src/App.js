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

const intro = "Hi! I'm Turble! I like attention and die if no one's looking at me!"
const xmas = "Merry Crimminins!!!"
const doot = "Deck the halls with boughs of Turble, falalalala"
const noah = "Noah is the greatest :)"
const attention = "HEY! pay attention to me :("
const threeleaves = "What has three leaves and don't give a fuck?"

const speeches = [noah, xmas, doot, attention, threeleaves]
const speechIndexLimitMax = 10;
var speechTimeCounter = 1;
var speechIndex = 0;
var speechIndexLimit = speechIndexLimitMax;
var speaking = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isDead: '',
      timeAlive: '',
      recordTimeAlive: '',
      socket: null,
      speech: intro,
    };
  }

  cycleSpeech() {
    if (speaking) {
      if (this.state.speech == intro) {
        speechIndexLimit = 8;
        speechIndex = 1
      }
      speaking = false;
      this.setState({speech: ''});
    } else {
      var newSpeechIndex = getRandomInt(0, speeches.length);
      while (newSpeechIndex == speechIndex) {
        newSpeechIndex = getRandomInt(0, speeches.length);
      }
      speechIndex = newSpeechIndex
      this.setState({speech: speeches[speechIndex]});
      speaking = true;
    }
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
    var newSpeech = this.state.speech
    if (this.state.isDead && !res.isDead) {
      newSpeech = intro
      speechTimeCounter = 1
      speaking = true
      speechIndexLimit = speechIndexLimitMax;
    }
    
    var formattedRecordTime = msToTime(res.recordTime)
    var formattedTimeAlive = msToTime(res.timeAlive)
    this.setState({ 
      isDead: res.isDead, 
      recordTimeAlive: formattedRecordTime,
      timeAlive: formattedTimeAlive,
      speech: newSpeech
    })
  }

  componentDidMount() {
    this.fetchInitialData();
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      this.resetStateWithData(data);
      console.log("speech counter is", speechTimeCounter, " and inxexlimit is ", speechIndexLimit)
      if (speechTimeCounter % speechIndexLimit == 0) {
        this.cycleSpeech()
      }
      if (!this.state.isDead) {
        speechTimeCounter += 1;
      }
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

  renderSpeech() {
    if (!this.state.isDead && this.state.speech) {
      return <div className="bubble bubble-bottom-left" contentEditable>
        {this.state.speech}
      </div>
  }
}

  render() {
    return (
      <div className="main">
        <div className="container">
          <div className={this.state.isDead ? "dead" : "alive"}></div>
          {this.renderSpeech()}
          {this.renderText()}
          <div className="text">
            His record is {this.state.recordTimeAlive}.
          </div>
        </div>
      </div>
    );
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default App;

