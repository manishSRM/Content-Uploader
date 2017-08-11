var express = require('express');
var monogClient = require('mongodb').MongoClient;
var oid = require('mongodb').ObjectId;
var db_url = 'mongodb://localhost:27017/contentuploader';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.send("Hi Hello");
});

var insertNewEventDetails = function(db, newEvent, callBack) {
    db.collection('events').insert(newEvent);
    callBack();
}

router.post('/createEvent/', function(req, res, next) {
    monogClient.connect(db_url, function(err, db) {
        if (!err) {
            insertNewEventDetails(db, req.body, function() {
                db.close();
            });
            res.send("Success");
        } else {
            res.send("Failed");
        }
    });
});


var updateEvent = function(db, updatedEvent, callBack) {
    db.collection('events').updateOne(
        {"name": updatedEvent.name},
        {
            $set: {"type": updatedEvent.type, "des": updatedEvent.des}
        }, function(err, results) {
            callBack(err);
        }
    );
}

router.post('/updateEvent/', function(req, res, next) {
    monogClient.connect(db_url, function(err, db) {
        if (!err) {
            updateEvent(db, req.body, function(err) {
                db.close();
                res.send(err);
            });
        } else {
            res.send("Failed");
        }
    });
});

var deleteEvent = function(db, eventTobeDeleted, callBack) {
    db.collection('events').deleteOne(
        {"name": eventTobeDeleted.name},
        function(err, results) {
            callBack(err);
        }
    );
}

router.post('/deleteEvent/', function(req, res, next) {
    monogClient.connect(db_url, function(err, db) {
        if (!err) {
            deleteEvent(db, req.body, function(err) {
                db.close();
                res.send(err);
            });
        } else {
            res.send("Failed");
        }
    });
});

function getEvents() {
    monogClient.connect(db_url, function(err, db) {
        return db.collection('events').find();
    });
}

router.get('/allEvents/', function(req, res, next) {
    var listOfEvent = [];
    var p;
    getEvents().then(function(cursor) {
        cursor.forEach(function(d) {
            console.log(d);
        });
    });
});

module.exports = router;
