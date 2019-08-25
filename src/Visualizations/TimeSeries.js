/**
 * Time series graph that plots the weekly scrobbles in a year.
 *
 * The data is received as a prop from the state of UserPage, it calculates the
 * number of scrobbles on each week, and plots week vs. scrobbles in a time
 * series graph.
 *
 * @file    This file defines the TimeSeries Component.
 * @author  davidomarf
 * @since   v0.2.0
 */

import React from "react";
import styles from "./TimeSeries.module.scss";
import * as d3 from "d3";
import * as utils from "../utils/visualization-utils";

const lineFunction = d3
  .line()
  .x((d) => d3.select("#" + d.key).attr("cx"))
  .y((d) => d3.select("#" + d.key).attr("curve-y"))
  .curve(d3.curveMonotoneX);

/* -------------------------- Component Definition -------------------------- */

/**
 * TimeSeries that plots the weekly scrobbles in a year.
 */
class TimeSeries extends React.Component {
  constructor(props) {
    super(props);

    // List containing {id:count} elements, where id is the ID generated using
    // getIDFromDate(), and count is the number of scrobbles in that date
    this.frequencyList = {};

    // Maximum number of scrobbles in a single day
    this.mostScrobblesInAWeek = 0;

    // The last date for the period to be displayed in the Heatmap
    this.endDate = { date: new Date() };
    this.endDate.uts = Math.ceil(this.endDate.date.getTime() / 1000);

    // Same day as endDate, but one year ago
    this.startDate = {
      date: new Date(
        new Date().setFullYear(this.endDate.date.getFullYear() - 1)
      )
    };
    this.startDate.utc = Math.floor(this.startDate.date.getTime() / 1000);
  }

  /**
   * Update the Heatmap to indicate the number of scrobbles in each day.
   *
   * Go through an "array-ized" version of frequencyList, and use the {id} to
   * select the SVG items, and the {value} to calculate the fill color.
   */
  updateHeatmapValues() {
    // Convert the dictionary into an array of {key, value} objects
    // @see https://github.com/d3/d3-collection#entries
    let freqArray = d3.entries(this.frequencyList);
    this.numberOfColorTags = 4;

    // Update using the maximum value in freqArray
    this.mostScrobblesInAWeek = d3.max(freqArray, (d) => d.value.scrobbles);

    for (let i = 0; i < freqArray.length; i++) {
      let favoriteArtist = "";
      let artists = d3.entries(freqArray[`${i}`].value.artists);
      let artists_i = d3.scan(artists, (a, b) => b.value - a.value);
      if (artists.length !== 0) {
        favoriteArtist = artists[artists_i].key;
      }

      d3.select("#" + freqArray[`${i}`].key)
        .attr(
          "curve-y",
          -(freqArray[`${i}`].value.scrobbles / this.mostScrobblesInAWeek) * 60
        )
        .attr("scrobbles", freqArray[`${i}`].value.scrobbles)
        .attr("artist", favoriteArtist)
        .transition()
        .duration(2000)
        .attr(
          "cy",
          -(freqArray[`${i}`].value.scrobbles / this.mostScrobblesInAWeek) * 60
        );
      d3.select("#ts-curve")
        .transition()
        .duration(2000)
        .attr("d", lineFunction(freqArray));
    }
  }

  drawHeatmapCells(svg) {
    let firstMonday = new Date(this.startDate.date).setDate(
      this.startDate.date.getDate() - this.startDate.date.getDay()
    );

    let dates = utils.getDateArray(firstMonday, this.endDate.date, 7);
    let style = styles["week-circle"];

    svg
      .append("path")
      .attr("id", "ts-curve")
      .attr("d", lineFunction(d3.entries(this.frequencyList)))
      .attr("stroke", "#4e5467")
      .attr("stroke-width", 0.5)
      .attr("fill", "none");

    let monthShift = 0;

    for (let i = 0; i < dates.length; i++) {
      let id = utils.getIDFromDate(dates[`${i}`], "ts");
      this.frequencyList[`${id}`] = { scrobbles: 0, artists: {} };
      if (dates[`${i}`].getDate() <= 7) {
        monthShift += 5;
      }
      svg
        .append("circle")
        .attr("cx", 22 + monthShift + i * 10)
        .attr("curve-y", 0)
        .attr("cy", 0)
        .attr("r", 1)
        .attr("class", style)
        .attr("id", id)
        // The attributes 'date' and 'scrobbles' are used to get the content
        // of the tooltip when hovering on a cell
        .attr("date", utils.formatWeekFromDate(dates[`${i}`]))
        .attr("scrobbles", 0)
        .attr("artist", undefined)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  }

  /**
   * React function to run when the component has been mounted
   *
   * This runs only once, and uses that fact to initialize the canvas, and append
   * the items that won't be redrawn.
   */
  componentDidMount() {
    // This creates the svg for the graph
    const svg = d3
      .select(`#d3-section-${this.props.title}`)
      .append("svg")
      // This makes the svg element responsive
      // @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
      // @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-20 -119 640 120");
    // .attr("viewBox", "-20 -250 560 270");

    // // Draw the Heatmap structure: Legend, texts, and cells
    // this.drawLegend(svg);
    // this.drawWeekDays(svg);
    this.drawHeatmapCells(svg);

    // Initialize the tooltip. Draw it after all other items so it stays at top
    tooltip = svg.append("rect");
    tooltip_text = svg.append("text");

    // Assign the props value to a variable to avoid writing a lot
    let lastList = this.props.user.scrobbles;

    // Convert the list of scrobble objects into a list of strings using the
    // date to determine an ID
    let idList = [].concat.apply(
      [],
      lastList.map((e) =>
        e.list
          .map((e) => {
            let weekMonday = new Date(1000 * Math.ceil(Number(e.date.uts)));
            weekMonday.setDate(weekMonday.getDate() - weekMonday.getDay());
            return {
              id: utils.getIDFromDate(weekMonday, "ts"),
              artist: e.artist["#text"]
            };
          })
          .filter((e) => this.frequencyList[`${e.id}`] !== undefined)
      )
    );

    // This counts the number of times that a given id appears in the
    // current list of ids
    for (let i = 0; i < idList.length; i++) {
      let id = idList[`${i}`].id;
      let artist = idList[`${i}`].artist;

      // If this.frequencyList.id is defined, increment its value
      if (this.frequencyList[`${id}`] !== undefined) {
        this.frequencyList[`${id}`].scrobbles++;

        if (this.frequencyList[`${id}`].artists[`${artist}`] === undefined) {
          this.frequencyList[`${id}`].artists[`${artist}`] = 1;
        } else {
          this.frequencyList[`${id}`].artists[`${artist}`]++;
        }
      }
    }

    // Update the values considering the new added scrobbles
    this.updateHeatmapValues();
  }

  render() {
    return (
      <>
        <div
          id={`d3-section-${this.props.title}`}
          className={styles["graph-container"]}
        />
      </>
    );
  }
}

/* --------------------------- D3 Tooltip Elements -------------------------- */

// Tooltip and Tooltip text are global variables that are used to display the
// number of scrobbles and date of eaach day in the Heatmap.
let tooltip;
let tooltip_text;

// Rules to modify the tooltip the mouse is over
let mouseover = function(d) {
  tooltip.style("opacity", 0.9);
  tooltip_text.style("opacity", 1);
};

// Rules to modify the tooltip when the mouse moves within it
let mousemove = function(d) {
  let week = d3.select(this);
  tooltip_text
    .style("fill", "white")
    .text(
      `${week.attr("scrobbles")} scrobbles on ${week.attr(
        "date"
      )}. Favorite artist: ${week.attr("artist")}`
    )
    .attr("class", styles["meta-text"])
    .attr(
      "x",
      d3.mouse(this)[0] +
        (d3.mouse(this)[0] > 410
          ? -(tooltip_text.node().getBBox().width + 15)
          : 15)
    )
    .attr("y", d3.mouse(this)[1]);
  tooltip
    .attr("width", tooltip_text.node().getBBox().width + 10)
    .attr("height", 15)
    .attr(
      "x",
      d3.mouse(this)[0] +
        (d3.mouse(this)[0] > 410
          ? -(tooltip_text.node().getBBox().width + 20)
          : 10)
    )
    .attr("y", d3.mouse(this)[1] - 10);
};

// Rules to modify the tooltip when the mouse leaves it
let mouseleave = function(d) {
  tooltip.style("opacity", 0);
  tooltip_text.text("");
};

/* ---------------------------- Export Component ---------------------------- */

export default TimeSeries;
