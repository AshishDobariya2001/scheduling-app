exports.getBestProfession = {
    startDate: {
        in: ['query'],
        notEmpty: true,
        errorMessage: 'Start date is required',
        isISO8601: {
            errorMessage: 'Start date must be in ISO 8601 format',
        },
    },
    endDate: {
        in: ['query'],
        notEmpty: true,
        errorMessage: 'End date is required',
        isISO8601: {
            errorMessage: 'End date must be in ISO 8601 format',
        },
    },
    limit: {
        in: ['query'],
        optional: true,
        isInt: {
            options: { min: 2 },
            errorMessage: 'Limit must be greater than 1',
        },
    },
};
