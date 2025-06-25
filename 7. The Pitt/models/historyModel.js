const mongoose = require("mongoose")
const {Schema} = mongoose
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
}, { timestamps: true

 });



const pastMedicalHistorySchema = new mongoose.Schema({
  currentHealthStatus: {
    type: String,
    required: false
  },
  medications: [{
    name: String,
    dose: String,
    frequency: String,
    route: String,
    reason: String,
    compliance: { type: Boolean, default: true },
    recentChanges: String
  }],
  allergies: [{
    allergen: String,
    reaction: String,
    type: { type: String, enum: ['drug', 'food', 'latex', 'environmental', 'other'] }
  }],
  childhoodIllnesses: [{
    illness: String,
    ageAtIllness: String,
    complications: String,
    hospitalized: Boolean
  }],
  chronicIllnesses: [{
    condition: String,
    diagnosisDate: String,
    currentTreatment: String,
    complications: String,
    followUpCare: String
  }],
  acuteIllnesses: [{
    illness: String,
    date: String,
    treatment: String,
    complications: String
  }],
  surgeries: [{
    typeOfSurgery: String,
    date: String,
    location: String,
    complications: String
  }],
  accidentsInjuries: [{
    description: String,
    date: String,
    treatment: String,
    complications: String
  }],
  hospitalizations: [{
    reason: String,
    hospital: String,
    date: String,
    duration: String
  }],
  transfusions: [{
    date: String,
    reason: String,
    complications: String
  }],
  immunizations: [{
    vaccine: String,
    date: String,
    reaction: String
  }],
  psychiatricHistory: [{
    diagnosis: String,
    treatment: String,
    hospitalization: Boolean,
    suicideAttempt: Boolean
  }],
  screeningExams: [{
    type: String,
    date: String,
    result: String
  }],
});

const obGynHistorySchema = new mongoose.Schema({
  // Obstetric History
  gravidity: { type: Number}, // Total pregnancies
  parity: {
    term: Number,        // ≥37 weeks
    preterm: Number,     // <37 weeks
    abortions: Number,   // <20 weeks (spontaneous/induced/ectopic/molar)
    living: Number       // Living children
  },
  pregnancies: [{
    year: String,
    durationWeeks: Number,
    modeOfDelivery: { type: String, enum: ['vaginal', 'c-section', 'assisted', 'other'] },
    birthWeight: String,
    gender: String,
    complications: String,
    ART: String, // Assisted reproductive technology
    placeOfDelivery: String,
    neonatalOutcome: String,
    currentStatus: String // e.g., child health
  }],
  currentPregnancy: {
    isPregnant: Boolean,
    gestationalAgeWeeks: Number,
    expectedDueDate: String,
    prenatalCareStart: String,
    supplements: String,
    teratogenicDrugUse: String,
    infectiousDiseases: String,
    immunizations: String,
    prenatalScreeningResults: String,
    bleeding: String,
    fluidLeakage: String,
    fetalMovements: String,
    contractions: String
  },
  // Gynecologic History
  menstrualHistory: {
    ageAtMenarche: Number,
    ageAtMenopause: Number,
    cycleLengthDays: Number,
    regularity: String,
    durationOfFlowDays: Number,
    volume: String,
    LMP: String,
    symptomsWithMenses: String,
    menstrualAbnormalities: String
  },
  sexualHistory: {
    genderOfPartners: String,
    concerns: String,
    contraceptiveUse: String,
    sexualRiskBehaviors: String,
    historyOfSexualViolence: String
  },
  gynecologicConditions: [{
    condition: String,
    diagnosisDate: String,
    treatment: String,
    complications: String
  }],
  infertilityHistory: {
    diagnosis: String,
    treatment: String
  },
  gynecologicProcedures: [{
    procedure: String,
    date: String,
    indication: String,
    complications: String
  }],
  screening: {
    papSmear: {
      date: String,
      result: String,
      treatment: String
    },
    mammogram: {
      date: String,
      result: String
    }
  },
  urinaryTractSymptoms: String,
  medicalHistory: String, // Systemic diseases, relevant medications
  allergies: [{
    allergen: String,
    reaction: String
  }]
});
const familyMemberSchema = new mongoose.Schema({
  relation: { type: String, required: true }, // e.g., mother, father, sister, cousin
  age: Number,
  ageAtDeath: Number,
  causeOfDeath: String,
  ethnicity: String,
  countryOfOrigin: String,
  medicalConditions: [{
    condition: String, // e.g., diabetes, cancer
    ageAtOnset: Number,
    details: String
  }],
  pregnancyComplications: String,
  healthHabits: String, // e.g., smoking, alcohol use
  mentalIllness: String,
  learningDisabilities: String,
  birthDefects: String
});

const familyHistorySchema = new mongoose.Schema({
  relatives: [familyMemberSchema],
  updatedAt: { type: Date, default: Date.now }
});

const socialHistorySchema = new mongoose.Schema({
  livingSituation: {
    type: String // e.g., alone, with family, assisted living
  },
  housingType: String,
  safetyConcerns: String,
  occupation: {
    current: String,
    past: String,
    employmentStatus: String,
    workplaceExposures: String
  },
  education: {
    level: String,
    literacy: String,
    languageProficiency: String
  },
  maritalStatus: String,
  significantRelationships: String,
  childrenDependents: {
    number: Number,
    ages: [Number],
    caregivingResponsibilities: String
  },
  supportSystems: String,
  substanceUse: {
    tobacco: {
      status: String, // never, former, current
      quantity: String,
      duration: String,
      quitAttempts: Number
    },
    alcohol: {
      status: String,
      quantity: String,
      duration: String,
      quitAttempts: Number
    },
    drugs: {
      status: String,
      typeOfDrugs: String,
      quantity: String,
      duration: String,
      quitAttempts: Number
    },
    caffeine: String
  },
  diet: String,
  exercise: String,
  sexualHistory: {
    partners: String,
    practices: String,
    orientation: String,
    contraception: String,
    riskBehaviors: String
  },
  travelHistory: String,
  legalIssues: {
    incarceration: Boolean,
    domesticViolence: Boolean,
    firearmsAtHome: Boolean
  },
  religiousCulturalBeliefs: String,
  financialStatus: {
    abilityToPay: String,
    insurance: String,
    economicStressors: String
  },
  hobbiesInterests: String,
  environmentalExposures: String,
  militaryService: {
    veteran: Boolean,
    details: String
  },
  functionalStatus: {
    activitiesOfDailyLiving: String,
    needForCarers: Boolean,
    mobilityAids: String
  }
});

const cardiovascularSymptomsSchema = new mongoose.Schema({
  chestPain: { type: Boolean, default: false },
  chestTightness: { type: Boolean, default: false },
  palpitations: { type: Boolean, default: false },
  shortnessOfBreath: { type: Boolean, default: false },
  orthopnea: { type: Boolean, default: false },
  paroxysmalNocturnalDyspnea: { type: Boolean, default: false },
  peripheralEdema: { type: Boolean, default: false },
  syncope: { type: Boolean, default: false },
  dizziness: { type: Boolean, default: false },
  claudication: { type: Boolean, default: false },
  fatigue: { type: Boolean, default: false },
  nocturnalCough: { type: Boolean, default: false },
  cyanosis: { type: Boolean, default: false },
  hemoptysis: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const gastrointestinalSymptomsSchema = new mongoose.Schema({
  abdominalPain: { type: Boolean, default: false },
  heartburn: { type: Boolean, default: false },
  indigestion: { type: Boolean, default: false },
  nausea: { type: Boolean, default: false },
  vomiting: { type: Boolean, default: false },
  lossOfAppetite: { type: Boolean, default: false },
  difficultySwallowing: { type: Boolean, default: false },
  painfulSwallowing: { type: Boolean, default: false },
  bloating: { type: Boolean, default: false },
  excessiveGas: { type: Boolean, default: false },
  diarrhea: { type: Boolean, default: false },
  constipation: { type: Boolean, default: false },
  changeInBowelHabits: { type: Boolean, default: false },
  bloodInStool: { type: Boolean, default: false },
  blackTarryStools: { type: Boolean, default: false },
  mucousInStool: { type: Boolean, default: false },
  rectalPain: { type: Boolean, default: false },
  tenesmus: { type: Boolean, default: false },
  jaundice: { type: Boolean, default: false },
  unintentionalWeightLoss: { type: Boolean, default: false },
  hematemesis: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const respiratorySymptomsSchema = new mongoose.Schema({
  cough: { type: Boolean, default: false },
  productiveCough: { type: Boolean, default: false },
  shortnessOfBreath: { type: Boolean, default: false },
  difficultyBreathing: { type: Boolean, default: false },
  wheezing: { type: Boolean, default: false },
  chestPainWithBreathing: { type: Boolean, default: false },
  chestTightness: { type: Boolean, default: false },
  coughingUpBlood: { type: Boolean, default: false },
  soreThroat: { type: Boolean, default: false },
  hoarseness: { type: Boolean, default: false },
  nasalCongestion: { type: Boolean, default: false },
  runnyNose: { type: Boolean, default: false },
  snoring: { type: Boolean, default: false },
  sleepApnea: { type: Boolean, default: false },
  stridor: { type: Boolean, default: false },
  paroxysmalNocturnalDyspnea: { type: Boolean, default: false },
  orthopnea: { type: Boolean, default: false },
  nightSweats: { type: Boolean, default: false },
  fever: { type: Boolean, default: false },
  fatigue: { type: Boolean, default: false },
  mucusProduction: { type: Boolean, default: false },
  breathlessness: { type: Boolean, default: false },
  chestDiscomfort: { type: Boolean, default: false },
  grunting: { type: Boolean, default: false },
  nasalFlaring: { type: Boolean, default: false },
  retractions: { type: Boolean, default: false },
  cyanosis: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const renalSymptomsSchema = new mongoose.Schema({
  dysuria: { type: Boolean, default: false },
  urinaryFrequency: { type: Boolean, default: false },
  polyuria: { type: Boolean, default: false },
  urgency: { type: Boolean, default: false },
  nocturia: { type: Boolean, default: false },
  hesitancy: { type: Boolean, default: false },
  weakStream: { type: Boolean, default: false },
  incontinence: { type: Boolean, default: false },
  oliguria: { type: Boolean, default: false },
  cloudyUrine: { type: Boolean, default: false },
  hematuria: { type: Boolean, default: false },
  passingStones: { type: Boolean, default: false },
  flankPain: { type: Boolean, default: false },
  groinPain: { type: Boolean, default: false },
  edema: { type: Boolean, default: false },
  frothyUrine: { type: Boolean, default: false },
  dribbling: { type: Boolean, default: false },
  painWithEjaculation: { type: Boolean, default: false },
  pruritus: { type: Boolean, default: false },
  fatigue: { type: Boolean, default: false },
  nausea: { type: Boolean, default: false },
  vomiting: { type: Boolean, default: false },
  anorexia: { type: Boolean, default: false },
  weightLoss: { type: Boolean, default: false },
  alteredTaste: { type: Boolean, default: false },
  confusion: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const nervousSystemSymptomsSchema = new mongoose.Schema({
  headaches: { type: Boolean, default: false },
  dizziness: { type: Boolean, default: false },
  vertigo: { type: Boolean, default: false },
  syncope: { type: Boolean, default: false },
  seizures: { type: Boolean, default: false },
  tremors: { type: Boolean, default: false },
  numbness: { type: Boolean, default: false },
  tingling: { type: Boolean, default: false },
  weakness: { type: Boolean, default: false },
  memoryLoss: { type: Boolean, default: false },
  confusion: { type: Boolean, default: false },
  balanceProblems: { type: Boolean, default: false },
  coordinationProblems: { type: Boolean, default: false },
  speechDifficulty: { type: Boolean, default: false },
  visionChanges: { type: Boolean, default: false },
  hearingLoss: { type: Boolean, default: false },
  muscleTwitching: { type: Boolean, default: false },
  lossOfSensation: { type: Boolean, default: false },
  difficultySwallowing: { type: Boolean, default: false },
  gaitProblems: { type: Boolean, default: false },
  involuntaryMovements: { type: Boolean, default: false },
  sleepDisturbances: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const musculoskeletalSymptomsSchema = new mongoose.Schema({
  jointPain: { type: Boolean, default: false },
  jointSwelling: { type: Boolean, default: false },
  musclePain: { type: Boolean, default: false },
  muscleStiffness: { type: Boolean, default: false },
  muscleWeakness: { type: Boolean, default: false },
  backPain: { type: Boolean, default: false },
  neckPain: { type: Boolean, default: false },
  restrictedMotion: { type: Boolean, default: false },
  bonePain: { type: Boolean, default: false },
  cramps: { type: Boolean, default: false },
  burningSensation: { type: Boolean, default: false },
  tingling: { type: Boolean, default: false },
  painWithExercise: { type: Boolean, default: false },
  changeInRingOrShoeSize: { type: Boolean, default: false },
  footProblems: { type: Boolean, default: false },
  sleepDisruptionDueToPain: { type: Boolean, default: false },
  generalizedAching: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const endocrineSymptomsSchema = new mongoose.Schema({
  fatigue: { type: Boolean, default: false },
  weightGain: { type: Boolean, default: false },
  weightLoss: { type: Boolean, default: false },
  lossOfAppetite: { type: Boolean, default: false },
  coldIntolerance: { type: Boolean, default: false },
  heatIntolerance: { type: Boolean, default: false },
  excessiveThirst: { type: Boolean, default: false },
  excessiveHunger: { type: Boolean, default: false },
  excessiveUrination: { type: Boolean, default: false },
  excessiveSweating: { type: Boolean, default: false },
  flushing: { type: Boolean, default: false },
  heartRateChange: { type: Boolean, default: false },
  menstrualChanges: { type: Boolean, default: false },
  lossOfLibido: { type: Boolean, default: false },
  infertility: { type: Boolean, default: false },
  breastLeakage: { type: Boolean, default: false },
  breastSwelling: { type: Boolean, default: false },
  hotFlashes: { type: Boolean, default: false },
  postmenopausalSymptoms: { type: Boolean, default: false },
  visionChanges: { type: Boolean, default: false },
  neckSwelling: { type: Boolean, default: false },
  skinChanges: { type: Boolean, default: false },
  abnormalHairLoss: { type: Boolean, default: false },
  abnormalHairGrowth: { type: Boolean, default: false },
  drySkin: { type: Boolean, default: false },
  nailChanges: { type: Boolean, default: false },
  easyBruising: { type: Boolean, default: false },
  fractures: { type: Boolean, default: false },
  decreasedHeight: { type: Boolean, default: false },
  muscleAches: { type: Boolean, default: false },
  tremors: { type: Boolean, default: false },
  mentalFogginess: { type: Boolean, default: false },
  depression: { type: Boolean, default: false },
  anxiety: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const hematologicalSymptomsSchema = new mongoose.Schema({
  easyBruising: { type: Boolean, default: false },
  easyBleeding: { type: Boolean, default: false },
  prolongedBleeding: { type: Boolean, default: false },
  petechiae: { type: Boolean, default: false },
  frequentInfections: { type: Boolean, default: false },
  swollenLymphNodes: { type: Boolean, default: false },
  lymphedema: { type: Boolean, default: false },
  fatigue: { type: Boolean, default: false },
  weakness: { type: Boolean, default: false },
  shortnessOfBreath: { type: Boolean, default: false },
  palpitations: { type: Boolean, default: false },
  dizziness: { type: Boolean, default: false },
  headaches: { type: Boolean, default: false },
  fevers: { type: Boolean, default: false },
  nightSweats: { type: Boolean, default: false },
  weightLoss: { type: Boolean, default: false },
  darkOrRedUrine: { type: Boolean, default: false },
  bloodClots: { type: Boolean, default: false },
  confusion: { type: Boolean, default: false },
  otherSymptoms: { type: String }
});

const reviewOfSystemsSchema = new mongoose.Schema({
  cardiovascular: cardiovascularSymptomsSchema,
  gastrointestinal: gastrointestinalSymptomsSchema,
  respiratory: respiratorySymptomsSchema,
  renal: renalSymptomsSchema,
  nervousSystem : nervousSystemSymptomsSchema,
  musculoskeletal: musculoskeletalSymptomsSchema,
  endocrine: endocrineSymptomsSchema,
  hematological: hematologicalSymptomsSchema

})

const imedHistorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    gender:{type: String, required: true, enum: ["Male", "Female"]   },
    dateOfAdmission:{type:Date, required: true, default: Date.now},
    hpi: hpiSchema,
    pastMedical: pastMedicalHistorySchema,
    obsGyn: obGynHistorySchema,
    familyHistory: familyHistorySchema,
    socialHistory: socialHistorySchema,
    reviewOfSystems: reviewOfSystemsSchema,},
    
{timestamps: true}
)

const ImedHistory = mongoose.model("imedHistory", imedHistorySchema, "Imed")

module.exports = imedHistorySchema
