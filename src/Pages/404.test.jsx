import React from "react";
import ReactDOM from "react-dom";
import NoMatch from "./404";

describe("404 Page", () => {
  it("should render without crashing", () => {
    let div = document.createElement("div");
    ReactDOM.render(<NoMatch />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
