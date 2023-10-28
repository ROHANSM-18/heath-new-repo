const Patient = require('../../models/patients');
const Doctor = require('../../models/doctors');
const User = require('../../models/users'); // Replace with the actual model name

const addDoctorToPatient = async (_, { input }) => {
  try {
    const { DoctorID, PatientID } = input;

    console.log('Received DoctorID:', DoctorID);
    console.log('Received PatientID:', PatientID);

    // Fetch the patient and include the associated doctor and user
    const patient = await Patient.findByPk(PatientID, {
        include: Doctor, 
        include: User
    });

    if (!patient) {
      throw new Error('Patient not found.');
    }

    if (!patient.Doctor) {
      const doctor = await Doctor.findByPk(DoctorID);
      if (!doctor) {
        throw new Error('Doctor not found.');
      }

      patient.Doctor = doctor; 
    }

    await patient.save();

    return patient;
  } catch (error) {
    console.error('Error adding doctor to patient:', error);
    throw new Error(`Failed to add doctor to patient: ${error.message}`);
  }
};

module.exports = addDoctorToPatient;