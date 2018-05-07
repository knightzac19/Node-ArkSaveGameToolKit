const IArkArray = require('../interfaces/iArkArray');

class ArkArrayByte extends IArkArray {
  constructor(archive, dataSize) {
    super();
    this._list = [];
    let size = archive.getInt();
    this.capacity = size;
    if (size + 4 != dataSize) {
      throw new TypeError();
    }
    for (let n = 0; n < size; n++) {
      this._list.push(archive.getByte());
    }
  }
  get list() {
    return this._list;
  }
}

module.exports = ArkArrayByte;
