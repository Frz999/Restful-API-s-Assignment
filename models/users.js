const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email :{ type :String,required: true,unique: true,lowercase: true},
    password :{ type :String},
    hash:{type:String}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('users', schema);