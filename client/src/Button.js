import React, { Component } from "react";
import './Button.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      available: true
    };
  }

  render() {
    return (
      <div className="button">
      </div>
    );
  }
}

export default Button;
