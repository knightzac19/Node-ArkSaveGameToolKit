const StructBase = require('./structBase');
const ArkName = require('../types/arkName');


class StructPropertyList {
  constructor(obj) {
    // super(obj.structType);
    this.native = false;
    obj.exclusivePropertyNameTree = [];
    if (!obj.archive) {
      this.properties = obj.properties;
    } else {
      this.properties = {};
var prop = require('../properties/propertyRegistry');
      let property = prop.readProperty(obj.archive, []);

      while (property != null) {
        if (property !== -1) {
          this.properties[property.name.name] = property;
        }
        property = prop.readProperty(obj.archive,[]);
      }
    }
  }

}
module.exports = StructPropertyList;
