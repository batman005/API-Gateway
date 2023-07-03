'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const {ServerConfig} = require('../config');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role, {through: 'User_Roles', as: 'roles'});
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(function encrypt(user){
    // + sign convert string to number SALT_ROUNDS
    const encryptedPassword = bcrypt.hashSync(user.password, +ServerConfig.SALT_ROUNDS);
    user.password = encryptedPassword;
  });
  return User;
};