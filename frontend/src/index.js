import React from "react";
import ReactDOM from "react-dom";

import Retro from "./components/Retro";
import registerServiceWorker from "./registerServiceWorker";

import "../node_modules/bulma/css/bulma.min.css";

ReactDOM.render(<Retro />, document.getElementById("root"));
registerServiceWorker();
