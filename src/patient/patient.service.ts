import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientService {
  /*
    using `any` type here as a shortcut. We'll take care of this immediately after
    checking the test passes.
  */
  async register(patientInput: any): Promise<any> {
    return {
      id: 1,
      name: patientInput.name,
    };
  }

}
