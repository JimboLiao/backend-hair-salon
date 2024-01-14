const sequelize = require("../entities/sequelizeModel");
const connectDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection to database has been established successfully.");
    return;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connectDb };
