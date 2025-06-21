const mongoose = require("mongoose")


const hpiSchema = new mongoose.Schema({
  chiefComplaints: [{
    type: String,
    required: true,
    trim: true,
    description: 'Primary symptom or reason for visit'
  }],
  symptoms: [{
    type: String,
    trim: true,
    description: 'Description of symptoms experienced'
  }],
  site: {
    type: String,
    required: true,
    trim: true,
    description: 'Location of the symptom or pain (SOCRATES)'
  },
  onset: {
    type: String,
    required: true,
    trim: true,
    description: 'When and how the symptom started (SOCRATES)'
  },
  character: {
    type: String,
    required: true,
    trim: true,
    description: 'Nature or quality of the symptom (e.g., sharp, dull) (SOCRATES)'
  },
  radiation: {
    type: String,
    trim: true,
    description: 'Whether the symptom spreads to other areas (SOCRATES)'
  },
  associations: {
    type: String,
    trim: true,
    description: 'Other symptoms associated with the main complaint (SOCRATES)'
  },
  timeCourse: {
    type: String,
    required: true,
    trim: true,
    description: 'Duration and pattern of the symptom (e.g., constant, intermittent) (SOCRATES)'
  },
  exacerbatingFactors: {
    type: String,
    trim: true,
    description: 'What makes the symptom worse (SOCRATES)'
  },
  relievingFactors: {
    type: String,
    trim: true,
    description: 'What makes the symptom better (SOCRATES)'
  },
  severity: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    description: 'Severity of symptom on a scale of 0 to 10 (SOCRATES)'
  },
  riskFactors: {
    type: String,
    trim: true,
    description: 'Patient-specific risk factors relevant to the illness (e.g., smoking, family history)'
  },
  precipitants: {
    type: String,
    trim: true,
    description: 'Events or exposures that triggered or precipitated the symptom'
  },
  complications: {
    type: String,
    trim: true,
    description: 'Any complications that have arisen from the illness or symptom'
  },
  progression: {
    type: String,
    trim: true,
    description: 'How the illness or symptoms have evolved over time'
  },
  impactOnFunction: {
    type: String,
    trim: true,
    description: 'Effect of illness on daily activities and quality of life'
  },
  previousTreatments: {
    type: String,
    trim: true,
    description: 'Treatments tried previously and their effectiveness'
  },
  relevantPastMedicalHistory: {
    type: String,
    trim: true,
    description: 'Past medical conditions related to current illness'
  },
  allergies: {
    type: String,
    trim: true,
    description: 'Known allergies relevant to treatment'
  },
  medications: {
    type: String,
    trim: true,
    description: 'Current medications including over-the-counter and supplements'
  }
}, { timestamps: true });

const historySchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    gender:{type: String, required: true, enum:{
        value:["Male", "Female"],
        message: '{VALUE} is not a valid gender'
    }},
    patientPC: String,
    analyzedPC: String,
    dateOfAdmission:{type:Date, required: true, default: Date.now},

timestamps: true
})