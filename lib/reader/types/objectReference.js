const ArkArchive = require('../arkArchive');
const ArkName = require('../types/arkName');
const GlobalClass = require("../globalClass");
const GameObject = require("../gameObject");

const TYPE_ID = 0;
const TYPE_PATH = 1;
const TYPE_PATH_NO_TYPE = 2; // Temporary, to support path references in sav files
class ObjectReference extends GlobalClass {
  constructor(obj) {
    super();
    if (obj.length < 1) {} else if (obj.length > 0 && typeof obj.objectId === 'number') {
      this.length = obj.length;
      this.objectId = obj.objectId;
      this.objectType = TYPE_ID;
    } else if (obj.objectString && obj.objectString.equals('ArkName')) {
      this.objectString = obj.objectString;
      this.objectType = TYPE_PATH;
    } else if (obj.archive.equals('ArkArchive') && obj.length > 0) {
      this.length = obj.length;
      this.read(obj.archive);

    }
  }
  toString() {
    return "ObjectReference [objectType=" + this.objectType + ", objectId=" + this.objectId + ", objectString=" + this.objectString + ", length=" + this.length + "]";
  }


  getObject(objectContainer) {
    if (objectContainer.equals('IGameObjectContainer') && this.objectType == TYPE_ID && this.objectId > -1 && this.objectId < objectContainer.objects.length) {
      return objectContainer.objects[this.objectId];
    }

    return null;
  }

  read(archive) {
    // if (!archive.equals('ArkArchive')) {
    //   return;
    // }
    // console.log(this.length);
    if (this.length >= 8) {
      this.objectType = archive.getInt();
      if (this.objectType == TYPE_ID) {
        this.objectId = archive.getInt();
      } else if (this.objectType == TYPE_PATH) {
        this.objectString = archive.getName();
      } else {
        archive.position -= 4;
        this.objectType = TYPE_PATH_NO_TYPE;
        this.objectString = archive.getName();
      }
    } else if (this.length == 4) {
      // Only seems to happen in Version 5
      this.objectType = TYPE_ID;
      this.objectId = archive.getInt();
    } else {
      console.warn(`ObjectReference with length value ${this.length} at ${archive.position}`);
      archive.position += this.length;
    }
  }

  collectNames(nameTable) {
    if (this.objectType == TYPE_PATH && Array.isArray(nameTable))
      nameTable.push(this.objectString.name);
  }

}
module.exports = ObjectReference;
