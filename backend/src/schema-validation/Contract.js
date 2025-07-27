exports.getContractById = {
    id: {
        in: ['params'],
        trim: true,
        notEmpty: true,
        errorMessage: 'Contract ID cannot be empty',
        isInt: {
            options: { min: 1 },
            errorMessage: 'Contract ID must be a positive integer',
        },
    },
};
