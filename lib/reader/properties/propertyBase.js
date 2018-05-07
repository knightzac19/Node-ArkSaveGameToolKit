const IProperty = require('./iProperty');
const ArkArchive = require('../arkArchive');
const ArkName = require('../types/arkName');

class PropertyBase extends IProperty {

  constructor(object) {
    super(object);
    this._value = null;
    if (typeof object.name === 'string' && typeof object.index === 'number' && typeof object.value !== undefined) {
      this.name = object.name;
      this.index = object.index;
      this._value = object.value;
    } else if (object.archive.equals('ArkArchive') && object.args.equals('PropertyArgs') && typeof object.propertyIsExcluded === 'boolean') {
      this.name = object.args.name;
      this.dataSize = object.archive.getInt();
      
      if (object.propertyIsExcluded) {
        object.archive.position += 4;
        return;
      }
      this.index = object.archive.getInt();
    }
  }
  get value() {
    throw new Error("Can't call abstract method get on value!");
  }

  set value(v) {
    throw new Error("Can't call abstract method get on value!");
  }

}
module.exports = PropertyBase;
