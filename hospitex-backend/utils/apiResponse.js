export const apiResponse = {
    success: (res, data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },
    
    error: (res, message = 'Error', statusCode = 500, errors = null) => {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    },
    
    paginated: (res, data, pagination, message = 'Success') => {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                pages: pagination.pages
            }
        });
    },
    
    created: (res, data, message = 'Resource created successfully') => {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    },
    
    updated: (res, data, message = 'Resource updated successfully') => {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },
    
    deleted: (res, message = 'Resource deleted successfully') => {
        return res.status(200).json({
            success: true,
            message
        });
    }
};