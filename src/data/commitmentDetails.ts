export type CommitmentDetailId =
  | 'background-checks'
  | 'health-screened'
  | 'professionally-trained'
  | 'compassionately-matched';

export interface CommitmentDetail {
  id: CommitmentDetailId;
  title: string;
  introduction: string;
  overview: string;
  sections: {
    title: string;
    description: string;
    steps: string[];
  }[];
  familyBenefits: string[];
}

export const COMMITMENT_DETAILS: Record<CommitmentDetailId, CommitmentDetail> =
  {
    'background-checks': {
      id: 'background-checks',
      title: 'Thorough Background Checks',
      introduction:
        'Trust begins before a caregiver enters your home. Our screening process is designed to help families make informed, confident care decisions.',
      overview:
        'Each candidate goes through a structured review before being considered for a family placement. We verify identity, review relevant history, and speak with people who can share first-hand experience of their work.',
      sections: [
        {
          title: 'Identity and address verification',
          description:
            'We confirm a candidate’s identity and the details needed to establish a clear, accountable profile.',
          steps: [
            'Review valid identity documentation and confirm the candidate’s details.',
            'Check address information and record verified contact details.',
            'Keep screening records securely as part of the placement process.',
          ],
        },
        {
          title: 'Police background checks',
          description:
            'Appropriate police or criminal background checks are completed before placement, in line with applicable local processes.',
          steps: [
            'Request the relevant background check for the candidate.',
            'Review the result before moving forward with a placement.',
            'Discuss any information that requires clarification as part of the screening decision.',
          ],
        },
        {
          title: 'Previous employment verification',
          description:
            'We review a candidate’s work history to better understand their experience and professional record.',
          steps: [
            'Confirm previous roles and employment timelines where possible.',
            'Understand the care responsibilities the candidate has handled.',
            'Resolve gaps or inconsistencies before the candidate is considered.',
          ],
        },
        {
          title: 'Reference checks and safety procedures',
          description:
            'References add practical context to a candidate’s work history, while clear safety procedures set expectations for the placement.',
          steps: [
            'Speak with previous employers or family references when available.',
            'Confirm communication, reliability, and suitability for in-home care.',
            'Explain household boundaries, reporting channels, and how to raise a concern.',
          ],
        },
      ],
      familyBenefits: [
        'A clearer picture of a caregiver’s identity and work history.',
        'A screening process completed before a family placement.',
        'Defined expectations and a channel for raising concerns.',
      ],
    },
    'health-screened': {
      id: 'health-screened',
      title: 'Health Screened',
      introduction:
        'A thoughtful care environment starts with attention to health, hygiene, and everyday wellbeing—for caregivers and the families they support.',
      overview:
        'Health screening helps establish that a caregiver is ready for in-home work and understands the hygiene practices expected in a household with a mother and newborn.',
      sections: [
        {
          title: 'Medical examinations',
          description:
            'Candidates complete a health assessment as part of the pre-placement process.',
          steps: [
            'Arrange an appropriate medical examination before placement.',
            'Review relevant fitness-to-work information while respecting personal privacy.',
            'Discuss any care-related considerations that may affect the placement.',
          ],
        },
        {
          title: 'Health certificates',
          description:
            'Health documentation supports a clear and accountable screening record.',
          steps: [
            'Collect applicable health certificates or examination records.',
            'Check that documents are current for the intended placement.',
            'Explain any documentation requirements to the caregiver and family.',
          ],
        },
        {
          title: 'Everyday hygiene standards',
          description:
            'Consistent hygiene routines are especially important when caring for a newborn or supporting a recovering mother.',
          steps: [
            'Follow careful handwashing before care tasks and after hygiene routines.',
            'Maintain clean clothing and a tidy approach to care essentials.',
            'Keep feeding, changing, and household care items clean and appropriately handled.',
          ],
        },
        {
          title: 'Ongoing health monitoring',
          description:
            'Health readiness is considered throughout the relationship, not only on the first day.',
          steps: [
            'Encourage caregivers to report illness or changes that may affect safe care.',
            'Review health documentation at appropriate intervals.',
            'Keep families informed about relevant placement or hygiene considerations.',
          ],
        },
      ],
      familyBenefits: [
        'Health information considered before care begins.',
        'Clear hygiene expectations for day-to-day routines.',
        'A practical approach to illness reporting and follow-up.',
      ],
    },
    'professionally-trained': {
      id: 'professionally-trained',
      title: 'Professionally Trained',
      introduction:
        'Confident care combines practical skills with patience, clear communication, and respect for each family’s way of doing things.',
      overview:
        'Caregivers receive preparation for maternal and newborn support, household safety, and professional conduct. Training helps them understand their responsibilities and when to seek guidance.',
      sections: [
        {
          title: 'Caregiver onboarding',
          description:
            'A structured introduction builds a shared understanding of role expectations and respectful in-home care.',
          steps: [
            'Review the caregiver’s responsibilities and family-specific routines.',
            'Practice clear, considerate communication with parents and family members.',
            'Set professional boundaries, privacy expectations, and escalation channels.',
          ],
        },
        {
          title: 'Maternal care',
          description:
            'Caregivers learn how to offer practical, compassionate support while respecting the mother’s preferences and care plan.',
          steps: [
            'Support comfort, rest, and agreed household routines.',
            'Follow the family’s instructions and any guidance provided by healthcare professionals.',
            'Recognize when a concern should be shared promptly with the family or a clinician.',
          ],
        },
        {
          title: 'Newborn care',
          description:
            'Preparation focuses on gentle handling, attentive observation, and careful everyday care.',
          steps: [
            'Use safe, attentive handling during routine care.',
            'Follow family-led feeding, changing, and soothing instructions.',
            'Maintain clean care items and observe the baby’s comfort and routine.',
          ],
        },
        {
          title: 'Safety and professional skills',
          description:
            'Practical safety awareness and reliable communication help care remain consistent at home.',
          steps: [
            'Keep the care area organized and reduce avoidable household hazards.',
            'Share routine updates clearly and promptly with the family.',
            'Work within the caregiver’s role and seek professional medical advice when needed.',
          ],
        },
      ],
      familyBenefits: [
        'Care aligned with the family’s routines and preferences.',
        'A clear understanding of caregiver responsibilities and boundaries.',
        'Attentive communication when a family needs to make a care decision.',
      ],
    },
    'compassionately-matched': {
      id: 'compassionately-matched',
      title: 'Compassionately Matched',
      introduction:
        'The right match feels considered, not assigned. We take time to understand your family, your home, and the kind of support that feels right.',
      overview:
        'Personalized matching brings together a family’s care needs and preferences with a caregiver’s experience, availability, and approach. The goal is a respectful working relationship from the beginning.',
      sections: [
        {
          title: 'Understanding your family',
          description:
            'We begin by listening to what matters to you and the support you are looking for.',
          steps: [
            'Discuss maternal and newborn care needs, timing, and household routines.',
            'Learn about language, communication, and cultural preferences.',
            'Note practical requirements such as schedule, location, and household expectations.',
          ],
        },
        {
          title: 'Selecting a suitable caregiver',
          description:
            'A potential match is considered in context, rather than by availability alone.',
          steps: [
            'Compare the family’s requirements with the caregiver’s relevant experience.',
            'Consider schedule fit, communication style, and care preferences.',
            'Share the proposed caregiver profile so the family can make an informed choice.',
          ],
        },
        {
          title: 'Personalized introduction',
          description:
            'A clear introduction gives both the family and caregiver an opportunity to align expectations.',
          steps: [
            'Introduce the candidate and clarify the proposed care arrangement.',
            'Discuss household routines, boundaries, and responsibilities together.',
            'Address questions or preferences before the placement begins.',
          ],
        },
        {
          title: 'Household fit and follow-up',
          description:
            'A good match takes account of the home environment and benefits from early communication.',
          steps: [
            'Confirm any specific household requirements before the first day.',
            'Share practical care instructions and agreed communication routines.',
            'Invite feedback so concerns or changing needs can be addressed.',
          ],
        },
      ],
      familyBenefits: [
        'A match shaped around your family’s stated preferences.',
        'Clear expectations shared before care begins.',
        'An opportunity to give feedback as your needs evolve.',
      ],
    },
  };
