const { Model, DataTypes, Op } = require("sequelize");
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

const getProductsDal = async (page, pageSize, query) => {
  const { brandId, category } = query;
  const where = { deletedAt: null };
  if (brandId) where.brandId = brandId;
  if (category) where.category = category;
  const offset = (page - 1) * pageSize;
  const { count, rows: data } = await Product.findAndCountAll({
    offset: offset,
    limit: pageSize,
    where: where,
  });

  return { count, data };
};

const getProductByIdDal = async (id) => {
  const product = await Product.findByPk(id);
  return product;
};

const createProductDal = async (product) => {
  const {
    productName,
    category,
    description,
    price,
    brandId,
    imgUrl,
    reserve,
  } = product;

  const newProduct = await Product.create(product);
  return newProduct.id;
};

const updateProductDal = async (id, product) => {
  const {
    productName,
    category,
    description,
    price,
    brandId,
    imgUrl,
    reserve,
  } = product;
  const selectedProduct = await Product.findByPk(id);
  if (!selectedProduct) {
    throw new Error("Not Found");
  }
  selectedProduct.productName = productName || selectedProduct.productName;
  selectedProduct.category = category || selectedProduct.category;
  selectedProduct.description = description || selectedProduct.description;
  selectedProduct.price = price || selectedProduct.price;
  selectedProduct.brandId = brandId || selectedProduct.brandId;
  selectedProduct.imgUrl = imgUrl || selectedProduct.imgUrl;
  selectedProduct.reserve = reserve || selectedProduct.reserve;

  await selectedProduct.save();
  return selectedProduct.id;
};

const deleteProductDal = async (id) => {
  const selectedProduct = await Product.findByPk(id);

  if (!selectedProduct) {
    throw new Error("Not Found");
  }

  // soft delete
  if (!selectedProduct.deletedAt) {
    selectedProduct.deletedAt = Date.now();
    await selectedProduct.save();
  }
  return selectedProduct.id;
};

const getProductsByIdsDal = async (ids) => {
  // ids is an array of many id, ids = [{id: 1}, {id: 2} ...]
  const products = await Product.findAll({
    where: {
      [Op.or]: ids,
    },
  });
  return products;
};
module.exports = {
  Product,
  getProductsDal,
  getProductByIdDal,
  createProductDal,
  updateProductDal,
  deleteProductDal,
  getProductsByIdsDal,
};
