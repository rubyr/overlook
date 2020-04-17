import chai from 'chai';
import Room from '../src/room';
const expect = chai.expect;

describe('Room', function() {
  let room1, room2;
  this.beforeEach(function() {
    room1 = new Room({"number": 1, "roomType": "residential suite", 
      "bidet": true, "bedSize": "queen", "numBeds": 1, "costPerNight": 358.4
    });
    room2 = new Room({"number": 2, "roomType": "suite", 
      "bidet": false, "bedSize": "full", "numBeds": 2, "costPerNight": 477.38
    });
  });

  it('should be a function', function() {
    expect(Room).to.be.a('function');
  });

  it('should instantiate a new Rooms', function() {
    expect(room1).to.be.an.instanceof(Room);
  });
  
  it('should take in and assume the properties of an object', function() {
    expect(room1.number).to.equal(1);
    expect(room1.roomType).to.equal("residential suite");
    expect(room1.bidet).to.equal(true);
    expect(room1.bedSize).to.equal("queen");
    expect(room1.numBeds).to.equal(1);
    expect(room1.costPerNight).to.equal(358.4);

    expect(room2.number).to.equal(2);
    expect(room2.roomType).to.equal("suite");
    expect(room2.bidet).to.equal(false);
    expect(room2.bedSize).to.equal("full");
    expect(room2.numBeds).to.equal(2);
    expect(room2.costPerNight).to.equal(477.38);
  });
});