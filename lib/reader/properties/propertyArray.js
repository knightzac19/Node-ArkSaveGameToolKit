const PropertyBase = require('./propertyBase');
const PropertyArgs = require('./propertyArgs');
const ArkName = require('../types/arkName');
const ArkArchive = require('../arkArchive');
const IArkArray = require('../interfaces/iArkArray');
const ArkArrayRegistry = require('../arrays/arkArrayRegistry');

let _value;
class PropertyArray extends PropertyBase {

  constructor(object) {

    // this.ArrayType = ArkName;
    if (typeof object.name === 'string' && typeof object.typeName === 'string' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {
      object.index = 0;
      super(object);
      this.arrayType = object.arrayType;
    } else if (typeof object.name === 'string' && typeof object.typeName === 'string' && typeof object.index === 'number' && object.value.equals('IArkArray') && object.arrayType.equals('ArkName')) {
      super(object);
      this.arrayType = object.arrayType;
    } else if (object.archive.equals('ArkArchive') && object.args.equals('PropertyArgs') && typeof object.propertyIsExcluded === 'boolean') {
      object.propertyIsExcluded = true;
      super(object);
      //TODO Finish Arrays and double check size.
      if (object.propertyIsExcluded) {
        object.archive.skipName();
        object.archive.position += this.dataSize;
        return;
      }

      this.arrayType = object.archive.getName();
      let position = object.archive.position;
      // console.log(ArkArrayRegistry.read(object.archive, this.arrayType, this.dataSize));
      try {
        // console.log( this.arrayType, this.dataSize)
        this._value = ArkArrayRegistry.read(object.archive, this.arrayType, this.dataSize);
        // console.log(this._value);

        if (this._value === null) {
          throw new Error();
        }
      } catch (e) {
        console.log(e);
        object.archive.position += this.dataSize;
        throw new TypeError(`Unreadable ArrayProperty with name ${JSON.stringify(this.arrayType)}, skipping!`);
        // throw new UnreadablePropertyException();
      }
    } else {
      super(object);
    }
  }

  get value() {
    return _value;
  }
  set value(value) {
    if (value.equals('IArkArray')) {
      _value = value;
    }
  }
}
module.exports = PropertyArray;
// let t = new PropertyArray({
//   value: new IArkArray(ArkName.EMPTY_NAME, ArkName.EMPTY_NAME)
// });
// console.log(t.value);
