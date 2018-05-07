const _ = require("lodash");
const GlobalClass = require("../globalClass");
const Map = require("collections/map");

class ArkNameTree extends GlobalClass {
  merge(items) {
    if(Array.isArray(items)) {
      _(items).filter();
      // items.forEach(i=>{
      //
      // });
    }
  }
}
module.exports = ArkNameTree;
