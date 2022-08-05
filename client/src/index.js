import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import reportWebVitals from './reportWebVitals';

const options = {
	// you can also just use 'bottom center'
	position: 'top center',
	timeout: 5000,
	offset: '30px',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<AlertProvider template={AlertTemplate} {...options}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</AlertProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
