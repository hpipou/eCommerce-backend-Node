'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User,{foreignKey:{name:'idUser'}})
    }
  }
  Order.init({
    listProduct: DataTypes.STRING,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    shipAdresse: DataTypes.STRING,
    city: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    country: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    totalPrice: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    idProfil: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};