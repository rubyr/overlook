// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

import $ from 'jquery';
import LoginManager from './login-manager';

import './css/base.scss';

$("#login-submit").click(() => {
  const username = $("#username").val();
  const pass = $("#password").val();
  const login = new LoginManager(username, pass, function() {
    console.log(login.userData);
  });
});