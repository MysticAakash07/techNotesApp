const allowedOrigins = require("./allowedOrigins");

const corOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not alllowed by CORS"));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

module.exports = corOptions;
