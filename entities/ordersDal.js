const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelizeModel");

const orderStatus = {
  PAY: "Payment",
  PROCESS: "Processing",
  DELIVER: "Delivering",
  PICKUP: "Picking up",
  COMPLETE: "Complete",
  CANCEL: "Canceled",
};

class Order extends Model {}
Order.init(
  {
    // model attributes
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: orderStatus.PAY,
    },
    delivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 40,
    },
    tradeNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // model options
    sequelize,
    modelName: "order",
    tableName: "order",
  }
);

const getOrdersDal = async () => {
  const allOrders = await Order.findAll({ where: { deletedAt: null } });
  return allOrders;
};

const getOrdersOfMemberDal = async (memberId) => {
  const selectedOrder = await Order.findAll({
    where: { memberId: memberId, deletedAt: null },
  });

  return selectedOrder;
};

const getOrderByIdDal = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error("Not Found");
  }
  return order;
};

const createOrderDal = async (order) => {
  const { memberId, delivery, tradeNo } = order;
  const newOrder = await Order.create({
    memberId: memberId,
    delivery: delivery,
    tradeNo: tradeNo,
  });

  return newOrder.id;
};

const updateOrderDal = async (id, order) => {
  const { memberId, status, delivery } = order;
  const st = orderStatus[status];
  if (!st) {
    throw new Error("Bad Value");
  }

  const selectedOrder = await Order.findByPk(id);
  if (!selectedOrder) {
    throw new Error("Not Found");
  }

  if (selectedOrder.memberId !== memberId) {
    throw new Error("Auth Fail");
  }

  selectedOrder.status = st || selectedOrder.status;
  selectedOrder.delivery = delivery || selectedOrder.delivery;
  await selectedOrder.save();

  return selectedOrder.id;
};

const deleteOrderDal = async (id, memberId) => {
  const selectedOrder = await Order.findByPk(id);

  if (!selectedOrder) {
    throw new Error("Not Found");
  }

  if (selectedOrder.memberId !== Number(memberId)) {
    console.log("memberId = ", memberId, " ", typeof memberId);
    console.log(selectedOrder.memberId, " !== ", Number(memberId));
    throw new Error("Auth Fail");
  }

  // soft delete
  selectedOrder.deletedAt = Date.now();
  await selectedOrder.save();
  return selectedOrder.id;
};

module.exports = {
  Order,
  getOrdersDal,
  getOrderByIdDal,
  getOrdersOfMemberDal,
  createOrderDal,
  updateOrderDal,
  deleteOrderDal,
};
