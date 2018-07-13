const express        = require('express');
const app            = express();
const fs             = require('fs');
const scrapeHtml     = require('./scrape_html.js');
const processData    = require('./process_json_data.js');
const dbHandler      = require('./mongo_handler.js');

const port = 8000;

const API_URL = 'http://api.pathofexile.com/public-stash-tabs/?id=';
const STARTER_ID = '224521283-233533891-219681636-252343422-237534337';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
	let database = await dbHandler.connectToDatabase();

	require('./app/routes')(app, database);
	app.listen(port, () => {
		console.log('We are live on ' + port);
	});

	// PoE api returns same tabId if there aren't any updates. If there are 100 duplicates, we should probably stop.
	var duplicateCounter = 110;
	var currTabId = STARTER_ID;

	while (duplicateCounter < 100) {
		const data = await scrapeHtml.scrape(API_URL + currTabId);
		const desiredData = processData.process(data);
		dbHandler.updateAccounts(desiredData.accountsHash);

		if (currTabId == desiredData.nextId)
			duplicateCounter++;

		currTabId = desiredData.nextId;
		console.log(desiredData.nextId);
		await sleep(1000);
	}

	console.log('Stopped searching.');
}

main();
