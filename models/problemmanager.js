const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const Schema=mongoose.Schema;

const ProblemManagerSchema= new Schema({
    frequency: Number,
    problemId: Schema.Types.ObjectId,
});

// export default mongoose.model('Problem', ProblemSchema);
module.exports = mongoose.model('Manager', ProblemManagerSchema);