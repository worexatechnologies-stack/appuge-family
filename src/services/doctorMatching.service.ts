import { DEMO_DOCTORS, DoctorProfile } from '../data/doctorsData';
import {
  CareMatchingOutput,
  CareQuestionnaireAnswers,
  DoctorMatchResult,
} from '../types/careQuestionnaire.types';

export class DoctorMatchingService {
  /**
   * Matches doctors based on answers provided in the Care Questionnaire.
   * Only returns doctors that meet the clinical criteria and modality/locality filters.
   */
  public static matchDoctors(
    answers: CareQuestionnaireAnswers,
    allDoctors: DoctorProfile[] = DEMO_DOCTORS
  ): CareMatchingOutput {
    const results: DoctorMatchResult[] = [];

    // Filter verified doctors first
    const activeDoctors = allDoctors.filter(d => d.medicalRegistration?.isVerified);

    for (const doc of activeDoctors) {
      const matchData = this.calculateDoctorMatch(doc, answers);
      if (matchData && matchData.matchScore >= 65) {
        results.push(matchData);
      }
    }

    // Sort descending by score
    results.sort((a, b) => b.matchScore - a.matchScore);

    const summary = this.generateSummaryLabels(answers);
    const hasEmergency = this.checkEmergencyRisk(answers);

    return {
      matches: results,
      answersSummary: summary,
      hasEmergencyNotice: hasEmergency,
    };
  }

  private static calculateDoctorMatch(
    doc: DoctorProfile,
    answers: CareQuestionnaireAnswers
  ): DoctorMatchResult | null {
    let baseScore = 0;
    const reasons: string[] = [];
    let highlight = '';

    // 1. Modality check
    if (answers.modalityPreference === 'ONLINE') {
      if (!doc.consultationTypes.includes('ONLINE')) return null;
      reasons.push('Available for secure HD video consultation');
    } else if (answers.modalityPreference === 'IN_CLINIC') {
      if (!doc.consultationTypes.includes('IN_CLINIC')) return null;
      reasons.push(`In-clinic consultation available at ${doc.clinic.locality}`);
    }

    // 2. Locality alignment for In-Clinic
    if (answers.localityPreference !== 'ANY') {
      const docLocality = doc.clinic.locality.toLowerCase();
      const targetLocality = answers.localityPreference.toLowerCase();

      if (answers.modalityPreference === 'IN_CLINIC') {
        if (docLocality === targetLocality) {
          baseScore += 10;
          reasons.push(`Directly situated in ${answers.localityPreference}`);
        } else {
          // If in-clinic only and user requested specific locality, reduce score
          baseScore -= 15;
        }
      } else if (docLocality === targetLocality) {
        baseScore += 5;
      }
    }

    // 3. Clinical branching logic
    switch (answers.recipient) {
      case 'MYSELF': {
        const mother = answers.motherDetails;
        if (!mother) break;

        if (mother.supportArea === 'breastfeeding_lactation') {
          if (doc.specialityId === 'lactation') {
            baseScore += 85;
            highlight = 'Certified IBCLC Lactation Specialist';
            reasons.push('Direct expertise in gentle latch, milk supply restoration & engorgement relief');
          } else if (doc.specialityId === 'pediatrician') {
            baseScore += 50;
            reasons.push('Pediatric infant feeding guidance');
          }
        } else if (mother.supportArea === 'skin_hair') {
          if (doc.specialityId === 'dermatologist') {
            baseScore += 85;
            highlight = 'Maternal & Postpartum Skin Specialist';
            reasons.push('Specialized in postpartum hair shed, skin barrier restoration & melasma');
          }
        } else if (mother.supportArea === 'nutrition_energy') {
          if (doc.specialityId === 'nutritionist') {
            baseScore += 85;
            highlight = 'Maternal Nutrition & Vitality Expert';
            reasons.push('Specialized in postpartum galactagogues, energy restoration and holistic diets');
          } else if (doc.specialityId === 'obstetrician' || doc.specialityId === 'physician') {
            baseScore += 65;
            reasons.push('Postpartum recovery & nutritional oversight');
          }
        } else if (
          mother.supportArea === 'postpartum_recovery' ||
          mother.supportArea === 'womens_health'
        ) {
          if (doc.specialityId === 'obstetrician' || doc.specialityId === 'gynecologist') {
            baseScore += 85;
            highlight = 'Maternal Health & Pelvic Healing Specialist';
            reasons.push('Experienced in C-section/episiotomy healing, pelvic floor assessment and hormonal balance');
          } else if (doc.specialityId === 'physician') {
            baseScore += 65;
            reasons.push('Post-discharge maternal physical check & vitals monitoring');
          }
        } else {
          // general_wellness
          if (doc.specialityId === 'physician') {
            baseScore += 80;
            highlight = 'Family Wellness & Preventative Care';
            reasons.push('Comprehensive health check, postpartum vitality & family guidance');
          } else if (doc.specialityId === 'obstetrician') {
            baseScore += 65;
            reasons.push('Specialized maternal well-being check');
          }
        }

        // Postpartum focus tags matching
        if (mother.postpartumFocus && mother.postpartumFocus.length > 0) {
          if (mother.postpartumFocus.includes('pelvic_floor') && (doc.specialityId === 'obstetrician' || doc.specialityId === 'gynecologist')) {
            baseScore += 5;
            reasons.push('Targeted pelvic floor recovery');
          }
          if (mother.postpartumFocus.includes('breastfeeding') && doc.specialityId === 'lactation') {
            baseScore += 5;
          }
        }
        break;
      }

      case 'PREGNANCY': {
        const preg = answers.pregnancyDetails;
        if (!preg) break;

        if (doc.specialityId === 'obstetrician' || doc.specialityId === 'gynecologist') {
          baseScore += 90;
          highlight = 'Senior Obstetrician & Antenatal Specialist';
          reasons.push('Comprehensive trimester tracking, growth scans & safe birth planning');

          if (preg.supportNeeded === 'high_risk') {
            baseScore += 5;
            reasons.push('Specialized experience in high-risk antenatal care');
          }
        } else if (preg.supportNeeded === 'nutrition_diet' && doc.specialityId === 'nutritionist') {
          baseScore += 80;
          highlight = 'Pregnancy Nutrition Consultant';
          reasons.push('Personalized antenatal nourishment plans for mother & baby');
        }
        break;
      }

      case 'NEWBORN': {
        const nb = answers.newbornDetails;
        if (!nb) break;

        if (nb.careNeeded === 'feeding_latch') {
          if (doc.specialityId === 'lactation') {
            baseScore += 90;
            highlight = 'IBCLC Infant Feeding & Latch Specialist';
            reasons.push('Specialized in gentle newborn latch, tongue-tie assessment & nipple comfort');
          } else if (doc.specialityId === 'pediatrician') {
            baseScore += 65;
            reasons.push('Newborn oral exam & infant digestion review');
          }
        } else if (nb.careNeeded === 'skin_rash') {
          if (doc.specialityId === 'dermatologist') {
            baseScore += 90;
            highlight = 'Pediatric Dermatologist';
            reasons.push('Specialist for cradle cap, infantile eczema & sensitive skin barriers');
          } else if (doc.specialityId === 'pediatrician') {
            baseScore += 70;
            reasons.push('Pediatric skin & rash evaluation');
          }
        } else {
          // newborn_checkup, sleep_patterns, growth_weight, vaccination, general_pediatric
          if (doc.specialityId === 'pediatrician') {
            baseScore += 90;
            highlight = 'Neonatal & Infant Care Pediatrician';
            reasons.push('Expert in newborn transition, colic calming, weight curves & immunization');
          }
        }
        break;
      }

      case 'CHILD': {
        const child = answers.childDetails;
        if (!child) break;

        if (child.concern === 'nutrition_eating') {
          if (doc.specialityId === 'nutritionist') {
            baseScore += 90;
            highlight = 'Pediatric Nutritionist';
            reasons.push('Specialized in toddler feeding resistance, growth plates & nutrient balancing');
          } else if (doc.specialityId === 'pediatrician') {
            baseScore += 75;
            reasons.push('Pediatric growth & dietary oversight');
          }
        } else if (child.concern === 'skin_conditions') {
          if (doc.specialityId === 'dermatologist') {
            baseScore += 90;
            highlight = 'Pediatric Dermatologist';
            reasons.push('Treatment of childhood atopic eczema, molluscum & sensitive skin allergies');
          } else if (doc.specialityId === 'pediatrician') {
            baseScore += 65;
            reasons.push('Pediatric skin check');
          }
        } else if (child.concern === 'development_speech') {
          if (doc.specialityId === 'development') {
            baseScore += 90;
            highlight = 'Child Development Specialist';
            reasons.push('Expert in speech milestones, fine motor progress & sensory integration');
          } else if (doc.specialityId === 'pediatrician') {
            baseScore += 70;
            reasons.push('Milestone evaluation & developmental guidance');
          }
        } else {
          // general_fever, routine_vaccination, specialist_eval
          if (doc.specialityId === 'pediatrician') {
            baseScore += 90;
            highlight = 'Senior Pediatrician';
            reasons.push('Complete childhood health assessment, fever diagnosis & gentle clinical care');
          } else if (doc.specialityId === 'physician') {
            baseScore += 65;
            reasons.push('Family clinical consultation');
          }
        }
        break;
      }
    }

    if (baseScore < 60) return null;

    // Doctor rating boost (e.g. 4.96 gives +5)
    if (doc.rating >= 4.9) {
      baseScore += 5;
    }

    const finalScore = Math.min(Math.round(baseScore), 99);

    return {
      doctor: doc,
      matchScore: finalScore,
      matchReasons: reasons.slice(0, 3),
      primaryHighlight: highlight || doc.specialityTitle,
    };
  }

  private static generateSummaryLabels(answers: CareQuestionnaireAnswers) {
    let recipientLabel = 'Care';
    let focusLabel = 'General Health';
    let stageOrAgeLabel = 'All Ages';

    switch (answers.recipient) {
      case 'MYSELF':
        recipientLabel = 'Mother / Myself';
        if (answers.motherDetails) {
          const areaMap: Record<string, string> = {
            postpartum_recovery: 'Postpartum Recovery',
            womens_health: "Women's Health",
            breastfeeding_lactation: 'Breastfeeding & Lactation',
            nutrition_energy: 'Nourishment & Energy',
            skin_hair: 'Skin & Hair Wellness',
            general_wellness: 'General Wellness',
          };
          focusLabel = areaMap[answers.motherDetails.supportArea] || 'Maternal Care';

          const timelineMap: Record<string, string> = {
            currently_pregnant: 'Currently Pregnant',
            under_6_weeks: 'Delivered < 6 Weeks ago',
            '6_weeks_to_3_months': 'Delivered 6w – 3m ago',
            '3_to_6_months': 'Delivered 3 – 6m ago',
            over_6_months: 'Delivered > 6m ago',
            not_applicable: 'Not Applicable',
          };
          stageOrAgeLabel = timelineMap[answers.motherDetails.deliveryTimeline] || 'Postpartum';
        }
        break;

      case 'PREGNANCY':
        recipientLabel = 'Pregnancy Journey';
        if (answers.pregnancyDetails) {
          const stageMap: Record<string, string> = {
            planning: 'Planning Conception',
            first_trimester: '1st Trimester (1–12w)',
            second_trimester: '2nd Trimester (13–27w)',
            third_trimester: '3rd Trimester (28w+)',
            not_sure: 'Pregnancy Support',
          };
          stageOrAgeLabel = stageMap[answers.pregnancyDetails.gestationStage] || 'Antenatal';

          const supportMap: Record<string, string> = {
            routine_checkup: 'Routine Check-up',
            nutrition_diet: 'Nutrition & Diet',
            ultrasound_scans: 'Scans & Diagnostics',
            pregnancy_concerns: 'Pregnancy Concerns',
            high_risk: 'High-Risk Consultation',
            general_guidance: 'General Guidance',
          };
          focusLabel = supportMap[answers.pregnancyDetails.supportNeeded] || 'Antenatal Care';
        }
        break;

      case 'NEWBORN':
        recipientLabel = 'Newborn Baby';
        if (answers.newbornDetails) {
          const ageMap: Record<string, string> = {
            '0_to_7_days': '0 to 7 Days Old',
            '1_to_4_weeks': '1 to 4 Weeks Old',
            '1_to_3_months': '1 to 3 Months Old',
            '3_to_6_months': '3 to 6 Months Old',
            '6_to_12_months': '6 to 12 Months Old',
          };
          stageOrAgeLabel = ageMap[answers.newbornDetails.ageGroup] || 'Infant';

          const careMap: Record<string, string> = {
            newborn_checkup: 'Newborn Check-up',
            feeding_latch: 'Feeding & Latch Care',
            sleep_patterns: 'Sleep & Rhythm',
            skin_rash: 'Skin Rash & Cradle Cap',
            growth_weight: 'Growth & Weight Curves',
            vaccination: 'Immunization Schedule',
            general_pediatric: 'General Pediatric Care',
          };
          focusLabel = careMap[answers.newbornDetails.careNeeded] || 'Newborn Care';
        }
        break;

      case 'CHILD':
        recipientLabel = 'Child Care';
        if (answers.childDetails) {
          const ageMap: Record<string, string> = {
            '1_to_2_years': '1 to 2 Years Old',
            '2_to_5_years': '2 to 5 Years Old',
            '6_to_10_years': '6 to 10 Years Old',
            over_10_years: 'Older than 10 Years',
          };
          stageOrAgeLabel = ageMap[answers.childDetails.ageGroup] || 'Child';

          const concernMap: Record<string, string> = {
            general_fever: 'General Illness / Fever',
            nutrition_eating: 'Nutrition & Eating Habits',
            skin_conditions: 'Skin Conditions',
            development_speech: 'Development & Milestones',
            routine_vaccination: 'Routine Vaccination',
            specialist_eval: 'Specialist Evaluation',
          };
          focusLabel = concernMap[answers.childDetails.concern] || 'Child Wellness';
        }
        break;
    }

    const modalityLabel =
      answers.modalityPreference === 'ONLINE'
        ? 'Online Video'
        : answers.modalityPreference === 'IN_CLINIC'
        ? 'In-Clinic Visit'
        : 'Online or In-Clinic';

    const localityLabel =
      answers.localityPreference === 'ANY'
        ? 'Any Bengaluru Location'
        : answers.localityPreference;

    return {
      recipientLabel,
      focusLabel,
      stageOrAgeLabel,
      modalityLabel,
      localityLabel,
    };
  }

  private static checkEmergencyRisk(answers: CareQuestionnaireAnswers): boolean {
    if (answers.recipient === 'NEWBORN') {
      // Newborns always have high vulnerability advisory
      return true;
    }
    if (answers.recipient === 'CHILD' && answers.childDetails?.concern === 'general_fever') {
      return true;
    }
    return false;
  }
}
