'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tribe = sequelize.define('Tribe', {
    name: DataTypes.STRING
  });
  Tribe.associate = function(models) {
    models.Tribe.belongsToMany(models.Player, {
      through: models.TribeMember
    });
    models.Tribe.belongsToMany(models.Player, {
      through: models.TribeOwner
    });
    models.Tribe.belongsTo(models.Server);
  };

  return Tribe;
};
