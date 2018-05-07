const StructPropertyList = require('../structs/structPropertyList');
const ExtraDataFoliage = require('./extraDataFoliage');

class ExtraDataFoliageHandler {
  canHandle(obj, length) {
    return obj.className.token == 'InstancedFoliageActor';
  }

  read(obj, archive, length) {
    let shouldBeZero = archive.getInt();
    if (shouldBeZero != 0) console.warn('ExtraDataFoliageHandler1',`Expected int after properties to be 0 but found ${shouldBeZero} at ${archive.position - 4}`);

    let structMapCount = archive.getInt();

    let structMapList = [];

    try {
      for (let structMapIndex = 0; structMapIndex < structMapCount; structMapIndex++) {
        let structCount = archive.getInt();
        let structMap = {};
        for (let structIndex = 0; structIndex < structCount; structIndex++) {
          let structName = archive.getString();
          let properties = new StructPropertyList({archive, structType:null});

          let shouldBeZero2 = archive.getInt();
          if (shouldBeZero2 != 0) console.warn('ExtraDataFoliageHandler2',`Expected int after properties to be 0 but found ${shouldBeZero2} at ${archive.position - 4}`);

          structMap[structName] = properties;
        }

        structMapList.push(structMap);
      }
    } catch (ex) {
      
      // Just stop reading and attach collected structs
    }

    let extraDataFoliage = new ExtraDataFoliage();
    extraDataFoliage.structMapList = structMapList;

    return extraDataFoliage;
  }
}
module.exports = ExtraDataFoliageHandler;
