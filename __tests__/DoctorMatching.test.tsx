import { DoctorMatchingService } from '../src/services/doctorMatching.service';
import { DEMO_DOCTORS } from '../src/data/doctorsData';
import { CareConciergeState } from '../src/types/careConcierge.types';

describe('Appuge Care Concierge - Smart Matching Engine', () => {
  it('recommends IBCLC Lactation Specialist as featured for Newborn + Feeding support', () => {
    const state: CareConciergeState = {
      recipient: 'NEWBORN',
      careNeedId: 'feeding_support',
      careNeedTitle: 'Feeding support',
      optionalNote: '',
      modality: 'ONLINE',
      locality: 'ANY',
    };

    const results = DoctorMatchingService.matchConcierge(state, DEMO_DOCTORS);

    expect(results.featured).not.toBeNull();
    expect(results.featured?.doctor.id).toBe('doc-sneha');
    expect(results.featured?.doctor.specialityId).toBe('lactation');
    expect(results.featured?.matchReason).toContain('Lactation Specialist');
    expect(results.whyExplanation).toContain('newborn feeding support');
    expect(results.hasUrgentWarning).toBe(false);
  });

  it('recommends Senior Obstetrician as featured for Myself + Postpartum care', () => {
    const state: CareConciergeState = {
      recipient: 'MYSELF',
      careNeedId: 'postpartum_care',
      careNeedTitle: 'Postpartum care',
      optionalNote: '',
      modality: 'IN_CLINIC',
      locality: 'Koramangala',
    };

    const results = DoctorMatchingService.matchConcierge(state, DEMO_DOCTORS);

    expect(results.featured).not.toBeNull();
    expect(results.featured?.doctor.id).toBe('doc-meera');
    expect(results.featured?.doctor.specialityId).toBe('obstetrician');
    expect(results.featured?.matchReason).toContain('postpartum');
  });

  it('recommends Pediatric Dermatologist for Newborn + Baby skin concerns', () => {
    const state: CareConciergeState = {
      recipient: 'NEWBORN',
      careNeedId: 'baby_skin_concerns',
      careNeedTitle: 'Baby skin concerns',
      optionalNote: '',
      modality: 'EITHER',
      locality: 'ANY',
    };

    const results = DoctorMatchingService.matchConcierge(state, DEMO_DOCTORS);

    expect(results.featured).not.toBeNull();
    expect(results.featured?.doctor.id).toBe('doc-kavita');
    expect(results.featured?.doctor.specialityId).toBe('dermatologist');
  });

  it('recommends Child Nutritionist for Child + Nutrition and growth', () => {
    const state: CareConciergeState = {
      recipient: 'CHILD',
      careNeedId: 'nutrition_growth',
      careNeedTitle: 'Nutrition and growth',
      optionalNote: '',
      modality: 'EITHER',
      locality: 'ANY',
    };

    const results = DoctorMatchingService.matchConcierge(state, DEMO_DOCTORS);

    expect(results.featured).not.toBeNull();
    expect(results.featured?.doctor.id).toBe('doc-aravind');
  });

  it('detects urgent symptom keywords in optional note and triggers safety alert', () => {
    const state: CareConciergeState = {
      recipient: 'NEWBORN',
      careNeedId: 'newborn_health',
      careNeedTitle: 'Newborn health',
      optionalNote: 'Baby has fast breathing and seems lethargic',
      modality: 'ONLINE',
      locality: 'ANY',
    };

    const results = DoctorMatchingService.matchConcierge(state, DEMO_DOCTORS);

    expect(results.hasUrgentWarning).toBe(true);
    expect(results.urgentWarningMessage).toContain('112 / 108');
  });

  it('filters by in-clinic modality and handles empty doctors list gracefully', () => {
    const state: CareConciergeState = {
      recipient: 'PREGNANCY',
      careNeedId: 'pregnancy_care',
      careNeedTitle: 'Pregnancy care',
      optionalNote: '',
      modality: 'IN_CLINIC',
      locality: 'ANY',
    };

    const results = DoctorMatchingService.matchConcierge(state, []);

    expect(results.featured).toBeNull();
    expect(results.secondary.length).toBe(0);
    expect(results.recipientLabel).toBe('Pregnancy');
  });
});
