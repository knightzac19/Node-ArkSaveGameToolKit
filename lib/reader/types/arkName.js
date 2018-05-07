let _token;
const GlobalClass = require("../globalClass");
class ArkName extends GlobalClass {

  constructor(...args) {
    super();
    let _name, _index, _token;
    const NAME_INDEX_PATTERN = new RegExp("(.*?)_([0-9]+)");
    if (typeof args[0] === 'string' && args[1] === undefined) {
      let m = args[0].match(NAME_INDEX_PATTERN);
      if (m) {
        this.name = _name = m[0];
        this.index = _index = parseInt(m[1]);
      } else {
        this.name = _name = args[0];
        this.index = _index = 0;
      }
      this.token = _token = args[0];
    } else if (typeof args[0] === 'string' && typeof args[1] === 'number') {
      if(!args[2]){
        args[2] = null;
      }
      this.name = args[0];
      this.index =  args[1];
      this.token = args[2] || args[1] == 0 ? args[0] : `${args[0]}_${args[1]}`;
      // console.log(this);
    } else {
      throw new TypeError(`Invalid Arguments for ArkName(), ${args[0]},${args[1]},${args[2]}`);
    }
  }
  static get EMPTY_NAME() {
    return new ArkName("");
  }

  static get NONE_NAME() {
    return new ArkName("None");
  }
  toString() {
    return this.token;
  }

  static create(...args) {
    if (typeof args[0] === 'string' && args[1] === undefined) {
      return new ArkName(args[0]);
    } else if (typeof args[0] === 'string' && typeof args[1] === 'number') {
      return new ArkName(args[0], args[1]);
    } else {
      throw new TypeError("Invalid object for ArkName.create()");
    }
  }
}

// ArkName = {
//   EMPTY_NAME: {
//     name: '',
//     token: '',
//     index: 0
//   },
//   NONE_NAME: {
//     name: 'None',
//     token: 'None',
//     index: 0
//   },
//   create: (token, name, index=0) => {
//     ArkName[token] = {
//       name: name ||,
//       index: index ||
//     };
//   }
// };
module.exports = ArkName;
