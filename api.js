var mongoose = require('mongoose'); 
var express = require('express'); 
var router = express.Router(); 
var TaskModel = require('./task_schema'); 

let environment = null;

if (!process.env.ON_HEROKU) {
    console.log("Cargando variables de entorno desde archivo");
    const env = require('node-env-file');
    env(__dirname + '/.env');
}

environment = {
    DBMONGOUSER: process.env.DBMONGOUSER,
    DBMONGOPASS: process.env.DBMONGOPASS,
    DBMONGOSERV: process.env.DBMONGOSERV,
    DBMONGO: process.env.DBMONGO,
};

console.log(environment);
// Connecting to database 
var query = 'mongodb+srv://' + environment.DBMONGOUSER + ':' + environment.DBMONGOPASS + '@' + environment.DBMONGOSERV + '/' + environment.DBMONGO + '?retryWrites=true&w=majority';


const db = (query); 
mongoose.Promise = global.Promise; 

mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) { 
	if (error) { 
		console.log("Error!" + error); 
	} else {
        console.log("Correcto");
    }
}); 

router.get('/all-tasks', function (req, res) {
    TaskModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.get('/get-task/:TaskId', function (req, res) {
    TaskModel.findOne({TaskId: req.params.TaskId}, function (err, data) {
        if (err) {
            console.log(err);
            res.send("Internal error");
        }
        else {
            res.send(data);
        }
    });
});


router.delete('/delete-task', function (req, res) {

    TaskModel.deleteOne({TaskId: req.body.TaskId}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
            console.log("Data Deleted!");
        }
    });
});

router.post('/update-task', function (req, res) {
    TaskModel.updateOne({TaskId: req.body.TaskId}, {
        Name: req.body.Name,
        Deadline: req.body.Deadline
    }, function (err, data) {
        if (err) {
            res.send("Internal error");
            console.log(err);
        } else {
            res.send(data);
            console.log("Data updated!");
        }
    });
});

router.post('/create-task', function (req, res) {
    let task_id = req.body.TaskId;
    let name = req.body.Name;
    let deadline = req.body.Deadline;

    let task = {
        TaskId: task_id,
        Name: name,
        Deadline: deadline
    }
    var newTask = new TaskModel(task);

    newTask.save(function (err, data) {
        if (err) {
            console.log(error);
        }
        else {
            res.send("Data inserted");
        }
    });
});

module.exports = router;
