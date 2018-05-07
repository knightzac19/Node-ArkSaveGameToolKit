#! /bin/node

const ArkSaveGame = require('./arkSaveGame');
const cluster = require('cluster');

if(cluster.isMaster) {
  let save = new ArkSaveGame({
    fileName: "D:\\Steam\\steamapps\\common\\ARK\\ShooterGame\\Saved\\ALtSaves\\TheIsland.ark",
    arkNameCache: null,
    savegameMaxDegreeOfParallelism: false,
    exclusivePropertyNameTree: null
  });
  save.loadEverything();

} else {
  let save = new ArkSaveGame();
  save.loadEverything();
}
