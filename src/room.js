class Room {
  constructor(params) {
    this.number = params.number; 
    this.roomType = params.roomType;
    this.bidet = params.bidet;
    this.bedSize = params.bedSize; 
    this.numBeds = params.numBeds;
    this.costPerNight = params.costPerNight;
  }
}

export default Room;