import React from "react";
import { withRouter } from "react-router-dom";

import styles from "./UserInput.module.scss";

/**
 * Displays and handles the form to get the last.fm username
 */
class UserInput extends React.Component {
  constructor() {
    super();
    this.state = {
      user: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ user: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // When submitted, redirect to /user/user, matching
    // the Route that renders Userpage
    this.props.history.push("/user/" + this.state.user);
  }

  render() {
    return (
      <div className={styles.field}>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="Username"
              value={this.state.user}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default withRouter(UserInput);
