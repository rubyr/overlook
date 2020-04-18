import chai from 'chai';
import RoomRepo from '../src/room-repo';
const expect = chai.expect;

describe('RoomRepo', function() {
  let roomRepo;
  this.beforeEach(function() {
    roomRepo = new RoomRepo();
  });

  it('should be a function', function() {
    expect(RoomRepo).to.be.a('function');
  });

  it('should instantiate a new Rooms', function() {
    expect(roomRepo).to.be.an.instanceof(RoomRepo);
  });

  describe('getRooms', function() {
    it('should be able to get all rooms', async function() {
      await roomRepo.getRooms();
      expect(roomRepo.rooms).to.not.equal([]);
    });
  });

  describe('getBookings', function() {
    it('should be able to get all bookings', async function() {
      await roomRepo.getBookings();
      expect(roomRepo.bookings).to.not.equal([]);
    });
  });
});