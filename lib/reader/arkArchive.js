const GlobalClass = require("./globalClass");
const sByte = require('./types/sByte');
// const ArkNameCache = require("./arkNameCache");
const ArkStringCache = require("./arkStringCache");
const ArkName = require('./types/arkName')
const _ = require("lodash");



class ArkArchive extends GlobalClass {
  constructor(object) {
    super();
    this._position = 0;
    this._size = 0;
    this.oldPosition = 0;
    this.positionCheck = 0;
    if (object.fileBuffer && Buffer.isBuffer(object.fileBuffer) && object.size) {
      this._fileBuffer = object.fileBuffer;
      this._size = Object.freeze(object.size);
      // this._arkNameCache = object.arkNameCache || new ArkNameCache();
      this._arkStringCache = object.arkStringCache || new ArkStringCache();
      this._exclusivePropertyNameTree = object.exclusivePropertyNameTree || null;
      // console.log(this);
    } else if (object.toClone) {
      console.log("Cloned");
      this._fileBuffer = object.toClone.fileBuffer;
      this._size = object.toClone._size;
      this._nameTable = object.toClone._nameTable;
      this._arkNameCache = object.toClone._arkNameCache;
      this._arkStringCache = object.toClone._arkStringCache;
      this._exclusivePropertyNameTree = object.toClone._exclusivePropertyNameTree;
      console.log(this._size);
    }
  }


  // public ArkNameTree ExclusivePropertyNameTree => _exclusivePropertyNameTree;

  get position() {
    // console.log({
    //   position: this._position
    // });
    return this._position;
  }
  set position(v) {
    if (v < 0 || v >= this._size) {
      // _logger.Error($ "Attempted to set position outside stream bounds (offset: {value:X}, size: {_size:X})");
      throw new Error(`Attempted to set position outside stream bounds (offset: ${v}, size: ${this._size})`);
    }
    if (isNaN(v)) {
      throw new TypeError("Invalid position NaN!");
    }
    // console.log({
    //   changedPosition: v
    // });
    this._position = v;
  }


  // public long Size => _size;


  get nameTable() {
    return this._nameTable;
  }
  set nameTable(v) {
    if (v != null)
      this._nameTable = v;
    else
      this._nameTable = null;
  }


  getNames(position) {
    let count = this.getInt(position);
    let names = {
      [count]: new ArkName()
    };
    let oldposition = this._position;
    this._position = position + 4;
    for (var i = 0; i < count; i++) names[i] = this.getName();
    this._position = oldposition;

    return names;
  }

  getName(position) {
    if (this._nameTable == null) {
      let nameAsString = this.getString(position);
      return ArkName.create(nameAsString);
    } else if (!position) {
      let id = this.getInt();
      // console.log(id);
      if (id < 1 || id > this._nameTable.length) {
        // _logger.Warn($ "Found invalid nametable index {id} at {_position - 4:X}");
        console.error(`Found invalid nametable index ${id} at ${this._position - 4}`);
        return null;
      }

      let nameString = this._nameTable[id - 1];
      let nameIndex = this.getInt();
      // if (nameString === 'None') {
      //   console.log(nameString);
      //   console.log(this._nameTable[id - 1])
      // }
      return ArkName.create(nameString, nameIndex);

    } else {
      let id = this.getInt(position);

      if (id < 1 || id > _nameTable.length) {
        // _logger.Warn($ "Found invalid nametable index {id} at {position:X}");
        console.error(`Found invalid nametable index ${id} at ${this._position}`);
        return null;
      }

      let nameString = this._nameTable[id - 1];
      let nameIndex = this.getInt(position + 4);

      return ArkName.create(nameString, nameIndex);
    }
  }


  skipName() {

    if (this._nameTable == null) {
      this.skipString();
    } else {
      this._position += 8;
    }
  }

  getNameLength(position) {
    if (this._nameTable == null) {
      let size = this.getInt(position);
      let multibyte = size < 0;
      let absSize = Math.abs(size);
      let readSize = multibyte ? absSize * 2 : absSize;
      return 4 + readSize;
    } else return 8;
  }

  
  getString() {

    let size = this.getInt();
    if (size == 0) return null;

    let multibyte = size < 0;
    let absSize = Math.abs(size);

    let readSize = multibyte ? absSize * 2 : absSize;
    if (readSize + this._position >= this._size) {

      throw new Error(`getString(), Trying to read ${readSize} bytes at ${this._position} with just ${this._size-this._position} bytes left`);
    }
    //3932582 pos
    if (multibyte) {

      this._position += absSize * 2;
      let result = this._fileBuffer.slice(this._position, this._position + absSize - 1).toString();
      return this._arkStringCache.add(result);
    } else {
      let result = this._fileBuffer.slice(this._position, this._position + absSize - 1).toString();
      this._position += absSize; //3932608

      return this._arkStringCache.add(result);
    }

    // if (multibyte) {
    // let buffer = Buffer.from(absSize);
    // var count = _va.ReadArray(_position, buffer, 0, absSize);
    // this._position += absSize * 2;
    // let result = buffer.toString('utf8', 0, absSize - 1);
    // var result = new string(buffer, 0, absSize - 1);

    // return result;
    // return this._arkStringCache.Add(result);
    // } else {
    // let buffer = Buffer.byteLength(absSize);
    // var count = _va.ReadArray(_position, buffer, 0, absSize);
    // this._position += absSize;
    // return buffer.toString('ascii', 0, absSize - 1);
    //return Encoding.ASCII.GetString(buffer, 0, absSize - 1);
    // return this._arkStringCache.Add(buffer.toString('ascii', 0, absSize - 1));
    // }
  }

  skipString() {
    let size = this.getInt();

    let multibyte = size < 0;
    let absSize = Math.abs(size);
    let readSize = multibyte ? absSize * 2 : absSize;

    if (absSize > 10000) console.warn(`Large String (${absSize}) at ${this._position - 4}`);

    if (readSize + this._position > this._size) {
      // _logger.Error($ "Trying to skip {readSize} bytes at {_position:X} with just {_size - _position} bytes left");
      throw new Error(`Trying to skip ${readSize} bytes at ${this._position} with just ${this._size - this._position} bytes left`);
    }

    this._position += readSize;
  }

  getInt(position) {
    const size = 4;
    if (position !== undefined) {

      if (this._position + size > this._size) {
        console.error({
          position: this._position,
          overflow: (this._position + size > this._size)
        });
        throw new Error();
      }

      let value = this._fileBuffer.readIntLE(position, size);


      return value;
    } else {
      if (position + size > this._size) {
        console.error({
          position: this._position,
          overflow: (this._position + size > this._size)
        });
        throw new Error();
      }

      let value = this._fileBuffer.readIntLE(this._position, size);
      this._position += size;
      return value;
    }

  }


  getBytes(length) {
    // var buffer = new sbyte[length];

    if (this._position + length > this._size) {
      // _logger.Error($"Trying to read {length} bytes at {_position:X} with just {_size - _position} bytes left");
      throw new TypeError(`Trying to read ${length} bytes at ${this._position} with just ${this._size - this._position} bytes left`);
    }
    this._position += length;
    let result = this._fileBuffer.slice(this._position, this._position + length);
    return result;
    // return buffer;
  }
  getByte() {
    const size = 1;
    if (this._position + size > this._size) {
      throw new TypeError();
    }

    var value = this._fileBuffer.readInt8(this._position);
    this._position += size;
    return value;
  }

  getLong() {
    const size = 8;
    if (this._position + size > this._size) {
      // _logger.Error($ "Trying to read {size} bytes at {_position:X} with just {_size - _position} bytes left");
      throw new OverflowException();
    }

    var value = this._fileBuffer.readDoubleLE(this._position);
    this._position += size;

    return value;
  }

  getShort() {
    const size = 2;
    if (this._position + size > this._size) {
      // _logger.Error($ "Trying to read {size} bytes at {_position:X} with just {_size - _position} bytes left");
      throw new OverflowException();
    }
    var value = this._fileBuffer.readInt16LE(this._position);
    this._position += size;

    return value;
  }

  getDouble() {
    const size = 8;
    if (this._position + size > this._size) {
      // _logger.Error($ "Trying to read {size} bytes at {_position:X} with just {_size - _position} bytes left");
      throw new OverflowException();
    }

    var value = this._fileBuffer.readDoubleLE(this._position);
    this._position += size;

    return value;
  }

  getFloat() {
    const size = 4;
    if (this._position + size > this._size) {
      throw new TypeError();
    }
    var value = this._fileBuffer.readFloatLE(this._position);
    this._position += size;

    return value;
  }

  getBoolean() {
    var val = this.getInt();
    if (val < 0 || val > 1) console.error(`Boolean at ${this._position} with value ${val}, returning true.`);

    return val != 0;
  }
}

module.exports = ArkArchive;
