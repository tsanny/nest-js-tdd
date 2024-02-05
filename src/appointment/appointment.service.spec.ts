import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
describe('AppointmentService', () => {
  let service: AppointmentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentService],
    }).compile();
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should schedule an unconfirmed appointment for a user on success', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T15:00:00Z');
    const newAppointment = service.scheduleAppointment({
      patientId: 1,
      startTime,
      endTime,
    });
    expect(newAppointment).toEqual({
      patientId: 1,
      startTime,
      endTime,
      confirmed: false,
    });
  });

  it('should throw an error when end time is before start time', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T13:00:00Z');

    /**
    * We have to wrap our "scheduleAppointment" function in another arrow function
    * because we expect an error to be thrown. If we don't do that,
    * Jest won't be able to properly handle the error and it will accuse that the test failed.
    */
    expect(() =>
      service.scheduleAppointment({
         patientId: 1,
         startTime,
         endTime,
      }),
    ).toThrow("appointment's endTime should be after startTime");
  });

  it('should throw an error when end time is equal to start time', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = startTime;

    /**
    * We have to wrap our "scheduleAppointment" function in another arrow function
    * because we expect an error to be thrown. If we don't do that,
    * Jest won't be able to properly handle the error and it will accuse that the test failed.
    */
    expect(() =>
      service.scheduleAppointment({
         patientId: 1,
         startTime,
         endTime,
      })
    ).toThrow("appointment's endTime should be after startTime");
  });
});

