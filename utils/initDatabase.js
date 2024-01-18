const { Product } = require("../entities/productsDal");
const { Brand } = require("../entities/brandsDal");
const sequelize = require("../entities/sequelizeModel");
const { createMemberDal } = require("../entities/membersDal");
const { Order } = require("../entities/ordersDal");
const { ProductInOrder } = require("../entities/productsInOrderDal");

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

  await createMemberDal(member);
  console.log("\n\n === Table member initialized === \n\n");
}

async function initOrders() {
  const orders = [
    { memberId: 1, delivery: 40, tradeNo: "123" },
    { memberId: 1, delivery: 40, tradeNo: "456" },
  ];
  for (const order of orders) {
    await Order.create(order);
  }
  console.log("\n\n === Table order initialized === \n\n");
}

async function initProductsInOrder() {
  const productsInOrder = [
    { orderId: 1, productId: 1, productAmount: 1 },
    { orderId: 1, productId: 2, productAmount: 1 },
    { orderId: 2, productId: 3, productAmount: 3 },
    { orderId: 2, productId: 4, productAmount: 2 },
    { orderId: 2, productId: 5, productAmount: 1 },
  ];

  for (const productInOrder of productsInOrder) {
    await ProductInOrder.create(productInOrder);
  }
  console.log("\n\n === Table productInOrder initialized === \n\n");
}

async function initDatabase() {
  try {
    // drop tables first then create tables
    await sequelize.sync({ force: true });
    await Promise.all([
      initProducts(),
      initBrands(),
      initMembers(),
      initOrders(),
      initProductsInOrder(),
    ]);
    await sequelize.close();
    console.log("\n\n === Database initialized === \n\n");
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

initDatabase();
