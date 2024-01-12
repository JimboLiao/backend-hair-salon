const { Product } = require("../entities/productsDal");
const sequelize = require("../entities/sequelizeModel");

function genProducts(n) {
  const products = [];
  for (let i = 1; i <= n; i++) {
    products.push({
      id: i,
      productName: `foo${i}`,
      category: "bar",
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

async function initDatabase() {
  try {
    // drop tables first then create tables
    await sequelize.sync({ force: true });
    await initProducts();
    await sequelize.close();
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

initDatabase();
