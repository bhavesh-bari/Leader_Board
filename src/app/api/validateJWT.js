import jwt from 'jsonwebtoken';

export const validateJWT = (request) => {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            throw new Error("Authentication failed: No token provided.");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken.user.id;

    } catch (error) {
        throw new Error(error.message);
    }
};