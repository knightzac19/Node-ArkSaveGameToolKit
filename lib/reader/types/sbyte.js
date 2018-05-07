const maxvalue = 127;
const minValue = -128;
const GlobalClass = require("../globalClass");
class sByte extends GlobalClass {
  constructor(s) {
    super();
    let _value;

    let parsed = isNaN(parseInt(s));
    if (!parsed && s <= maxvalue && s >= minValue) {
      this.value = s;
    } else {
      this.value = NaN;
    }
  }
  static parse(s) {
    return new sByte(s);
  }
  value() {
    return this.value;
  }
  static isInt8(s) {
    let parsed = isNaN(parseInt(s));
    return (!parsed && s <= maxvalue && s >= minValue);
  }
}

module.exports = sByte;
