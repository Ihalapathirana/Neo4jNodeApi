var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = 3000;
var neo4j = require('neo4j-driver').v1;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','password'));
var session = driver.session();

app.get('/', function(req, res){
    session
    .run('MATCH (people:Person) RETURN people LIMIT 10')
    .then(function(result){
        var arr = [];
        result.records.forEach(function(records){
            arr.push({
                name: records._fields[0].properties.name,
                country: records._fields[0].properties.country,
                age: records._fields[0].properties.age
            })
        })
        res.send(arr)
    })
    .catch(function(err){
        console.log(err);
    })
})

app.post('/add', function(req, res){
    var name = req.body.name;
    var country = req.body.country;
    var age = req.body.age;

    session.run('CREATE(p:Person{name:{nameParam}, country:{countryParam}, age:{ageParam}}) RETURN p',{nameParam:name, countryParam:country, ageParam:age })
    .then(function(result){
        res.send('added');
        session.close();
    })
    .catch(function(err){
        console.log(err);
    })
})

app.listen(port);
console.log('Server listen to port '+ port);

module.exports = app;