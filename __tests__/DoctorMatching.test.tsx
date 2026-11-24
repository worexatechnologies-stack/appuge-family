import { DoctorMatchingService } from '../src/services/doctorMatching.service';
import { DEMO_DOCTORS } from '../src/data/doctorsData';
import { CareQuestionnaireAnswers } from '../src/types/careQuestionnaire.types';

describe('Doctor Matching Engine & Care Questionnaire Flow', () => {
  it('correctly matches lactation specialist for newborn feeding/latch issues', () => {
    const answers: CareQuestionnaireAnswers = {
      recipient: 'NEWBORN',
      newbornDetails: {
        ageGroup: '1_to_4_weeks',
        careNeeded: 'feeding_latch',
      },
      modalityPreference: 'ONLINE',
      localityPreference: 'ANY',
    };

    const output = DoctorMatchingService.matchDoctors(answers, DEMO_DOCTORS);

    expect(output.matches.length).toBeGreaterThan(0);
    // Top doctor should be Dr. Sneha (lactation)
    const topMatch = output.matches[0];
    expect(topMatch.doctor.id).toBe('doc-sneha');
    expect(topMatch.doctor.specialityId).toBe('lactation');
    expect(topMatch.matchScore).toBeGreaterThanOrEqual(90);
    expect(topMatch.primaryHighlight).toContain('Latch');
    expect(output.hasEmergencyNotice).toBe(true); // Newborn advisory
  });

  it('matches obstetrician for maternal postpartum recovery with pelvic floor focus', () => {
    const answers: CareQuestionnaireAnswers = {
      recipient: 'MYSELF',
      motherDetails: {
        supportArea: 'postpartum_recovery',
        deliveryTimeline: 'under_6_weeks',
        postpartumFocus: ['pelvic_floor', 'physical_recovery'],
      },
      modalityPreference: 'IN_CLINIC',
      localityPreference: 'Koramangala',
    };

    const output = DoctorMatchingService.matchDoctors(answers, DEMO_DOCTORS);

    expect(output.matches.length).toBeGreaterThan(0);
    const topMatch = output.matches[0];
    // Dr. Meera is Obstetrician in Koramangala
    expect(topMatch.doctor.id).toBe('doc-meera');
    expect(topMatch.matchScore).toBeGreaterThanOrEqual(90);
    expect(topMatch.matchReasons.some(r => r.includes('Koramangala'))).toBe(true);
  });

  it('matches pediatrician for newborn general checkup & colic', () => {
    const answers: CareQuestionnaireAnswers = {
      recipient: 'NEWBORN',
      newbornDetails: {
        ageGroup: '1_to_3_months',
        careNeeded: 'newborn_checkup',
      },
      modalityPreference: 'ANY',
      localityPreference: 'Indiranagar',
    };

    const output = DoctorMatchingService.matchDoctors(answers, DEMO_DOCTORS);

    expect(output.matches.length).toBeGreaterThan(0);
    const topMatch = output.matches[0];
    expect(topMatch.doctor.id).toBe('doc-radhika');
    expect(topMatch.matchScore).toBeGreaterThanOrEqual(90);
    expect(topMatch.primaryHighlight).toContain('Pediatrician');
  });

  it('matches child nutritionist or pediatrician for child nutrition concerns', () => {
    const answers: CareQuestionnaireAnswers = {
      recipient: 'CHILD',
      childDetails: {
        ageGroup: '2_to_5_years',
        concern: 'nutrition_eating',
      },
      modalityPreference: 'ANY',
      localityPreference: 'ANY',
    };

    const output = DoctorMatchingService.matchDoctors(answers, DEMO_DOCTORS);

    expect(output.matches.length).toBeGreaterThan(0);
    const doctorSpecialities = output.matches.map(m => m.doctor.specialityId);
    expect(doctorSpecialities).toContain('pediatrician');
  });

  it('triggers emergency risk notice for child high fever', () => {
    const answers: CareQuestionnaireAnswers = {
      recipient: 'CHILD',
      childDetails: {
        ageGroup: '1_to_2_years',
        concern: 'general_fever',
      },
      modalityPreference: 'ANY',
      localityPreference: 'ANY',
    };

    const output = DoctorMatchingService.matchDoctors(answers, DEMO_DOCTORS);
    expect(output.hasEmergencyNotice).toBe(true);
  });

  it('handles zero matches gracefully when no doctor fits ultra-restrictive criteria', () => {
    // Artificial test with empty doctors list
    const answers: CareQuestionnaireAnswers = {
      recipient: 'PREGNANCY',
      pregnancyDetails: {
        gestationStage: 'second_trimester',
        supportNeeded: 'routine_checkup',
      },
      modalityPreference: 'IN_CLINIC',
      localityPreference: 'Whitefield',
    };

    const output = DoctorMatchingService.matchDoctors(answers, []);
    expect(output.matches.length).toBe(0);
    expect(output.answersSummary.recipientLabel).toBe('Pregnancy Journey');
  });
});
