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

// getData("customer23", "overlook2019");

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
    html: `There are <span class="bigtext">${
      roomsAvailable
    }</span> room${
      roomsAvailable > 1 ? "s" : ""
    } available today.`
  }).appendTo("#rooms-available");

  $("<section/>", {
    class: "card",
    html: `Total revenue today: <span class="bigtext">$${
      roomRepo.getRevenue(today)
    }</span>`
  }).appendTo("#revenue-today");

  $("<section/>", {
    class: "card",
    html: `<span class="bigtext no-before">${
      +(roomRepo.getBookedRooms(today).length / .25).toFixed(2)
    }%</span> of rooms are booked.`
  }).appendTo("#percent-occupied");

  $("#manager-page").slideDown(1000);
}

function loadUserPage() {
  $("#user-page").slideDown(1000);
  $("#user-name").append(user.name + "!");
  const bookings = roomRepo.filterBookingsByUser(user.id);
  $("#user-bookings").html(
    `<h3>Previous bookings:</h3><table class="date-table">${bookings.map(booking => 
      `<tr><td>${booking.date}</td><td>Room ${booking.roomNumber}</td></tr>`).join("")
    }</table>`
  );
  $("#user-spent").html(
    `You have spent <span class="bigtext">$${roomRepo.getTotalBookingsPrice(bookings)}</span> on rooms.`
  );
}