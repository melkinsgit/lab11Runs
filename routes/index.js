var express = require('express');
var router = express.Router();

var Lake = require('../models/lake.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  Lake.find(function(err, lakeDocs){
	if (err) { return next(err); }
		return res.render('index', { lakes: lakeDocs, error: req.flash('error') });  // returns an array of JSON ojbects type Lake called lakes; index.jade deals with lakes
  });
});

/* POST a new Lake */
router.post('/', function(req, res, next) {
	
	for (var att in req.body) {  // remove any empty forms from the req.body before they go to the db and create empty records
		if (req.body[att] === ''){
			delete(req.body[att]);
		}
	}
	
	var runToSave = {date: req.body.dateRun || Date.now(),
		time: req.body.time,
		weather: req.body.weather}
	
	
	req.body.runs = [];
	req.body.runs.push(runToSave);
	
	var newLake = Lake(req.body);  // JSON object of the user input data; calling Lake constructor
	console.log(newLake);
	
	newLake.save(function (err, savedLake) {
		if (err) { 
			if (err.name == "ValidationError"){
				req.flash('error', 'Invalid data');
				return res.redirect('/');
			}
			if (err.code == 11000){
				req.flash('error', 'A lake with that name already exists.');
				return res.redirect('/');
			}
			return next(err) ;
		}
		res.status (201);
		console.log("should have saved lake: ")
		console.log(savedLake);
		return res.redirect('/');
	} );  // end save new lake

} );


/* New POST to add a run to a lake */

router.post('/addRun', function(req, res, next) {
	
	var newRun = req.body.dateRun;
	if (!newRun || newRun == ""){
		return res.redirect('/');
	}
	
	// lake will be a db object that is a match for the lake name the user chose
	Lake.findOne ( { name: req.body.name }, function (err, lake) {
		
		if (err) {
				return next(err);
			}
		
		if (!lake) {
			return next (new Error('No lake found with name ' + req.body.name) );
		}
		console.log(req.body);
		var newRunTimeInfo = {date:req.body.date,
			time: req.body.time,
			weather: req.body.weather}
			
		lake.runs.push(newRunTimeInfo);
		
		lake.save(function(err){
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	} );
});

module.exports = router;
