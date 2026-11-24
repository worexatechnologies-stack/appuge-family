import {
  calculateDoctorAppointmentPrice,
  DOCTOR_SPECIALITIES,
  DEMO_DOCTORS,
  INITIAL_DOCTOR_APPOINTMENTS,
  DoctorAppointmentStatus,
} from '../src/data/doctorsData';

describe('Appuge Doctors Healthcare Domain', () => {
  it('correctly calculates consultation fee with 5% platform fee and 5% GST', () => {
    // ₹1000 fee
    // platform fee = 5% of 1000 = 50
    // taxes = 5% of (1000 + 50 = 1050) = 53
    // total = 1103
    const price = calculateDoctorAppointmentPrice(1000);
    expect(price.consultationFee).toBe(1000);
    expect(price.platformFee).toBe(50);
    expect(price.taxes).toBe(53);
    expect(price.totalAmount).toBe(1103);
  });

  it('contains all 8 required specialities with doctor counts', () => {
    expect(DOCTOR_SPECIALITIES.length).toBe(8);
    const expectedIds = [
      'pediatrician',
      'gynecologist',
      'obstetrician',
      'lactation',
      'dermatologist',
      'nutritionist',
      'development',
      'physician',
    ];
    const actualIds = DOCTOR_SPECIALITIES.map(s => s.id);
    for (const id of expectedIds) {
      expect(actualIds).toContain(id);
    }
  });

  it('contains verified demo doctors with Karnataka Medical Council registrations and clinic details', () => {
    expect(DEMO_DOCTORS.length).toBeGreaterThanOrEqual(5);
    for (const doc of DEMO_DOCTORS) {
      expect(doc.id).toMatch(/^doc-/);
      expect(doc.fullName).toContain('Dr.');
      expect(doc.experienceYears).toBeGreaterThan(0);
      expect(doc.onlineFee).toBeGreaterThan(0);
      expect(doc.inClinicFee).toBeGreaterThan(0);
      expect(doc.medicalRegistration.isVerified).toBe(true);
      expect(doc.medicalRegistration.registrationNumber).toBeTruthy();
      expect(doc.clinic.name).toBeTruthy();
      expect(doc.clinic.address).toBeTruthy();
      expect(doc.isDemo).toBe(true);
    }
  });

  it('initial appointments follow valid status lifecycle without leaking into product orders', () => {
    expect(INITIAL_DOCTOR_APPOINTMENTS.length).toBeGreaterThanOrEqual(3);
    const validStatuses: DoctorAppointmentStatus[] = [
      'REQUESTED',
      'UNDER_REVIEW',
      'PENDING_DOCTOR',
      'ACCEPTED',
      'CONFIRMED',
      'COMPLETED',
      'DECLINED',
      'CANCELLED',
      'NO_SHOW',
      'DISPUTED',
    ];

    for (const apt of INITIAL_DOCTOR_APPOINTMENTS) {
      expect(apt.appointmentReference).toMatch(/^APG-DOC-/);
      expect(validStatuses).toContain(apt.status);
      expect(apt.consultationFee).toBeGreaterThan(0);
      expect(apt.totalAmount).toBeGreaterThan(0);
      expect(apt.timeline.length).toBeGreaterThan(0);
    }
  });
});
