const {
  createMemberDal,
  loginByEmailDal,
  getMemberByIdDal,
  updateMemberDal,
} = require("../entities/membersDal");
const { checkParams } = require("../utils/checkReq");
const jwt = require("jsonwebtoken");
const { failResponse } = require("../utils/failResponse");
const { handleError } = require("../utils/handleErr");

const getMember = async (req, res) => {
  try {
    const id = res.locals.id;
    const member = await getMemberByIdDal(id);
    res.status(200).json({ data: member });
  } catch (err) {
    handleError(err, res);
  }
};
const createMember = async (req, res) => {
  try {
    const requiredValues = ["username", "password", "email"];
    const checkResult = checkParams(req.body, requiredValues);
    if (checkResult.isPassed) {
      const newMemberId = await createMemberDal(req.body);
      res.status(201).json({ id: newMemberId });
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

const updateMember = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.id = res.locals.id;
    const memberId = await updateMemberDal(updateData);
    res.status(200).json({ id: memberId });
  } catch (err) {
    handleError(err, res);
  }
};

const loginMember = async (req, res) => {
  try {
    const requiredValues = ["password", "email"];
    const checkResult = checkParams(req.body, requiredValues);
    if (checkResult.isPassed) {
      // gen token
      const id = await loginByEmailDal(req.body);
      const payload = { id: id };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });
      res.status(200).json({
        id: id,
        token: token,
      });
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

module.exports = { getMember, createMember, updateMember, loginMember };
