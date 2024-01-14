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

module.exports = { failResponse, notFound, serverError };
