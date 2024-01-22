const {
  getProductsDal,
  getProductByIdDal,
  createProductDal,
  updateProductDal,
  deleteProductDal,
  searchProductDal,
} = require("../entities/productsDal");
const { failResponse } = require("../utils/failResponse");
const { checkParams } = require("../utils/checkReq");
const { getBrandByIdDal } = require("../entities/brandsDal");
const { handleError } = require("../utils/handleErr");

const searchProducts = async (req, res) => {
  // pagination start with page 1
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 6;
  const q = req.query.q || "";
  try {
    const { count, data } = await searchProductDal(page, pageSize, q);
    const pagination = {
      page: page,
      pageSize: pageSize,
      nextPage: count > page * pageSize ? page + 1 : null,
      totalCount: count,
    };
    res.json({
      data: data,
      pagination: pagination,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const getProducts = async (req, res) => {
  // pagination start with page 1
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 6;
  try {
    const query = {
      brandId: req.query.brandId,
      category: req.query.category,
    };
    const { count, data } = await getProductsDal(page, pageSize, query);

    const pagination = {
      page: page,
      pageSize: pageSize,
      nextPage: count > page * pageSize ? page + 1 : null,
      totalCount: count,
    };

    res.json({
      data: data,
      pagination: pagination,
    });
  } catch (err) {
    handleError(err, res);
  }
};

const getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductByIdDal(id);
    if (product === null) {
      throw new Error("Not Found");
    }
    if (req.query._expand === "brand") {
      const brand = await getBrandByIdDal(product.brandId);
      return res.status(200).json({ data: { product: product, brand: brand } });
    }
    return res.status(200).json({ data: product });
  } catch (err) {
    handleError(err, res);
  }
};

const createProduct = async (req, res) => {
  try {
    const requiredProductValues = [
      "productName",
      "category",
      "description",
      "price",
      "brandId",
      "imgUrl",
    ];
    const checkResult = checkParams(req.body, requiredProductValues);
    if (checkResult.isPassed) {
      const newProductId = await createProductDal(req.body);
      res.status(201).json({ id: newProductId });
    } else {
      failResponse(
        res,
        400,
        `Missing required argument: ${checkResult.missingParam}`
      );
    }
  } catch (err) {
    handleError(err, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productId = await updateProductDal(id, req.body);
    res.status(200).json({ id: productId });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productId = await deleteProductDal(id);
    res.status(200).json({ id: productId });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
