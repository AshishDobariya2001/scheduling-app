const _ = require('lodash');
const bcrypt = require('bcrypt');



exports.genRes = (code, payload, type, noWrapPayload) => {
  noWrapPayload = noWrapPayload || false;
  type = type || 'unknown';
  if (code && code >= 300) {
    payload = _.isArray(payload) ? payload : [payload];
    const plainTextErrors =
      payload.length > 0 && _.isString(payload[0]) ? payload : [];
    const objectErrors =
      payload.length > 0 && _.isObject(payload[0]) ? payload : [];
    return {
      error: {
        errors: plainTextErrors,
        errorParams: objectErrors,
        code,
        type,
      },
    };
  }
  if (payload && !noWrapPayload) {
    return { result: payload };
  }
  if (payload) {
    return payload;
  }
  return undefined;
};
exports.generateCloudFrontUrl = (filePath) => {
  if (filePath) {
    return `${process.env.CDN_WEB_STATIC}/${filePath}`;
  }
  return '';
};

exports.getUploadsPath = (file) => `uploads/${file.split('uploads/')[1]}`;

exports.genOtp = () => {
  if (['local', 'development', 'uat', 'test'].includes(process.env.NODE_ENV)) {
    return 555555;
  }
  return Math.floor(100000 + Math.random() * 900000);
};

exports.getIp = (req) => req.headers.ipAddress || req.headers.ipaddress;

exports.getCountryNameFromCode = (countryCode) =>
  new Intl.DisplayNames(['en'], {
    type: 'region',
  }).of(countryCode);


exports.generatePassword = async (password) =>
  await bcrypt.hash(password, bcrypt.genSaltSync(8));

