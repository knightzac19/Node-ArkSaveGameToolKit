const ArkName = require("../types/arkName");
const GlobalClass = require("../globalClass");


class PropertyArgs extends GlobalClass {
  constructor(name, typeName) {
    let _name, _typeName;
    super();
    if (name.equals('ArkName') && typeName.equals('ArkName')) {
      this.name  = name;
      this.typeName = typeName;
    } else {
      throw new TypeError("Invalid arguments provided to PropertyArgs()");
    }
  }
}
module.exports = PropertyArgs;
