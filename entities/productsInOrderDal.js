const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelizeModel");

class ProductInOrder extends Model {}

ProductInOrder.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    productAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { sequelize, tableName: "productInOrder", modelName: "productInOrder" }
);

async function getProductsInOrderByOrderIdDal(orderId) {
  const selectedProductsInOrder = await ProductInOrder.findAll({
    where: { orderId: orderId },
  });

  return selectedProductsInOrder;
}

async function bulkCreateProductsInOrderDal(orderId, productInfos) {
  // productInfos = [{productId: id, productAmount: amount}, ...];

  const newProductInOrders = productInfos.map((info) => {
    return {
      orderId: orderId,
      productId: info.productId,
      productAmount: info.productAmount,
    };
  });

  await ProductInOrder.bulkCreate(newProductInOrders);
}

module.exports = {
  ProductInOrder,
  getProductsInOrderByOrderIdDal,
  bulkCreateProductsInOrderDal,
};
