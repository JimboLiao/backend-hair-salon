const { Product } = require("../entities/productsDal");
const { Brand } = require("../entities/brandsDal");
const sequelize = require("../entities/sequelizeModel");
const { Member } = require("../entities/membersDal");

PRODUCT_CATEGORIES = ["shampoo", "conditioner", "hair wax"];
function genProducts(n) {
  const products = [];
  for (let i = 1; i <= n; i++) {
    products.push({
      productName: `Product ${i}`,
      category: `${PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length]}`,
      description: "description",
      price: 100,
      brandId: i > n / 2 ? 1 : 2,
      imgUrl: "url",
      reserve: 2,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return products;
}

async function initProducts() {
  const products = genProducts(20);
  for (const product of products) {
    await Product.create(product);
  }
  console.log("\n\n === Table product initialized === \n\n");
}

function genBrands(n) {
  const brands = [];
  for (let i = 1; i <= n; i++) {
    brands.push({
      brandName: `Brand ${i}`,
      description: "description",
      logoImgUrl: "img url",
    });
  }
  return brands;
}
async function initBrands() {
  const brands = genBrands(2);
  for (const brand of brands) {
    await Brand.create(brand);
  }
  console.log("\n\n === Table brand initialized === \n\n");
}

async function initMembers() {
  const member = {
    email: "test@email.com",
    username: "hello",
    password: "123",
  };
  await Member.create(member);
  console.log("\n\n === Table member initialized === \n\n");
}

async function initDatabase() {
  try {
    // drop tables first then create tables
    await sequelize.sync({ force: true });
    await Promise.all([initProducts(), initBrands(), initMembers()]);
    await sequelize.close();
    console.log("\n\n === Database initialized === \n\n");
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

initDatabase();
