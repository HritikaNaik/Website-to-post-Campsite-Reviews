class expressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.satusCode = statusCode;
	}
}

module.exports = expressError;
