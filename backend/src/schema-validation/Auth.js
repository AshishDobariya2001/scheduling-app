exports.register = {
  firstName: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'First name cannot be empty',
    },
    isString: {
      errorMessage: 'First name must be string',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Email cannot be empty'
    },
    isEmail: {
      bail: true,
      errorMessage: 'Enter a valid Email',
    },
  },
  lastName: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Last name cannot be empty',
    },
    isString: {
      errorMessage: 'Last name must be string',
    },
  },
  password: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Password cannot be empty',
    },
  },
};

exports.login = {
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Email cannot be empty'
    },
    isEmail: {
      bail: true,
      errorMessage: 'Enter a valid Email',
    },
  },
  password: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Password cannot be empty',
    },
  },
};
