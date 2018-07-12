const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');

let myDb;

module.exports.connectToDatabase = function () {
	return new Promise ((resolve, reject) => {
		MongoClient.connect(db.url, (err, database) => {
	  		if (err) reject(err);
	  		else {
	  			myDb = database;
	  			resolve(database);
	  		}
	  	}); 
  	});            
}

module.exports.updateAccounts = function (accountsData) {
	for (var account in accountsData) {
		var accountInfo = { stashes: accountsData[account].stashes };

	    const details = { '_id': account };
	    myDb.collection('accounts').update(details, accountInfo, { upsert: true }, (err, result) => {
	      if (err) {
	          console.log('Error upserting');
	      }
	    });
	}
}