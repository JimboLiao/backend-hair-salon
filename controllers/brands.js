const {
  getBrandByIdDal,
  getBrandsDal,
  createBrandDal,
  updateBrandDal,
  deleteBrandDal,
} = require("../entities/brandsDal");
const { checkParams } = require("../utils/checkReq");
const { failResponse } = require("../utils/failResponse");
const { handleError } = require("../utils/handleErr");

const getBrands = async (req, res) => {
  try {
    const brands = await getBrandsDal();
    res.status(200).json({ data: brands });
  } catch (err) {
    handleError(err, res);
  }
};

const getBrand = async (req, res) => {
  const id = req.params.id;
  try {
    const brand = await getBrandByIdDal(id);
    res.status(200).json({ data: brand });
  } catch (err) {
    handleError(err, res);
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
    handleError(err, res);
  }
};
const updateBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const brandId = await updateBrandDal(id, req.body);
    res.status(200).json({ id: brandId });
  } catch (err) {
    handleError(err, res);
  }
};
const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const brandId = await deleteBrandDal(id);
    res.status(200).json({ id: brandId });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
