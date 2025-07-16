

const successHandler = (res, message = "", data = {}, status = 200) => {
  return res.status(status).send({
    success: true,
    message,
    data,
  });
};

module.exports = successHandler;
