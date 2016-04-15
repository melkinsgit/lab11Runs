// lake.js defines a lake record in our DB

// require returns module.exports - you require a file.js

// define the data structure
// define data types
// arrays and nested objects
// objectID

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* runners db - records distances around each lake, runs at a given lake on multiple dates, with the time the lake was run on that date and notes about the weather */

var lakeSchema = new Schema ({
	name : { type: String,
		required: true,
		unique: true,
		lowercase: true},
	miles : Number,
	runs : [{
		dateRun: {Date,
			default: Date.now()},
		time: {type: Number,
			min: 0,
			required: true}
		weather: String
		}]
	// averageEggsLaid : { type: Number,  // integers and floats
		// min: 1,
		// max: 50},
	// threatened: { type: Boolean, default: false},
	// add nest data
	// datesSeen : [{type : Date, default: Date.now()}]    // just adding [] gives you an array
});

// mongoose.model turns it into a Run object - uppercase first letter
var Lake = mongoose.model('Lake', lakeSchema);

module.exports = Lake;