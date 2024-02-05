import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { PatientService } from '../patient/patient.service';
import { PatientModule } from '../patient/patient.module';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let patientService: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PatientModule],
      providers: [AppointmentService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    patientService = module.get(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should schedule an unconfirmed appointment for a user on success', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T15:00:00Z');

    // Using the 'register' method to retrieve the new patient id
    const { id: patientId } = await patientService.register({
      name: 'John Doe',
    });

    const newAppointment = await service.scheduleAppointment({
      patientId,
      startTime,
      endTime,
    });

    expect(newAppointment).toEqual({
      patientId,
      startTime,
      endTime,
      confirmed: false,
    });
  });

  it('should throw an error when end time is before start time', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T13:00:00Z');

    await expect(
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).rejects.toThrow("appointment's endTime should be after startTime");
  });

  it('should throw an error when end time is equal to start time', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = startTime;

    await expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).rejects.toThrow("appointment's endTime should be after startTime");
  });

  it('should throw an error when end time is in the next day', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-02T14:00:00Z');

    await expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).rejects.toThrow("appointment's endTime should be in the same day as start time's");
  });

  it('should throw an error when end time is in the same day and hour of next month', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-02-01T14:00:00Z');

    await expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).rejects.toThrow("appointment's endTime should be in the same day as start time's");
  });

  it('should throw an error when the patient does not exist', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T15:00:00Z');
    
    await expect(
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      })
    ).rejects.toThrow('Patient does not exist');
  });
});

