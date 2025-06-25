const mongoose = require('mongoose');
const imedHistorySchema = require("./historyModel.js")
const { Schema } = mongoose;

const diseaseSchema = new Schema({
  // Core identification
  name: { type: String, required: true }, // e.g., "Diabetes Mellitus Type 2"
  synonyms: [String], // Alternative names

  // Classification
  system: String,
  category: String, // e.g., "Metabolic", "Infectious"
  subcategory: String, // e.g., "Autoimmune", "Bacterial"

  // Description and epidemiology
  description: String,
  prevalence: String,
  incidence: String,
  demographics: String, // Age, sex, ethnicity, risk groups

  // Etiology and risk factors
  causes: [String], // e.g., "Genetic", "Environmental"
  riskFactors: [String], // e.g., "Obesity", "Smoking", "Family history"

  // Pathophysiology
  pathophysiology: String,
  mechanism: String,

  // Clinical features
  signs: [String], // Observable on exam
  symptoms: [String], // Patient-reported
  complications: [String],

  // Diagnosis
  diagnosticCriteria: [String], // e.g., "Fasting glucose > 126 mg/dL"
  diagnosticTests: [{
    testName: String,
    findings: String
  }],
  differentialDiagnosis: [String],

  // Treatment and management
  treatments: [{
    type: String, // "Medication", "Surgery", "Lifestyle"
    details: String
  }],
  guidelines: [String], // e.g., "ADA 2024", "NICE"
  followUp: String,
  prevention: [String],


  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Disease = mongoose.model('Disease', diseaseSchema);

module.exports = diseaseSchema
