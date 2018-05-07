const ArkArchive = require('../arkArchive');
const ArkName = require('../types/arkName');
const PropertyInt32 = require('./propertyInt32');
const PropertyBool = require('./propertyBool');
const PropertyByte = require('./propertyByte');
const PropertyFloat = require('./propertyFloat');
const PropertyDouble = require('./propertyDouble');
const PropertyInt8 = require('./propertyInt8');
const PropertyInt16 = require('./propertyInt16');
const PropertyInt64 = require('./propertyInt64');
const PropertyName = require('./propertyName');
const PropertyObject = require('./propertyObject');
const PropertyStr = require('./propertyStr');
const PropertyStruct = require('./propertyStruct');
const PropertyArray = require('./propertyArray');
const PropertyText = require('./propertyText');
const PropertyArgs = require('./propertyArgs');
const GlobalClass = require("../globalClass");
// const ExcludedProperty = require('./excludedProperty');

const _ = require('lodash');


class PropertyRegistry extends GlobalClass {
  static readProperty(archive, exclusivePropertyNameTree = []) {
    const _int = ArkName.create("IntProperty");
    const _uint32 = ArkName.create("UInt32Property");
    const _int8 = ArkName.create("Int8Property");
    const _int16 = ArkName.create("Int16Property");
    const _uint16 = ArkName.create("UInt16Property");
    const _uint64 = ArkName.create("UInt64Property");
    const _bool = ArkName.create("BoolProperty");
    const _byte = ArkName.create("ByteProperty");
    const _float = ArkName.create("FloatProperty");
    const _double = ArkName.create("DoubleProperty");
    const _name = ArkName.create("NameProperty");
    const _object = ArkName.create("ObjectProperty");
    const _str = ArkName.create("StrProperty");
    const _struct = ArkName.create("StructProperty");
    const _array = ArkName.create("ArrayProperty");
    const _text = ArkName.create("TextProperty");



    if (archive.equals('ArkArchive')) {
      let name = archive.getName();
      if (name == null || (name && name.name === '')) {
        throw Error(`Property name is empty at ${archive.position}. Ignoring remaining properties.`);
      }
      if (_.isEqual(ArkName.NONE_NAME, name)) {
        return null;
      }

      // console.log(exclusivePropertyNameTree.toArray());
      let propertyIsExcluded = !exclusivePropertyNameTree.hasOwnProperty(name.toString());
      // propertyIsExcluded = false;
      // exclusivePropertyNameTree = [];
      // exclusivePropertyNameTree = [];
      // let propertyIsExcluded = false;
      let type = archive.getName();

      let args = new PropertyArgs(name, type);
// console.log(args);

      let result = null;
      if (_.isEqual(_int, type) || _.isEqual(_uint32, type)) result = new PropertyInt32({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_bool, type)) result = new PropertyBool({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_byte, type)) result = new PropertyByte({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_float, type)) result = new PropertyFloat({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_double, type)) result = new PropertyDouble({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_int8, type)) result = new PropertyInt8({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_int16, type) || _.isEqual(_uint16, type)) result = new PropertyInt16({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_uint64, type)) result = new PropertyInt64({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_name, type)) result = new PropertyName({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_object, type)) result = new PropertyObject({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_str, type)) result = new PropertyStr({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_struct, type)) result = new PropertyStruct({
        archive,
        args,
        propertyIsExcluded,
        exclusivePropertyNameTree: (exclusivePropertyNameTree == null || propertyIsExcluded ? null : exclusivePropertyNameTree[name.toString()])
      });
      //    else if (_.isEqual(_struct, type)) result = new PropertyStruct({archive, args, propertyIsExcluded}, exclusivePropertyNameTree == null || propertyIsExcluded ? null : exclusivePropertyNameTree[name]);
      else if (_.isEqual(_array, type)) result = new PropertyArray({
        archive,
        args,
        propertyIsExcluded
      });
      else if (_.isEqual(_text, type)) result = new PropertyText({
        archive,
        args,
        propertyIsExcluded
      });
      else {
        // console.log(args);
        throw new TypeError(`Unknown property type ${type} near ${archive.position}. Ignoring remaining properties.`);
      }

      if (propertyIsExcluded)
        return -1;

      return result;
    } else {
      return null;
    }

  }
}
module.exports = PropertyRegistry;
