import { Middleware } from '../../utils/deps.ts';

const ResponseMiddleware: Middleware = async ({ response }, next) => {
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE'
	);
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	await next();
};

export default ResponseMiddleware;
