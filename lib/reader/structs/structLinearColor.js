const StructBase = require('./structBase');

class StructLinearColor extends StructBase {
  constructor(obj) {
    super(obj.structType);

    if (!obj.archive) {
      this.r = obj.r;
      this.b = obj.b;
      this.g = obj.g;
      this.a = obj.a;
    } else {
      this.r = archive.getFloat();
      this.g = archive.getFloat();
      this.b = archive.getFloat();
      this.a = archive.getFloat();
    }
  }

}
module.exports = StructLinearColor;
