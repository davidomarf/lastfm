import React from "react";

/**
 * Displays and handles the form to get the last.fm username
 */
function Loading(props) {
  return (
    <>
      <h2>We are reading your scrobbles</h2>
      <h3>
        {props.pages} out of {props.total} pages
      </h3>
      <p>
        You can go for a snack, we'll take about{" "}
        {Math.round((props.total - props.pages) / 5)} seconds
      </p>
    </>
  );
}

export default Loading;
