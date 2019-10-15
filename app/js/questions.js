var sqlite3 = require('scripts/sqlite3');
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
	db.run("CREATE


