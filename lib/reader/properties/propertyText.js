const PropertyBase = require('./propertyBase');
const ArkArchive = require('../arkArchive');
const ArkName = require('../types/arkName');

class PropertyText extends PropertyBase {
  constructor(object) {
    if (typeof object.name === 'string' && typeof object.typeName === 'string' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {} else if (typeof object.name === 'string' && typeof object.typeName === 'string' && typeof object.index === 'number' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {} else if (object.archive.equals('ArkArchive') && object.args.equals('PropertyArgs') && typeof object.propertyIsExcluded === 'boolean') {
        // object.propertyIsExcluded = false;
      super(object);
      if (object.propertyIsExcluded) {
        object.archive.position += this.dataSize;
        return;
      }
      this._value = object.archive.getBytes(this.dataSize).toString('base64');
    } else {
      super(object);
    }
  }

  get value() {
    return this._value;
  }
  set value(v) {
    if (typeof v == 'string')
      this._value = v;
  }

}
module.exports = PropertyText;
