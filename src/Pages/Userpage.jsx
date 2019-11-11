import React from "react";

import styles from "./Userpage.module.scss";

import Heatmap from "../Visualizations/Heatmap";
import TimeSeries from "../Visualizations/TimeSeries";
import Loading from "../Elements/Loading";

const lastfm = require("../API/lastfm");

/**
 * Whole page for the user rendered when route is /user/:user
 */
class UserPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set user to the string after /user/ in the url
      user: props.match.params.user,
      playcount: 0,
      pages: 1,
      scrobbles: []
    };

    this.endDate = { date: new Date() };
    this.endDate.utc = Math.ceil(this.endDate.date.getTime() / 1000);

    // Same day as endDate, but one year ago
    this.startDate = {
      date: new Date(
        new Date().setFullYear(this.endDate.date.getFullYear() - 1)
      )
    };
    this.startDate.utc = Math.floor(this.startDate.date.getTime() / 1000);

    // Get the actual playcount of the user
    this.getPlaycount();
  }

  /**
   * Update the state of the component to contain the complete list of scrobbles
   */
  getScrobbles() {
    // Function to filter the value of the promise and return only what we'll be using
    const returnRecentTracks = (e) => {
      // If the user is currently scrobbling, delete that element
      if (e.recenttracks.track[0]["@attr"]) {
        e.recenttracks.track.shift();
      }
      return e.recenttracks.track;
    };

    for (let i = 1; i <= this.state.pages; i++) {
      // lastfm.getScrobbles() returns a Promise
      lastfm
        .getScrobbles(this.state.user, i)
        // When resolved, update the state by concatenating the value of the promise
        .then((v) => {
          if (v) {
            let list = returnRecentTracks(v);
            let start = Number(list[list.length - 1].date.uts);
            let end = Number(list[0].date.uts);
            this.setState({
              scrobbles: this.state.scrobbles.concat({
                page: i,
                list,
                start,
                end
              })
            });
          } else {
            console.log(i);
          }
        });
    }
  }

  /**
   * Update the state of the component to contain the number of scrobbles from the user
   */
  getPlaycount() {
    // lastfm.getUserPlayCount() returns a Promise
    lastfm
      .getUserPlayCount(this.state.user)
      // When resolved, set the state using the value of the promise, and send
      // a callback to get the scrobbles
      .then((v) =>
        this.setState(
          {
            playcount: Number(v.user.playcount),
            pages: Math.ceil(Number(v.user.playcount) / 200)
          },
          () => this.getScrobbles()
        )
      );
  }

    render() {
    return (
      <div id="fullpage-wrapper">
        <div className="section">
          <center>
            <h2>
              Hey, <u>{this.state.user}</u>, this is how you've been listening
              to music!
            </h2>
          </center>
          <div className={styles["section-container"]}>
            {/* Mount Heatmap only when the scrobbles are set */}
            {this.state.scrobbles.length < this.state.pages && (
              <Loading
                pages={this.state.scrobbles.length}
                total={this.state.pages}
              />
            )}
            {this.state.scrobbles.length >= this.state.pages && (
              <TimeSeries title="Timeseries" user={this.state} />
            )}
            {this.state.scrobbles.length >= this.state.pages && (
              <Heatmap title="Heatmap" user={this.state} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
