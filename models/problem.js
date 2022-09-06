// import mongoose from "mongoose";
// import passportLocalMongoose from 'passport-local-mongoose';
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const Schema=mongoose.Schema;

const ProblemSchema= new Schema({
    problemUrl: String,
    problemName:String,
    problemStatus: String,
});

// export default mongoose.model('Problem', ProblemSchema);
module.exports = mongoose.model('Problem', ProblemSchema);
