const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelizeModel");

class Product extends Model {}

Product.init(
  {
    // model attributes
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reserve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // model options
    sequelize,
    modelName: "product",
    tableName: "product",
  }
);

const getProductsDal = () => {
  return;
};

module.exports = { Product, getProductsDal };
