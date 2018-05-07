const IArkArray = require('../interfaces/iArkArray');
const ArkName = require('../types/arkName');
const StructRegistry = require('../structs/structRegistry');
const StructPropertyList = require('../structs/structPropertyList');

class ArkArrayStruct extends IArkArray {
  constructor(archive, dataSize) {
    super();

    this._list = [];
    let size = archive.getInt();
    this.capacity = size;
    let structType;
    if (size * 4 + 4 == dataSize) {
      structType = ArkName.create("Color");
    } else if (size * 12 + 4 == dataSize) {
      structType = ArkName.create("Vector");
    } else if (size * 16 + 4 == dataSize) {
      structType = ArkName.create("LinearColor");
    } else {
      structType = null;
    }

    if (structType != null) {
      for (let n = 0; n < size; n++) {
        this._list.push(StructRegistry.read(archive, structType));
      }
    } else {

      for (let n = 0; n < size; n++) {
        this._list.push(new StructPropertyList({archive, structType:null}));
      }
    }
    // console.log(this);

  }
  get list() {
    return this._list;
  }
}

module.exports = ArkArrayStruct;
