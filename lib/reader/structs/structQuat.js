const StructBase = require('./structBase');

class StructQuat extends StructBase {
  constructor(obj) {
    super(obj.structType);

    if (!obj.archive) {
      this.x = obj.x;
      this.y = obj.y;
      this.z = obj.z;
      this.w = obj.w;
    } else {
      this.x = archive.getFloat();
      this.y = archive.getFloat();
      this.z = archive.getFloat();
      this.w = archive.getFloat();
    }
  }

}
module.exports = StructQuat;
