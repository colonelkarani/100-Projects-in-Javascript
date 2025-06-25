const diseaseSchema = require("../models/diseaseModel.js")
const patientSchema = require("../models/patientModel.js")

class Illness {
    constructor(patient, disease){
        this.patient = patient,
        this.disease = disease
    }
    show(){
        return this.#patient.vitals
    }
}

console.log( patientSchema.vitals)
console.log(typeof diseaseSchema)
