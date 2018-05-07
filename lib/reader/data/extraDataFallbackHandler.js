const ExtraDataBlob = require('./extraDataBlob');

class ExtraDataFallBackHandler {
  canHandle(obj, length) {
    return true;
  }

  read(obj, archive, length) {
    if (parseInt(length) >= 2147483647)
      throw new TypeError("Attempted to read more than 2147483647 bytes.");

    let extraData = new ExtraDataBlob();

    extraData.data = archive.getBytes(parseInt(length));

    return extraData;
  }
}
module.exports = ExtraDataFallBackHandler;
