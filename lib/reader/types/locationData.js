class LocationData {
  constructor(archive) {
    this.x = 0.00;
    this.Y = 0.00;
    this.Z = 0.00;
    this.pitch = 0.00;
    this.yaw = 0.00;
    this.roll = 0.00;
    this.read(archive);
  }
  read(archive) {
    this.x = archive.getFloat();
    this.Y = archive.getFloat();
    this.Z = archive.getFloat();
    this.pitch = archive.getFloat();
    this.yaw = archive.getFloat();
    this.roll = archive.getFloat();
  }

  toString() {
    return "LocationData [x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", pitch=" + this.pitch + ", yaw=" + this.yaw + ", roll=" + this.roll + "]";
  }
  skip(archive) {
    archive.position += 4 * 6; /* float size */
  }
}
module.exports = LocationData;
