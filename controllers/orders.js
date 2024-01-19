const {
  getOrdersOfMemberDal,
  getOrderByIdDal,
  createOrderDal,
  updateOrderDal,
  deleteOrderDal,
  afterPaymentOrderDal,
} = require("../entities/ordersDal");
const { getProductByIdDal } = require("../entities/productsDal");
const {
  getProductsInOrderByOrderIdDal,
  bulkCreateProductsInOrderDal,
} = require("../entities/productsInOrderDal");
const { checkParams } = require("../utils/checkReq");
const { failResponse } = require("../utils/failResponse");
const sequelize = require("../entities/sequelizeModel");
const ecpay_payment = require("ecpay_aio_nodejs");
const { handleError } = require("../utils/handleErr");
const { MERCHANTID, HASHKEY, HASHIV, HOST, CLIENT } = process.env;
const ecpay_options = {
  OperationMode: "Test", //Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
};

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
        throw new Error("Bad query");
      }
    } else {
      // no queries
      return res.status(200).json({ data: orders });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const getOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await getOrderByIdDal(id);
    if (order.memberId !== res.locals.id) throw new Error("Auth Fail");
    return res.status(200).json({ data: order });
  } catch (err) {
    handleError(err, res);
  }
};

const ecpayCreditOneTime = (ecpayArg) => {
  const { totalAmount, tradeDesc, itemName, orderId, tradeNo } = ecpayArg;
  const MerchantTradeDate = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  let base_param = {
    MerchantTradeNo: tradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: MerchantTradeDate, //ex: 2017/02/13 15:45:30
    TotalAmount: totalAmount,
    TradeDesc: tradeDesc,
    ItemName: itemName,
    ReturnURL: `${HOST}/api/orders/ecpayReturn`,
    // ChooseSubPayment: '',
    // OrderResultURL: 'http://192.168.0.1/payment_result',
    // NeedExtraPaidInfo: '1',
    ClientBackURL: `${CLIENT}/`,
    // ItemURL: 'http://item.test.tw',
    // Remark: '交易備註',
    // HoldTradeAMT: '1',
    // StoreID: '',
    CustomField1: orderId, // 用 CustomField1 紀錄 orderId
    // CustomField2: '',
    // CustomField3: '',
    // CustomField4: ''
  };

  // inovice
  let inv_params = {};

  const create = new ecpay_payment(ecpay_options);
  const html = create.payment_client.aio_check_out_credit_onetime(
    (parameters = base_param),
    (invoice = inv_params)
  );

  return { html };
};

const createOrder = async (req, res) => {
  const requiredValues = ["grandTotal", "delivery", "productInfos"];
  const checkResult = checkParams(req.body, requiredValues);
  if (checkResult.isPassed) {
    const t = await sequelize.transaction();
    try {
      const isValidInfos = req.body.productInfos.every((info) => {
        return (
          info.hasOwnProperty("productId") &&
          info.hasOwnProperty("productAmount")
        );
      });

      if (!Array.isArray(req.body.productInfos) || !isValidInfos) {
        throw new Error("Bad Value");
      }

      const newOrder = req.body;
      newOrder.memberId = res.locals.id;
      const tradeNo = "test" + new Date().getTime();

      newOrder.tradeNo = tradeNo;
      const orderId = await createOrderDal(newOrder, t);
      await bulkCreateProductsInOrderDal(orderId, req.body.productInfos, t);

      const { html } = ecpayCreditOneTime({
        totalAmount: req.body.grandTotal.toString(),
        tradeDesc: "Description",
        itemName: "ItemName",
        orderId: orderId.toString(),
        tradeNo: tradeNo,
      });
      await t.commit();
      res.status(201).json(html);
    } catch (err) {
      handleError(err, res);
    }
  } else {
    failResponse(
      res,
      400,
      `Missing required argument: ${checkResult.missingParam}`
    );
  }
};

const ecpayReturn = async (req, res) => {
  try {
    const orderId = req.body?.CustomField1;

    const { CheckMacValue } = req.body;
    const data = { ...req.body };

    // 產生驗證檢查碼，CheckMacValue 不驗證
    // https://developers.ecpay.com.tw/?p=2902
    delete data.CheckMacValue;

    const create = new ecpay_payment(ecpay_options);
    const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

    // transaction successful
    if (CheckMacValue === checkValue) {
      // 修改訂單狀態
      await afterPaymentOrderDal(orderId);
      // 交易成功，回傳 1|OK 給綠界
      res.send("1|OK");
    } else {
      res.send("not successful");
    }
  } catch (err) {
    handleError(err, res);
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
    handleError(err, res);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const memberId = res.locals.id;
    const orderId = await deleteOrderDal(id, memberId);
    return res.status(200).json({ id: orderId });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  ecpayReturn,
};
