const PropertyBase = require("./propertyBase");
class ExcludedProperty extends PropertyBase {

  constructor() {
    super({
      name: null,
      value: false,
      index: 0
    });
  }

  static get instance() {
    return new ExcludedProperty();
  }

  get value() {
    return value;
  }
  set value(v) {
    if (typeof v === 'boolean') {
      value = value;
    }
  }

}
module.exports = ExcludedProperty;
