const UserRepository = require("../models/repositories/UserRepostiory");
const { resCode } = require("../config/options");

exports.login = async (req, res) => {
  try {
    const { success, message, data } = await UserRepository.login(req.body);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json({
        status: resCode.HTTP_BAD_REQUEST,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (error) {
    return res.status(resCode.HTTP_INTERNAL_SERVER_ERROR).json({
      status: resCode.HTTP_INTERNAL_SERVER_ERROR,
      message: errorMessage.SERVER_ERROR,
      errorType: errorTypes.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { success, message, data } = await UserRepository.register(req.body);

    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json({
        status: resCode.HTTP_BAD_REQUEST,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (error) {
    return res.status(resCode.HTTP_INTERNAL_SERVER_ERROR).json({
      status: resCode.HTTP_INTERNAL_SERVER_ERROR,
      message: errorMessage.SERVER_ERROR,
      errorType: errorTypes.INTERNAL_SERVER_ERROR,
    });
  }
};
