// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

import $ from 'jquery';
import LoginManager from './login-manager';

import './css/base.scss';

let user;

$("#login-submit").click(() => {
  const username = $("#username").val();
  const pass = $("#password").val();
  login(username, pass);
});

function login(username, pass) {
  const login = new LoginManager(username, pass, function() {
    user = login.userData;
    if (login.id === "manager") {
      loadManagerPage();
    } else {
      loadUserPage();
    }
    hideLoginPage();
  });
}

function hideLoginPage() {
  $("#login-page").slideUp(1000);
}

function loadManagerPage() {

}

function loadUserPage() {
  $("#user-page").slideDown(1000);
  $("#user-name").append(user.name + "!");
  $("#user-bookings").html(`<p>You have x upcoming bookings.</p>`);
}

// login("customer23", "overlook2019");