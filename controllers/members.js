const {
  createMemberDal,
  loginByEmailDal,
  getMemberByIdDal,
  updateMemberDal,
} = require("../entities/membersDal");
const { checkParams } = require("../utils/checkReq");
const jwt = require("jsonwebtoken");
const {
  failResponse,
  serverError,
  notFound,
  wrongPassword,
} = require("../utils/failResponse");

const getMember = async (req, res) => {
  try {
    const id = res.locals.id;
    const member = await getMemberByIdDal(id);
    res.status(200).json({ data: member });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
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
    console.error(err);
    if (err instanceof Error) {
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

const updateMember = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.id = res.locals.id;
    const memberId = await updateMemberDal(updateData);
    res.status(200).json({ id: memberId });
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
    console.error(err);
    if (err instanceof Error) {
      if (err.message === "Not Found") return notFound(res);
      if (err.message === "Wrong password") return wrongPassword(res);
      return failResponse(res, 500, err.message);
    } else {
      return serverError(res);
    }
  }
};

module.exports = { getMember, createMember, updateMember, loginMember };
