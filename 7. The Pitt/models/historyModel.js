const mongoose = require("mongoose")


const chiefComplaintsSchema = new mongoose.Schema({
    title:{
    type: String,
    required: true,
    trim: true
},
  site: {
    type: String,
    required: true,
    trim: true,
  },
onset: {
    type: String,
    required: true,
    trim: true,
  },
  character: {
    type: String,
    required: true,
    trim: true,
  },
  radiation: {
    type: String,
    trim: true,
  },    
  timeCourse: {
    type: String,
    required: true,
    trim: true,
  },
  exacerbatingFactors: {
    type: String,
    trim: true,
  },
  relievingFactors: {
    type: String,
    trim: true,
  },
  severity: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
   importantPositives: [{
    type: String,
    trim: true,
  }],
  importantNegatives: [{
    type: String,
    trim: true,
  }],
  riskFactors: {
    type: String,
    trim: true,
  },
  precipitants: {
    type: String,
    trim: true,
  },
  complications: {
    type: String,
    trim: true,
  },
  progression: {
    type: String,
    trim: true,
  },
  impactOnFunction: {
    type: String,
    trim: true,
  },  
  previousTreatments: {
    type: String,
    trim: true,
  },
  relevantPastMedicalHistory: {
    type: String,
    trim: true,
  },
  });

const hpiSchema = new mongoose.Schema({
  chiefComplaints: [chiefComplaintsSchema], 
  allergies: {
    type: String,
    trim: true,
  },
  medications: {
    type: String,
    trim: true,
  },
  treatmentsAfterAdmission: [{
    type: String,
    trim: true,
  }],
    testsAfterAdmission: [{
    type: String,
    trim: true,
  }],
}, { timestamps: true });

const historySchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    gender:{type: String, required: true, enum:{
        value:["Male", "Female"],
        message: '{VALUE} is not a valid gender'
    }},
    dateOfAdmission:{type:Date, required: true, default: Date.now},
    hpi: hpiSchema,

timestamps: true
})

const vitalsSchema = new mongoose.Schema({
    temperature: Number,
    bloodPressure: Number,
    pulseRate: Number,
    respRate: Number,
    oxygenSat: Number,
    bloodGlusoce: Number,
})