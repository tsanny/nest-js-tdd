import { Injectable } from '@nestjs/common';
import { Patient } from './patient.model';

export interface PatientInput {
  name: string;
}

Injectable()
export class PatientService {
  private readonly patients: Patient[] = [];

  async register(patientInput: PatientInput): Promise<Patient> {
    const newPatient = {
      id: this.patients.length + 1,
      name: patientInput.name,
    };

    this.patients.push(newPatient);

    return newPatient;
  }

  /* We will use the simplest solution possible and return a static false. */
  async doesPatientExist(patientId: number): Promise<boolean> {
    return this.patients.some((patient) => patient.id === patientId);
  }
}

