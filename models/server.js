'use strict';
module.exports = (sequelize, DataTypes) => {
  var Server = sequelize.define('Server', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rootPath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    saveDir: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          ['Unix', 'Win']
        ]
      }
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIPv4: true
      }
    },
    serverPort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [4, 5]
      }
    },
    rconPort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [4, 5]
      }
    },
    rconPass: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 16]
      }
    }
  });
  Server.associate = function(models) {
    models.Server.hasMany(models.Player);
    models.Server.hasMany(models.Tribe);
    models.Server.hasMany(models.TribeMember);
    models.Server.hasMany(models.TribeOwner);
  };

  return Server;
};
