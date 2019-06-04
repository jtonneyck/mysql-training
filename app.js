const express = require("express")
const app = express()
const mysql = require("mysql")
 
app.set("port", 3000)
app.set('view engine', 'ejs');
app.use(express.static('public'))

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'tech-savvy',
    password : 'tech-savvy12345',
    database : 'sakila'
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
  });

app.get("/query", (req, res)=> {
    connection.query("SELECT * FROM Customer", function (error, results, fields) { 
        if(error) {
            res.status(422).json(error)
        } else {
            console.log('The solution is: ', results);
            debugger
            let header = Object.keys(results[0])
            res.status(200).json({results, header, error})
        }
      });
})

app.listen(app.get("port"), ()=> {
    console.log("App is listening on port", app.get("port"))
} )

//process.on('exit', exitHandler.bind(null,{cleanup:true}));