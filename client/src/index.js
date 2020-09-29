import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import AuthForm from './components/AuthForm';

ReactDOM.render(
  <React.StrictMode>
    <h1> Hello world </h1>
    <AuthForm />
  </React.StrictMode>,
  document.getElementById('root')
);
