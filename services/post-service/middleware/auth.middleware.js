import jwt from 'jsonwebtoken';


const getTokenFromRequest = (request) => {
    //  console.log("COOKIES:", request.cookies);
    // console.log("HEADERS:", request.headers);
	return request.cookies?.token || null;
};


const authenticate = (request, response, next) => {
	try {
		const token = getTokenFromRequest(request);

		if (!token) {
			return response.status(401).json({
				message: 'Authentication token is required.',
			});
		}

		if (!process.env.JWT_SECRET) {
			return response.status(500).json({
				message: 'JWT secret is not configured.',
			});
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET);

		if (!payload?.userId) {
			return response.status(401).json({
				message: 'Invalid authentication token.',
			});
		}

		request.auth = payload;
		request.userId = payload.userId;

		return next();
	} catch (error) {
		return response.status(401).json({
			message: 'Invalid or expired authentication token.',
			error: error.message,
		});
	}
};

export default authenticate;
