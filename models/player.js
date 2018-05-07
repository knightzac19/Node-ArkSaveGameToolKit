'use strict';

module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('Player', {
    level: DataTypes.INTEGER,
    engrams: DataTypes.INTEGER,
    steamId: DataTypes.STRING,
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    characterName: DataTypes.STRING,
    playerName: DataTypes.STRING,
    steamName: DataTypes.STRING,
    playerUrl: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    communityBanned: DataTypes.BOOLEAN,
    vacBanned: DataTypes.BOOLEAN,
    numberOfVacBans: DataTypes.INTEGER,
    daysSinceLastBan: DataTypes.INTEGER,
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['id']
    },{
      unique:true,
      fields: ['steamId','ServerId']
    }]
  });
  Player.associate = function(models) {
    // models.Player.hasOne(models.TribeMember);
    // models.Player.hasOne(models.TribeOwner);
    models.Player.belongsTo(models.Server);
    models.Player.belongsToMany(models.Tribe,{through:models.TribeMember});
    models.Player.belongsToMany(models.Tribe,{through:models.TribeOwner});
  };
  return Player;
};
