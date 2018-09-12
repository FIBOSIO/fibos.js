const http = require("http");

module.exports = (url, opts) => {
	opts = opts || {};
	return new Promise((resolve, reject) => {
		let request = opts.method === "POST" ? http.post : http.get;
		delete opts.method;

		request(url, opts, (err, res) => {
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