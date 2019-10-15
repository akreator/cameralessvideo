"use strict"
var express = require('express')

var app = express();
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/imgs', express.static(__dirname + '/app/imgs'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/three', express.static(__dirname + '/node_modules/three'));
app.use('/models', express.static(__dirname + '/app/models'));

app.get('/', (req, res) => res.sendFile(__dirname + '/app/html/index.html'));

app.get('*', (req, res) => res.send('<h2>Error 404: page not found</h2>'));

app.listen(8080, function() {
	console.log('- Server listening on port 8080');
});
