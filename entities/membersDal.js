const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./sequelizeModel");

const SALTROUND = 10;

class Member extends Model {}

Member.init(
  {
    // model attributes
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    postNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // model options
    sequelize,
    tableName: "member",
    modelName: "member",
  }
);

const getMemberByIdDal = async (id) => {
  const member = await Member.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!member) {
    throw new Error("Not Found");
  }
  return member;
};

const createMemberDal = async (member) => {
  const { email, username, password } = member;
  const hashPassword = await bcrypt.hash(password, SALTROUND);
  const newMember = await Member.create({
    email: email,
    username: username,
    password: hashPassword,
  });

  return newMember.id;
};

const loginByEmailDal = async (member) => {
  const { email, password } = member;
  const selectedMember = await Member.findOne({ where: { email: email } });
  if (!selectedMember) {
    throw new Error("Not Found");
  }

  const match = await bcrypt.compare(password, selectedMember.password);
  if (match) {
    return selectedMember.id;
  } else {
    throw new Error("Wrong password");
  }
};

const updateMemberDal = async (member) => {
  const {
    id,
    username,
    email,
    password,
    firstName,
    lastName,
    birthday,
    postNumber,
    city,
    address,
  } = member;

  const selectedMember = await Member.findByPk(id);
  if (!selectedMember) {
    throw new Error("Not Found");
  }
  let hashPassword = "";
  if (password) {
    hashPassword = bcrypt.hash(password, SALTROUND);
  }
  selectedMember.username = username || selectedMember.username;
  selectedMember.email = email || selectedMember.email;
  selectedMember.password = hashPassword || selectedMember.password;
  selectedMember.firstName = firstName || selectedMember.firstName;
  selectedMember.lastName = lastName || selectedMember.lastName;
  selectedMember.birthday = birthday || selectedMember.birthday;
  selectedMember.postNumber = postNumber || selectedMember.postNumber;
  selectedMember.city = city || selectedMember.city;
  selectedMember.address = address || selectedMember.address;

  await selectedMember.save();
  return selectedMember.id;
};

module.exports = {
  Member,
  getMemberByIdDal,
  createMemberDal,
  updateMemberDal,
  loginByEmailDal,
};
