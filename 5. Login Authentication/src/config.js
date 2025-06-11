const mongoose = require('mongoose')

const connect = mongoose.connect('mongodb://localhost:27017/')
.then(()=>{console.log('mongoose connected');})
.catch(()=>{console.log('mongoose cannot be connected');})

const loginSchema = new mongoose.Schema({
   name: { type: String, required: true },
    
    password: { type: String, required: true }}
)
//creating a model
const collection = new mongoose.model('USERS', loginSchema);

module.exports = collection;