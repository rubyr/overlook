import chai from 'chai';
import RoomRepo from '../src/room-repo';
const expect = chai.expect;

describe('RoomRepo', function() {
  let roomRepo;
  let bookings;
  let rooms;
  this.beforeEach(function() {
    roomRepo = new RoomRepo();
    bookings = [{
      id: "5fwrgu4i7k55hl6sz",
      userID: 9,
      date: "2020/02/04",
      roomNumber: 4,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6t5",
      userID: 43,
      date: "2020/01/24",
      roomNumber: 3,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6t6",
      userID: 13,
      date: "2020/01/10",
      roomNumber: 2,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6t7",
      userID: 20,
      date: "2020/02/16",
      roomNumber: 1,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6t8",
      userID: 1,
      date: "2020/02/05",
      roomNumber: 3,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6t9",
      userID: 38,
      date: "2020/02/14",
      roomNumber: 3,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6ta",
      userID: 25,
      date: "2020/01/11",
      roomNumber: 4,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6tb",
      userID: 49,
      date: "2020/02/06",
      roomNumber: 5,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6tc",
      userID: 22,
      date: "2020/01/30",
      roomNumber: 2,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6td",
      userID: 27,
      date: "2020/01/31",
      roomNumber: 3,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6te",
      userID: 44,
      date: "2020/01/19",
      roomNumber: 5,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6tf",
      userID: 36,
      date: "2020/01/25",
      roomNumber: 2,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6tg",
      userID: 34,
      date: "2020/02/03",
      roomNumber: 3,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6th",
      userID: 19,
      date: "2020/02/26",
      roomNumber: 1,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6ti",
      userID: 6,
      date: "2020/01/22",
      roomNumber: 4,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6tj",
      userID: 21,
      date: "2020/01/17",
      roomNumber: 3,
      roomServiceCharges: [ ]
    },
    {
      id: "5fwrgu4i7k55hl6tk",
      userID: 7,
      date: "2020/01/27",
      roomNumber: 2,
      roomServiceCharges: [ ]
    }];
    rooms = [
      {
        number: 1,
        roomType: "residential suite",
        bidet: true,
        bedSize: "queen",
        numBeds: 1,
        costPerNight: 358.4
      },
      {
        number: 2,
        roomType: "suite",
        bidet: false,
        bedSize: "full",
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 3,
        roomType: "single room",
        bidet: false,
        bedSize: "king",
        numBeds: 1,
        costPerNight: 491.14
      },
      {
        number: 4,
        roomType: "single room",
        bidet: false,
        bedSize: "queen",
        numBeds: 1,
        costPerNight: 429.44
      },
      {
        number: 5,
        roomType: "single room",
        bidet: true,
        bedSize: "queen",
        numBeds: 2,
        costPerNight: 340.17
      },
    ];
    roomRepo.bookings = bookings; // for the tests
    roomRepo.rooms = rooms;
  });

  it('should be a function', function() {
    expect(RoomRepo).to.be.a('function');
  });

  it('should instantiate a new Rooms', function() {
    expect(roomRepo).to.be.an.instanceof(RoomRepo);
  });

  describe('findRoomByNumber', function() {
    it('should return the room object for a given valid room', function() {
      expect(roomRepo.findRoomByNumber(3)).to.deep.equal(rooms[2]);
    });
    it('should return undefined if a room does not exist', function() {
      expect(roomRepo.findRoomByNumber(16)).to.equal(undefined);
    });
  });

  describe('filterBookingsByUser', function() {
    it('should return a list of bookings for a given user', function() {
      expect(roomRepo.filterBookingsByUser(1)).to.deep.equal([
        {
          id: '5fwrgu4i7k55hl6t8',
          userID: 1,
          date: '2020/02/05',
          roomNumber: 3,
          roomServiceCharges: []
        }
      ]);
    });
  });

  describe('sortBookingsByDate', function() {
    it('should return a sorted list of bookings', function() {
      expect(roomRepo.sortBookingsByDate([bookings[0], bookings[1]]))
        .to.deep.equal([
          {
            id: "5fwrgu4i7k55hl6t5",
            userID: 43,
            date: "2020/01/24",
            roomNumber: 3,
            roomServiceCharges: [ ]
          },
          {
            id: "5fwrgu4i7k55hl6sz",
            userID: 9,
            date: "2020/02/04",
            roomNumber: 4,
            roomServiceCharges: [ ]
          }
        ]);
    });
  });

  describe('getTotalBookingsPrice', function() {
    it('should return a sorted list of bookings', function() {
      expect(roomRepo.getTotalBookingsPrice([bookings[0], bookings[1]]))
        .to.deep.equal(920.58);
    });
  });

  describe('getBookedRooms', function() {
    it('should return a list of rooms that are booked on a given date', function() {
      expect(roomRepo.getBookedRooms("2020/02/04")).to.deep.equal([
        {
          number: 4,
          roomType: 'single room',
          bidet: false,
          bedSize: 'queen',
          numBeds: 1,
          costPerNight: 429.44
        }
      ]);
    });
  });

  describe('getOpenRooms', function() {
    it('should return a list of rooms that are not booked for a given date', function() {
      expect(roomRepo.getOpenRooms("2020/02/04")).to.deep.equal([
        {
          number: 1,
          roomType: "residential suite",
          bidet: true,
          bedSize: "queen",
          numBeds: 1,
          costPerNight: 358.4
        },
        {
          number: 2,
          roomType: "suite",
          bidet: false,
          bedSize: "full",
          numBeds: 2,
          costPerNight: 477.38
        },
        {
          number: 3,
          roomType: "single room",
          bidet: false,
          bedSize: "king",
          numBeds: 1,
          costPerNight: 491.14
        },
        {
          number: 5,
          roomType: "single room",
          bidet: true,
          bedSize: "queen",
          numBeds: 2,
          costPerNight: 340.17
        },
      ]);
    })
  });

  describe('getRevenue', function() {
    it('should return the total revenue made for a given date', function() {
      expect(roomRepo.getRevenue("2020/02/04")).to.equal(429.44);
    });
  });
});