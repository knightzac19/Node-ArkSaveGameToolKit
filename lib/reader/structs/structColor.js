const StructBase = require('./structBase');

class StructColor extends StructBase {
  constructor(obj) {
    super(obj.structType);

    if (!obj.archive) {
      this.b = obj.b;
      this.g = obj.g;
      this.r = obj.r;
      this.a = obj.a;
    } else {
      this.b = archive.getByte();
      this.g = archive.getByte();
      this.r = archive.getByte();
      this.a = archive.getByte();
    }
  }

}
module.exports = StructColor;
