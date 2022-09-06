// import mongoose from "mongoose";
// import passportLocalMongoose from 'passport-local-mongoose';
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const Schema=mongoose.Schema;

const UserSchema= new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    submissions:{
        type: Schema.Types.ObjectId,
        ref: 'Problem',
    },
    following:[
        {
            name:String,
            last: String,
        }
    ],
    todo:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Problem',
        }
    ],
    recentdeleted:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Problem',
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
