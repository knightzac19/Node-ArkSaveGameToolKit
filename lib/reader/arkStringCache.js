const GlobalClass = require("./globalClass");
const List = require("collections/list");

class ArkStringCache extends GlobalClass {
  constructor() {
    super();
    this._instances = new List();
  }

  add(value) {
    if (value == null) return null;

    if (this._instances.has(value)) {
      return this._instances.get(value);
    } else {
      // console.log(args);
      this._instances.push(value);
      return value;

    }

  }


}

module.exports = ArkStringCache;
