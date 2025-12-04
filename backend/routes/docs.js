const express = require('express');
const router = express.Router();

// @route   GET /api/docs
// @desc    Get all available API endpoints
// @access  Public
router.get('/', (req, res) => {
    const endpoints = {
        message: 'IoT Lab Inventory Management API',
        version: '1.0.0',
        baseUrl: `${req.protocol}://${req.get('host')}`,
        endpoints: {
            authentication: [
                {
                    method: 'POST',
                    path: '/api/auth/register',
                    description: 'Register a new user',
                    access: 'Public',
                    body: {
                        name: 'string (required)',
                        email: 'string (required) - must end with @atriauniversity.edu.in',
                        password: 'string (required)'
                    },
                    response: {
                        token: 'string',
                        user: {
                            id: 'string',
                            name: 'string',
                            email: 'string',
                            role: 'string (user/admin)'
                        }
                    }
                },
                {
                    method: 'POST',
                    path: '/api/auth/login',
                    description: 'Login for users and admins',
                    access: 'Public',
                    body: {
                        email: 'string (required)',
                        password: 'string (required)'
                    },
                    hardcodedAdmin: {
                        email: 'admin@atriauniversity.edu.in',
                        password: 'iotlab'
                    },
                    response: {
                        token: 'string',
                        user: {
                            id: 'string',
                            name: 'string',
                            email: 'string',
                            role: 'string (user/admin)'
                        }
                    }
                },
                {
                    method: 'POST',
                    path: '/api/auth/change-password',
                    description: 'Change user password',
                    access: 'Private (requires JWT token)',
                    headers: {
                        Authorization: 'Bearer <token>'
                    },
                    body: {
                        currentPassword: 'string (required)',
                        newPassword: 'string (required)'
                    },
                    response: {
                        message: 'Password updated successfully'
                    }
                }
            ],
            userManagement: [
                {
                    method: 'GET',
                    path: '/api/admin/users',
                    description: 'Get all users',
                    access: 'Admin only',
                    headers: {
                        Authorization: 'Bearer <admin_token>'
                    },
                    response: [
                        {
                            _id: 'string',
                            name: 'string',
                            email: 'string',
                            role: 'string',
                            createdAt: 'date'
                        }
                    ]
                },
                {
                    method: 'POST',
                    path: '/api/admin/users',
                    description: 'Add a new user',
                    access: 'Admin only',
                    headers: {
                        Authorization: 'Bearer <admin_token>'
                    },
                    body: {
                        name: 'string (required)',
                        email: 'string (required)',
                        password: 'string (required)',
                        role: 'string (optional) - user/admin'
                    },
                    response: {
                        message: 'User created successfully',
                        user: {
                            id: 'string',
                            name: 'string',
                            email: 'string',
                            role: 'string'
                        }
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/admin/users/:id',
                    description: 'Update a user',
                    access: 'Admin only',
                    headers: {
                        Authorization: 'Bearer <admin_token>'
                    },
                    params: {
                        id: 'User ID'
                    },
                    body: {
                        name: 'string (optional)',
                        email: 'string (optional)',
                        role: 'string (optional)',
                        password: 'string (optional)'
                    },
                    response: {
                        message: 'User updated successfully',
                        user: {
                            id: 'string',
                            name: 'string',
                            email: 'string',
                            role: 'string'
                        }
                    }
                },
                {
                    method: 'DELETE',
                    path: '/api/admin/users/:id',
                    description: 'Delete a user',
                    access: 'Admin only',
                    headers: {
                        Authorization: 'Bearer <admin_token>'
                    },
                    params: {
                        id: 'User ID'
                    },
                    response: {
                        message: 'User deleted successfully'
                    }
                }
            ]
        },
        testingInstructions: {
            postman: {
                step1: 'Login to get token',
                step2: 'Copy the token from response',
                step3: 'Add to Authorization header as: Bearer <token>',
                step4: 'Test protected endpoints'
            },
            website: {
                url: 'http://localhost:3000',
                adminCredentials: {
                    email: 'admin@atriauniversity.edu.in',
                    password: 'iotlab'
                }
            }
        },
        errorCodes: {
            200: 'Success',
            400: 'Bad Request - Invalid input',
            401: 'Unauthorized - Invalid or missing token',
            403: 'Forbidden - Insufficient permissions',
            404: 'Not Found - Resource not found',
            500: 'Internal Server Error'
        }
    };

    res.json(endpoints);
});

module.exports = router;
