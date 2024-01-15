const {
  getBrandByIdDal,
  getBrandsDal,
  createBrandDal,
  updateBrandDal,
  deleteBrandDal,
} = require("../entities/brandsDal");
const { checkParams } = require("../utils/checkReq");
const {
  failResponse,
  serverError,
  notFound,
} = require("../utils/failResponse");

const getBrands = async (req, res) => {
  try {
    const brands = await getBrandsDal();
    res.status(200).json({ data: brands });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const getBrand = async (req, res) => {
  const id = req.params.id;
  try {
    const brand = await getBrandByIdDal(id);
    res.status(200).json({ data: brand });
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

const createBrand = async (req, res) => {
  try {
    const requiredValues = ["brandName", "description"];
    const checkResult = checkParams(req.body, requiredValues);
    if (checkResult.isPassed) {
      const newBrandId = await createBrandDal(req.body);
      res.status(201).json({ id: newBrandId });
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
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};
const updateBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const brandId = await updateBrandDal(id, req.body);
    res.status(200).json({ id: brandId });
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
const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const brandId = await deleteBrandDal(id);
    res.status(200).json({ id: brandId });
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

module.exports = { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
