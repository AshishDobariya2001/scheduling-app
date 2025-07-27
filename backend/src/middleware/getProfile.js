const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const { Profile } = require('../models');

const { resCode, profileRoles } = require('../config/options');

const { Op } = sequelize;

const hasRole = (profile, types) => {
  if (types && types.length) {
    return types.includes(profile.type)
      ? true
      : types.indexOf(profile.type) > -1;
  }
  return false;
};

const verifyJwt = async (token, roles) => {
  const secretOrKey = process.env.JWT_SECRET_KEY;
  return await jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
    if (err) {
      return {
        status: resCode.HTTP_UNAUTHORIZED,
        errorMessage: "Unauthorized access",
        errorType: "UnauthorizedAccess",
      };
    }
    if (jwtPayload && jwtPayload.id) {
      const existingProfile = await Profile.findOne({
        where: {
          id: jwtPayload.id,
        },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'profession',
          'type',
          'createdAt',
          'updatedAt',
        ]
      });

      if (existingProfile && hasRole(existingProfile, roles)) {
        return { status: resCode.HTTP_OK, profile: existingProfile };
      }
      return {
        status: resCode.HTTP_UNAUTHORIZED,
        errorMessage: "Unauthorized access",
        errorType: "UnauthorizedAccess",
      };
    }
    return { status: resCode.HTTP_OK };
  });
};

exports.verifyJwt = verifyJwt
exports.authenticateJWT = function (roles = profileRoles.getAllRolesAsArray()) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      return verifyJwt(token, roles).then((checkAuth) => {
        if (checkAuth.status === 200) {
          req.authenticated = true;
          req.profile = checkAuth.profile;
          next();
        } else {
          return res
            .status(checkAuth.status)
            .json({
              status: checkAuth.status,
              errorMessage: checkAuth.errorMessage,
              errorType: checkAuth.errorType
            });
        }
      });
    }
    return res
      .status(401)
      .json({
        status: 401,
        errorMessage: "Unauthorized access",
        errorType: "UnauthorizedAccess"
      });
  };
};
