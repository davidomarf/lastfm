import React from "react";

import styles from "./Heatmap.module.scss";
import * as d3 from "d3";

// Using it to render the months name without calling
// Date.toLocaleDateString() if only the month is needed
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

/**
 * Generate an array of dates containing every day between
 * start and end.
 *
 * If start is a later date than end, it will generate the dates
 * backwards.
 * @param {Date} start  First value of the array
 * @param {Date} end    Last value of the array
 * @return {Date[]}     All the days between start and end
 */
function getDateArray(start, end) {
  let step = 1;
  if (start > end) step = -1;
  let arr = [];
  let dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + step);
  }

  return arr;
}

/**
 * Function to interpolate colors using a given
 * d3 color palette.
 *
 * The domain is the range of the expected values to be
 * received in the interpolator.
 */
const myColor = d3
  .scaleSequential()
  .interpolator(d3.interpolateYlOrRd)
  .domain([0, 8]);

class Heatmap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dayArray = [];
    this.maxValue = 343;
    this.numberOfCategories = 8;
  }

  /**
   * Write "Mon", "Wed", and "Fri" at the leftmost part of
   * the visualization for the corresponding rows
   * @param {Object} svg  SVG element where the graph is drawn
   */
  drawWeekDays(svg) {
    let days = ["Mon", "Wed", "Fri"];
    for (let i = 0; i < days.length; i++)
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", (i + 1) * 20 - 4.25)
        .attr("class", styles["meta-text"] + " " + styles["day-flag"])
        .text(days[i]);
  }

  /**
   * Draw the legend of the graph that indicates the value range
   * for each color available in the heatmap
   *
   * @param {Object} svg  SVG element where the graph is drawn
   */
  drawLegend(svg) {
    let text = [
      [20, 90, "Less"],
      [45 + (this.numberOfCategories + 1) * 10, 90, "More"]
    ];

    svg
      .selectAll("text")
      .data(text)
      .enter()
      .append("text")
      .attr("x", d => d[0])
      .attr("y", d => d[1])
      .attr("class", styles["meta-text"])
      .text(d => d[2]);

    for (let i = 0; i <= this.numberOfCategories; i++) {
      svg
        .append("rect")
        .attr("x", 42 + i * 10)
        .attr("y", 82)
        .attr("width", 10)
        .attr("height", 10)
        .attr("class", styles["day"])
        .attr("style", "fill:" + myColor(i));
    }
  }

  draw(svg) {
    let activity = this.props.user.scrobbles.map(e =>
      Math.floor(e.date.uts / 86400)
    );
    console.log(activity)

    let dev_today = new Date();
    let end = dev_today;
    let endUTC = Math.floor(
      Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) / 86400000
    );
    // activity = activity.map(d => endUTC - d);
    let endActivityIndex = undefined;
    for (let i = 0; i < activity.length; i++) {
      if (end >= activity[i]) {
        endActivityIndex = i;
        break;
      }
    }

    let start = new Date(new Date().setFullYear(dev_today.getFullYear() - 1));
    let startUTC = Math.floor(
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) /
        86400000
    );
    let startActivityIndex = activity.length - 1;
    for (let i = endActivityIndex; i < activity.length; i++) {
      if (startUTC > activity[i]) {
        startActivityIndex = i - 1;
        break;
      }
    }

    activity = activity
      .slice(endActivityIndex, startActivityIndex + 1)
      .map(d => d - startUTC)
      .reverse();

    var counts = {};

    for (var i = 0; i < activity.length; i++) {
      var num = activity[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    let dates = getDateArray(start, end);

    let monthShift = 0;
    let weekShift = 0;
    let drawMonthNextSunday = false;
    for (let i = 0, j = 0; i < dates.length; i++) {
      let style = styles["day"];
      let color = undefined;
      if (counts[i] !== undefined) {
        color = myColor(
          Math.ceil(
            this.numberOfCategories * (counts[i] / (0.9 * this.maxValue))
          )
        ); //Math.ceil(5 * (counts[i] / 30));
      }
      let weekDay = dates[i].getDay();
      let monthDay = dates[i].getDate();
      if (monthDay === 1) {
        drawMonthNextSunday = true;
        monthShift += 5;
      }
      if (weekDay === 0) {
        weekShift++;
        if (drawMonthNextSunday) {
          svg
            .append("text")
            .attr("x", 20 + monthShift + weekShift * 10)
            .attr("y", -5)
            .text(months[dates[i].getMonth()])
            .attr("class", styles["meta-text"] + " " + styles["month-flag"]);

          drawMonthNextSunday = false;
        }
      }

      svg
        .append("rect")
        .attr("x", 20 + monthShift + weekShift * 10)
        .attr("y", weekDay * 10)
        .attr("width", 8)
        .attr("height", 8)
        .attr("class", style)
        .attr("style", "fill:" + color);
    }
  }

  componentDidMount() {
    const svg = d3
      .select(`#d3-section-${this.props.title}`)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-20 -20 640 120");
    this.drawLegend(svg);
    this.drawWeekDays(svg);
    this.draw(svg);
  }

  render() {
    return (
      <>
        <h2>
          Hey, {this.props.user.user}, this is how you listen to your music!
        </h2>
        <div
          id={`d3-section-${this.props.title}`}
          className={styles["graph-container"]}
        />
      </>
    );
  }
}

export default Heatmap;
