import $ from 'jquery';
import LoginManager from './login-manager';

import './css/base.scss';
import RoomRepo from './room-repo';
import moment from 'moment';
import datepicker from 'js-datepicker';

let user;
const roomRepo = new RoomRepo();
const loginManager = new LoginManager();
const today = getToday();

const bookingDate = datepicker("#booking-calendar", {
  minDate: new Date(),
  onSelect: showOpenRooms
});

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
});

function login() {
  user = loginManager.userData;

  $("<h3/>", {
    id: "date",
    text: today
  }).appendTo("header");

  $("aside").delay(1000).show();

  $("#new-booking").show();

  if (loginManager.id === "manager") {
    loadManagerPage();
  } else {
    loadUserPage();
  }
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

  $("aside").prepend(
    `<label for="manager-customer-search">Customer Search</label>
    <input id="manager-customer-search"></input>
    <section id="manager-customer-stats" style="display:none"></section>`
  );

  $("#manager-customer-search").on('keyup', (event) => {
    const query = $("#manager-customer-search").val().toLowerCase();
    if (event.keyCode === 13) {
      const userData = user.find(
        (usr) => usr.name.toLowerCase().includes(query)
      );

      if (userData !== undefined) {
        initForm(userData.id);
        const bookings = roomRepo.filterBookingsByUser(userData.id);
        $("#manager-customer-stats").html(
          `<h3>${userData.name}</h3>
          <ul>` + bookings.map(book => {
            const future = compareDates(book.date, today) === 1;
            return `<li data-booking-id=${book.id}>
              ${future ? `<button class="remove-booking">&times;</button>` : ""}
              Room ${book.roomNumber} on ${book.date}
            </li>`
          }).join("") + `</ul>`
        ).show();

        $("button.remove-booking").click(function() {
          const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings";
          const id = parseInt(this.closest("li").dataset.bookingId);
          fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
          }).then(response => {
            if (response.ok) {
              this.closest("ul").removeChild(this.closest("li"));
            } else {
              console.log(response);
            }
          }).catch(err => console.log(err));
        });
      } else {
        $("#manager-customer-stats").html(
          `Sorry, but there were no users matching that name.`
        ).show();
      }
    }
  });

  $("#manager-page").slideDown(1000);
}

function loadUserPage() {
  $("#user-page").slideDown(1000);
  $("#user-name").append(user.name + "!");
  const bookings = roomRepo.filterBookingsByUser(user.id);
  const pastBookings = bookings.filter(b => compareDates(b.date, today) === -1);
  const futureBookings = bookings.filter(b => compareDates(b.date, today) === 1);
  $("#user-bookings").html(
    `<h3>Previous bookings:</h3><table class="date-table">${
      pastBookings.map(booking => `<tr><td>${booking.date}</td><td>Room ${
        booking.roomNumber}</td></tr>`).join("")
    }</table>`
  );

  $("#user-upcoming-bookings").html(
    `<h3>Upcoming bookings:</h3><table class="date-table">${
      futureBookings.map(booking => `<tr><td>${booking.date}</td><td>Room ${
        booking.roomNumber}</td></tr>`).join("")
    }</table>`
  );
  $("#user-spent").html(
    `You have spent <span class="bigtext">$${roomRepo.getTotalBookingsPrice(bookings)}</span> on rooms.`
  );

  initForm();
}

function initForm(userId) {
  $("#booking-filter-room-type").click(() => {
    $("#booking-open-rooms").children().hide();
    var selected = $("#booking-filter-room-type")
      .children("input:checked")
      .map(function() { 
        return this.value 
      }).get();
    
    selected.forEach(opt => {
      opt = opt.replace(/_/g, " ");
      $("#booking-open-rooms").children().filter(`option[data-room-type="${opt}"]`).show();
    });
  });

  $("#booking-submit").click(() => {
    const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings";
    const userID = user.id || userId;
    const date = moment(bookingDate.dateSelected).format("YYYY/MM/DD");
    const roomNumber = parseInt($("#booking-open-rooms").val());
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userID, date, roomNumber})
    }).then(response => {
      if (response.ok) {
        $("#booking-calendar").val("");
        $("#booking-form").hide();
        $("#booking-status").html(
          `Congratulations! You're booked for Room ${roomNumber} on ${date}`
        ).addClass("status-success").removeClass("status-error")
          .delay(5000).slideUp(1000);
      } else {
        $("#booking-status").html(
          "Sorry, something went wrong. Please try again."
        ).addClass("status-error").removeClass("status-success")
          .delay(5000).slideUp(1000);
      }
    }).catch(err => console.log(err));
  });
}

function compareDates(a, b) {
  a = a.split("/").map(a => Number(a));
  b = b.split("/").map(b => Number(b));
  a = new Date(a[0], a[1] - 1, a[2]);
  b = new Date(b[0], b[1] - 1, b[2]);
  return a > b ? 1 : -1;
}

function showOpenRooms(datepicker, date) {
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