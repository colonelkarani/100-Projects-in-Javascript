const mongoose = require('mongoose');
const { Schema } = mongoose;

// ===== SUB-SCHEMAS FOR EACH SYSTEM =====

const generalExamSchema = new Schema({
  appearance: String, // Well-nourished, cachectic, etc.
  consciousness: String, // Alert, drowsy, confused
  hydration: String, // Well-hydrated, dehydrated
  jaundice: Boolean,
  cyanosis: Boolean,
  clubbing: Number,
  pallor: Boolean,
  edema: String, // Location and severity
  lymphNodes: String, // Palpable nodes description
  vitalSigns: {
    heartRate: Number,
    respiratoryRate: Number,
    bloodPressure: String, // "120/80"
    temperature: Number,
    oxygenSaturation: Number
  }
});

const cardiovascularExamSchema = new Schema({
  jugularVenousPressure: String,
  heartSounds: {
    s1: String, // Normal, diminished, etc.
    s2: String,
    murmurs: [{
      location: String,
      timing: String, // Systolic/diastolic
      grade: Number, // I-VI
      radiation: String
    }]
  },
  peripheralPulses: String, // Symmetric, diminished, etc.
  capillaryRefill: Number, // Seconds
  edema: String // Cardiovascular-specific edema notes
});

const respiratoryExamSchema = new Schema({
  chestExpansion: String, // Symmetric, reduced
  percussionNote: String, // Resonant, dull, hyperresonant
  breathSounds: String, // Vesicular, bronchial, absent
  addedSounds: [String], // Wheezes, crackles, rhonchi
  trachealPosition: String // Midline, deviated
});

const gastrointestinalExamSchema = new Schema({
  abdomen: {
    contour: String, // Flat, distended, scaphoid
    scars: String,
    visiblePeristalsis: Boolean,
    tenderness: String, // Location and severity
    guarding: Boolean,
    rigidity: Boolean
  },
  bowelSounds: String, // Present, absent, hyperactive
  liverSpan: Number, // cm
  splenomegaly: Boolean,
  masses: String
});

const renalExamSchema = new Schema({
  flankTenderness: Boolean,
  suprapubicTenderness: Boolean,
  bladderDistension: Boolean,
  costovertebralAngleTenderness: Boolean
});

const musculoskeletalExamSchema = new Schema({
  gait: String,
  jointInspection: [{
    joint: String,
    swelling: Boolean,
    deformity: Boolean,
    redness: Boolean
  }],
  rangeOfMotion: String, // Normal, limited
  muscleStrength: String // Scale 0-5
});

const neurologicalExamSchema = new Schema({
  mentalStatus: String,
  cranialNerves: [String], // II-XII status
  motorFunction: {
    tone: String,
    power: String // Scale 0-5
  },
  reflexes: {
    biceps: String,
    triceps: String,
    brachioradialis: String,
    patellar: String,
    achilles: String
  },
  sensation: String,
  coordination: String
});

const skinExamSchema = new Schema({
  rash: String,
  lesions: String,
  ulcers: String,
  turgor: String // Normal, decreased
});

// ===== MAIN EXAMINATION SCHEMA =====
const examinationSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, default: Date.now },
  examiner: String, // Name/ID of healthcare provider
  general: generalExamSchema,
  cardiovascular: cardiovascularExamSchema,
  respiratory: respiratoryExamSchema,
  gastrointestinal: gastrointestinalExamSchema,
  renal: renalExamSchema,
  musculoskeletal: musculoskeletalExamSchema,
  neurological: neurologicalExamSchema,
  skin: skinExamSchema,
  additionalNotes: String
});

const Examination = mongoose.model('Examination', examinationSchema);

module.exports = examinationSchema
