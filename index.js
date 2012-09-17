module.exports = process.env.COVERAGE
	? require('./lib-cov/set-operations')
	: require('./lib/set-operations');
