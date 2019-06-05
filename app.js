const express = require("express")
const app = express()
const mysql = require("mysql")
const bodyParser = require('body-parser')
const dbConfig = require("./config/db")
require('dotenv').config()

app.use(bodyParser.json())
app.set("port", process.env.PORT)
app.set('view engine', 'ejs');
app.use(express.static('public'))

const databases = {
  sakila : mysql.createConnection({
    host     : dbConfig.host,
    user     : dbConfig.user,
    password : dbConfig.password,
    database : 'sakila'
  }),
  northwind : mysql.createConnection({
    host     : dbConfig.host,
    user     : dbConfig.user,
    password : dbConfig.password,
    database : 'northwind'
  }),
  chinook : mysql.createConnection({
    host     : dbConfig.host,
    user     : dbConfig.user,
    password : dbConfig.password,
    database : 'Chinook'
  })
}

  databases.sakila.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + databases.sakila.threadId);
  });
  databases.northwind.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + databases.northwind.threadId);
  });
  databases.chinook.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + databases.chinook.threadId);
  });

app.post("/query", (req, res)=> {

    const db = databases[req.body.db]
    
    db.query(req.body.query, function (error, results, fields) { 
        if(error) {
            res.status(422).json(error)
        } else {
            console.log('The solution is: ', results);
            let header = Object.keys(results[0])
            res.status(200).json({results, header, error})
        }
      });
})

app.listen(app.get("port"), ()=> {
    console.log("App is listening on port", app.get("port"))
} )

