const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
var port = process.env.PORT || 8080;
app.set('port', port);

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'dist/welp')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//require('./db');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/welp/index.html'));
});

app.listen(port, () => {
    console.log('App listening on port ' + port +'!')
});