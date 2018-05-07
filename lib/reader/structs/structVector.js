const StructBase = require('./structBase');

class StructVector extends StructBase {
  constructor(obj) {
    super(obj.structType);

    if (!obj.archive) {
      this.x = obj.x;
      this.y = obj.y;
      this.z = obj.z;
    } else {
      this.x = archive.getFloat();
      this.y = archive.getFloat();
      this.z = archive.getFloat();
    }
  }

}
module.exports = StructVector;
