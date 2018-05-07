const PropertyBase = require('./propertyBase');
const ArkArchive = require('../arkArchive');
const ArkName = require('../types/arkName');
const StructRegistry = require('../structs/structRegistry');

class PropertyStruct extends PropertyBase {
  constructor(object) {
    if (typeof object.name === 'string' && typeof object.typeName === 'string' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {} else if (typeof object.name === 'string' && typeof object.typeName === 'string' && typeof object.index === 'number' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {} else if (object.archive.equals('ArkArchive') && object.args.equals('PropertyArgs') && typeof object.propertyIsExcluded === 'boolean') {
  object.propertyIsExcluded = true;
        super(object);
      if (object.propertyIsExcluded) {
        object.archive.skipName();
        object.archive.position += this.dataSize;
        return;
      }

      let structType = object.archive.getName();
      let position = object.archive.position;

      try {
        this._value = StructRegistry.read(object.archive, structType, object.dataSize, object.exclusivePropertyNameTree);
      } catch (ex) {
        // skip struct
        object.archive.position += this.dataSize;
      }
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
module.exports = PropertyStruct;
