const failResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "fail",
    message,
  });
};

const notFound = (res) => {
  return failResponse(res, 404, "Not Found");
};

const serverError = (res) => {
  return failResponse(res, 500, "Server Error");
};

const authFail = (res) => {
  return failResponse(res, 403, "Authenticate failed");
};

const noToken = (res) => {
  return failResponse(res, 401, "No token");
};

const wrongPassword = (res) => {
  return failResponse(res, 401, "Wrong password");
};
module.exports = {
  failResponse,
  notFound,
  serverError,
  authFail,
  noToken,
  wrongPassword,
};
