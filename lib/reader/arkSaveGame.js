const ArkArchive = require('./arkArchive');
const fs = require('fs');
const GameObject = require('./gameObject');
const ArkNameCache = require("./ArkNameCache");
const EmbeddedData = require("./types/embeddedData");
const Promise = require('bluebird');
const _ = require('lodash');
const ProgressBar = require('progress');
const async = require('async');
const napajs = require('napajs');

class ArkSaveGame {
  constructor(obj) {
    this.binaryDataOffset = 0;
    this.nameTableOffset = 0;
    this.propertiesBlockOffset = 0;
    this._baseRead = false;
    this.dataFiles = [];
    this.embeddedData = [];
    this._objects = [];
    const self = this;
    this.objectQueue = async.queue(function (task, callback) {
      task.loadProperties(self._archive, (task.index < self._objects.length - 1) ? task[task.index + 1] : null, self.propertiesBlockOffset);
      console.log(self.objectQueue.workersList())
      // console.log(`Processed ${task.className}`)
      callback();
    }, 8);
    this.objectQueue.drain = function () {
      console.log('all items have been processed');
    };
    // setInterval(()=>{ },4000);
    if (obj.fileName !== undefined, obj.arkNameCache !== undefined, obj.savegameMaxDegreeOfParallelism !== undefined, obj.exclusivePropertyNameTree !== undefined) {
      this._fileName = obj.fileName;
      // this._arkNameCache = obj.arkNameCache || new ArkNameCache();
      // this._arkStringCache = new ArkStringCache();
      this._savegameMaxDegreeOfParallelism = obj.savegameMaxDegreeOfParallelism;
      this._exclusivePropertyNameTree = obj.exclusivePropertyNameTree;

      // let fi = new FileInfo(_fileName);
      // let size = fi.Length;
      // SaveTime = fi.LastWriteTimeUtc;
      let fi = fs.statSync(this._fileName);
      let size = fi.size;
      // _mmf = MemoryMappedFile.CreateFromFile(_fileName, FileMode.Open, null, 0L, MemoryMappedFileAccess.Read);
      // _va = _mmf.CreateViewAccessor(0L, 0L, MemoryMappedFileAccess.Read);
      this._fileBuffer = fs.readFileSync(this._fileName);
      // console.log(this._fileBuffer, size, this._arkNameCache, this._arkStringCache, this._exclusivePropertyNameTree);
      this._archive = new ArkArchive({
        fileBuffer: this._fileBuffer,
        size
      });
    }

  }

  get objects() {
    return this._objects;
  }

  set objects(v) {
    return false;
  }

  /// <summary>
  /// Load all gameobjects, properties and other data in this savegame.
  /// </summary>
  loadEverything() {
    return this.readBinary(this._archive, this._fileBuffer);
  }

  getObjectAtOffset(offset, nextPropertiesOffset) {
    let oldposition = this._archive.position;
    this._archive.position = offset;
    let gameObject = new GameObject(this._archive, this._arkNameCache);
    gameObject.loadProperties(this._archive, null, this.propertiesBlockOffset, this.nextPropertiesOffset);
    this._archive.position = oldposition;

    return gameObject;
  }


  readBinary(archive, buffer) {
    if (!this._baseRead) {
      let self = this;
      
      this.readBinaryBase(archive);
      this.readBinaryObjects(archive);
  
      // console.log(this.objectQueue.running());
      // return this.readBinaryObjectProperties(archive, buffer);
    } else {
      // console.log(this.objectQueue.running());
      let self = this;
      archive.position = this._gameObjectsOffset;
      this.readBinaryObjects(archive);
      // console.log(this.objectQueue.running());
      // return this.readBinaryObjectProperties(archive, buffer);
    }

  }

  readBinaryBase(archive) {
    let self = this;

    self.readBinaryHeader(archive);
    if (self.saveVersion > 5) {
      // Name table is located after the objects block, but will be needed to read the objects block
      self.readBinaryNameTable(archive);
    }

    self.readBinaryDataFiles(archive);

    // self.SaveState = new SaveState {
    //   self.GameTime = self.GameTime, self.SaveTime = self.SaveTime, self.MapName = self.dataFiles.FirstOrDefault()
    // };

    self.readBinaryEmbeddedData(archive, false);

    let unknownValue = archive.getInt();

    if (unknownValue != 0) {
      for (let n = 0; n < unknownValue; n++) {
        let unknownFlags = archive.getInt();
        let objectCount = archive.getInt();
        let name = archive.getString();
      }
    }
    self._baseRead = true;
    self._gameObjectsOffset = archive.position;



  }

  readBinaryHeader(archive) {
    console.log("Reading BinaryNameHeader");
    this.saveVersion = archive.getShort();

    if (this.saveVersion == 5) {

      this.gameTime = archive.getFloat();
      this.propertiesBlockOffset = 0;

    } else if (this.saveVersion == 6) {

      this.nameTableOffset = archive.getInt();
      this.propertiesBlockOffset = archive.getInt();
      this.gameTime = archive.getFloat();

    } else if (this.saveVersion == 7 || this.saveVersion == 8) {

      this.binaryDataOffset = archive.getInt();
      let unknownValue = archive.getInt();
      if (unknownValue != 0) {
        // let msg = $ "Found unexpected Value {unknownValue} at {archive.position - 4:X}";
        // _logger.Error(msg);
        throw new Error("unexpected value");
      }

      this.nameTableOffset = archive.getInt();
      this.propertiesBlockOffset = archive.getInt();
      this.gameTime = archive.getFloat();

    } else if (this.saveVersion == 9) {
      this.binaryDataOffset = archive.getInt();
      let unknownValue = archive.getInt();
      if (unknownValue != 0) {
        // let msg = $ "Found unexpected Value {unknownValue} at {archive.position - 4:X}";
        // _logger.Error(msg);
        throw new Error("unexpected value");
      }

      this.nameTableOffset = archive.getInt();
      this.propertiesBlockOffset = archive.getInt();
      this.gameTime = archive.getFloat();

      //note: unknown integer value was added in v268.22 with this.saveVersion=9 [0x25 (37) on The Island, 0x26 (38) on ragnarok/center/scorched]
      let unknownValue2 = archive.getInt();
    } else {
      // let msg = $ "Found unknown Version {this.saveVersion}";
      // _logger.Error(msg);
      throw new TypeError(`Found unknown Version ${this.saveVersion}`);
    }
  }

  readBinaryNameTable(archive) {
    console.log("Reading BinaryNameTable");
    let position = archive.position;

    //3932578
    archive.position = this.nameTableOffset;

    let nameCount = archive.getInt();
    // console.log('nametable',{position:archive.position});
    let nameTable = [];
    // console.log('nametable',{pos:archive.position});
    for (let n = 0; n < nameCount; n++) {
      nameTable.push(archive.getString());

    }

    archive.nameTable = nameTable;

    archive.position = position;
  }

  readBinaryDataFiles(archive, dataFiles = true) {
    let count = archive.getInt();
    if (dataFiles) {
      this.dataFiles = [];
      for (let n = 0; n < count; n++) {
        this.dataFiles.push(archive.getString());
      }
    } else {
      for (let n = 0; n < count; n++) {
        archive.skipString();
      }
    }
  }

  readBinaryEmbeddedData(archive, embeddedData = true) {
    let count = archive.getInt();
    if (embeddedData) {
      this.embeddedData = [];
      for (let n = 0; n < count; n++) {
        // this.embeddedData.push(new EmbeddedData(archive));
      }
    } else {
      for (let n = 0; n < count; n++) {
        EmbeddedData.skip(archive);
      }
    }
  }

  readBinaryObjects(archive, gameObjects = true) {
    if (gameObjects) {
      let count = archive.getInt();
      // console.log({
      //   count,
      //   pos: archive.position
      // });
      this._objects = [];
      console.log("Reading BinaryObjects");
      for (let n = 0; n < count; n++) {
        let gameObject = new GameObject(archive, this._arkNameCache);
        gameObject.objectId = n;
        // console.log(gameObject);
        this._objects.push(gameObject);
        gameObject.index = n;
        this.objectQueue.push(gameObject);
        gameObject = undefined;
      }
      console.log("Finished BinaryObjects");
    }
  }

  readBinaryObjectProperties(archive, fileBuffer, objectFilter = null, gameObjects = true, gameObjectProperties = true) {
    var q = async.queue(function (task, callback) {
      console.log('hello ' + task.name);
      callback();
    }, 2);

    // assign a callback
    q.drain = function () {
      console.log('all items have been processed');
    };
    // add some items to the queue
    q.push({ name: 'foo' }, function (err) {
      console.log('finished processing foo');
    });
    q.push({ name: 'bar' }, function (err) {
      console.log('finished processing bar');
    });

    // add some items to the queue (batch-wise)
    q.push([{ name: 'baz' }, { name: 'bay' }, { name: 'bax' }], function (err) {
      console.log('finished processing item');
    });

    // add some items to the front of the queue
    q.unshift({ name: 'bar' }, function (err) {
      console.log('finished processing bar');
    });
    return;
    if (gameObjects && gameObjectProperties) {
      let success = true;
      let self = this;
      return new Promise(function (resolve, reject) {
        console.log("Filling out properties...");
        // console.log(self._objects.length);
        // let jobs = _.chunk(self._objects, 5);
        let count = 0;
        // process.stdout.write(`Objects Processed ${count}`);
        // let objPromises = [];
        // var bar = new ProgressBar('[:bar] :percent%', {
        //   total: self._objects.length,
        //   renderThrottle: 0
        // });
        // async.parallel([])

        async.eachOf(self._objects, (j, index) => {
          // bar.tick();
          // objPromises = j.map((item, index) => {

          // return new Promise(function(resolve, reject) {
          j.loadProperties(archive, (index < j.length - 1) ? j[index + 1] : null, self.propertiesBlockOffset);
          //   resolve();
          // });
          // });
        });
        resolve();
      });

      // Promise.coroutine(function*() {
      //   yield all([
      //     job[0][1].loadProperties(archive, (1 < this._objects.length - 1) ? this._objects[1 + 1] : null, this.propertiesBlockOffset),
      //     job[0][2].loadProperties(archive, (2 < this._objects.length - 1) ? this._objects[2 + 1] : null, this.propertiesBlockOffset),
      //     job[0][3].loadProperties(archive, (3 < this._objects.length - 1) ? this._objects[3 + 1] : null, this.propertiesBlockOffset)
      //   ]);
      // });

      // if (cluster.isMaster) {
      //   let jobChunks = chunk(this._objects, (this._objects.length / numCPUs));
      //   // console.log(jobChunks);
      //   for (var i = 0; i < 2; i++) {
      //     let process = cluster.fork();
      //     process.send(new ArkArchive({toClone:archive,fileBuffer:this._fileBuffer}));
      //   }
      // }
    }
  }

  readBinaryObjectPropertiesImpl(item, archive, index) {
    item.loadProperties(archive, (index < this._objects.length - 1) ? this._objects[index + 1] : null, this.propertiesBlockOffset);

  }

}

module.exports = ArkSaveGame;
