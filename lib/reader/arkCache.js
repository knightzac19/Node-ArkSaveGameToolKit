#! /bin/node
const ArkSaveGame = require('./arkSaveGame');


let save = new ArkSaveGame({
  fileName: "D:\\Steam\\steamapps\\common\\ARK\\ShooterGame\\Saved\\Saves\\TheIsland.ark", //Path to your ark
  arkNameCache: null,
  savegameMaxDegreeOfParallelism: false,
  exclusivePropertyNameTree: null
});
save.loadEverything();
