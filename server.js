"use strict"
var express = require('express')

var app = express();
app.use('/views', express.static(__dirname + '/app/html'));
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/imgs', express.static(__dirname + '/app/imgs'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/three', express.static(__dirname + '/node_modules/three'));
app.use('/models', express.static(__dirname + '/app/models'));

app.get('/', (req, res) => res.sendFile(__dirname + '/app/html/index.html'));

app.get('/playback', (req, res) => res.sendFile(__dirname + '/app/html/playback.html')); 

app.get('/video1', (req, res) => res.sendFile(__dirname + '/app/html/video1.html'));

app.get('/video2', (req, res) => res.sendFile(__dirname + '/app/html/video2.html'));

app.get('/video2-yes', (req, res) => res.sendFile(__dirname + '/app/html/video2-yes.html'));

app.get('/video2-yes2', (req, res) => res.sendFile(__dirname + '/app/html/video2-yes2.html'));

app.get('/video2-no', (req, res) => res.sendFile(__dirname + '/app/html/video2-no.html'));

app.get('/why', (req, res) => res.sendFile(__dirname + '/app/html/why.html'));

app.get('/camera1', (req, res) => res.sendFile(__dirname + '/app/html/camera1.html'));

app.get('/camera2-yes', (req, res) => res.sendFile(__dirname + '/app/html/camera2-yes.html'));

app.get('/camera2-no', (req, res) => res.sendFile(__dirname + '/app/html/camera2-no.html'));

app.get('/camera3', (req, res) => res.sendFile(__dirname + '/app/html/camera3.html'));


app.get('*', (req, res) => res.send('<h2>Error 404: page not found</h2>'));

app.listen(8080, function() {
	console.log('- Server listening on port 8080');
});
