import Room from './room';

class RoomRepo {
  constructor() {
    this.rooms = [];
    this.bookings = [];
  }

  getData() {
    return Promise.all([this.fetchRooms(), this.fetchBookings()]);
  }

  fetchData(url, callback) {
    return fetch(`https://fe-apps.herokuapp.com/api/v1/overlook/1904/${url}`)
      .then(response => response.json())
      .then(data => {
        callback(data);
      });
  }

  fetchRooms() {
    return this.fetchData('rooms/rooms', data => {
      this.rooms = data.rooms.map(roomData => new Room(roomData));
    });
  }

  fetchBookings() {
    return this.fetchData('bookings/bookings', data => {
      this.bookings = this.sortBookingsByDate(data.bookings);
    });
  }

  findRoomByNumber(roomNumber) {
    return this.rooms.find(room => room.number === roomNumber);
  }

  filterBookingsByUser(userId) {
    return this.bookings.filter(booking => booking.userID === userId);
  }


  sortBookingsByDate(bookings) {
    return bookings.sort((a, b) => {
      a = a.date.split("/").map(a => Number(a));
      b = b.date.split("/").map(b => Number(b));
      a = new Date(a[0], a[1] - 1, a[2]);
      b = new Date(b[0], b[1] - 1, b[2]);
      return a > b ? 1 : -1;
    });
  }

  getTotalBookingsPrice(bookings) {
    return +bookings.reduce((acc, b) => {
      return acc + this.findRoomByNumber(b.roomNumber).costPerNight;
    }, 0).toFixed(2);
  }

  getRandomDate() {
    return this.bookings[Math.floor(Math.random() * this.bookings.length)].date;
  }

  getBookedRooms(date) {
    return this.rooms.filter(room => {
      const bookingsToday = this.bookings.filter(
        booking => booking.date === date);
      return bookingsToday.find(booking => booking.roomNumber === room.number);
    })
  }

  getOpenRooms(date) {
    return this.rooms.filter(room => {
      return !this.getBookedRooms(date).find(bookedRoom => room === bookedRoom);
    });
  }

  getRevenue(date) {
    return +this.getBookedRooms(date).reduce((acc, room) => acc + room.costPerNight, 0).toFixed(2);
  }
}

export default RoomRepo;