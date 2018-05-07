const ArkName = require('../types/arkName');
const StructPropertyList = require('./structPropertyList');
const StructVector = require('./structVector');
const StructVector2d = require('./structVector2d');
const StructQuat = require('./structQuat');
const StructColor = require('./structColor');
const StructLinearColor = require('./structLinearColor');

class StructRegistry {
  read(archive, structType, dataSize, exclusivePropertyNameTree = null) {
    if (exclusivePropertyNameTree !== null) {
      throw Error("Invalid name tree");
    }
    const _itemNetId = ArkName.create("ItemNetID");
    const _itemNetInfo = ArkName.create("ItemNetInfo");
    const _transform = ArkName.create("Transform");
    const _primalPlayerDataStruct = ArkName.create("PrimalPlayerDataStruct");
    const _primalPlayerCharacterConfigStruct = ArkName.create("PrimalPlayerCharacterConfigStruct");
    const _primalPersistentCharacterStatsStruct = ArkName.create("PrimalPersistentCharacterStatsStruct");
    const _tribeData = ArkName.create("TribeData");
    const _tribeGovernment = ArkName.create("TribeGovernment");
    const _terrainInfo = ArkName.create("TerrainInfo");
    const _arkInventoryData = ArkName.create("ArkInventoryData");
    const _dinoOrderGroup = ArkName.create("DinoOrderGroup");
    const _arkDinoData = ArkName.create("ARKDinoData");

    const _vector = ArkName.create("Vector");
    const _vector2d = ArkName.create("Vector2D");
    const _quat = ArkName.create("Quat");
    const _color = ArkName.create("Color");
    const _linearColor = ArkName.create("LinearColor");
    const _rotator = ArkName.create("Rotator");
    const _uniqueNetIdRepl = ArkName.create("UniqueNetIdRepl");


    if (_.isEqual(structType, _itemNetId) || _.isEqual(structType, _transform) ||
      _.isEqual(structType, _primalPlayerDataStruct) || _.isEqual(structType, _primalPlayerCharacterConfigStruct) ||
      _.isEqual(structType, _primalPersistentCharacterStatsStruct) || _.isEqual(structType, _tribeData) ||
      _.isEqual(structType, _tribeGovernment) || _.isEqual(structType, _terrainInfo) ||
      _.isEqual(structType, _itemNetInfo) || _.isEqual(structType, _arkInventoryData) ||
      _.isEqual(structType, _dinoOrderGroup) || _.isEqual(structType, _arkDinoData)) {
      archive.position += dataSize;
      return null;
    }
    // return new StructPropertyList({
    //   archive,
    //   structType,
    //   exclusivePropertyNameTree
    // });
    else if (_.isEqual(structType, _vector) || _.isEqual(structType, _rotator))
      return new StructVector({
        archive,
        structType
      });
    else if (_.isEqual(structType, _vector2d))
      return new StructVector2d({
        archive,
        structType
      });
    else if (_.isEqual(structType, _quat))
      return new StructQuat({
        archive,
        structType
      });
    else if (_.isEqual(structType, _color))
      return new StructColor({
        archive,
        structType
      });
    else if (_.isEqual(structType, _linearColor))
      return new StructLinearColor({
        archive,
        structType
      });
    else if (_.isEqual(structType, _uniqueNetIdRepl))
      return new StructUniqueNetIdRepl({
        archive,
        structType
      });
    else {
      console.warn(`Unknown Struct Type ${structType} at ${archive.position} trying to read as StructPropertyList!`);
      return new StructPropertyList(archive, structType);
    }
  }
}
module.exports = StructRegistry;
