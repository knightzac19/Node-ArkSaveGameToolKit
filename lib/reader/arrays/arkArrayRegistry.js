const GlobalClass = require("../globalClass");
const ArkArrayBool = require("./arkArrayBool");
const ArkArrayByte = require("./arkArrayByte");
const ArkArrayInteger = require('./arkArrayInteger');
const ArkArrayObjectReference = require("./arkArrayObjectReference");
const ArkArrayString = require("./arkArrayString");
const ArkArrayInt16 = require("./arkArrayInt16");
const ArkArrayInt8 = require("./arkArrayInt8");
const ArkArrayFloat = require("./arkArrayFloat");
const ArkArrayDouble = require("./arkArrayDouble");
const ArkArrayName = require("./arkArrayName");
const ArkArrayLong = require("./arkArrayLong");
const ArkArrayStruct = require("./arkArrayStruct");
const ArkName = require("../types/arkName");
const _ = require('lodash');


class ArkArrayRegistry extends GlobalClass {
  static read(archive, arrayType, size) {
    const _object = ArkName.create("ObjectProperty");
    const _struct = ArkName.create("StructProperty");
    const _uint32 = ArkName.create("UInt32Property");
    const _int = ArkName.create("IntProperty");
    const _uint16 = ArkName.create("UInt16Property");
    const _int16 = ArkName.create("Int16Property");
    const _byte = ArkName.create("ByteProperty");
    const _int8 = ArkName.create("Int8Property");
    const _str = ArkName.create("StrProperty");
    const _uint64 = ArkName.create("UInt64Property");
    const _bool = ArkName.create("BoolProperty");
    const _float = ArkName.create("FloatProperty");
    const _double = ArkName.create("DoubleProperty");
    const _name = ArkName.create("NameProperty");

    if (archive.equals('ArkArchive')) {
      if (_.isEqual(_object, arrayType)) return new ArkArrayObjectReference(archive, size).list;
      else if (_.isEqual(_struct,arrayType)) return new ArkArrayStruct(archive, size).list;
      else if (_.isEqual(_uint32, arrayType) || _.isEqual(_int, arrayType)) return new ArkArrayInteger(archive, size).list;
      else if (_.isEqual(_uint16,arrayType) || _.isEqual(_int16,arrayType)) return new ArkArrayInt16(archive, size).list;
      else if (_.isEqual(_byte, arrayType)) return new ArkArrayByte(archive, size).list;
      else if (_.isEqual(_int8,arrayType)) return new ArkArrayInt8(archive, size).list;
      else if (_.isEqual(_str,arrayType)) return new ArkArrayString(archive, size).list;
      else if (_.isEqual(_uint64,arrayType)) return new ArkArrayLong(archive, size);
      else if (_.isEqual(_bool, arrayType)) return new ArkArrayBool(archive, size).list;
      else if (_.isEqual(_float,arrayType)) return new ArkArrayFloat(archive, size).list;
      else if (_.isEqual(_double,arrayType)) return new ArkArrayDouble(archive, size).list;
      else if (_.isEqual(_name,arrayType)) return new ArkArrayName(archive, size).list;
      else {
        // _logger.Warn($"Unknown Array Type {arrayType} at {archive.Position:X}");
        // console.log(arrayType);
        console.warn(`Unknown Array Type ${arrayType} at ${archive.position}`);
        return null;
      }
    }
  }
}
module.exports = ArkArrayRegistry;
