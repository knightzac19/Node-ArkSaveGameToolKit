const StructBase = require('./structBase');

class StructUniqueNetIdRepl extends StructBase {
  constructor(obj) {
    super(obj.structType);

    if (!obj.archive) {
      this.unk = obj.unk;
      this.netId = obj.netId;
    } else {
      this.unk = obj.archive.getInt();
      this.netId = obj.archive.getString();
    }
  }

}
module.exports = StructUniqueNetIdRepl;
