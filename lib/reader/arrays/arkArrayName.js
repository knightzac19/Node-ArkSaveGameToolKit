const IArkArray = require('../interfaces/iArkArray');

class ArkArrayName extends IArkArray {
  constructor(archive, dataSize) {
    super();
    this._list = [];
    let size = archive.getInt();
    this.capacity = size;
    // console.log(this);
    for (let n = 0; n < size; n++) {
      this._list.push(archive.getName());
    }
  }
  get list() {
    return this._list;
  }
}

module.exports = ArkArrayName;
