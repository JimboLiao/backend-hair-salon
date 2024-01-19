const {
  authFail,
  notFound,
  badBodyValue,
  wrongPassword,
  serverError,
  failResponse,
} = require("./failResponse");

const handleError = (err, res) => {
  console.error(err);
  if (err instanceof Error) {
    switch (err.message) {
      case "Not Found":
        return notFound(res);
      case "Bad Value":
        return badBodyValue(res);
      case "Wrong password":
        return wrongPassword(res);
      case "Auth Fail":
        return authFail(res);
      case "Bad query":
        return badQuery(res);
      default:
        return failResponse(res, 500, err.message);
    }
  } else {
    return serverError(res);
  }
};

module.exports = { handleError };
