class EmbeddedData {
  // constructor(archive) {
  //   this.read(archive);
  // }

  // read(archive) {
  //   this.path = archive.getString();
  //
  //   var partCount = archive.getInt();
  //
  //   Data = new sbyte[partCount][][];
  //   for (var part = 0; part < partCount; part++) {
  //     var blobCount = archive.getInt();
  //     var partData = new sbyte[blobCount][];
  //
  //     for (var blob = 0; blob < blobCount; blob++) {
  //       var blobSize = archive.getInt() * 4; // Array of 32 bit values
  //       partData[blob] = archive.getBytes(blobSize);
  //     }
  //
  //     Data[part] = partData;
  //   }
  // }

  skip(archive) {
    archive.skipString();

    let partCount = archive.getInt();
    for (let part = 0; part < partCount; part++) {
      let blobCount = archive.getInt();
      for (let blob = 0; blob < blobCount; blob++) {
        let blobSize = archive.getInt() * 4;
        archive.position += blobSize;
      }
    }
  }
}
module.exports = EmbeddedData;
