const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    avatar : {
        type : String,
        required : true,
    }

});
const admin = mongoose.model('admin',adminSchema);
module.exports = admin;

