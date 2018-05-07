const PropertyBase = require('./propertyBase');
const ArkArchive = require('../arkArchive');
const ArkName = require('../types/arkName');
const ArkByteValue = require('../types/arkByteValue');

class PropertyByte extends PropertyBase {
  constructor(object) {
    if (typeof object.name === 'string' && typeof object.typeName === 'string' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {} else if (typeof object.name === 'string' && typeof object.typeName === 'string' && typeof object.index === 'number' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {} else if (object.archive.equals('ArkArchive') && object.args.equals('PropertyArgs') && typeof object.propertyIsExcluded === 'boolean') {
        // object.propertyIsExcluded = false;
      super(object);
      let enumName = object.archive.getName();

      this._value = new ArkByteValue({
        archive: object.archive,
        enumName: enumName,
        propertyIsExcluded: object.propertyIsExcluded
      });

    } else {
      super(object);
    }
  }

  get value() {
    return this._value;
  }
  set value(v) {
    if (v.equals('ArkByteValue'))
      this._value = v;
  }
}
module.exports = PropertyByte;
