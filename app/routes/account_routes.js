const bodyParser     = require('body-parser');

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/accounts/:id', (req, res) => {
		console.log(req.params.id);
	    const details = { '_id': req.params.id };
	    db.collection('accounts').findOne(details, (err, account) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(account);
	      }
	    });
  	});
  	app.get('/items', (req, res) => {
  		let matchConditions = [];
  		let shouldProject = 0;

  		// Order in subjected rarity so mongo can filter faster
  		if (req.query.iMods)
  			matchConditions.push({ 'stashes.items.implicitMods': {$regex: req.query.iMods, $options: '$i'} });

  		if (req.query.typeLine)
  			matchConditions.push({ 'stashes.items.typeLine': {$regex: req.query.typeLine, $options: '$i'} });

  		if (req.query.ilvl)
  			matchConditions.push({ 'stashes.items.ilvl': parseInt(req.query.ilvl) });

  		if (req.query.lvlreq)
  			matchConditions.push({ 'stashes.items.requirements.name': 'Level' });

  		db.collection('accounts').aggregate([
  			{
  				$unwind: '$stashes'
  			}, 
  			{
  				$unwind: '$stashes.items'
  			},
  			{
  				$match: {
  					$and: matchConditions
  				}
  			}
  		]).toArray().then((result, err) => {
  			if (err)
  				res.send({'error': err})
  			else
  				res.send(result);
  		})
  	});
};