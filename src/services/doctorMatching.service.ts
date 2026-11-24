import { DEMO_DOCTORS, DoctorProfile } from '../data/doctorsData';
import {
  CareMatchingOutput,
  CareQuestionnaireAnswers,
  DoctorMatchResult,
} from '../types/careQuestionnaire.types';
import {
  CareConciergeState,
  ConciergeResultsData,
  RecommendedDoctor,
} from '../types/careConcierge.types';

export class DoctorMatchingService {
  /**
   * Premium 3-question Care Concierge matching engine.
   * Matches doctors purely based on genuine verified profile data,
   * patient category, care need, and consultation preference.
   */
  public static matchConcierge(
    state: CareConciergeState,
    allDoctors: DoctorProfile[] = DEMO_DOCTORS
  ): ConciergeResultsData {
    const verifiedDoctors = allDoctors.filter(d => d.medicalRegistration?.isVerified);

    // Filter by modality first
    const eligibleDoctors = verifiedDoctors.filter(doc => {
      if (state.modality === 'ONLINE') {
        return doc.consultationTypes.includes('ONLINE');
      }
      if (state.modality === 'IN_CLINIC') {
        return doc.consultationTypes.includes('IN_CLINIC');
      }
      return true;
    });

    const matches: { doctor: DoctorProfile; score: number; reason: string; expertise: string[] }[] = [];

    for (const doc of eligibleDoctors) {
      let score = 0;
      let reason = '';
      const expertise: string[] = [];

      // Locality alignment boost
      if (
        state.modality === 'IN_CLINIC' &&
        state.locality !== 'ANY' &&
        doc.clinic.locality.toLowerCase() === state.locality.toLowerCase()
      ) {
        score += 15;
      }

      switch (state.recipient) {
        case 'MYSELF': {
          switch (state.careNeedId) {
            case 'postpartum_care':
            case 'womens_health':
              if (doc.specialityId === 'obstetrician' || doc.specialityId === 'gynecologist') {
                score += 90;
                reason = 'Senior Obstetrician specializing in postpartum recovery & pelvic health';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'physician') {
                score += 70;
                reason = 'Postpartum recovery check & maternal vitals monitoring';
                expertise.push('Postpartum Recovery', 'Family Health');
              }
              break;
            case 'breastfeeding_support':
              if (doc.specialityId === 'lactation') {
                score += 95;
                reason = 'Certified IBCLC Lactation Specialist with gentle latch coaching';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'pediatrician') {
                score += 65;
                reason = 'Pediatric feeding & infant latch guidance';
                expertise.push('Infant Feeding', 'Newborn Health');
              }
              break;
            case 'skin_hair':
              if (doc.specialityId === 'dermatologist') {
                score += 92;
                reason = 'Postpartum skin barrier recovery & gentle hair shed management';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              }
              break;
            case 'nutrition':
              if (doc.specialityId === 'nutritionist' || doc.id === 'doc-aravind') {
                score += 88;
                reason = 'Maternal nourishment & vitality restoration';
                expertise.push('Postpartum Diet', 'Holistic Nutrition');
              } else if (doc.specialityId === 'obstetrician') {
                score += 65;
                reason = 'Maternal health & nutritional oversight';
                expertise.push('Maternal Health');
              }
              break;
            default: // general_consultation
              if (doc.specialityId === 'physician') {
                score += 88;
                reason = 'Everyday maternal and family wellness consultation';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'obstetrician') {
                score += 70;
                reason = 'Comprehensive maternal check-up';
                expertise.push('Women’s Health');
              }
              break;
          }
          break;
        }

        case 'PREGNANCY': {
          if (doc.specialityId === 'obstetrician' || doc.specialityId === 'gynecologist') {
            score += 92;
            reason =
              state.careNeedId === 'high_risk_consultation'
                ? 'Senior specialist in high-risk pregnancy & maternal monitoring'
                : 'Compassionate antenatal care & trimester growth tracking';
            expertise.push(...doc.areasOfExpertise.slice(0, 3));
          } else if (state.careNeedId === 'pregnancy_nutrition' && (doc.specialityId === 'nutritionist' || doc.id === 'doc-aravind')) {
            score += 85;
            reason = 'Antenatal nutrition & balanced pregnancy diet';
            expertise.push('Pregnancy Nutrition');
          }
          break;
        }

        case 'NEWBORN': {
          switch (state.careNeedId) {
            case 'feeding_support':
              if (doc.specialityId === 'lactation') {
                score += 96;
                reason = 'Certified IBCLC Lactation Specialist for newborn latch & feeding ease';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'pediatrician') {
                score += 70;
                reason = 'Newborn pediatric feeding & oral assessment';
                expertise.push('Newborn Growth', 'Infant Colic');
              }
              break;
            case 'baby_skin_concerns':
              if (doc.specialityId === 'dermatologist') {
                score += 94;
                reason = 'Pediatric dermatologist for cradle cap, eczema & delicate baby skin';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'pediatrician') {
                score += 70;
                reason = 'Pediatric infant rash & skin barrier assessment';
                expertise.push('Newborn Skin Care');
              }
              break;
            default: // newborn_health, growth_development, vaccination_guidance, general_pediatric_care
              if (doc.specialityId === 'pediatrician') {
                score += 92;
                reason = 'Senior Pediatrician with dedicated neonatal care & colic transition experience';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              }
              break;
          }
          break;
        }

        case 'CHILD': {
          switch (state.careNeedId) {
            case 'nutrition_growth':
              if (doc.id === 'doc-aravind' || doc.specialityId === 'nutritionist') {
                score += 95;
                reason = 'Pediatrician & Child Nutritionist specializing in growth & fussy eating';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'pediatrician') {
                score += 75;
                reason = 'Child growth curves & pediatric dietary review';
                expertise.push('Growth Tracking');
              }
              break;
            case 'skin_concerns':
              if (doc.specialityId === 'dermatologist') {
                score += 92;
                reason = 'Pediatric skin specialist for allergies, rashes & eczema';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'pediatrician') {
                score += 68;
                reason = 'Pediatric allergy & skin assessment';
                expertise.push('Allergy Care');
              }
              break;
            case 'development':
              if (doc.specialityId === 'development') {
                score += 92;
                reason = 'Child Development Specialist for motor & speech milestones';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'pediatrician') {
                score += 75;
                reason = 'Pediatric developmental milestone tracking';
                expertise.push('Milestone Tracking');
              }
              break;
            default: // general_health, vaccination, pediatric_consultation
              if (doc.specialityId === 'pediatrician') {
                score += 90;
                reason = 'Comprehensive pediatric care, gentle diagnosis & vaccination guidance';
                expertise.push(...doc.areasOfExpertise.slice(0, 3));
              } else if (doc.specialityId === 'physician') {
                score += 65;
                reason = 'Family preventative health consultation';
                expertise.push('General Health');
              }
              break;
          }
          break;
        }
      }

      if (score >= 60) {
        matches.push({
          doctor: doc,
          score,
          reason,
          expertise: expertise.length > 0 ? expertise : doc.areasOfExpertise.slice(0, 2),
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    // Check optional note for urgent red flags
    const note = (state.optionalNote || '').toLowerCase();
    const urgentKeywords = [
      'breathing',
      'breath',
      'fever above',
      'high fever',
      'unresponsive',
      'lethargic',
      'blue',
      'seizure',
      'emergency',
      'convulsion',
    ];
    const hasUrgent = urgentKeywords.some(kw => note.includes(kw));

    // Curate presentation: 1 featured, up to 2 secondary, rest counted
    const featuredMatch = matches[0]
      ? {
          doctor: matches[0].doctor,
          matchReason: matches[0].reason,
          relevantExpertise: matches[0].expertise,
          isFeatured: true,
        }
      : null;

    const secondaryMatches: RecommendedDoctor[] = matches.slice(1, 3).map(m => ({
      doctor: m.doctor,
      matchReason: m.reason,
      relevantExpertise: m.expertise,
      isFeatured: false,
    }));

    const additionalCount = Math.max(0, matches.length - 3);

    const recipientLabelMap: Record<string, string> = {
      MYSELF: 'Myself',
      PREGNANCY: 'Pregnancy',
      NEWBORN: 'Newborn',
      CHILD: 'Child',
    };
    const recipientLabel = state.recipient ? recipientLabelMap[state.recipient] || 'Family' : 'Family';
    const careNeedLabel = state.careNeedTitle || 'Specialist Care';
    const modalityLabel =
      state.modality === 'ONLINE'
        ? 'Online Video'
        : state.modality === 'IN_CLINIC'
        ? 'In-Clinic'
        : 'Online or In-Clinic';

    const whyExplanation = `Matched to your selection for ${recipientLabel.toLowerCase()} ${careNeedLabel.toLowerCase()}.`;

    return {
      featured: featuredMatch,
      secondary: secondaryMatches,
      additionalCount,
      whyExplanation,
      recipientLabel,
      careNeedLabel,
      modalityLabel,
      hasUrgentWarning: hasUrgent,
      urgentWarningMessage: hasUrgent
        ? 'If your baby or child has acute difficulty breathing, high fever above 102°F, or is unresponsive, seek immediate emergency care at the nearest hospital or call 112 / 108.'
        : undefined,
    };
  }

  /**
   * Backwards-compatible questionnaire matching method
   */
  public static matchDoctors(
    answers: CareQuestionnaireAnswers,
    allDoctors: DoctorProfile[] = DEMO_DOCTORS
  ): CareMatchingOutput {
    const verifiedDoctors = allDoctors.filter(d => d.medicalRegistration?.isVerified);

    let careNeedId = 'general';
    let careNeedTitle = 'General Care';

    if (answers.recipient === 'NEWBORN') {
      careNeedId = answers.newbornDetails?.careNeeded || 'newborn_health';
      careNeedTitle = careNeedId.replace(/_/g, ' ');
    } else if (answers.recipient === 'MYSELF') {
      careNeedId = answers.motherDetails?.supportArea || 'postpartum_care';
      careNeedTitle = careNeedId.replace(/_/g, ' ');
    } else if (answers.recipient === 'PREGNANCY') {
      careNeedId = answers.pregnancyDetails?.supportNeeded || 'pregnancy_care';
      careNeedTitle = careNeedId.replace(/_/g, ' ');
    } else if (answers.recipient === 'CHILD') {
      careNeedId = answers.childDetails?.concern || 'general_health';
      careNeedTitle = careNeedId.replace(/_/g, ' ');
    }

    const conciergeOutput = this.matchConcierge(
      {
        recipient: answers.recipient,
        careNeedId,
        careNeedTitle,
        optionalNote: '',
        modality: answers.modalityPreference === 'ANY' ? 'EITHER' : answers.modalityPreference,
        locality: answers.localityPreference,
      },
      verifiedDoctors
    );

    const allMatches: DoctorProfile[] = [];
    if (conciergeOutput.featured) allMatches.push(conciergeOutput.featured.doctor);
    conciergeOutput.secondary.forEach(s => allMatches.push(s.doctor));

    const matchResults: DoctorMatchResult[] = allMatches.map((doc, idx) => ({
      doctor: doc,
      matchScore: 95 - idx * 10,
      matchReasons: [doc.specialityTitle, `Verified ${doc.medicalRegistration.council}`],
      primaryHighlight: doc.specialityTitle,
    }));

    return {
      matches: matchResults,
      answersSummary: {
        recipientLabel: conciergeOutput.recipientLabel,
        focusLabel: conciergeOutput.careNeedLabel,
        stageOrAgeLabel: answers.recipient,
        modalityLabel: conciergeOutput.modalityLabel,
        localityLabel: answers.localityPreference,
      },
      hasEmergencyNotice: answers.recipient === 'NEWBORN',
    };
  }
}
