import React from "react";
import thunk from "redux-thunk"; // for async dispatcher
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AuthRoute from "./Router/AuthRoute.react";
import "./App.css";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import "bootstrap/dist/css/bootstrap.min.css";

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <AuthRoute></AuthRoute>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
