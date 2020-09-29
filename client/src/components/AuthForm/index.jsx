import React from 'react';
import ReactDOM from 'react-dom';

import './AuthForm.css';

export default function AuthForm() {
  return (
    <form
      method="post"
      className="auth-form"
      //   onsubmit="javascript:document.location='http://' + $('login') + ':' + $('pass') + '@mydomain.tld';"
    >
      <input type="text" name="login" id="login" />
      <input type="password" name="pass" id="pass" />
      <input type="submit" value="ok" />

      <h3>Hello from ipsum lorem</h3>
    </form>
  );
}
