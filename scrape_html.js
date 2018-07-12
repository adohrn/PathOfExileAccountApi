const http = require('http');

module.exports.scrape = function (url) {
	return new Promise ((resolve, reject) => {
		http.get(url, (resp) => {
		  let data = '';

		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
		    data += chunk;
		  });

		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			resolve(data);
		  });

		}).on("error", (err) => {
		  	console.log("Error: " + err.message);
			reject(err);
		});
	});
}