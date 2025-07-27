const jwt = require('jsonwebtoken');
const { User } = require('../index');
const {
  userRoles,
  resCode,
  errorMessage,
  errorTypes,
  defaultStatus
} = require('../../config/options');
const { Op } = require('sequelize');
const { UnauthorizedException } = require('../../utils/exceptions');

const hasRole = (user, roles) => {
  if (roles && roles.length) {
    return roles.includes(user.role) ? true : roles.indexOf(user.role) > -1;
  }
  return false;
};
const verifyJwt = async (token, roles, force) => {
  const secretOrKey = process.env.JWT_SECRET_KEY;
  return jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
    if (err) {
      return {
        status: resCode.HTTP_UNAUTHORIZED,
        errorMessage: errorMessage.UNAUTHORIZED_ACCESS,
        errorType: errorTypes.UNAUTHORIZED_ACCESS,
      };
    }
    if (jwtPayload && jwtPayload.id) {
      const existingUser = await User.findOne({
        where: {
          id: jwtPayload.id,
          status: { [Op.notIn]: [defaultStatus.DELETED] },
        },
        attributes: {
          exclude: [
            'password',
          ],
        },
      });
      if (existingUser && hasRole(existingUser, roles)) {
        return {
          status: resCode.HTTP_OK,
          user: existingUser,
        };
      }
      return {
        status: resCode.HTTP_UNAUTHORIZED,
        errorMessage: errorMessage .UNAUTHORIZED_ACCESS,
        errorType: errorTypes.UNAUTHORIZED_ACCESS,
      };
    }
    if (!force) {
      return { status: resCode.HTTP_OK };
    }
    return {
      status: resCode.HTTP_FORBIDDEN,
      errorMessage: errorMessage.FORBIDDEN,
      errorType: errorTypes.FORBIDDEN,
    };
  });
};

exports.verifyJwt = verifyJwt;

exports.authenticateJWT = function (
  roles = userRoles.getAllRolesAsArray(),
  force = true
) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      return verifyJwt(token, roles, force)
        .then((checkAuth) => {
          if (checkAuth.status === resCode.HTTP_OK) {
            req.authenticated = true;
            req.user = checkAuth.user;
            next();
          } else {
            next(new UnauthorizedException(checkAuth.errorMessage));
          }
        })
        .catch((err) => {
          next(new UnauthorizedException ());
        });
    } else {
      if (!force) {
        req.authenticated = true;
        next();
      } else {
        next(new UnauthorizedException());
      }
    }
  };
};
