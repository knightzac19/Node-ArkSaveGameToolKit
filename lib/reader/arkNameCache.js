const GlobalClass = require("./globalClass");
const ArkName = require('./types/arkName');
const Map = require("collections/map");

class ArkNameCache extends GlobalClass {
  constructor() {
    super();
    this._instances = new Map();
  }

  create(...args) {

    if (args[0] && args[1] === undefined) {

      if (this._instances.has(args[0])) {
        return this._instances.get(args[0]);
      } else {
          // console.log(args);
        return this._instances.set(args[0], new ArkName(args[0])).get(args[0]);

      }
    } else if (args[0] && args[1] !== undefined) {

      let token = args[1] == 0 ? args[0] : `${args[0]}_${args[1]}`;
      if (this._instances.has(token)) {

        return this._instances.get(token);
      } else {
        return this._instances.set(token, new ArkName(
          args[0],
          args[1],
          token
        )).get(token);
      }
    }
  }


}

module.exports = ArkNameCache;
