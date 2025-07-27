exports.depositBalance = {
    depositAmount: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Deposit amount cannot be empty'
        },
        isFloat: {
            options: { min: 0.01 },
            errorMessage: 'Deposit amount must be a number greater than 0'
        }
    }
};
