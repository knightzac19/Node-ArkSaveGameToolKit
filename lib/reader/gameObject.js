const ArkName = require("./types/arkName");
const ArkNameCache = require("./ArkNameCache");
const PropertyRegistry = require('./properties/propertyRegistry');
const PropertyBase = require('./properties/propertyBase');
const Map = require("collections/map");
const uuid = require('uuid/v4');
const GlobalClass = require("./globalClass");
const LocationData = require('./types/locationData');
const ExtraDataRegistry = require('./data/extraDataRegistry');
// console.log(PropertyRegistry);
const _ = require('lodash');
const Promise = require('bluebird');

class GameObject extends GlobalClass {

  constructor(archive, arkNameCache) {
    super();

    this._dinoId1 = ArkName.create("DinoID1", 0);
    this._tamerString = ArkName.create("TamerString", 0);
    this._tamingTeamID = ArkName.create("TamingTeamID", 0);
    this._ownerName = ArkName.create("OwnerName", 0);
    this._bHasResetDecayTime = ArkName.create("bHasResetDecayTime", 0);
    this._bInitializedMe = ArkName.create("bInitializedMe", 0);
    this._currentStatusValues = ArkName.create("CurrentStatusValues", 0);
    this._raft_bp_c = ArkName.create("Raft_BP_C", 0);
    this._motorraft_bp_c = ArkName.create("MotorRaft_BP_C", 0);
    this._structurePaintingComponent = ArkName.create("StructurePaintingComponent", 0);
    this._male = ArkName.create("PlayerPawnTest_Male_C", 0);
    this._female = ArkName.create("PlayerPawnTest_Female_C", 0);
    this._droppedItem = ArkName.create("DroppedItemGenericLowQuality_C", 0);

    this.dependencies = {
      [this._dinoId1]: null,
      [this._tamerString]: null,
      [this._tamingTeamID]: null,
      [this._ownerName]: null,
      [this._bHasResetDecayTime]: null,
      [this._bInitializedMe]: null,
      [this._currentStatusValues]: null
    };
    this.properties = {};
    // this._arkNameCache = arkNameCache || new ArkNameCache();
    this._isFlags = 0;
    this._propertiesOffset = 0;
    this.gameObjectIs = Object.freeze({
      None: 0,
      IsCreature: 1 << 0,
      IsTamedCreature: 1 << 1,
      IsWildCreature: 1 << 2,
      IsRaftCreature: 1 << 3,
      IsStructure: 1 << 4,
      IsInventory: 1 << 5,
      IsTamedCreatureInventory: 1 << 6,
      IsWildCreatureInventory: 1 << 7,
      IsStructureInventory: 1 << 8,
      IsPlayerCharacterInventory: 1 << 9,
      IsStatusComponent: 1 << 10,
      IsDinoStatusComponent: 1 << 11,
      IsPlayerCharacterStatusComponent: 1 << 12,
      IsDroppedItem: 1 << 13,
      IsPlayerCharacter: 1 << 14,
      IsStructurePaintingComponent: 1 << 15,
      IsDeathItemCache: 1 << 16,
      IsSomethingElse: 1 << 17
    });
    // console.log(this.gameObjectIs);
    this.isCreature = (this._isFlags && this.gameObjectIs.IsCreature) == this.gameObjectIs.IsCreature;
    this.isTamedCreature = (this._isFlags && this.gameObjectIs.IsTamedCreature) == this.gameObjectIs.IsTamedCreature;
    this.isWildCreature = (this._isFlags && this.gameObjectIs.IsWildCreature) == this.gameObjectIs.IsWildCreature;
    this.isRaftCreature = (this._isFlags && this.gameObjectIs.IsRaftCreature) == this.gameObjectIs.IsRaftCreature;
    this.isStructure = (this._isFlags && this.gameObjectIs.IsStructure) == this.gameObjectIs.IsStructure;
    this.isInventory = (this._isFlags && this.gameObjectIs.IsInventory) == this.gameObjectIs.IsInventory;
    this.isTamedCreatureInventory = (this._isFlags && this.gameObjectIs.IsTamedCreatureInventory) == this.gameObjectIs.IsTamedCreatureInventory;
    this.isWildCreatureInventory = (this._isFlags && this.gameObjectIs.IsWildCreatureInventory) == this.gameObjectIs.IsWildCreatureInventory;
    this.isStructureInventory = (this._isFlags && this.gameObjectIs.IsStructureInventory) == this.gameObjectIs.IsStructureInventory;
    this.isPlayerCharacterInventory = (this._isFlags && this.gameObjectIs.IsPlayerCharacterInventory) == this.gameObjectIs.IsPlayerCharacterInventory;
    this.isStatusComponent = (this._isFlags && this.gameObjectIs.IsStatusComponent) == this.gameObjectIs.IsStatusComponent;
    this.isDinoStatusComponent = (this._isFlags && this.gameObjectIs.IsDinoStatusComponent) == this.gameObjectIs.IsDinoStatusComponent;
    this.isPlayerCharacterStatusComponent = (this._isFlags && this.gameObjectIs.IsPlayerCharacterStatusComponent) == this.gameObjectIs.IsPlayerCharacterStatusComponent;
    this.isDroppedItem = (this._isFlags && this.gameObjectIs.IsDroppedItem) == this.gameObjectIs.IsDroppedItem;
    this.isPlayerCharacter = (this._isFlags && this.gameObjectIs.IsPlayerCharacter) == this.gameObjectIs.IsPlayerCharacter;
    this.isStructurePaintingComponent = (this._isFlags && this.gameObjectIs.IsStructurePaintingComponent) == this.gameObjectIs.IsStructurePaintingComponent;
    this.isDeathItemCache = (this._isFlags && this.gameObjectIs.IsDeathItemCache) == this.gameObjectIs.IsDeathItemCache;
    this.isSomethingElse = (this._isFlags && this.gameObjectIs.IsSomethingElse) == this.gameObjectIs.IsSomethingElse;
    this.className = null;
    this.isItem = false;
    this.names = [];
    this.archive = archive;
    this.read(archive);
    // console.log(this);
  }

  checkFlag(flag, checkVar) {
    return flag === checkVar;
  }
  read(archive) {
    let uuidMostSig = archive.getLong();
    let uuidLeastSig = archive.getLong();
    this.className = archive.getName();
    // debugger;
    //1794
    this.isItem = archive.getBoolean();

    let countNames = archive.getInt();
    this.names = [];

    for (let nameIndex = 0; nameIndex < countNames; nameIndex++) {
      this.names.push(archive.getName());
    }

    this.unkBool = archive.getBoolean();
    this.unkIndex = archive.getInt();

    let countLocationData = archive.getInt();

    if (countLocationData > 1) console.warn(`countLocationData > 1 at ${archive.position - 4}`);

    if (countLocationData != 0) {
      this.location = new LocationData(archive);
    }

    this._propertiesOffset = archive.getInt();
    let shouldBeZero = archive.getInt();
    if (shouldBeZero != 0) console.warn(`Expected int after propertiesOffset to be 0 but found ${shouldBeZero} at ${archive.position - 4}`);
  }



  loadProperties(archive, next, propertiesBlockOffset, nextGameObjectPropertiesOffset) {

    let propPromises = [];
    // return new Promise(function(resolve, reject) {
    let offset = propertiesBlockOffset + this._propertiesOffset; //3963513
    let nextOffset = nextGameObjectPropertiesOffset != null ? propertiesBlockOffset + nextGameObjectPropertiesOffset.value : (next != null) ? propertiesBlockOffset + next._propertiesOffset : archive.size - 1; //3963525
    let self = this;
    archive.position = offset;
    // process.stdout.write(archive.position+", ");
    let count = 0;
    let getProp = Promise.coroutine(function*() {

      let property = PropertyRegistry.readProperty(this.archive, this.dependencies);
      if (property !== -1 && property !== null) {
        // self._arkNameCache.create(property.name.token, property.index);
        this.properties[property.name.name] = property;
        // console.log(property);
        // console.log(self.properties);
      }
      // property = ;
      yield property;

    });
    // this.properties = new Map();
    try {

      // let property = PropertyRegistry.readProperty(archive, this.dependencies);
      let br = false;
      let property;
      // while (property != null) {
      for (let i = 0; i <= 100; i++) {
        property = this.getProp().next();
        if (property == null) {
          break;
        }
      }

      // propPromises.push(propPromise);
      // }
    } catch (ex) {
      if (ex instanceof TypeError) {
        // console.log(archive.position);
        // console.log(ex);
      } else {
        // console.log(ex);
      }

      // Stop reading and ignore possible extra data for now, needs a new field in ExtraDataHandler
      // return;
    } finally {
      // console.log(count);
      // debugger;
      if (this.isItem) {
        return;
      }
      // console.log(this.properties);
      // if(!_.isEmpty(this.properties)) {
      //   console.log(archive.position);
      //   // console.log(this.properties[this._dinoId1.name]);
      // }
      // if(this.className.name == 'Argent_Character_BP_C') {
      //       console.log(archive.position);
      //   console.log(this);
      // }
      if (this.properties[this._ownerName.name] || this.properties[this._bHasResetDecayTime.name]) {
        if (this.className.token.includes("DeathItemCache_")) {
          // this._isFlags |= this.gameObjectIs.IsDeathItemCache;
          this.isDeathItemCache = true;
          return;
        }
        // this._isFlags |= this.gameObjectIs.IsStructure;
        this.isStructure = true;

        return;
      }
      // console.log(this.properties[this._dinoId1.name]);
      if (this.properties[this._dinoId1.name]) {
        // this._isFlags |= this.gameObjectIs.IsCreature;
        this.isCreature = true;
      }

      if (this.isCreature && (this.properties[this._tamerString.name] || this.properties[this._tamingTeamID.name])) {
        // this._isFlags |=  this.gameObjectIs.IsCreature | this.gameObjectIs.IsTamedCreature;
        this.isTamedCreature = true;
      }


      if (this.isCreature && !this.isTamedCreature) {
        // this._isFlags |= this.gameObjectIs.IsWildCreature | this.gameObjectIs.IsTamedCreature | this.gameObjectIs.IsCreature;
        this.isWildCreature = true;
      }


      if (this.isTamedCreature && (_.isEqual(this.className, this._raft_bp_c) || _.isEqual(this._motorraft_bp_c, this.className))) {
        // this._isFlags |= this.gameObjectIs.IsRaftCreature;
        this.isRaftCreature = true;
      }


      if (this.isCreature)
        return;

      if (this.properties[this._currentStatusValues.name]) {
        // this._isFlags |= this.gameObjectIs.IsStatusComponent;
        this.isStatusComponent = true;
      }


      if (this.isStatusComponent && this.className.token.includes("DinoCharacterStatusComponent_")) {
        // this._isFlags |= this.gameObjectIs.IsDinoStatusComponent;
        this.isStatusComponent = true;
      }

      if (this.isStatusComponent && !this.isDinoStatusComponent && this.className.token.includes("PlayerCharacterStatusComponent_")) {
        // this._isFlags |= this.gameObjectIs.IsPlayerCharacterStatusComponent;
        this.isPlayerCharacterStatusComponent = true;
      }

      if (this.isStatusComponent)
        return;

      if (this.properties[this._bInitializedMe.name]) {
        // this._isFlags |= this.gameObjectIs.IsInventory;
        this.isInventory = true;

      }

      if (this.isInventory && this.className.token.includes("PrimalInventoryBP_")) {
        // this._isFlags |= this.gameObjectIs.IsStructureInventory;
        this.isStructureInventory = true;

      }

      if (this.isInventory && !this.isStructureInventory && this.className.token.includes("DinoTamedInventoryComponent_")) {
        // this._isFlags |= this.gameObjectIs.IsTamedCreatureInventory;
        this.isTamedCreatureInventory = true;
      }

      if (this.isInventory && !(this.isStructureInventory || this.isTamedCreatureInventory) && this.className.token.includes("PrimalInventoryComponent")) {

        this.isPlayerCharacterInventory = true;
      }

      if (this.isInventory && !(this.isStructureInventory || this.isTamedCreatureInventory || this.isPlayerCharacterInventory) && this.className.token.includes('DinoWildInventoryComponent_')) {

        this.isWildCreatureInventory = true;
      }

      if (this.isInventory) return;
      if (_.isEqual(this._structurePaintingComponent, this.className)) {
        this.isStructurePaintingComponent = true;
        return;
      }

      if (_.isEqual(this._droppedItem, this.className)) {
        this.isDroppedItem = true;
        return;
      }

      if (_.isEqual(this._male, this.className) || _.isEqual(this._female, this.className)) {
        this.isPlayerCharacter = true;
        return;
      }

      this.isSomethingElse = true;
      return;


    }

    let distance = nextOffset - archive.position;
    // console.log(distance);
    //
    let extraData = null;
    if (distance > 0) {

      extraData = ExtraDataRegistry.getExtraData(this, archive, distance);

    } else {
      extraData = null;
    }
    //   resolve();
    // });


  }


}

module.exports = GameObject;
