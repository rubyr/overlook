import $ from 'jquery';
import LoginManager from './login-manager';

import './css/base.scss';
import RoomRepo from './room-repo';

let user;
let roomRepo = new RoomRepo();
let loginManager = new LoginManager();

const thing = (username, pass) => {
  if (loginManager.validatePass(pass)) {
    Promise.all([
      roomRepo.getData(), loginManager.getData(username)
    ]).then(login);
  }
};

thing("customer23", "overlook2019");

function login() {
  user = loginManager.userData;
  if (login.id === "manager") {
    loadManagerPage();
  } else {
    loadUserPage();
  }
  hideLoginPage();
}

function hideLoginPage() {
  $("#login-page").slideUp(1000);
}

function loadManagerPage() {

}

function loadUserPage() {
  $("#user-page").slideDown(1000);
  $("#user-name").append(user.name + "!");
  const bookings = roomRepo.filterBookingsByUser(user.id);
  // todo: find a better system of displaying this
  $("#user-bookings").html(
    `<p>${bookings.map(booking => booking.date + "</p><p>").join("")}</p>`
  );
  $("#user-spent").html(
    `You have spent $${roomRepo.getTotalBookingsPrice(bookings)} on rooms.`
  );
}