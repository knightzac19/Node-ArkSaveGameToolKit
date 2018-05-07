module.exports = (sequelize, DataTypes) => {
  var TribeMember = sequelize.define('TribeMember');
  TribeMember.associate = function(models) {
    models.TribeMember.belongsTo(models.Server);
  };

  return TribeMember;
};
