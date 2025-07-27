const jwt = require('jsonwebtoken');
const jwtOPTIONS = require('../config/jwtOptions');
const { userRoles, defaultStatus } = require('../config/options');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      'User',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        status: {
          type: DataTypes.ENUM(...defaultStatus.getDefaultStatusArray()),
          allowNull: false,
          defaultValue: defaultStatus.ACTIVE
        },
        role: {
          type: DataTypes.ENUM(...userRoles.getAllRolesAsArray()),
          allowNull: false,
          defaultValue: userRoles.USER
        },
      },
      {
        timestamps: true,   
        freezeTableName: true,
    }
    );
  
    User.prototype.genToken = function () {
      const payload = { id: this.id };
      return jwt.sign(payload, jwtOPTIONS.secretOrKey, {
        expiresIn: jwtOPTIONS.expiry,
      });
    };
  
    User.prototype.validPassword = function (password) {
      return this.password ? bcrypt.compareSync(password, this.password) : false;
    };
    User.associate = (models) => {};
  
    return User;
  };
  