const sByte = require("./sbyte");
const _ = require("lodash");
const GlobalClass = require("../globalClass");
const ArkArchive = require('../arkArchive');
const ArkName = require('./arkName');

class ArkByteValue extends GlobalClass {
  constructor(obj) {
    super();
    this._byteValue = 0;
    this._nameValue = null;
    if (obj.archive && obj.archive.equals('ArkArchive') && obj.enumName.equals('ArkName')) {
      // obj.propertyIsExcluded = (typeof obj.propertyIsExcluded !== 'boolean' || null ? false : obj.propertyIsExcluded);
      this.read(obj.archive, obj.enumName, obj.propertyIsExcluded);
    }
  }

  get byteValue() {
    return this._byteValue;
  }

  set byteValue(value) {
    this._fromEnum = false;
    this._enumName = ArkName.NONE_NAME;
    this._byteValue = value;
  }

  setEnumValue(enumName, nameValue) {
    this._fromEnum = true;
    this._enumName = enumName;
    this._nameValue = nameValue;
  }

  read(archive, enumName, propertyIsExcluded) {

    this._enumName = enumName;
    this._fromEnum = !(enumName == 'None');
    if (propertyIsExcluded) {
      if (this._fromEnum) {
        archive.skipName();
      } else
        archive.position += 1;
    } else {
      if (this._fromEnum) {
        this._nameValue = archive.getName();
      } else {
        this.byteValue = archive.getByte();
      }
    }

  }

/*
None
---------------
%%%%%%%%%%%%%%%%
7571879
None
False
---------------
7571880

14
---------------
None
---------------
%%%%%%%%%%%%%%%%
7571912
None
False
---------------
7571913

6
---------------
None
---------------
%%%%%%%%%%%%%%%%
7571945
None
False
---------------
7571946

6
---------------
None
---------------
%%%%%%%%%%%%%%%%
7571978
None
False
---------------
7571979

6
---------------
*/

  getTypeCode() {
    throw new NotImplementedException();
  }

  toBoolean(provider) {
    throw new NotImplementedException();
  }

  toChar() {
    throw new NotImplementedException();
  }

  toSByte() {
    return this.byteValue;
  }

  toByte(provider) {
    return parseInt(this.byteValue.value);
  }

  ToInt16() {
    return this.byteValue;
  }

  ToUInt16() {
    throw new NotImplementedException();
  }

  ToInt32() {
    throw new NotImplementedException();
  }

  ToUInt32() {
    throw new NotImplementedException();
  }

  ToInt64() {
    throw new NotImplementedException();
  }

  ToUInt64() {
    throw new NotImplementedException();
  }

  ToSingle() {
    throw new NotImplementedException();
  }

  ToDouble() {
    throw new NotImplementedException();
  }

  ToDecimal() {
    throw new NotImplementedException();
  }

  ToDateTime() {
    throw new NotImplementedException();
  }

  ToString() {
    throw new NotImplementedException();
  }

  ToType() {
    throw new NotImplementedException();
  }
}

module.exports = ArkByteValue;
