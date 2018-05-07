const arkcache = require("./lib/cachedata.js");
const ArkCacher = new arkcache();

class ArkData {
  constructor(steamKey){
    this.steamKey = steamKey;
  }
  refresh() {
    ArkCacher.runCache(this.steamKey);
  }
}
if(process.argv[2] == "test") {
  ArkCacher.runCache(process.argv[3]);
}
module.exports = ArkData;
