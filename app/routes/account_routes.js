var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	app.get('/accounts/:id', (req, res) => {
		const id = req.params.id;
	    const details = { '_id': req.params.id };
	    db.collection('accounts').findOne(details, (err, account) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(account);
	      }
	    });
  });
};