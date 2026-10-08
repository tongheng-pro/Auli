// Default values scanned from ALL pages of https://emr-doc.pmrs2.org (standard_lookup, form_values,
// core_components, vital_signs, physical_examinations, medical_histories).
// "Refresh" in the popup re-scans the whole site and saves a newer copy into the extension.
const EMR_SOURCE_URL = 'https://emr-doc.pmrs2.org/references/standard_lookup.html';
const EMR_DEFAULT = {
  scannedAt: '2026-10-08',
  groups: [
 {
  "page": "Standard Lookup",
  "section": "Patient",
  "title": "Sex (ភេទ)",
  "items": [
   {
    "code": "F",
    "value": "F",
    "khmer": "ស្រី",
    "description": "Female"
   },
   {
    "code": "M",
    "value": "M",
    "khmer": "ប្រុស",
    "description": "Male"
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Patient",
  "title": "Marital Status (ស្ថានភាពគ្រួសារ)",
  "items": [
   {
    "code": "MAST-0000X1",
    "value": "Single",
    "khmer": "នៅលីវ",
    "description": "The patient has never been married or is not in a legally recognized partnership."
   },
   {
    "code": "MAST-00M002",
    "value": "Married",
    "khmer": "រៀបការ",
    "description": "The patient is in a legally recognized marriage or domestic partnership"
   },
   {
    "code": "MAST-000S03",
    "value": "Widowed",
    "khmer": "មេម៉ាយ/ពោះម៉ាយ",
    "description": "The patient's spouse or legal partner is deceased"
   },
   {
    "code": "MAST-0000N4",
    "value": "Divorced",
    "khmer": "លែងលះ/បែកគ្នា",
    "description": "The patient was previously married, and the marriage has been legally dissolved"
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Visit",
  "title": "Admission Types (ប្រភេទនៃការចូល)",
  "items": [
   {
    "code": "ADTY-000J008",
    "value": "Walk-in",
    "khmer": "មកដោយខ្លួនឯង",
    "description": "Patient comes to the facility without a prior appointment."
   },
   {
    "code": "ADTY-000009S",
    "value": "Appointment",
    "khmer": "មកដោយតាមការណាត់ជួប",
    "description": "Patient arrives for a scheduled visit."
   },
   {
    "code": "ADTY-0P0000A",
    "value": "Refer",
    "khmer": "មកដោយការបញ្ជូន",
    "description": "Patient is referred by another facility or provider."
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Visit",
  "title": "Visit Types (ផ្នែកទទួលសេវា)",
  "items": [
   {
    "code": "VITY-00J000C",
    "value": "IPD",
    "khmer": "សម្រាកពេទ្យ",
    "description": "Patient stays at the hospital for one or more nights."
   },
   {
    "code": "VITY-00L000D",
    "value": "OPD",
    "khmer": "ពិគ្រោះក្រៅ",
    "description": "Patient receives care without being admitted overnight."
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Visit",
  "title": "Discharge Types (ប្រភេទនៃការចេញ)",
  "items": [
   {
    "code": "DITY-0000E08",
    "value": "Authorized",
    "khmer": "ចេញដោយអនុញ្ញាត",
    "description": "Patient is well enough to go home."
   },
   {
    "code": "DITY-0B00009",
    "value": "Unauthorized",
    "khmer": "ចេញដោយមិនអនុញ្ញាត",
    "description": "Patient chose to leave before formal discharge."
   },
   {
    "code": "DITY-00000CA",
    "value": "Deceased",
    "khmer": "ស្លាប់",
    "description": "Patient passed away during the stay."
   },
   {
    "code": "DITY-000Y00F",
    "value": "Refer Out",
    "khmer": "បញ្ចូនទៅបន្តការព្យាបាលទៅមន្ទីរពេទ្យផ្សេង",
    "description": "Patient is sent to another hospital or care facility."
   },
   {
    "code": "DITY-000010X",
    "value": "Absconded",
    "khmer": "ចេញដោយមិនជូនដំណឹង/លួចរត់ចេញ",
    "description": "Patient left without informing or formal discharge."
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Visit",
  "title": "Visit Outcomes (ស្ថានភាពជំងឺ)",
  "items": [
   {
    "code": "VIOU-B000008",
    "value": "Unchanged",
    "khmer": "គ្មានការធូរស្រាល",
    "description": "No significant change in patient’s condition."
   },
   {
    "code": "VIOU-0000V09",
    "value": "Recovered",
    "khmer": "ជាសះស្បើយ",
    "description": "Patient’s condition has resolved."
   },
   {
    "code": "VIOU-000G00A",
    "value": "Improved",
    "khmer": "ធូរស្រាល",
    "description": "Condition has shown improvement but not fully resolved."
   },
   {
    "code": "VIOU-00C000B",
    "value": "Deceased",
    "khmer": "ស្លាប់",
    "description": "Patient passed away during the visit."
   },
   {
    "code": "VIOU-0V0000C",
    "value": "Hopeless",
    "khmer": "អស់សង្ឃឹម",
    "description": "Patient's condition has no solution"
   },
   {
    "code": "VIOU-00000NE",
    "value": "Home treatment",
    "khmer": "បន្តព្យាបាលនៅផ្ទះ",
    "description": "Patient can continue to receive treatment at home"
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Invoice",
  "title": "Payment Types (ប្រភេទបង់ប្រាក់)",
  "items": [
   {
    "code": "PATY-0000N09",
    "value": "HEF (Poor)",
    "khmer": "មូលនិធិសមធម៌សម្រាប់គ្រួសារក្រីក្រ",
    "description": "Health Equity Fund for poor household"
   },
   {
    "code": "PATY-00002NF",
    "value": "HEF (Informal Worker)",
    "khmer": "មូលនិធិសមធម៌សម្រាប់កម្មករនិយោជិកក្រៅប្រព័ន្ធ",
    "description": "Health Equity Fund for informal workers"
   },
   {
    "code": "PATY-00002EH",
    "value": "HEF (CNP)",
    "khmer": "គម្រោងអាហាររូបត្ថមនៅកម្ពុជា",
    "description": "Health Equity Fund for Child Nutrition Project"
   },
   {
    "code": "PATY-00003LD",
    "value": "HEF (At Risk)",
    "khmer": "មូលនិធិសមធម៌សម្រាប់គ្រួសារងាយរងហានិភ័យ",
    "description": "Health Equity Fund for At-Risk household"
   },
   {
    "code": "PATY-000K010",
    "value": "NSSF",
    "khmer": "បេឡាជាតិសន្តិសុខសង្គម របបថែទាំសុខភាព",
    "description": "National Social Security Fund for Healthcare"
   },
   {
    "code": "PATY-0000G3E",
    "value": "NSSF Employee",
    "khmer": "បេឡាជាតិសន្តិសុខសង្គម របបថែទាំសុខភាព កម្មករនិយោជិត",
    "description": "National Social Security Fund for Healthcare of Employee"
   },
   {
    "code": "PATY-00B003F",
    "value": "NSSF Public Servant",
    "khmer": "បេឡាជាតិសន្តិសុខសង្គម របបថែទាំសុខភាព បុគ្គលក្នុងវិស័យសាធារណៈ",
    "description": "National Social Security Fund for Healthcare of Public Servant"
   },
   {
    "code": "PATY-000T040",
    "value": "NSSF Self-Employed",
    "khmer": "បេឡាជាតិសន្តិសុខសង្គម របបថែទាំសុខភាព បុគ្គលស្វ័យនិយោជន៍",
    "description": "National Social Security Fund for Self Employed"
   },
   {
    "code": "PATY-0000H08",
    "value": "Discount",
    "khmer": "បង់បញ្ចុះថ្លៃ",
    "description": "Partially discounted"
   },
   {
    "code": "PATY-0J0000C",
    "value": "Hospital Exception",
    "khmer": "ករណីលើកលែង",
    "description": "Exception or fully discounted"
   },
   {
    "code": "PATY-00T001A",
    "value": "Full Pay",
    "khmer": "បង់ពេញថ្លៃ",
    "description": "Full pay"
   }
  ]
 },
 {
  "page": "Standard Lookup",
  "section": "Diagnosis",
  "title": "Diagnosis Types (ប្រភេទរោគវិនិច្ឆ័យ)",
  "items": [
   {
    "code": "DIAGT-00Z00C",
    "value": "Differential",
    "khmer": "រោគវិនិច្ឆ័យញែក",
    "description": "Diagnosis that could explain the symptoms"
   },
   {
    "code": "DIAGT-00A008",
    "value": "In",
    "khmer": "រោគវិនិច្ឆ័យចូល",
    "description": "The condition suspected when the patient is first admitted"
   },
   {
    "code": "DIAGT-000Y09",
    "value": "Out",
    "khmer": "រោគវិនិច្ឆ័យចេញ",
    "description": "Final diagnosis after treatment and evaluation, recorded at discharge"
   },
   {
    "code": "DIAGT-0000BM",
    "value": "Primary",
    "khmer": "រោគវិនិ្ឆ័យចំបង",
    "description": "The main reason for the current hospital visit or treatment"
   },
   {
    "code": "DIAGT-0000AB",
    "value": "Secondary",
    "khmer": "រោគវិនិច្ឆ័យបន្តាប់បន្សំ",
    "description": "Coexisting conditions that influence care or outcomes"
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Contraception & Family Planning",
  "title": "Birth Control Type",
  "items": [
   {
    "code": "OBVA-S000099",
    "value": "Combined Oral Contraceptive (COC)",
    "khmer": "ថ្នាំគ្រាប់ស៊ីអូស៊ី",
    "description": ""
   },
   {
    "code": "OBVA-00D0097",
    "value": "Injectable Contraceptive",
    "khmer": "ថ្នាំចាក់",
    "description": ""
   },
   {
    "code": "OBVA-00P0096",
    "value": "Intrauterine Device (IUD)",
    "khmer": "កងដាក់ក្នុងស្បូន",
    "description": ""
   },
   {
    "code": "OBVA-00W009A",
    "value": "Contraceptive Implant",
    "khmer": "កងដាក់ក្រោមស្បែក",
    "description": ""
   },
   {
    "code": "OBVA-0000C98",
    "value": "Condom",
    "khmer": "ស្រោមអនាម័យ",
    "description": ""
   },
   {
    "code": "OBVA-000159Z",
    "value": "Removal of IUD",
    "khmer": "ដោះកងដាក់ក្នុងស្បូន",
    "description": ""
   },
   {
    "code": "OBVA-00A015B",
    "value": "Insertion of Contraceptive Implant",
    "khmer": "ការដាក់កងក្នុងដៃ",
    "description": ""
   },
   {
    "code": "OBVA-000W15C",
    "value": "Contraceptive Implant Follow-up",
    "khmer": "តាមដានកងដាក់ក្នុងដៃ",
    "description": ""
   },
   {
    "code": "OBVA-C00015D",
    "value": "Removal of Contraceptive Implant",
    "khmer": "ដោះកងដៃចេញ",
    "description": ""
   },
   {
    "code": "OBVA-00015VE",
    "value": "Counseling",
    "khmer": "ការផ្តល់ប្រឹក្សា",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Contraception & Family Planning",
  "title": "Birth Control Customer Type",
  "items": [
   {
    "code": "OBVA-00001H1",
    "value": "Past User",
    "khmer": "ធ្លាប់ប្រើ",
    "description": ""
   },
   {
    "code": "OBVA-0000I10",
    "value": "First-Time User",
    "khmer": "លើកដំបូង",
    "description": ""
   },
   {
    "code": "OBVA-0000I12",
    "value": "Continuing User / Current User",
    "khmer": "ចាស់",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Contraception & Family Planning",
  "title": "Type Of Contraceptive Method Received",
  "items": [
   {
    "code": "OBVA-S000099",
    "value": "Combined Oral Contraceptive (COC)",
    "khmer": "ថ្នាំគ្រាប់ស៊ីអូស៊ី",
    "description": ""
   },
   {
    "code": "OBVA-00D0097",
    "value": "Injectable Contraceptive",
    "khmer": "ថ្នាំចាក់",
    "description": ""
   },
   {
    "code": "OBVA-00P0096",
    "value": "Intrauterine Device (IUD)",
    "khmer": "កងដាក់ក្នុងស្បូន",
    "description": ""
   },
   {
    "code": "OBVA-00W009A",
    "value": "Contraceptive Implant",
    "khmer": "កងដាក់ក្រោមស្បែក",
    "description": ""
   },
   {
    "code": "OBVA-0000C98",
    "value": "Condom",
    "khmer": "ស្រោមអនាម័យ",
    "description": ""
   },
   {
    "code": "OBVA-0000I9B",
    "value": "Sterilization",
    "khmer": "បញ្ឈប់កំណើត",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Labor & Delivery",
  "title": "Delivery Baby Born",
  "items": [
   {
    "code": "OBVA-00007ID",
    "value": "Live Birth",
    "khmer": "កើតរស់",
    "description": ""
   },
   {
    "code": "OBVA-00T007C",
    "value": "Stillbirth",
    "khmer": "កើតស្លាប់",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Labor & Delivery",
  "title": "Delivery Baby Sex",
  "items": [
   {
    "code": "OBVA-00G007A",
    "value": "Male",
    "khmer": "ប្រុស",
    "description": ""
   },
   {
    "code": "OBVA-00007GB",
    "value": "Female",
    "khmer": "ស្រី",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Labor & Delivery",
  "title": "Delivery Type",
  "items": [
   {
    "code": "OBVA-000B153",
    "value": "Normal Vaginal Delivery (NVD)",
    "khmer": "សម្រាលធម្មតា",
    "description": ""
   },
   {
    "code": "OBVA-00R0154",
    "value": "Assisted Vaginal Delivery",
    "khmer": "សម្រាលដោយអន្តរាគមន៍",
    "description": ""
   },
   {
    "code": "OBVA-X000155",
    "value": "Cesarean Section (C-Section)",
    "khmer": "សម្រាលដោយវះកាត់",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Labor & Delivery",
  "title": "Birth Outcomes",
  "items": [
   {
    "code": "OBVA-00007ID",
    "value": "Live birth",
    "khmer": "កើតរស់",
    "description": ""
   },
   {
    "code": "OBVA-00T007C",
    "value": "Stillbirth",
    "khmer": "កើតស្លាប់",
    "description": ""
   },
   {
    "code": "OBVA-00007EU",
    "value": "Fresh stillbirth",
    "khmer": "ស្លាប់កើតថ្មីៗ",
    "description": ""
   },
   {
    "code": "OBVA-T00007F",
    "value": "Macerated stillbirth",
    "khmer": "ស្លាប់កើតយូ",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Labor & Delivery",
  "title": "Birth Terms",
  "items": [
   {
    "code": "OBVA-0001MB1",
    "value": "Term birth / Full-term",
    "khmer": "កើតគ្រប់ខែ",
    "description": ""
   },
   {
    "code": "OBVA-R0001B0",
    "value": "Preterm birth / Premature",
    "khmer": "កើតមិនគ្រប់ខែ",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Safe Abortion Care",
  "title": "Safe Abortion Method",
  "items": [
   {
    "code": "OBVA-00H0156",
    "value": "Medical Abortion",
    "khmer": "រំលូតដោយថ្នាំ",
    "description": ""
   },
   {
    "code": "OBVA-000157X",
    "value": "Manual Vacuum Aspiration (MVA)",
    "khmer": "រំលូតដោយបូមសុញ្ញាកាស",
    "description": ""
   },
   {
    "code": "OBVA-0001Z58",
    "value": "Dilation and Evacuation (D&E)",
    "khmer": "រំលូតដោយពង្រីកមាត់ស្បូន និងយកចេញ",
    "description": ""
   },
   {
    "code": "OBVA-000159Z",
    "value": "Other Methods",
    "khmer": "វិធីសាស្ត្រផ្សេងទៀត",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Clinical Assessment & Findings",
  "title": "Positivities",
  "items": [
   {
    "code": "OBVA-0T0008A",
    "value": "Present",
    "khmer": "មាន",
    "description": ""
   },
   {
    "code": "OBVA-00L008B",
    "value": "Absent",
    "khmer": "មិនមាន",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Clinical Assessment & Findings",
  "title": "Newborn Examination Results",
  "items": [
   {
    "code": "OBVA-00000E72",
    "value": "No conditions/signs detected / No Abnormality Detected (NAD)",
    "khmer": "គ្មានរកឃើញនូវ លក្ខខណ្ឌ/សញ្ញា",
    "description": ""
   },
   {
    "code": "OBVA-00000E8C",
    "value": "Conditions/signs detected",
    "khmer": "លក្ខខណ្ឌ/សញ្ញា ត្រូវបានរកឃើញ",
    "description": ""
   }
  ]
 },
 {
  "page": "Form Values",
  "section": "Clinical Assessment & Findings",
  "title": "Child Examination Results",
  "items": [
   {
    "code": "OBVA-000ADE9E",
    "value": "Impairments or symptoms detected",
    "khmer": "មានកម្សោយ ឬ រោគសញ្ញា ដែលត្រូវបានរកឃើញ",
    "description": ""
   },
   {
    "code": "OBVA-000ADEAM",
    "value": "No impairments or symptoms detected",
    "khmer": "មិនមានកម្សោយ ឬរោគសញ្ញាត្រូវបានរកឃើញទេ",
    "description": ""
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Vital Signs",
  "title": "Normal Ranges Reference",
  "items": [
   {
    "code": "",
    "value": "Temperature",
    "khmer": "",
    "description": "36.5–37.3 °C"
   },
   {
    "code": "",
    "value": "Pulse (Heart Rate)",
    "khmer": "",
    "description": "60–100 beats per minute"
   },
   {
    "code": "",
    "value": "Respiratory Rate",
    "khmer": "",
    "description": "12–20 breaths per minute"
   },
   {
    "code": "",
    "value": "Blood Pressure",
    "khmer": "",
    "description": "Systolic: 90–120 mmHg, Diastolic: 60–80 mmHg"
   },
   {
    "code": "",
    "value": "Oxygen Saturation (SpO₂)",
    "khmer": "",
    "description": "95–100%"
   },
   {
    "code": "",
    "value": "Random Glucose Rapid Test",
    "khmer": "",
    "description": "Random: < 140 mg/dL, Fasting: 70–99 mg/dL"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Medical History",
  "title": "History Categories",
  "items": [
   {
    "code": "",
    "value": "Current Illness",
    "khmer": "",
    "description": "What's happening now - symptoms, when they started, what makes them better or worse"
   },
   {
    "code": "",
    "value": "Current Medications",
    "khmer": "",
    "description": "What medicines the patient is taking right now"
   },
   {
    "code": "",
    "value": "Past Medical History",
    "khmer": "",
    "description": "Previous illnesses, hospitalizations, chronic conditions"
   },
   {
    "code": "",
    "value": "Past Surgical History",
    "khmer": "",
    "description": "Any surgeries the patient has had"
   },
   {
    "code": "",
    "value": "Allergies",
    "khmer": "",
    "description": "Things the patient is allergic to (foods, medicines, etc.)"
   },
   {
    "code": "",
    "value": "Immunizations",
    "khmer": "",
    "description": "Vaccinations the patient has received"
   },
   {
    "code": "",
    "value": "Family History",
    "khmer": "",
    "description": "Health problems that run in the family"
   },
   {
    "code": "",
    "value": "Social History",
    "khmer": "",
    "description": "Lifestyle factors like smoking, drinking, occupation"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Physical Examination",
  "title": "Examination Areas",
  "items": [
   {
    "code": "",
    "value": "General Appearance",
    "khmer": "",
    "description": "How the patient looks overall - alert, distressed, well-nourished"
   },
   {
    "code": "",
    "value": "Head & Neck",
    "khmer": "",
    "description": "Eyes, ears, nose, throat, neck lymph nodes"
   },
   {
    "code": "",
    "value": "Heart & Lungs",
    "khmer": "",
    "description": "Heart sounds, breathing sounds, chest movement"
   },
   {
    "code": "",
    "value": "Abdomen",
    "khmer": "",
    "description": "Belly tenderness, organ size, bowel sounds"
   },
   {
    "code": "",
    "value": "Skin",
    "khmer": "",
    "description": "Rashes, color changes, wounds"
   },
   {
    "code": "",
    "value": "Nervous System",
    "khmer": "",
    "description": "Reflexes, coordination, mental status"
   },
   {
    "code": "",
    "value": "Muscles & Joints",
    "khmer": "",
    "description": "Strength, movement, swelling"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Diagnosis",
  "title": "Diagnosis Types",
  "items": [
   {
    "code": "",
    "value": "Primary",
    "khmer": "",
    "description": "The main reason for this hospital visit"
   },
   {
    "code": "",
    "value": "Secondary",
    "khmer": "",
    "description": "Other conditions that also need attention"
   },
   {
    "code": "",
    "value": "Differential",
    "khmer": "",
    "description": "Possible diagnoses being considered"
   },
   {
    "code": "",
    "value": "Admission",
    "khmer": "",
    "description": "Initial diagnosis when patient arrives"
   },
   {
    "code": "",
    "value": "Discharge",
    "khmer": "",
    "description": "Final diagnosis when patient leaves"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Forms Added in v1.4",
  "title": "Standard Form Types",
  "items": [
   {
    "code": "ENTY-000016Z",
    "value": "OPD Contraception",
    "khmer": "",
    "description": "Family planning consultations, contraceptive methods chosen/administered, and client history"
   },
   {
    "code": "ENTY-0000K15",
    "value": "Delivery",
    "khmer": "",
    "description": "Labor & delivery summary, obstetrical history, delivery mode, oxytocin administration, and newborn vitality"
   },
   {
    "code": "ENTY-0000K1B",
    "value": "Abortion",
    "khmer": "",
    "description": "Safe abortion care, uterine size, clinical procedure method, and post-abortion contraception uptake"
   },
   {
    "code": "ENTY-000H014",
    "value": "OPD ANC",
    "khmer": "",
    "description": "Antenatal care visit, gestational age, uterine fundal height, and fetal heart rate"
   },
   {
    "code": "ENTY-000001B2",
    "value": "OPD PNC",
    "khmer": "",
    "description": "Postnatal care checkup, postpartum days, maternal danger signs, and infant danger signs"
   },
   {
    "code": "ENTY-00000A8C",
    "value": "Child Phy-Exam(0-28 Days)",
    "khmer": "",
    "description": "Neonatal physical examination within 28 days of birth, APGAR scores, birth weight, and congenital screening"
   },
   {
    "code": "ENTY-00000A8C",
    "value": "Child Phy-Exam(1M-5Y)",
    "khmer": "",
    "description": "Pediatric physical examination (1 month to 5 years), growth tracking, and developmental milestones"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Birth Control Type (វិធីពន្យារកំណើត)",
  "items": [
   {
    "code": "OBVA-S000099",
    "value": "Combined Oral Contraceptive (COC)",
    "khmer": "ថ្នាំគ្រាប់ស៊ីអូស៊ី",
    "description": "Oral contraceptive preparation"
   },
   {
    "code": "OBVA-00D0097",
    "value": "Injectable Contraceptive",
    "khmer": "ថ្នាំចាក់",
    "description": "Injectable contraceptive"
   },
   {
    "code": "OBVA-00P0096",
    "value": "Intrauterine Device (IUD)",
    "khmer": "កងដាក់ក្នុងស្បូន",
    "description": "Intrauterine device"
   },
   {
    "code": "OBVA-00W009A",
    "value": "Contraceptive Implant",
    "khmer": "កងដាក់ក្រោមស្បែក",
    "description": "Contraceptive implant"
   },
   {
    "code": "OBVA-0000C98",
    "value": "Condom",
    "khmer": "ស្រោមអនាម័យ",
    "description": "Condom"
   },
   {
    "code": "OBVA-000159Z",
    "value": "Removal of IUD",
    "khmer": "ដោះកងដាក់ក្នុងស្បូន",
    "description": "Removal of intrauterine device"
   },
   {
    "code": "OBVA-00A015B",
    "value": "Insertion of Contraceptive Implant",
    "khmer": "ការដាក់កងក្នុងដៃ",
    "description": "Insertion of contraceptive implant"
   },
   {
    "code": "OBVA-000W15C",
    "value": "Contraceptive Implant Follow-up",
    "khmer": "តាមដានកងដាក់ក្នុងដៃ",
    "description": "Contraceptive implant check"
   },
   {
    "code": "OBVA-C00015D",
    "value": "Removal of Contraceptive Implant",
    "khmer": "ដោះកងដៃចេញ",
    "description": "Removal of contraceptive implant"
   },
   {
    "code": "OBVA-00015VE",
    "value": "Counseling",
    "khmer": "ការផ្តល់ប្រឹក្សា",
    "description": "Counseling"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Customer Type (ស្ថានភាពនៃការប្រើប្រាស់វិធីពន្យារកំណើត)",
  "items": [
   {
    "code": "OBVA-00001H1",
    "value": "Past User",
    "khmer": "ធ្លាប់ប្រើ",
    "description": "Past user"
   },
   {
    "code": "OBVA-0000I10",
    "value": "First-Time User",
    "khmer": "លើកដំបូង",
    "description": "First"
   },
   {
    "code": "OBVA-0000I12",
    "value": "Continuing User / Current User",
    "khmer": "ចាស់",
    "description": "Current user"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Post-Abortion Method (តើអតិថិជនបានទទួលមធ្យោបាយពន្យារកំណើតប្រភេទណា?)",
  "items": [
   {
    "code": "OBVA-S000099",
    "value": "Combined Oral Contraceptive (COC)",
    "khmer": "ថ្នាំគ្រាប់ស៊ីអូស៊ី",
    "description": "Oral contraceptive preparation"
   },
   {
    "code": "OBVA-00D0097",
    "value": "Injectable Contraceptive",
    "khmer": "ថ្នាំចាក់",
    "description": "Injectable contraceptive"
   },
   {
    "code": "OBVA-00P0096",
    "value": "Intrauterine Device (IUD)",
    "khmer": "កងដាក់ក្នុងស្បូន",
    "description": "Intrauterine device"
   },
   {
    "code": "OBVA-00W009A",
    "value": "Contraceptive Implant",
    "khmer": "កងដាក់ក្រោមស្បែក",
    "description": "Contraceptive implant"
   },
   {
    "code": "OBVA-0000C98",
    "value": "Condom",
    "khmer": "ស្រោមអនាម័យ",
    "description": "Condom"
   },
   {
    "code": "OBVA-0000I9B",
    "value": "Sterilization",
    "khmer": "បញ្ឈប់កំណើត",
    "description": "Sterilization"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Delivery Baby Born (ទារកកើត)",
  "items": [
   {
    "code": "OBVA-00007ID",
    "value": "Live Birth",
    "khmer": "កើតរស់",
    "description": "Live birth"
   },
   {
    "code": "OBVA-00T007C",
    "value": "Stillbirth",
    "khmer": "កើតស្លាប់",
    "description": "Stillbirth"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Delivery Baby Sex (ភេទទារក)",
  "items": [
   {
    "code": "OBVA-00G007A",
    "value": "Male",
    "khmer": "ប្រុស",
    "description": "Male"
   },
   {
    "code": "OBVA-00007GB",
    "value": "Female",
    "khmer": "ស្រី",
    "description": "Female"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Delivery Type (ប្រភេទសម្រាលកូន)",
  "items": [
   {
    "code": "OBVA-000B153",
    "value": "Normal Vaginal Delivery (NVD)",
    "khmer": "សម្រាលធម្មតា",
    "description": "Normal delivery"
   },
   {
    "code": "OBVA-00R0154",
    "value": "Assisted Vaginal Delivery",
    "khmer": "សម្រាលដោយអន្តរាគមន៍",
    "description": "Assisted delivery"
   },
   {
    "code": "OBVA-X000155",
    "value": "Cesarean Section (C-Section)",
    "khmer": "សម្រាលដោយវះកាត់",
    "description": "Cesarean section"
   }
  ]
 },
 {
  "page": "Core Components",
  "section": "Standard Value Mappings & Terminology",
  "title": "Safe Abortion Method (មធ្យោបាយរំលូត / វិធីសាស្ត្ររំលូតកូន)",
  "items": [
   {
    "code": "OBVA-00H0156",
    "value": "Medical Abortion",
    "khmer": "រំលូតដោយថ្នាំ",
    "description": "Medical abortion"
   },
   {
    "code": "OBVA-000157X",
    "value": "Manual Vacuum Aspiration (MVA)",
    "khmer": "រំលូតដោយបូមសុញ្ញាកាស",
    "description": "Vacuum aspiration of uterus"
   },
   {
    "code": "OBVA-0001Z58",
    "value": "Dilation and Evacuation (D&E)",
    "khmer": "រំលូតដោយពង្រីកមាត់ស្បូន និងយកចេញ",
    "description": "Dilation and evacuation of uterus"
   },
   {
    "code": "OBVA-000159Z",
    "value": "Other Methods",
    "khmer": "វិធីសាស្ត្រផ្សេងទៀត",
    "description": "Other contraceptive method"
   }
  ]
 },
 {
  "page": "Required Vital Signs",
  "section": "Required Vital Signs",
  "title": "Required Vital Signs",
  "items": [
   {
    "code": "",
    "value": "Temperature",
    "khmer": "សីតុណ្ហភាព",
    "description": "A float value representing the body's core thermal state."
   },
   {
    "code": "",
    "value": "Heart Rate",
    "khmer": "ចង្វាក់បេះដូង",
    "description": "An integer that functions as a real-time counter for the heart's pump cycle, measured in beats per minute (bpm)."
   },
   {
    "code": "",
    "value": "Respiratory Rate",
    "khmer": "ចង្វាក់ដង្ហើម",
    "description": "An integer tracking the frequency of the body's primary resource-intake cycle (breathing)."
   },
   {
    "code": "",
    "value": "Systolic Blood Pressure",
    "khmer": "សម្ពាធឈាម Systolic",
    "description": "An integer measures the peak pressure on the circulatory network during a pump cycle. Optional for children"
   },
   {
    "code": "",
    "value": "Diastolic Blood Pressure",
    "khmer": "សម្ពាធឈាម Diastolic",
    "description": "An integer measures the baseline pressure when the pump is in its resting phase. Optional for children"
   },
   {
    "code": "",
    "value": "Blood Oxygen",
    "khmer": "អុកស៊ីហ្សែនក្នុងឈាម",
    "description": "A percentage integer (SpO2) that measures the saturation of the body's data carriers (hemoglobin) with a critical resource (oxygen)."
   },
   {
    "code": "",
    "value": "Random Blood Glucose",
    "khmer": "គ្លុយកូស",
    "description": "An integer representing the amount of readily available fuel (glucose) in the system. Optional"
   }
  ]
 },
 {
  "page": "Recommended Physical Examination Concepts",
  "section": "Recommended Physical Examination Concepts",
  "title": "Recommended Physical Examination Concepts",
  "items": [
   {
    "code": "",
    "value": "General Appearance",
    "khmer": "រូបរាងទូទៅ",
    "description": "Consciousness (alert/drowsy), Distress, Nutrition, Posture, Gait, Hygiene, Pallor, Jaundice, Cyanosis, Edema"
   },
   {
    "code": "",
    "value": "ENT(ORL)",
    "khmer": "ការវាយតម្លៃប្រព័ន្ធប្រសាទឆ្លើយតប",
    "description": "Head, Eyes, Ears, Nose, Throat/Mouth"
   },
   {
    "code": "",
    "value": "Cardiovascular System",
    "khmer": "ប្រព័ន្ធសរសៃឈាមបេះដូង",
    "description": "Inspection (chest), Palpation (apex beat), Auscultation (S1/S2, murmurs), Peripheral pulses"
   },
   {
    "code": "",
    "value": "Respiratory System",
    "khmer": "ប្រព័ន្ធផ្លូវដង្ហើម",
    "description": "Chest symmetry, Expansion, Percussion (dullness), Breath sounds, Crepitations, Wheezing"
   },
   {
    "code": "",
    "value": "Gastro-Intestinal System",
    "khmer": "ពោះ",
    "description": "Inspection (distension), Palpation (tenderness, organ size), Percussion, Bowel sounds"
   },
   {
    "code": "",
    "value": "Central Nervouse System",
    "khmer": "ប្រព័ន្ធប្រសាទ",
    "description": "Mental status, Cranial nerves, Motor/sensory function, Reflexes, Coordination"
   },
   {
    "code": "",
    "value": "Skin & Extremities",
    "khmer": "ស្បែក",
    "description": "Rashes, Lesions, Color changes, Ulcers, Turgor, Temperature"
   },
   {
    "code": "",
    "value": "Glasgow Coma Scale",
    "khmer": "មាត្រដ្ឋានវាយតម្លៃកម្រិតស្មារតី",
    "description": "Structured consciousness assessment using Eye, Verbal and Motor responses, producing a GCS score from 3–15."
   },
   {
    "code": "",
    "value": "Urogenital System",
    "khmer": "ប្រព័ន្ធទឹកនោម និងប្រព័ន្ធបន្តពូជ",
    "description": "Genitourinary examination: urinary/genital findings, tenderness, swelling, discharge, lesions, etc."
   },
   {
    "code": "",
    "value": "Mental Status",
    "khmer": "ស្ថានភាពផ្លូវចិត្ត និងស្មារតី",
    "description": "Cognitive and behavioral assessment: appearance, behavior, mood, speech, orientation, memory, attention, thought process, etc."
   },
   {
    "code": "",
    "value": "Other body parts",
    "khmer": "ផ្នែកផ្សេងទៀតនៃរាងកាយ",
    "description": "Examination findings involving body parts or anatomical areas not covered by the standard examination sections above."
   }
  ]
 },
 {
  "page": "Recommended Medical History Concepts",
  "section": "Recommended Medical History Concepts",
  "title": "Recommended Medical History Concepts",
  "items": [
   {
    "code": "",
    "value": "History of Present Illness",
    "khmer": "ប្រវត្តិជំងឺបច្ចុប្បន្ន",
    "description": "Detailed narrative of symptoms — onset, duration, severity, aggravating/relieving factors, associated symptoms"
   },
   {
    "code": "",
    "value": "Past Medical History",
    "khmer": "ប្រវត្តិជំងឺពីមុន",
    "description": "Previous diagnoses (e.g., diabetes, hypertension), surgeries, hospitalizations, chronic conditions"
   },
   {
    "code": "",
    "value": "Past Surgical History",
    "khmer": "ប្រវត្តិនៃការវះកាត់",
    "description": "Details of past operations (type, date, complications if any)"
   },
   {
    "code": "",
    "value": "Current Medication",
    "khmer": "ឱសថដែលប្រើប្រាស់បច្ចុប្បន្ន",
    "description": "Current medications (name, dose, frequency), over-the-counter drugs, supplements"
   },
   {
    "code": "",
    "value": "Allergies",
    "khmer": "អាឡែរហ្ស៊ី",
    "description": "Known drug, food, or environmental allergies and type of reaction"
   },
   {
    "code": "",
    "value": "Family History",
    "khmer": "សាវតាររោគក្នុងគ្រួសារ",
    "description": "Hereditary conditions in parents, siblings, grandparents. Example: heart disease, cancer"
   },
   {
    "code": "",
    "value": "Social History",
    "khmer": "សាវតាររោគក្នុងសហគមន៍",
    "description": "Lifestyle factors: tobacco use, alcohol, drug use, occupation, living situation, marital status"
   },
   {
    "code": "",
    "value": "Obstetric & Gynecologic History",
    "khmer": "ប្រវត្តិសម្ភព និងរោគស្ត្រី",
    "description": "For female patients: menarche, menstruation pattern, pregnancies, contraception, menopause"
   },
   {
    "code": "",
    "value": "Immunization History",
    "khmer": "ប្រវត្ដិចាក់វ៉ាក់សំាងបង្ការ",
    "description": "Vaccination status — especially for tetanus, flu, COVID-19, childhood vaccines"
   }
  ]
 }
],
};
