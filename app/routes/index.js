const accountRoutes = require('./account_routes');

module.exports = function(app, db) {
  accountRoutes(app, db);
  // Other route groups could go here, in the future
};