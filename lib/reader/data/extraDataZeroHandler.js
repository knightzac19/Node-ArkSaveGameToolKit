class ExtraDataZeroHandler {
  canHandle(obj, length) {
    return length == 4;
  }

  read(obj, archive, length) {
    let shouldBeZero = archive.getInt();
    if (shouldBeZero != 0) console.warn('ExtraDataZeroHandler',`Expected int after properties to be 0 but found ${shouldBeZero} at ${archive.position - 4}`);

    return;
  }
}
module.exports = ExtraDataZeroHandler;
