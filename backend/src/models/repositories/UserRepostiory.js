const { User } = require('../index');
const { Op } = require('sequelize');
const { defaultStatus } = require('../../config/options');
const { generatePassword } = require('../helpers/UtilHelper');

exports.login = async (data) => {
    const query = {
        where: {
          status: { [Op.notIn]: [defaultStatus.DELETED] },
          [Op.or]: [
            data.email && { email: data.email },
          ],
        },
      };
      const existingUser = await User.findOne(query);
      if (!existingUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      console.log("🚀 ~ existingUser:", existingUser.validPassword(data.password))
      if (!existingUser.validPassword(data.password)) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

    return { 
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken: existingUser.genToken(),
            user: {
                id: existingUser.id,
                role: existingUser.role,
            }
        }
    }
}   


exports.register = async (data) => {
    const query = {
        where: {
          status: { [Op.notIn]: [defaultStatus.DELETED] },
          [Op.or]: [
            data.email && { email: data.email },
          ],
        },
        attributes: [
          'id',
          'firstName',
          'lastName', 
        ],
      };
      const existingUser = await User.findOne(query);    

      if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    data.password = await generatePassword(data.password);
    const newUser = await User.create(data);
    return {
        success: true,
        message: 'User registered successfully',
        data: {
          accessToken: newUser.genToken(),
          user: {
              id: newUser.id,
              role: newUser.role,
          }
        }
    }
}