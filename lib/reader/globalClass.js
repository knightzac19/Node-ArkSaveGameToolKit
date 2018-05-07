

class GlobalClass {
  getClass() {
    return this.constructor.name;
  }
  equals(v) {
    return v === this.getClass();
  }
}
module.exports = GlobalClass;
