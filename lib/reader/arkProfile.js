const GlobalClass = require("./globalClass");
const GameObject = require("./gameObject");
const ArkArchive = require('./arkArchive');
const fs = require("fs");


class ArkProfile extends GlobalClass {
  contructor(fileName = null, arkNameCache = null, exclusivePropertyNameTree = null) {
    this.objects = [];
    if (fileName == null) {
      this.objects = [];
      // _arkNameCache = new ArkNameCache();
    } else {
      this._fileName = fileName;

      if (arkNameCache != null) this._arkNameCache = arkNameCache;
      this._exclusivePropertyNameTree = exclusivePropertyNameTree;
      let fi = fs.statSync(fileName);
      this.saveTime = fi.mtime;
      let size = fi.size;
      if (size == 0) return;
      // using(MemoryMappedFile mmf = MemoryMappedFile.CreateFromFile(fileName, FileMode.Open, null, 0 L, MemoryMappedFileAccess.Read)) {
      // using(MemoryMappedViewAccessor va = mmf.CreateViewAccessor(0 L, 0 L, MemoryMappedFileAccess.Read)) {
      let fileBuffer = fs.readFileSync(fileName);
      archive = new ArkArchive(fileBuffer, size, this._arkNameCache, this._exclusivePropertyNameTree);
      readBinary(archive);
      // }
      // }
    }


  }
  readBinary(archive) {
    this.profileVersion = archive.getInt();

    // if (ProfileVersion != 1)
    // throw new NotSupportedException("Unknown Profile Version {ProfileVersion} in ""{_fileName}""" + (ProfileVersion == 0 ? " (possibly corrupt)" : ""));

    var profilesCount = archive.getInt();
    for (let i = 0; i < profilesCount; i++) {
      this.objects.push(new GameObject(archive, this._arkNameCache));
    }

    for (let i = 0; i < profilesCount; i++) {
      var obj = this.objects[i];
      if (obj.ClassName.Token.Equals("PrimalPlayerData") || obj.ClassName.Token.Equals("PrimalPlayerDataBP_C")) this._profile = obj;
      obj.loadProperties(archive, i < profilesCount - 1 ? Objects[i + 1] : null, 0);
    }
  }
}

module.exports = ArkProfile
