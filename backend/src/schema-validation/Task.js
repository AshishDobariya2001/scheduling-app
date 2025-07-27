const { httpMethods } = require("../config/options");

module.exports = {
  createTask: {
    name: {
      in: ['body'],
      isString: {
        errorMessage: 'Name must be a string'
      },
      trim: true,
      notEmpty: {
        errorMessage: 'Name cannot be empty'
      }
    },
    url: {
      in: ['body'],
      exists: {
        errorMessage: 'URL is required'
      },
      isURL: {
        errorMessage: 'URL must be a valid URL'
      }
    },
    method: {
      in: ['body'],
      isIn: {
        options: [httpMethods.getAllMethods()],
        errorMessage: 'Invalid HTTP method'
      }
    },
    headers: {
      in: ['body'],
      optional: true,
      isObject: {
        errorMessage: 'Headers must be an object'
      }
    },
    token: {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Token must be a string'
      }
    },
    body: {
      in: ['body'],
      optional: true,
      isObject: {
        errorMessage: 'Body must be an object'
      }
    },
    scheduledTime: {
      in: ['body'],
      exists: {
        errorMessage: 'Scheduled time is required'
      },
      isISO8601: {
        errorMessage: 'Scheduled time must be a valid ISO8601 date string'
      }
    },
    maxRetry: {
      in: ['body'],
      optional: true,
      isInt: {
        options: { min: 1, max: 10 },
        errorMessage: 'Max retry must be an integer between 1 and 10'
      }
    }
  },
  updateTask: {
    name: {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Name must be a string'
      },
      trim: true,
      notEmpty: {
        errorMessage: 'Name cannot be empty'
      }
    },
    url: {
      in: ['body'],
      optional: true,
      isURL: {
        errorMessage: 'URL must be a valid URL'
      }
    },
    method: {
      in: ['body'],
      optional: true,
      isIn: {
        options: [httpMethods.getAllMethods()],
        errorMessage: 'Invalid HTTP method'
      }
    },
    headers: {
      in: ['body'],
      optional: true,
      isObject: {
        errorMessage: 'Headers must be an object'
      }
    },
    token: {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Token must be a string'
      }
    },
    body: {
      in: ['body'],
      optional: true,
      isObject: {
        errorMessage: 'Body must be an object'
      }
    },
    scheduledTime: {
      in: ['body'],
      optional: true,
      isISO8601: {
        errorMessage: 'Scheduled time must be a valid ISO8601 date string'
      }
    },
    maxRetry: {
      in: ['body'],
      optional: true,
      isInt: {
        options: { min: 1, max: 10 },
        errorMessage: 'Max retry must be an integer between 1 and 10'
      }
    }
  }
};
