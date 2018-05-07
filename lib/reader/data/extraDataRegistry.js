const ExtraDataFallbackHandler = require('./extraDataFallbackHandler');
const ExtraDataZeroHandler = require('./extraDataZeroHandler');
const ExtraDataCharacterHandler = require('./extraDataCharacterHandler');
const ExtraDataFoliageHandler = require('./extraDataFoliageHandler');

class ExtraDataRegistry {
  static getExtraData(obj, archive, length) {
    const EXTRA_DATA_HANDLERS = [new ExtraDataFallbackHandler(), new ExtraDataZeroHandler(), new ExtraDataCharacterHandler(), new ExtraDataFoliageHandler()];

    for (let i = EXTRA_DATA_HANDLERS.length - 1; i >= 0; i--) {
    // EXTRA_DATA_HANDLERS.forEach(h=>{
      let handler = EXTRA_DATA_HANDLERS[i];
      if (handler.canHandle(obj, length)) {
        return handler.read(obj, archive, length);
      }
    // })

    }

    return null;
  }
}
module.exports = ExtraDataRegistry;
