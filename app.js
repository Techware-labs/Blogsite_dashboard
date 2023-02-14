const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fileupload = require('express-fileupload');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended : false }));
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());

//default option
app.use(fileupload());

app.use(express.static('public'));

//specifying the folder where the routes are
const routes = require('./server/routes/routes');
app.use('/', routes);

const handlebars = exphbs.create ({ extname : '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'admin',
    password        : 'admin',
    database        : 'Techware_Blogs'
});

//connect to db
pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log('connection id:' + connection.threadId);
});


//starting the server and specifying the port
app.listen(port, () => console.log(`listening to port ${port}`));