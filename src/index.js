// Import React library for building user interfaces
import React from "react";
// Import ReactDOM for rendering React components to the DOM
import ReactDOM from "react-dom";
// Import the main App component
import App from "./App";
// Import BrowserRouter for enabling routing in the application
import { BrowserRouter } from "react-router-dom";

// Render the application to the root DOM element
ReactDOM.render(
  <React.StrictMode>
    {/* Wrap the application in BrowserRouter to enable routing */}
    <BrowserRouter>
      {/* Render the main App component */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  // Specify the root DOM element where the app will be mounted
  document.getElementById("root")
);
