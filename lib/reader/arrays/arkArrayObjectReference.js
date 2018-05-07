const IArkArray = require('../interfaces/iArkArray');
const ObjectReference = require("../types/objectReference");

class ArkArrayObjectReference extends IArkArray {
  constructor(archive, dataSize) {
    super();
    this._list = [];
    let size = archive.getInt();
    this.capacity = size;

    for (let n = 0; n < size; n++) {
      this._list.push(new ObjectReference({
        archive,
        length: 8
      })); //Fixed Size?
    }
  }
  get list() {
    return this._list;
  }
}

module.exports = ArkArrayObjectReference;
