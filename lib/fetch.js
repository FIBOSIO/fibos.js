const http = require("http");
var fibos;

module.exports = (url, opts) => {
	if (url.indexOf('fibos') === 0) {
		if (!fibos)
			fibos = require('fibos');

		opts = opts || {};

		return new Promise((resolve, reject) => {
			fibos.post(url.substr(5), opts.body, (err, res) => {
				if (err) {
					return reject(err);
				}
				resolve({
					status: 200,
					text: () => new Promise((resolve, reject) => {
						resolve(res);
					}),
					json: () => new Promise((resolve, reject) => {
						try {
							resolve(JSON.parse(res));
						} catch (e) {
							reject(e);
						}
					})
				});
			});
		});

		return;
	}

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