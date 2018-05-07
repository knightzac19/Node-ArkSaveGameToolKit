class ExtraDataCharacterHandler {
  canHandle(obj, length) {
    return obj.className.token.includes("_Character_");
  }

  read(obj, archive, length) {
    // console.log(obj.className,archive.position);
    let shouldBeZero = archive.getInt();
    if (shouldBeZero != 0) {
      console.warn('ExtraDataCharacterHandler',`Expected int after properties to be 0 but found ${shouldBeZero} at ${archive.position - 4}`);
    }

    let shouldBeOne = archive.getInt();
    if (shouldBeOne != 1) {
      console.warn('ExtraDataCharacterHandler',`Expected int after properties to be 1 but found ${shouldBeOne} at ${archive.position - 4}`);
    }

    return;
  }
}
module.exports = ExtraDataCharacterHandler;
