import React from 'react';
import thunk from 'redux-thunk'; // for async dispatcher
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AuthRoute from './component/Router/AuthRoute.react';
import './App.css';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import { FileUpload } from './container/FileContainer/FileUpload.react';

const store = createStore(
	reducers,
	compose(
		applyMiddleware(thunk),
		window.devToolsExtension ? window.devToolsExtension() : () => {}
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
