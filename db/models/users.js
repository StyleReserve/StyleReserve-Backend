'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.belongsTo(models.Stylers, {
        foreignKey: 'styler_id',
      });
      models.Users.hasMany(models.Sreserves, {
        foreignKey: 'owner_id',
      });
      models.Users.hasMany(models.Srmembers, {
        foreignKey: 'user_id',
      });
      models.Users.hasMany(models.Creserves, {
        foreignKey: 'user_id',
      });
    }
  }
  Users.init({
    provider: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    salt: DataTypes.STRING
    
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Users',
  });
  return Users;
};