const GlobalClass = require("../globalClass");

class IProperty extends GlobalClass {
  constructor(object) {
    super(object);
    if (typeof object !== 'object') {
      throw new TypeError("Invalid object provided!");
    }
    if (new.target === IProperty) {
      // throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  get value() {
   return  this.value;
  }
  set value(value) {
    if(value !== undefined)
      this.value = value;
  }

}
module.exports = IProperty;
