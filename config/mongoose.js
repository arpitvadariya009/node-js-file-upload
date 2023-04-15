const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1/demo');
if(db){
    console.log("DB is connected");
}else{
    console.log("DB not connected");
}

module.exports = db;
