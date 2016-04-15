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
	
	var date = req.body.dateRun || Date.now();
	
	req.body.runs = [];
	req.body.runs.push(date);
	
	var newLake = Lake(req.body);  // JSON object of the user input data; calling Lake constructor
	
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
		return res.redirect('/');
	} );

} );


/* New POST */

router.post('/addRunTime', function(req, res, next) {
	
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
		
		lake.datesSeen.push(newSighting);
		
		lake.save(function(err){
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	} );
});


/* Delete a bird */ 
// router.post('/deleteBird', function(req, res, next) {

	// var birdToDelete = req.body.name;
	
	// Bird.findOne({name: req.body.name}, function (err, bird){
		// if (err){
			// return next(err)
		// }
		
		// if (!bird) {
			// return next (new Error('No bird found with name ' + req.body.name) );
		// }
		
		// Bird.remove({name:req.body.name}, function (error, result) {
			// if (err){
				// return next(err)
			// }
			// res.redirect('/');
		// });	
	// });
// } );


/* Update a bird */
// router.post('/updateBird', function(req, res, next) {
	
	// find the bird sent as hidden from the update button next to a given bird
	// Bird.findOne({name: req.body.name}, function (err, birdToUpdate){
		// if (err){
			// return next(err)
		// }
		
		// if (!birdToUpdate) {
			// return next (new Error('No bird found with name ' + req.body.name) );
		// }
		// if there is no error and there is a bird by the name of the req data sent, then render the update form/page with the data for that bird - the object of which was returned from the findOne search
		console.log("the bird we want to update is:")
		console.log(birdToUpdate);		
		// where the jade file refers to bird, the values from birdToUpdate will be used
		// res.render('update', {bird: birdToUpdate});  // jade: code
	// });
// });

/* Submit Updated bird */ 
router.post('/submitUpdate', function(req, res, next){
	
	// take the data from the form as updated by the user and set it into vars that will be used for the update method
	// var updateInfo = {name:req.body.name[0],
		// description: req.body.description,
		// averageEggsLaid: req.body.averageEggsLaid,
		// threatened: req.body.threatened}
		
	// the _id is name[1]; the bird name is name[0]
	// search for the bird that has been updated which is the collected of data from the req - the id num has been sent as hidden from the form via the req
	// Bird.findOne({_id:req.body.name[1]}, function (err, birdToSubmit){
		// if (err){
			// return next(err)
		// }
		// if (!birdToSubmit) {
			// return next (new Error('No bird found with name ' + req.body.name) );
		// }
		// if no error and that bird by that id exists, update the object returned from the findOne with the data sent by the user via the request now in var updateInfo
		// birdToSubmit.update(updateInfo, function (err){
			// if (err) {
				// return next(err)
			// }
			// reload the main page with updated data
			// res.redirect('/');
		// });
	// });
// });

module.exports = router;
