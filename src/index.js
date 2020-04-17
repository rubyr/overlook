import $ from 'jquery';
import LoginManager from './login-manager';

import './css/base.scss';
import RoomRepo from './room-repo';

let user;
let roomRepo = new RoomRepo();
let loginManager = new LoginManager();
let today = "1970/01/01";

function getData(username, pass) {
  if (loginManager.validatePass(pass)) {
    Promise.all([
      roomRepo.getData(), loginManager.getData(username)
    ]).then(login);
  }
}

$("#login-submit").click(() => {
  getData(
    $("#username").val(),
    $("#password").val()
  )
})

getData("manager", "overlook2019");

function login() {
  user = loginManager.userData;
  today = roomRepo.getRandomDate();

  $("<h3/>", {
    id: "date",
    text: today
  }).appendTo("header");

  if (loginManager.id === "manager") {
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
  const roomsAvailable = roomRepo.getOpenRooms(today).length;

  $("<section/>", {
    class: "card",
    text: `There are ${
      roomsAvailable
    } room${
      roomsAvailable > 1 ? "s" : ""
    } available today.`
  }).appendTo("#rooms-available");

  $("<section/>", {
    class: "card",
    text: `Total revenue today: $${
      roomRepo.getRevenue(today)
    }`
  }).appendTo("#revenue-today");

  $("<section/>", {
    class: "card",
    text: `${
      +(roomRepo.getBookedRooms(today).length / .25).toFixed(2)
    }% of rooms are booked.`
  }).appendTo("#percent-occupied");

  $("#manager-page").slideDown(1000);
}

function loadUserPage() {
  $("#user-page").slideDown(1000);
  $("#user-name").append(user.name + "!");
  const bookings = roomRepo.filterBookingsByUser(user.id);
  // todo: find a better system of displaying this
  $("#user-bookings").html(
    `<h3>Previous bookings:</h3><p>${bookings.map(booking => 
      `${booking.date}: Room ${booking.roomNumber}</p><p>`).join("")
    }</p>`
  );
  $("#user-spent").html(
    `You have spent $${roomRepo.getTotalBookingsPrice(bookings)} on rooms.`
  );
}