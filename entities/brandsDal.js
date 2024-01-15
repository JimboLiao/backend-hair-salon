const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelizeModel");

class Brand extends Model {}
Brand.init(
  {
    // model attributes
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logoImgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // model options
    sequelize,
    modelName: "brand",
    tableName: "brand",
  }
);

const getBrandsDal = async () => {
  const brands = await Brand.findAll({ where: { deletedAt: null } });
  return brands;
};

const getBrandByIdDal = async (id) => {
  const brand = await Brand.findByPk(id);
  if (!brand) {
    throw new Error("Not Found");
  }
  return brand;
};

const createBrandDal = async (brand) => {
  const { brandName, description, logoImgUrl } = brand;
  const newBrand = await Brand.create({
    brandName: brandName,
    description: description,
    logoImgUrl: logoImgUrl,
  });

  return newBrand.id;
};

const updateBrandDal = async (id, brand) => {
  const { brandName, description, logoImgUrl } = brand;
  const selectedBrand = await Brand.findByPk(id);

  if (!selectedBrand) {
    throw new Error("Not Found");
  }

  selectedBrand.brandName = brandName || selectedBrand.brandName;
  selectedBrand.description = description || selectedBrand.description;
  selectedBrand.logoImgUrl = logoImgUrl || selectedBrand.logoImgUrl;

  await selectedBrand.save();
  return selectedBrand.id;
};

const deleteBrandDal = async (id) => {
  const brand = await Brand.findByPk(id);

  if (!brand) {
    throw new Error("Not Found");
  }

  brand.deletedAt = Date.now();
  await brand.save();
  return brand.id;
};

module.exports = {
  Brand,
  getBrandsDal,
  getBrandByIdDal,
  createBrandDal,
  updateBrandDal,
  deleteBrandDal,
};
