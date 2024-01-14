const {
  getProductsDal,
  getProductByIdDal,
} = require("../entities/productsDal");
const {
  notFound,
  serverError,
  failResponse,
} = require("../utils/failResponse");

const getProducts = async (req, res) => {
  // pagination start with page 1
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 6;
  try {
    const { count, data } = await getProductsDal(page, pageSize);

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
    console.error(err);
    if (err instanceof Error) {
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductByIdDal(id);
    if (product === null) {
      notFound(res);
    }
    res.status(200).json({ data: product });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const createProduct = (req, res) => {};

const updateProduct = (req, res) => {};

const deleteProduct = (req, res) => {};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
