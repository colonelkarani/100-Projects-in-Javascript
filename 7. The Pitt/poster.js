const ImedHistory = require("./models/historyModel.js")

const data = {
  "name": "Jane Doe",
  "age": 35,
  "gender": "Female",
  "dateOfAdmission": "2025-06-23T09:38:00.000Z",
  "hpi": {
    "chiefComplaints": [
      {
        "title": "Abdominal Pain",
        "site": "Right lower quadrant",
        "onset": "2 days ago",
        "character": "Sharp",
        "radiation": "None",
        "timeCourse": "Constant",
        "exacerbatingFactors": "Movement",
        "relievingFactors": "Rest",
        "severity": 7,
        "importantPositives": ["Fever", "Nausea"],
        "importantNegatives": ["No vomiting", "No diarrhea"],
        "riskFactors": "Recent travel",
        "precipitants": "Heavy meal",
        "complications": "None",
        "progression": "Worsening",
        "impactOnFunction": "Unable to work",
        "previousTreatments": "Paracetamol",
        "relevantPastMedicalHistory": "No previous similar episodes"
      }
    ],
    "allergies": "None",
    "medications": "None",
    "treatmentsAfterAdmission": ["IV fluids", "IV antibiotics"],
    "testsAfterAdmission": ["Abdominal ultrasound", "CBC"]
  },
  "pastMedical": {
    "currentHealthStatus": "Generally healthy",
    "medications": [],
    "allergies": [],
    "childhoodIllnesses": [
      {
        "illness": "Measles",
        "ageAtIllness": "7",
        "complications": "None",
        "hospitalized": false
      }
    ],
    "chronicIllnesses": [],
    "acuteIllnesses": [
      {
        "illness": "Appendicitis",
        "date": "2022-04-10",
        "treatment": "Appendectomy",
        "complications": "None"
      }
    ],
    "surgeries": [
      {
        "type": "Appendectomy",
        "date": "2022-04-11",
        "location": "County Hospital",
        "complications": "None"
      }
    ],
    "accidentsInjuries": [],
    "hospitalizations": [
      {
        "reason": "Appendicitis",
        "hospital": "County Hospital",
        "date": "2022-04-10",
        "duration": "3 days"
      }
    ],
    "transfusions": [],
    "immunizations": [
      {
        "vaccine": "Tetanus",
        "date": "2020-10-01",
        "reaction": "None"
      }
    ],
    "psychiatricHistory": [],
    "screeningExams": [
      {
        "type": "Pap smear",
        "date": "2024-05-01",
        "result": "Normal"
      }
    ]
  },
  "obsGyn": {
    "gravidity": 2,
    "parity": {
      "term": 2,
      "preterm": 0,
      "abortions": 0,
      "living": 2
    },
    "pregnancies": [
      {
        "year": "2015",
        "durationWeeks": 39,
        "modeOfDelivery": "vaginal",
        "birthWeight": "3.2 kg",
        "gender": "Female",
        "complications": "None",
        "ART": "None",
        "placeOfDelivery": "County Hospital",
        "neonatalOutcome": "Healthy",
        "currentStatus": "Alive and well"
      },
      {
        "year": "2018",
        "durationWeeks": 38,
        "modeOfDelivery": "vaginal",
        "birthWeight": "3.0 kg",
        "gender": "Male",
        "complications": "None",
        "ART": "None",
        "placeOfDelivery": "County Hospital",
        "neonatalOutcome": "Healthy",
        "currentStatus": "Alive and well"
      }
    ],
    "currentPregnancy": {
      "isPregnant": false
    },
    "menstrualHistory": {
      "ageAtMenarche": 13,
      "ageAtMenopause": null,
      "cycleLengthDays": 28,
      "regularity": "Regular",
      "durationOfFlowDays": 5,
      "volume": "Normal",
      "LMP": "2025-06-01",
      "symptomsWithMenses": "Mild cramps",
      "menstrualAbnormalities": "None"
    },
    "sexualHistory": {
      "genderOfPartners": "Male",
      "concerns": "None",
      "contraceptiveUse": "Oral contraceptive pills",
      "sexualRiskBehaviors": "None",
      "historyOfSexualViolence": "None"
    },
    "gynecologicConditions": [],
    "infertilityHistory": {},
    "gynecologicProcedures": [],
    "screening": {
      "papSmear": {
        "date": "2024-05-01",
        "result": "Normal",
        "treatment": ""
      },
      "mammogram": {
        "date": "2024-06-01",
        "result": "Normal"
      }
    },
    "urinaryTractSymptoms": "None",
    "medicalHistory": "No chronic illnesses",
    "allergies": []
  },
  "familyHistory": {
    "relatives": [
      {
        "relation": "Mother",
        "age": 60,
        "ageAtDeath": null,
        "causeOfDeath": null,
        "ethnicity": "Kikuyu",
        "countryOfOrigin": "Kenya",
        "medicalConditions": [
          {
            "condition": "Hypertension",
            "ageAtOnset": 55,
            "details": "On medication"
          }
        ],
        "pregnancyComplications": "None",
        "healthHabits": "Non-smoker",
        "mentalIllness": "None",
        "learningDisabilities": "None",
        "birthDefects": "None"
      },
      {
        "relation": "Father",
        "age": 65,
        "ageAtDeath": null,
        "causeOfDeath": null,
        "ethnicity": "Kikuyu",
        "countryOfOrigin": "Kenya",
        "medicalConditions": [
          {
            "condition": "Diabetes Mellitus",
            "ageAtOnset": 60,
            "details": "Diet controlled"
          }
        ],
        "pregnancyComplications": "N/A",
        "healthHabits": "Non-smoker",
        "mentalIllness": "None",
        "learningDisabilities": "None",
        "birthDefects": "None"
      }
    ],
    "updatedAt": "2025-06-23T09:38:00.000Z"
  },
  "socialHistory": {
    "livingSituation": "With family",
    "housingType": "Apartment",
    "safetyConcerns": "None",
    "occupation": {
      "current": "Teacher",
      "past": "Student",
      "employmentStatus": "Employed",
      "workplaceExposures": "None"
    },
    "education": {
      "level": "University",
      "literacy": "Fluent",
      "languageProficiency": "English, Swahili"
    },
    "maritalStatus": "Married",
    "significantRelationships": "Husband",
    "childrenDependents": {
      "number": 2,
      "ages": [10, 7],
      "caregivingResponsibilities": "Mother"
    },
    "supportSystems": "Family, friends",
    "substanceUse": {
      "tobacco": {
        "status": "never",
        "quantity": "",
        "duration": "",
        "quitAttempts": 0
      },
      "alcohol": {
        "status": "occasional",
        "quantity": "1-2 drinks/week",
        "duration": "10 years",
        "quitAttempts": 0
      },
      "drugs": {
        "status": "never",
        "type": "",
        "quantity": "",
        "duration": "",
        "quitAttempts": 0
      },
      "caffeine": "2 cups coffee/day"
    },
    "diet": "Balanced",
    "exercise": "Jogging 3x/week",
    "sexualHistory": {
      "partners": "1",
      "practices": "Vaginal intercourse",
      "orientation": "Heterosexual",
      "contraception": "Oral contraceptive pills",
      "riskBehaviors": "None"
    },
    "travelHistory": "Visited Mombasa last month",
    "legalIssues": {
      "incarceration": false,
      "domesticViolence": false,
      "firearmsAtHome": false
    },
    "religiousCulturalBeliefs": "Christian",
    "financialStatus": {
      "abilityToPay": "Good",
      "insurance": "NHIF",
      "economicStressors": "None"
    },
    "hobbiesInterests": "Reading, gardening",
    "environmentalExposures": "None",
    "militaryService": {
      "veteran": false,
      "details": ""
    },
    "functionalStatus": {
      "activitiesOfDailyLiving": "Independent",
      "needForCarers": false,
      "mobilityAids": "None"
    }
  },
  "reviewOfSystems": {
    "cardiovascular": {
      "chestPain": false,
      "chestTightness": false,
      "palpitations": false,
      "shortnessOfBreath": false,
      "orthopnea": false,
      "paroxysmalNocturnalDyspnea": false,
      "peripheralEdema": false,
      "syncope": false,
      "dizziness": false,
      "claudication": false,
      "fatigue": false,
      "nocturnalCough": false,
      "cyanosis": false,
      "hemoptysis": false,
      "otherSymptoms": ""
    },
    "gastrointestinal": {
      "abdominalPain": true,
      "heartburn": false,
      "indigestion": false,
      "nausea": true,
      "vomiting": false,
      "lossOfAppetite": false,
      "difficultySwallowing": false,
      "painfulSwallowing": false,
      "bloating": false,
      "excessiveGas": false,
      "diarrhea": false,
      "constipation": false,
      "changeInBowelHabits": false,
      "bloodInStool": false,
      "blackTarryStools": false,
      "mucousInStool": false,
      "rectalPain": false,
      "tenesmus": false,
      "jaundice": false,
      "unintentionalWeightLoss": false,
      "hematemesis": false,
      "otherSymptoms": ""
    },
    "respiratory": {
      "cough": false,
      "productiveCough": false,
      "shortnessOfBreath": false,
      "difficultyBreathing": false,
      "wheezing": false,
      "chestPainWithBreathing": false,
      "chestTightness": false,
      "coughingUpBlood": false,
      "soreThroat": false,
      "hoarseness": false,
      "nasalCongestion": false,
      "runnyNose": false,
      "snoring": false,
      "sleepApnea": false,
      "stridor": false,
      "paroxysmalNocturnalDyspnea": false,
      "orthopnea": false,
      "nightSweats": false,
      "fever": false,
      "fatigue": false,
      "mucusProduction": false,
      "breathlessness": false,
      "chestDiscomfort": false,
      "grunting": false,
      "nasalFlaring": false,
      "retractions": false,
      "cyanosis": false,
      "otherSymptoms": ""
    },
    "renal": {
      "dysuria": false,
      "urinaryFrequency": false,
      "polyuria": false,
      "urgency": false,
      "nocturia": false,
      "hesitancy": false,
      "weakStream": false,
      "incontinence": false,
      "oliguria": false,
      "cloudyUrine": false,
      "hematuria": false,
      "passingStones": false,
      "flankPain": false,
      "groinPain": false,
      "edema": false,
      "frothyUrine": false,
      "dribbling": false,
      "painWithEjaculation": false,
      "pruritus": false,
      "fatigue": false,
      "nausea": false,
      "vomiting": false,
      "anorexia": false,
      "weightLoss": false,
      "alteredTaste": false,
      "confusion": false,
      "otherSymptoms": ""
    },
    "nervousSystem": {
      "headaches": false,
      "dizziness": false,
      "vertigo": false,
      "syncope": false,
      "seizures": false,
      "tremors": false,
      "numbness": false,
      "tingling": false,
      "weakness": false,
      "memoryLoss": false,
      "confusion": false,
      "balanceProblems": false,
      "coordinationProblems": false,
      "speechDifficulty": false,
      "visionChanges": false,
      "hearingLoss": false,
      "muscleTwitching": false,
      "lossOfSensation": false,
      "difficultySwallowing": false,
      "gaitProblems": false,
      "involuntaryMovements": false,
      "sleepDisturbances": false,
      "otherSymptoms": ""
    },
    "musculoskeletal": {
      "jointPain": false,
      "jointSwelling": false,
      "musclePain": false,
      "muscleStiffness": false,
      "muscleWeakness": false,
      "backPain": false,
      "neckPain": false,
      "restrictedMotion": false,
      "bonePain": false,
      "cramps": false,
      "burningSensation": false,
      "tingling": false,
      "painWithExercise": false,
      "changeInRingOrShoeSize": false,
      "footProblems": false,
      "sleepDisruptionDueToPain": false,
      "generalizedAching": false,
      "otherSymptoms": ""
    },
    "endocrine": {
      "fatigue": false,
      "weightGain": false,
      "weightLoss": false,
      "lossOfAppetite": false,
      "coldIntolerance": false,
      "heatIntolerance": false,
      "excessiveThirst": false,
      "excessiveHunger": false,
      "excessiveUrination": false,
      "excessiveSweating": false,
      "flushing": false,
      "heartRateChange": false,
      "menstrualChanges": false,
      "lossOfLibido": false,
      "infertility": false,
      "breastLeakage": false,
      "breastSwelling": false,
      "hotFlashes": false,
      "postmenopausalSymptoms": false,
      "visionChanges": false,
      "neckSwelling": false,
      "skinChanges": false,
      "abnormalHairLoss": false,
      "abnormalHairGrowth": false,
      "drySkin": false,
      "nailChanges": false,
      "easyBruising": false,
      "fractures": false,
      "decreasedHeight": false,
      "muscleAches": false,
      "tremors": false,
      "mentalFogginess": false,
      "depression": false,
      "anxiety": false,
      "otherSymptoms": ""
    },
    "hematological": {
      "easyBruising": false,
      "easyBleeding": false,
      "prolongedBleeding": false,
      "petechiae": false,
      "frequentInfections": false,
      "swollenLymphNodes": false,
      "lymphedema": false,
      "fatigue": false,
      "weakness": false,
      "shortnessOfBreath": false,
      "palpitations": false,
      "dizziness": false,
      "headaches": false,
      "fevers": false,
      "nightSweats": false,
      "weightLoss": false,
      "darkOrRedUrine": false,
      "bloodClots": false,
      "confusion": false,
      "otherSymptoms": ""
    }
  }
}

const dataj = JSON.stringify(data)

   async function post(data){    
   const history = new ImedHistory(data)
   await history.save().then(console.log("history saved")).catch(err=>{console.log(err)})
   }

post(data)