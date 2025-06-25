const mongoose = require("mongoose")
const imedHistorySchema = require("./historyModel.js")
const examinationSchema = require("./examModel.js")
const diseaseSchema = require("./diseaseModel.js")

const {Schema} = mongoose
const vitalsSchema = new mongoose.Schema({
    temperature: Number,
    bloodPressure: Number,
    pulseRate: Number,
    respRate: Number,
    oxygenSat: Number,
    bloodGlucose: Number,
    recordedAt: {type: Date, default: Date.now}
})

const visitSchema = new mongoose.Schema({
  visitDate: { type: Date, default: Date.now },           // Date and time of the visit
  reasonForVisit: { type: String, required: true },       // Chief complaint or reason for encounter
  location: String,                                       // Clinic, ward, telemedicine, etc.
  history: { },                  // Snapshot of history at the time (can embed or reference)
  reviewOfSystems: { },          // ROS at the visit
  examination: { },              // Physical exam findings
  vitals: { },                   // Vitals taken at the visit
  assessment: String,                                     // Clinical impression/diagnosis
  plan: String,                                           // Management plan
  medicationsPrescribed: [{                               // Medications prescribed or changed at the visit
    name: String,
    dose: String,
    frequency: String,
    duration: String
  }],
  labsOrdered: [{                                         // Labs ordered at the visit
    testName: String,
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    result: String,
    dateResulted: Date
  }],
  imagingOrdered: [{                                      // Imaging studies ordered
    studyType: String,
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    result: String,
    dateResulted: Date
  }],
  proceduresPerformed: [{                                 // Procedures done during the visit
    procedureName: String,
    details: String,
    outcome: String
  }],
  referrals: [{                                           // Referrals made during the visit
    specialty: String,
    reason: String
  }],
  followUpInstructions: String,                           // When and how to follow up
  notes: String,                                          // Additional narrative or clinical notes
  attachments: [{                                         // Files, images, or documents
    fileName: String,
    fileType: String,
    fileUrl: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const labResultSchema = new mongoose.Schema({
  testName: { type: String },           // e.g., "Complete Blood Count", "Blood Glucose"
  testCode: { type: String },                           // Optional: LOINC or local code
  specimenType: { type: String },                       // e.g., "Blood", "Urine", "CSF"
  dateOrdered: { type: Date },
  dateCollected: { type: Date },
  dateReported: { type: Date, default: Date.now },
  orderingProvider: { type: String },                   // Name or ID of ordering clinician
  result: { type: String },                             // e.g., "Positive", "Negative", "Normal", "Abnormal"
  value: { type: Schema.Types.Mixed },                  // For numeric or text results
  unit: { type: String },                               // e.g., "mmol/L", "g/dL"
  referenceRange: { type: String },                     // e.g., "4.0-10.0 mmol/L"
  interpretation: { type: String },                     // e.g., "High", "Low", "Normal"
  comments: { type: String },                           // Any additional notes
  attachments: [{                                       // For scanned reports, PDFs, images
    url: String,
    description: String
  }]
});

const imagingSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true 
    // e.g., 'X-ray', 'CT', 'MRI', 'Ultrasound', 'Mammogram', 'PET', etc.
  },
  bodyPart: { 
    type: String, 
    required: true 
    // e.g., 'Chest', 'Abdomen', 'Head', etc.
  },
  date: { 
    type: Date, 
    required: true 
  },
  indication: { 
    type: String, 
    required: true 
    // Reason for the imaging study
  },
  findings: { 
    type: String, 
    required: true 
    // Radiologist's report or summary of findings
  },
  impression: { 
    type: String 
    // Final impression/diagnosis if provided
  },
  performedBy: { 
    type: String 
    // Name of radiologist or technician
  },
  imageLinks: [{
    type: String 
    // URLs or file paths to images if stored digitally
  }],
  reportFile: { 
    type: String 
    // URL or path to the full report PDF or document
  },
  notes: { 
    type: String 
    // Any additional notes
  }
});

const procedureSchema = new mongoose.Schema({
  procedureName: { type: String},         // Name of the procedure
  procedureCode: { type: String },                         // CPT/ICD-10/other coding (optional)
  indication: { type: String },                            // Reason for the procedure
  date: { type: Date, required: true },                    // Date performed
  provider: { type: String },                              // Name of the provider/surgeon
  location: { type: String },                              // Facility or department
  anesthesia: { type: String },                            // Type of anesthesia used (if any)
  findings: { type: String },                              // Intraoperative/diagnostic findings
  outcome: { type: String },                               // Immediate outcome/result
  complications: { type: String },                         // Any complications
  followUp: { type: String },                              // Recommended follow-up or aftercare
  notes: { type: String },                                 // Additional notes
  documents: [{ type: String }]                            // Links to related documents or images (optional)
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
    history: imedHistorySchema,
    examination: examinationSchema,
   vitals: vitalsSchema,
   visits: [visitSchema],
  labs: [labResultSchema],
  imaging: [imagingSchema],
  procedures: [procedureSchema],
})

const Patient = new mongoose.model("Patients", patientSchema)

module.exports = patientSchema