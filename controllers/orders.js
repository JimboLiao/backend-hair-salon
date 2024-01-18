const {
  getOrdersOfMemberDal,
  getOrderByIdDal,
  createOrderDal,
  updateOrderDal,
  deleteOrderDal,
} = require("../entities/ordersDal");
const { getProductByIdDal } = require("../entities/productsDal");
const {
  getProductsInOrderByOrderIdDal,
  bulkCreateProductsInOrderDal,
} = require("../entities/productsInOrderDal");
const { checkParams } = require("../utils/checkReq");
const {
  badQuery,
  authFail,
  failResponse,
  badBodyValue,
  notFound,
} = require("../utils/failResponse");

const fillProductsToOrder = async (order) => {
  const productsInOrder = await getProductsInOrderByOrderIdDal(order.id);

  const result = {
    date: order.createdAt,
    status: order.status,
    delivery: order.delivery,
    products: [],
  };

  for (const productInOrder of productsInOrder) {
    const product = await getProductByIdDal(productInOrder.productId);
    result.products.push({
      productName: product.productName,
      amount: productInOrder.productAmount,
      price: product.price,
      imgUrl: product.imgUrl,
    });
  }
  return result;
};

const getOrders = async (req, res) => {
  try {
    const id = res.locals.id;
    const orders = await getOrdersOfMemberDal(id);
    if (Object.keys(req.query).length !== 0) {
      if (req.query._embed === "products") {
        const results = [];
        for (const order of orders) {
          const result = await fillProductsToOrder(order);
          results.push(result);
        }

        return res.status(200).json({ data: results });
      } else {
        return badQuery(res);
      }
    } else {
      // no queries
      return res.status(200).json({ data: orders });
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      if (err.message === "Not Found") return notFound(res);
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const getOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await getOrderByIdDal(id);
    if (order.memberId !== res.locals.id) return authFail(res);
    return res.status(200).json({ data: order });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      if (err.message === "Not Found") return notFound(res);
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const createOrder = async (req, res) => {
  try {
    const requiredValues = ["tradeNo", "delivery", "productInfos"];
    const checkResult = checkParams(req.body, requiredValues);
    if (checkResult.isPassed) {
      const isValidInfos = req.body.productInfos.every((info) => {
        return (
          info.hasOwnProperty("productId") &&
          info.hasOwnProperty("productAmount")
        );
      });

      if (!Array.isArray(req.body.productInfos) || !isValidInfos) {
        return badBodyValue(res);
      }

      const newOrder = req.body;
      newOrder.memberId = res.locals.id;
      const orderId = await createOrderDal(newOrder);

      await bulkCreateProductsInOrderDal(orderId, req.body.productInfos);

      res.status(201).json({ id: orderId });
    } else {
      failResponse(
        res,
        400,
        `Missing required argument: ${checkResult.missingParam}`
      );
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      if (err.message === "Not Found") return notFound(res);
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const updateOrder = async (req, res) => {
  try {
    const memberId = res.locals.id;
    let order = req.body;
    order.memberId = memberId;
    const orderId = await updateOrderDal(req.params.id, order);
    return res.status(200).json({ id: orderId });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      if (err.message === "Not Found") return notFound(res);
      if (err.message === "Bad Value") return badBodyValue(res);
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const memberId = res.locals.id;
    const orderId = await deleteOrderDal(id, memberId);
    return res.status(200).json({ id: orderId });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      if (err.message === "Not Found") return notFound(res);
      if (err.message === "Bad Value") return badBodyValue(res);
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrder, deleteOrder };
