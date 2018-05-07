const StructBase = require('./structBase');

class StructVector2d extends StructBase {
  constructor(obj) {
    super(obj.structType);

    if (!obj.archive) {
      this.x = obj.x;
      this.y = obj.y;
    } else {
      this.x = archive.getFloat();
      this.y = archive.getFloat();
    }
  }

}
module.exports = StructVector2d;
