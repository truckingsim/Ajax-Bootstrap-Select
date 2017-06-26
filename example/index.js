const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use('/dist', express.static('../dist'));

server.post('/ajax', (req, res) => {
	const q = req.body.q;
	const content = require('./dataset.json');

	if (q) {
		return res.json(content.filter(item => {
			return item.Name.toLowerCase().indexOf(q.toLowerCase()) > -1 || item.Email.toLowerCase().indexOf(q.toLowerCase()) > -1;
		}).slice(0,20));
	}
	return res.json(content.slice(0,20));
});

server.get('*', (req, res) => {
	res.sendFile(path.resolve('./index.html'));
});

server.listen(8080);
console.log('Server started at localhost:8080');
