import $ from 'jquery';
import LoginManager from './login-manager';

import './css/base.scss';
import RoomRepo from './room-repo';
import moment from 'moment';
import datepicker from 'js-datepicker';

let user;
let roomRepo = new RoomRepo();
let loginManager = new LoginManager();
let today = getToday();

function getToday() {
  return moment().format("YYYY/MM/DD");
}

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

getData("customer23", "overlook2019");

function login() {
  user = loginManager.userData;

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

  const bookingDate = datepicker("#booking-calendar", {
    minDate: new Date(),
    onSelect: (instance, date) => {
      date = moment(date).format("YYYY/MM/DD");
      const rooms = roomRepo.getOpenRooms(date);
      if (rooms.length === 0) {
        $("#booking-form").hide();
        $("#apology").show();
      } else {
        $("#apology").hide();
        $("#booking-form").show();
        $("#booking-open-rooms").html(
          rooms.map(room => 
            `<option value="${room.number}" data-room-type="${room.roomType}">Room ${room.number} (${
              room.numBeds} ${room.bedSize
            }-size beds, $${room.costPerNight}/ night)</option>`
          ).join("")
        );
      }
    } 
  });

  $("#booking-filter-room-type").click(() => {
    $("#booking-open-rooms").children().hide();
    var selected = $("#booking-filter-room-type")
      .children("input:checked")
      .map(function() { return this.value })
      .get();
    console.log(selected);
    selected.forEach(opt => {
      opt = opt.replace(/_/g, " ");
      $("#booking-open-rooms").children().filter(`option[data-room-type="${opt}"]`).show();
    });
  });

  $("#booking-submit").click(() => {
    const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings";
    const userID = user.id;
    const date = moment(bookingDate.dateSelected).format("YYYY/MM/DD");
    const roomNumber = parseInt($("#booking-open-rooms").val());
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userID, date, roomNumber})
    }).then(response => console.log(response))
      .catch(err => console.log(err));
  });
}