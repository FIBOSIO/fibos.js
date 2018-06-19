const http = require("http");

module.exports = (url, opts) => {
	opts = opts || {};
	return new Promise((resolve, reject) => {
		let client = new http.Client;
		let method = opts.method || "GET";
		delete opts.method;

		client.request(method, url, opts, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve({
				status: res.statusCode,
				text: () => new Promise((resolve, reject) => {
					resolve(res.readAll().toString());
				}),
				json: () => new Promise((resolve, reject) => {
					try {
						resolve(res.json());
					} catch (e) {
						reject(e);
					}
				})
			});
		});
	});
}