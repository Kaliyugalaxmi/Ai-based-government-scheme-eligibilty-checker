import { useState, useEffect } from "react";
import { EligibilityExplainer } from "./EligibilityExplainer";
import { RoadmapModal } from "./RoadmapModal";
import { ConfidenceScore } from "./ConfidenceScore";
import { ComparisonView } from "./ComparisonView";
import { ConfidenceModal } from "./ConfidenceModal";
import { aiService } from "../utils/aiService";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Meghalaya", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const Schemes = [
  { id: 1, schemeName: "PM Kisan Samman Nidhi", category: "Farmer Support", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.6000/year direct income support to farmer families" },
  { id: 2, schemeName: "PM Fasal Bima Yojana", category: "Farmer Support", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 500000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Crop insurance scheme for farmers against natural calamities" },
  { id: 3, schemeName: "Kisan Credit Card", category: "Farmer Support", minAge: 18, maxAge: 75, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Credit card for farmers to meet agricultural expenses" },
  { id: 4, schemeName: "PM Ujjwala Yojana", category: "Women Welfare", minAge: 18, maxAge: 60, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Women Welfare", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Free LPG connection to BPL women households" },
  { id: 5, schemeName: "Beti Bachao Beti Padhao", category: "Education", minAge: 0, maxAge: 10, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Scheme for girl child welfare and education" },
  { id: 6, schemeName: "PM Matru Vandana Yojana", category: "Women Welfare", minAge: 19, maxAge: 40, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.5000 maternity benefit for pregnant and lactating mothers" },
  { id: 7, schemeName: "Sukanya Samriddhi Yojana", category: "Education", minAge: 0, maxAge: 10, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 1000000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Savings scheme for girl child education and marriage" },
  { id: 8, schemeName: "Janani Suraksha Yojana", category: "Health", minAge: 14, maxAge: 45, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Cash assistance to poor pregnant women for institutional delivery" },
  { id: 9, schemeName: "PM Surakshit Matritva Abhiyan", category: "Health", minAge: 14, maxAge: 45, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Free antenatal care on 9th of every month at govt health facilities" },
  { id: 10, schemeName: "Ayushman Bharat PM-JAY", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.5 lakh health insurance cover per family per year" },
  { id: 11, schemeName: "Rashtriya Swasthya Bima Yojana", category: "Health", minAge: 5, maxAge: 65, gender: "Any", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Health insurance for BPL families up to Rs.30000" },
  { id: 12, schemeName: "National Scholarship Portal Pre-Matric", category: "Education", minAge: 0, maxAge: 18, gender: "Any", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Scholarship for pre-matric students from minority/SC/ST communities" },
  { id: 13, schemeName: "National Scholarship Portal Post-Matric", category: "Education", minAge: 14, maxAge: 30, gender: "Any", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Scholarship for post-matric students from minority/SC/ST communities" },
  { id: 14, schemeName: "Central Sector Scholarship", category: "Education", minAge: 17, maxAge: 25, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 450000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Merit-based scholarship for college students" },
  { id: 15, schemeName: "PM Scholarship Scheme for WARB", category: "Education", minAge: 18, maxAge: 25, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 600000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Scholarship for children of ex-servicemen and coast guard" },
  { id: 16, schemeName: "Dr. Ambedkar Post Matric Scholarship", category: "Education", minAge: 14, maxAge: 30, gender: "Any", casteEligible: "OBC|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Post-matric scholarship for OBC and EWS students" },
  { id: 17, schemeName: "Scholarship for SC Students", category: "Education", minAge: 14, maxAge: 30, gender: "Any", casteEligible: "SC", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Post-matric scholarship for SC students" },
  { id: 18, schemeName: "Scholarship for ST Students", category: "Education", minAge: 14, maxAge: 30, gender: "Any", casteEligible: "ST", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Post-matric scholarship for ST students" },
  { id: 19, schemeName: "PMEGP", category: "Employment", minAge: 18, maxAge: 35, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 500000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed|Self Employed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Subsidy for setting up new micro enterprises" },
  { id: 20, schemeName: "Stand Up India", category: "Employment", minAge: 18, maxAge: 50, gender: "Female", casteEligible: "SC|ST", incomeLimit: 1000000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed|Self Employed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Loans from Rs.10 lakh to Rs.1 crore for SC/ST and women entrepreneurs" },
  { id: 21, schemeName: "MUDRA Yojana Shishu", category: "Employment", minAge: 18, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 500000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed|Unemployed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Loans up to Rs.50000 for small businesses" },
  { id: 22, schemeName: "MUDRA Yojana Kishor", category: "Employment", minAge: 18, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 1000000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Loans Rs.50000 to Rs.5 lakh for small businesses" },
  { id: 23, schemeName: "MUDRA Yojana Tarun", category: "Employment", minAge: 18, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 2000000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Loans Rs.5 lakh to Rs.10 lakh for small businesses" },
  { id: 24, schemeName: "PMSBY Suraksha Bima Yojana", category: "Health", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.2 lakh accidental death/disability insurance at Rs.20/year premium" },
  { id: 25, schemeName: "PMJJBY Jeevan Jyoti Bima", category: "Health", minAge: 18, maxAge: 50, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.2 lakh life insurance cover at Rs.436/year premium" },
  { id: 26, schemeName: "Atal Pension Yojana", category: "Pension", minAge: 18, maxAge: 40, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 500000, bplRequired: "No", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Guaranteed pension of Rs.1000-5000/month after age 60" },
  { id: 27, schemeName: "National Old Age Pension Scheme", category: "Pension", minAge: 60, maxAge: 100, gender: "Any", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Monthly pension for destitute elderly persons" },
  { id: 28, schemeName: "Indira Gandhi National Widow Pension", category: "Pension", minAge: 40, maxAge: 79, gender: "Female", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Monthly pension for BPL widows aged 40-79" },
  { id: 29, schemeName: "Indira Gandhi National Disability Pension", category: "Pension", minAge: 18, maxAge: 79, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "Yes", schemeType: "Central", state: "All", description: "Monthly pension for severely disabled BPL persons" },
  { id: 30, schemeName: "Skill India PMKVY", category: "Employment", minAge: 15, maxAge: 45, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed|Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Free skill training and certification with stipend" },
  { id: 31, schemeName: "NRLM Deen Dayal Upadhyaya", category: "Employment", minAge: 18, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 150000, bplRequired: "Yes", purpose: "Employment", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "SHG-based livelihood support for rural poor" },
  { id: 32, schemeName: "PM Awas Yojana Gramin", category: "Housing", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Employment", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Housing assistance for rural BPL families" },
  { id: 33, schemeName: "PM Awas Yojana Urban", category: "Housing", minAge: 21, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Employment", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Subsidized housing loan for urban poor" },
  { id: 34, schemeName: "MGNREGA", category: "Employment", minAge: 18, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 150000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "100 days guaranteed wage employment in rural areas" },
  { id: 35, schemeName: "National Food Security Act PDS", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Subsidized food grains through ration card" },
  { id: 36, schemeName: "PM Garib Kalyan Anna Yojana", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Free 5 kg food grain per person per month" },
  { id: 37, schemeName: "Annapurna Scheme", category: "Health", minAge: 65, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "10 kg free food grain per month for destitute senior citizens" },
  { id: 38, schemeName: "National Disability Scholarship", category: "Education", minAge: 5, maxAge: 25, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "Yes", schemeType: "Central", state: "All", description: "Scholarship for differently abled students at all levels" },
  { id: 39, schemeName: "ADIP Scheme Assistive Devices", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 150000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "Yes", schemeType: "Central", state: "All", description: "Free assistive devices for persons with disabilities" },
  { id: 40, schemeName: "Divyangjan Sports Scholarships", category: "Employment", minAge: 10, maxAge: 25, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 600000, bplRequired: "No", purpose: "Employment", employmentStatus: "Student", disabilityRequired: "Yes", schemeType: "Central", state: "All", description: "Sports scholarship for differently abled athletes" },
  { id: 41, schemeName: "Senior Citizen Savings Scheme", category: "Pension", minAge: 60, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 5000000, bplRequired: "No", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "High interest savings scheme for senior citizens above 60" },
  { id: 42, schemeName: "Varishtha Pension Bima Yojana", category: "Pension", minAge: 60, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 5000000, bplRequired: "No", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Guaranteed pension of 8 percent per annum for senior citizens" },
  { id: 43, schemeName: "NMMS Scholarship", category: "Education", minAge: 13, maxAge: 18, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 350000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.12000/year scholarship to prevent school dropout" },
  { id: 44, schemeName: "Startup India Seed Fund", category: "Employment", minAge: 21, maxAge: 45, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 5000000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Financial assistance for startups at ideation stage" },
  { id: 45, schemeName: "PM Jan Dhan Yojana", category: "Health", minAge: 10, maxAge: 65, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Zero balance bank account with Rs.2 lakh accident insurance" },
  { id: 46, schemeName: "E-Shram Card Benefits", category: "Employment", minAge: 16, maxAge: 59, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed|Self Employed|Farmer", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Rs.2 lakh insurance for unorganized sector workers" },
  { id: 47, schemeName: "National Apprenticeship Promotion", category: "Employment", minAge: 14, maxAge: 25, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 400000, bplRequired: "No", purpose: "Employment", employmentStatus: "Student|Unemployed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Stipend support for apprentices in industry" },
  { id: 48, schemeName: "MSME Technology Upgradation", category: "Employment", minAge: 21, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 2000000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Subsidy for technology upgradation of MSME units" },
  { id: 49, schemeName: "PM Scholarship for OBC Students", category: "Education", minAge: 11, maxAge: 20, gender: "Any", casteEligible: "OBC", incomeLimit: 150000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Pre and post matric scholarship for OBC students" },
  { id: 50, schemeName: "Agneepath Scheme", category: "Employment", minAge: 17, maxAge: 21, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 1000000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "Central", state: "All", description: "Short-term military service with Seva Nidhi package" },
  { id: 51, schemeName: "Maharashtra Swadhar Yojana", category: "Education", minAge: 16, maxAge: 25, gender: "Any", casteEligible: "SC|ST", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Maharashtra", description: "Financial assistance for SC/ST students for higher education expenses" },
  { id: 52, schemeName: "Mahatma Phule Jan Arogya Yojana", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Maharashtra", description: "Health coverage up to Rs.1.5 lakh for BPL families in Maharashtra" },
  { id: 53, schemeName: "Maharashtra Lek Ladki Yojana", category: "Women Welfare", minAge: 0, maxAge: 18, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 800000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Maharashtra", description: "Financial assistance for girl child from birth to higher education" },
  { id: 54, schemeName: "Maharashtra Annasaheb Patil Loan", category: "Employment", minAge: 18, maxAge: 45, gender: "Any", casteEligible: "General|EWS", incomeLimit: 800000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed|Unemployed", disabilityRequired: "No", schemeType: "State", state: "Maharashtra", description: "Interest-free loans for unemployed youth and entrepreneurs" },
  { id: 55, schemeName: "Maharashtra Sanjay Gandhi Niradhar Yojana", category: "Pension", minAge: 18, maxAge: 65, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 21000, bplRequired: "Yes", purpose: "Pension", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "State", state: "Maharashtra", description: "Monthly financial assistance for destitute persons in Maharashtra" },
  { id: 56, schemeName: "UP Kisan Karj Rahat Yojana", category: "Farmer Support", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "State", state: "Uttar Pradesh", description: "One-time farm loan waiver up to Rs.1 lakh for UP farmers" },
  { id: 57, schemeName: "UP Mukhyamantri Kanya Sumangala Yojana", category: "Women Welfare", minAge: 0, maxAge: 21, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Uttar Pradesh", description: "Financial support at key life stages for girl child in UP" },
  { id: 58, schemeName: "UP Scholarship Scheme", category: "Education", minAge: 11, maxAge: 30, gender: "Any", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Uttar Pradesh", description: "Pre and post matric scholarships for weaker sections in UP" },
  { id: 59, schemeName: "UP Pension Scheme Vridha", category: "Pension", minAge: 60, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 46080, bplRequired: "Yes", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Uttar Pradesh", description: "Rs.500/month old age pension for BPL elderly in UP" },
  { id: 60, schemeName: "UP Vishwakarma Shram Samman Yojana", category: "Employment", minAge: 18, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Employment", employmentStatus: "Self Employed|Unemployed", disabilityRequired: "No", schemeType: "State", state: "Uttar Pradesh", description: "Skill training and toolkit grant for artisans and traditional workers in UP" },
  { id: 61, schemeName: "Rajasthan Mukhyamantri Chiranjeevi Swasthya Bima", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 800000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Rajasthan", description: "Cashless health coverage up to Rs.25 lakh per family in Rajasthan" },
  { id: 62, schemeName: "Rajasthan Aapki Beti Scheme", category: "Women Welfare", minAge: 0, maxAge: 18, gender: "Female", casteEligible: "SC|ST", incomeLimit: 150000, bplRequired: "Yes", purpose: "Women Welfare", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Rajasthan", description: "Annual grant for girl students from BPL SC/ST families in Rajasthan" },
  { id: 63, schemeName: "Rajasthan Shubh Shakti Yojana", category: "Women Welfare", minAge: 18, maxAge: 55, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 120000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Rajasthan", description: "Rs.55000 assistance to unmarried daughters and women workers in Rajasthan" },
  { id: 64, schemeName: "Rajasthan Free Laptop Yojana", category: "Education", minAge: 14, maxAge: 18, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Rajasthan", description: "Free laptops for meritorious Class 8 and Class 10 students in Rajasthan" },
  { id: 65, schemeName: "TN Amma Two Wheeler Scheme", category: "Women Welfare", minAge: 18, maxAge: 40, gender: "Female", casteEligible: "SC|ST|OBC|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Tamil Nadu", description: "50% subsidy on two-wheelers for working women in Tamil Nadu" },
  { id: 66, schemeName: "TN Kalaignar Magalir Urimai Thittam", category: "Women Welfare", minAge: 21, maxAge: 60, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Tamil Nadu", description: "Rs.1000/month financial assistance for women heads of households in TN" },
  { id: 67, schemeName: "TN CM Uzhavar Pathukappu Thittam", category: "Farmer Support", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "State", state: "Tamil Nadu", description: "Crop insurance and financial relief for farmers in Tamil Nadu" },
  { id: 68, schemeName: "TN Dr Muthulakshmi Maternity Benefit Scheme", category: "Health", minAge: 19, maxAge: 45, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Tamil Nadu", description: "Rs.18000 maternity assistance for first two live births in Tamil Nadu" },
  { id: 69, schemeName: "Karnataka Mukhyamantri Sandhya Suraksha Yojana", category: "Pension", minAge: 60, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Karnataka", description: "Rs.600-800/month pension for elderly in Karnataka" },
  { id: 70, schemeName: "Karnataka Vidya Siri Scholarship", category: "Education", minAge: 15, maxAge: 30, gender: "Any", casteEligible: "OBC", incomeLimit: 100000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Karnataka", description: "Scholarship for OBC students in Karnataka" },
  { id: 71, schemeName: "Karnataka Yuva Nidhi Scheme", category: "Employment", minAge: 21, maxAge: 30, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "State", state: "Karnataka", description: "Rs.3000/month for unemployed graduates and Rs.1500 for diploma holders in Karnataka" },
  { id: 72, schemeName: "West Bengal Kanyashree Prakalpa", category: "Education", minAge: 13, maxAge: 18, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 120000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "West Bengal", description: "Annual Rs.1000 and Rs.25000 lump sum for girl students in West Bengal" },
  { id: 73, schemeName: "West Bengal Swasthya Sathi", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 150000, bplRequired: "No", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "West Bengal", description: "Health coverage up to Rs.5 lakh per family per year in West Bengal" },
  { id: 74, schemeName: "West Bengal Krishak Bandhu Scheme", category: "Farmer Support", minAge: 18, maxAge: 60, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "State", state: "West Bengal", description: "Rs.10000/year farm assistance and Rs.2 lakh death benefit for farmers in WB" },
  { id: 75, schemeName: "West Bengal Yuvashree Prakalpa", category: "Employment", minAge: 18, maxAge: 45, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 200000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "State", state: "West Bengal", description: "Rs.1500/month for unemployed youth registered with employment exchange in WB" },
  { id: 76, schemeName: "Gujarat Mukhyamantri Mahila Utkarsh Yojana", category: "Women Welfare", minAge: 18, maxAge: 55, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Self Employed|Unemployed", disabilityRequired: "No", schemeType: "State", state: "Gujarat", description: "Zero interest loans up to Rs.1 lakh for women SHGs in Gujarat" },
  { id: 77, schemeName: "Gujarat Namo Saraswati Vigyan Scholarship", category: "Education", minAge: 11, maxAge: 18, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 250000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Gujarat", description: "Rs.10000-15000/year scholarship for girls studying science in Gujarat" },
  { id: 78, schemeName: "Gujarat Kisan Suryoday Yojana", category: "Farmer Support", minAge: 18, maxAge: 70, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 400000, bplRequired: "No", purpose: "Farmer Support", employmentStatus: "Farmer", disabilityRequired: "No", schemeType: "State", state: "Gujarat", description: "3-phase electricity connection for daytime irrigation to farmers in Gujarat" },
  { id: 79, schemeName: "MP Ladli Laxmi Yojana", category: "Women Welfare", minAge: 0, maxAge: 21, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Women Welfare", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Madhya Pradesh", description: "Financial benefits in installments totaling Rs.1.18 lakh for girl child in MP" },
  { id: 80, schemeName: "MP Sikho Kamao Yojana", category: "Employment", minAge: 18, maxAge: 29, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 300000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed", disabilityRequired: "No", schemeType: "State", state: "Madhya Pradesh", description: "Rs.8000-10000/month stipend during vocational training in MP" },
  { id: 81, schemeName: "Bihar Mukhyamantri Kanya Utthan Yojana", category: "Education", minAge: 0, maxAge: 25, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 150000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Bihar", description: "Financial incentive from birth to graduation for girl child in Bihar" },
  { id: 82, schemeName: "Bihar Student Credit Card Scheme", category: "Education", minAge: 18, maxAge: 25, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 450000, bplRequired: "No", purpose: "Education", employmentStatus: "Student", disabilityRequired: "No", schemeType: "State", state: "Bihar", description: "Education loan up to Rs.4 lakh at 4% interest for higher studies in Bihar" },
  { id: 83, schemeName: "Bihar Mukhyamantri Vriddha Pension", category: "Pension", minAge: 60, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 60000, bplRequired: "Yes", purpose: "Pension", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Bihar", description: "Rs.400/month old age pension for BPL senior citizens in Bihar" },
  { id: 84, schemeName: "Kerala Karunya Health Scheme", category: "Health", minAge: 0, maxAge: 100, gender: "Any", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 100000, bplRequired: "Yes", purpose: "Health", employmentStatus: "Any", disabilityRequired: "No", schemeType: "State", state: "Kerala", description: "Medical assistance for BPL families for serious illness treatment in Kerala" },
  { id: 85, schemeName: "Kerala Kudumbashree Mission", category: "Employment", minAge: 18, maxAge: 55, gender: "Female", casteEligible: "General|OBC|SC|ST|EWS", incomeLimit: 150000, bplRequired: "No", purpose: "Employment", employmentStatus: "Unemployed|Self Employed", disabilityRequired: "No", schemeType: "State", state: "Kerala", description: "Microfinance and livelihood support for women through SHGs in Kerala" },
];

function checkEligibility(form, scheme) {
  const age = Number(form.age);
  const income = Number(form.income);

  if (age < scheme.minAge || age > scheme.maxAge) return false;
  if (income > 0 && income > scheme.incomeLimit) return false;
  if (scheme.gender !== "Any" && form.gender && form.gender !== scheme.gender) return false;
  
  if (form.caste) {
    const allowed = scheme.casteEligible.split("|");
    if (!allowed.includes(form.caste)) return false;
  }

  if (scheme.bplRequired === "Yes" && form.bpl === "No") return false;
  if (scheme.disabilityRequired === "Yes" && form.disability === "No") return false;

  if (form.employment && scheme.employmentStatus !== "Any") {
    const allowed = scheme.employmentStatus.split("|");
    if (!allowed.includes(form.employment)) return false;
  }

  return true;
}

function SchemeCard({ scheme, formData, selectedScheme, onSelectScheme }) {
  const [expanded, setExpanded] = useState(false);
  const isSelected = selectedScheme?.id === scheme.id;
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!expanded) return;
      setAiLoading(true);
      try {
        const res = await aiService.explainEligibility(formData, [scheme]);
        if (!mounted) return;
        setAiExplanation((res.explanations && res.explanations[0]) || null);
      } catch (e) {
        console.error("AI explain error:", e);
      } finally {
        if (mounted) setAiLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [expanded, scheme, formData]);
  
  return (
    <div 
      style={{
        ...styles.schemeCard,
        ...( isSelected ? styles.schemeCardSelected : {}),
        transform: expanded ? "translateY(-2px)" : "translateY(0)",
        boxShadow: expanded ? "0 6px 20px rgba(0, 102, 204, 0.15)" : "0 2px 8px rgba(0, 102, 204, 0.08)"
      }}
    >
      <div style={styles.schemeHeader}>
        <h4 style={styles.schemeName}>{scheme.schemeName}</h4>
        <span style={styles.badge}>{scheme.category}</span>
      </div>
      <p style={styles.benefit}>{scheme.description}</p>

      {isSelected && (
        <div style={styles.selectedIndicator}>
          ✓ Details Below
        </div>
      )}

      {expanded && (
        <div style={styles.expandedContent}>
          <div style={styles.criteria}>
            <p style={styles.criteriaLabel}>📋 Eligibility:</p>
            <div style={styles.criteriaList}>
              {aiLoading && <div style={styles.loadingText}>Analyzing eligibility...</div>}
              {!aiLoading && aiExplanation && (
                (aiExplanation.reasons || []).map((r, i) => (
                  <span key={i} style={styles.criteriaItem}>{r}</span>
                ))
              )}

              {!aiLoading && !aiExplanation && (
                <>
                  <span style={styles.criteriaItem}>✓ Age: {scheme.minAge}–{scheme.maxAge} yrs</span>
                  {scheme.gender !== "Any" && <span style={styles.criteriaItem}>✓ {scheme.gender}</span>}
                  <span style={styles.criteriaItem}>✓ Income ≤ ₹{(scheme.incomeLimit / 100000).toFixed(1)}L</span>
                  {scheme.bplRequired === "Yes" && <span style={styles.criteriaItem}>✓ BPL Required</span>}
                </>
              )}
            </div>
            {aiExplanation && aiExplanation.warnings && aiExplanation.warnings.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {aiExplanation.warnings.map((w, i) => (
                  <div key={i} style={styles.warningItem}>{w}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.cardActions}>
        <button
          style={{...styles.actionBtn, ...styles.detailsBtn}}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details ▲" : "Show Details ▼"}
        </button>
        <button
          style={{...styles.actionBtn, ...styles.selectBtn, ...(isSelected ? styles.selectBtnActive : {})}}
          onClick={() => onSelectScheme(isSelected ? null : scheme)}
        >
          {isSelected ? "Selected ✓" : "Select"}
        </button>
      </div>
    </div>
  );
}

function EligibilityForm() {
  const [formData, setFormData] = useState({
    age: "", gender: "", state: "", caste: "", income: "", bpl: "",
    purpose: "", employment: "", disability: "No",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  // Modal states
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [confidenceLoading, setConfidenceLoading] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [selectedExplanationLoading, setSelectedExplanationLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!selectedScheme) {
        setSelectedExplanation(null);
        return;
      }
      setSelectedExplanationLoading(true);
      try {
        const res = await aiService.explainEligibility(formData, [selectedScheme]);
        if (!mounted) return;
        setSelectedExplanation((res.explanations && res.explanations[0]) || null);
      } catch (e) {
        console.error("Error loading selected explanation", e);
      } finally {
        if (mounted) setSelectedExplanationLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [selectedScheme, formData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getAIRecommendation = async (matchedSchemes) => {
    if (matchedSchemes.length === 0) {
      setRecommendationLoading(false);
      return;
    }
    
    setRecommendationLoading(true);
    console.log("🤖 Starting AI recommendation for", matchedSchemes.length, "schemes");
    
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      
      if (!apiKey) {
        console.warn("⚠️ No API key found - using heuristic fallback recommendation");
        const best = heuristicRecommendation(matchedSchemes);
        // compute confidence for heuristic choice
        const schemeObj = matchedSchemes.find(s => s.schemeName === best.bestScheme.schemeName);
        if (schemeObj) {
          const conf = await aiService.getConfidenceScore(best.bestScheme.schemeName, formData, schemeObj);
          best.confidence = conf;
        }
        setRecommendation(best);
        setRecommendationLoading(false);
        return;
      }

      const schemesText = matchedSchemes.map((s, i) => 
        `${i + 1}. ${s.schemeName}: ${s.description} (Income limit: ₹${s.incomeLimit.toLocaleString()}, Age: ${s.minAge}-${s.maxAge})`
      ).join('\n');

      const prompt = `You are a government scheme expert. Based on this user profile and eligible schemes, recommend the SINGLE BEST scheme.

USER PROFILE:
- Age: ${formData.age} years
- Gender: ${formData.gender}
- State: ${formData.state}
- Caste: ${formData.caste}
- Annual Income: ₹${formData.income}
- BPL Status: ${formData.bpl || "Not specified"}
- Purpose/Need: ${formData.purpose}
- Employment: ${formData.employment || "Any"}
- Disability: ${formData.disability}

ELIGIBLE SCHEMES (All these schemes match the criteria):
${schemesText}

Task: Pick the BEST scheme that will benefit them most.

Respond with ONLY this JSON:
{
  "bestScheme": {
    "schemeName": "exact scheme name",
    "reason": "2-3 sentences why this is best for them"
  },
  "overallAdvice": "one sentence summary"
}`;

      console.log("📤 Calling Groq API...");
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        console.error("❌ API Error status", response.status);
        const best = heuristicRecommendation(matchedSchemes);
        setRecommendation(best);
        setRecommendationLoading(false);
        return;
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (data.choices?.[0]?.message?.content) {
        const responseText = data.choices[0].message.content;
        console.log("📝 Response text:", responseText);
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const recommendation = JSON.parse(jsonMatch[0]);
            console.log("✅ Recommendation parsed:", recommendation);
            if (recommendation && recommendation.bestScheme) {
              // after receiving best scheme, compute confidence
              const schemeObj = matchedSchemes.find(s => s.schemeName === recommendation.bestScheme.schemeName);
              if (schemeObj) {
                try {
                  const conf = await aiService.getConfidenceScore(recommendation.bestScheme.schemeName, formData, schemeObj);
                  recommendation.confidence = conf;
                } catch (e) {
                  console.warn("Confidence fetch failed", e);
                }
              }
              setRecommendation(recommendation);
            } else {
              const best = heuristicRecommendation(matchedSchemes);
              const schemeObj = matchedSchemes.find(s => s.schemeName === best.bestScheme.schemeName);
              if (schemeObj) {
                const conf = await aiService.getConfidenceScore(best.bestScheme.schemeName, formData, schemeObj);
                best.confidence = conf;
              }
              setRecommendation(best);
            }
          } catch (e) {
            console.error("Parse error:", e);
            setRecommendation(heuristicRecommendation(matchedSchemes));
          }
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      // Fallback using heuristic
      if (matchedSchemes.length > 0) {
        const best = heuristicRecommendation(matchedSchemes);
        const schemeObj = matchedSchemes.find(s => s.schemeName === best.bestScheme.schemeName);
        if (schemeObj) {
          try {
            const conf = await aiService.getConfidenceScore(best.bestScheme.schemeName, formData, schemeObj);
            best.confidence = conf;
          } catch {}
        }
        setRecommendation(best);
      }
    } finally {
      setRecommendationLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setRecommendation(null);
    setSelectedScheme(null);
    setTimeout(() => {
      const matched = Schemes.filter((scheme) => {
        if (formData.state && scheme.state !== "All" && scheme.state !== formData.state) return false;
        if (formData.purpose && scheme.purpose !== formData.purpose) return false;
        return checkEligibility(formData, scheme);
      });
      setResults(matched);
      setLoading(false);
      
      // Get AI recommendation if schemes found
      if (matched.length > 0) {
        getAIRecommendation(matched);
      }
    }, 500);
  };

  const handleReset = () => {
    setFormData({ age: "", gender: "", state: "", caste: "", income: "", bpl: "", purpose: "", employment: "", disability: "No" });
    setResults(null);
    setRecommendation(null);
    setSelectedScheme(null);
  };

  const centralResults = results?.filter(s => s.state === "All") ?? [];
  const stateResults = results?.filter(s => s.state !== "All") ?? [];

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #0066cc !important; box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1) !important; }
        input::placeholder { color: #999; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>🇮🇳 Government Schemes Finder</h1>
          <p style={styles.subtitle}>Discover all government schemes you're eligible for with AI-powered insights</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Age *</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required min="0" max="120" placeholder="Years" style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.select}>
                <option value="">Select Gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State *</label>
              <select name="state" value={formData.state} onChange={handleChange} required style={styles.select}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Caste Category *</label>
              <select name="caste" value={formData.caste} onChange={handleChange} required style={styles.select}>
                <option value="">Select Category</option>
                <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Annual Income (₹) *</label>
              <input type="number" name="income" value={formData.income} onChange={handleChange} required min="0" placeholder="e.g. 250000" style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>BPL Status</label>
              <select name="bpl" value={formData.bpl} onChange={handleChange} style={styles.select}>
                <option value="">Select</option>
                <option>Yes</option><option>No</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Purpose *</label>
              <select name="purpose" value={formData.purpose} onChange={handleChange} required style={styles.select}>
                <option value="">Select Purpose</option>
                <option>Health</option><option>Education</option><option>Employment</option>
                <option>Farmer Support</option><option>Women Welfare</option><option>Pension</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Employment Status</label>
              <select name="employment" value={formData.employment} onChange={handleChange} style={styles.select}>
                <option value="">Select Status</option>
                <option>Student</option><option>Unemployed</option><option>Self Employed</option>
                <option>Salaried</option><option>Farmer</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Disability</label>
              <select name="disability" value={formData.disability} onChange={handleChange} style={styles.select}>
                <option>No</option><option>Yes</option>
              </select>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "⏳ Checking..." : "🔍 Check Eligibility"}
            </button>
            <button type="button" onClick={handleReset} style={styles.resetBtn}>🔄 Reset</button>
          </div>
        </form>

        {results !== null && (
          <div style={styles.resultsSection}>
            {results.length > 0 ? (
              <>
                <div style={styles.resultHeader}>
                  <div style={styles.resultCount}>{results.length}</div>
                  <div>
                    <h3 style={styles.resultTitle}>Schemes Found!</h3>
                    <p style={styles.resultSubtitle}>Click cards to see more details</p>
                  </div>
                </div>

                {recommendation && (
                  <div style={styles.recommendationBox}>
                    <div style={styles.recommendationHeader}>
                      <div style={styles.aiIcon}>⭐ AI RECOMMENDATION - BEST SCHEME FOR YOU</div>
                      <div style={styles.recommendationAdvice}>{recommendation.overallAdvice}</div>
                    </div>
                    {recommendation.bestScheme && (
                      <div style={styles.topSchemeCard}>
                        <div style={styles.topSchemeIcon}>✨</div>
                        <div style={styles.topSchemeContent}>
                          <h4 style={styles.topSchemeName}>{recommendation.bestScheme.schemeName}</h4>
                          <p style={styles.topSchemeReason}>{recommendation.bestScheme.reason}</p>
                          {recommendation.confidence && recommendation.confidence.confidenceScore != null && (
                            <p style={styles.recommendationConfidence}>
                              AI Confidence: {recommendation.confidence.confidenceScore}%
                              {recommendation.confidence.confidenceReason && (
                                <span style={styles.confidenceReason}> ({recommendation.confidence.confidenceReason})</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <div style={styles.aiActionButtons}>
                      <button
                        style={styles.aiActionBtn}
                        onClick={() => setShowConfidenceModal(true)}
                      >
                        ⭐ AI Confidence Score
                      </button>
                      <button
                        style={styles.aiActionBtn}
                        onClick={() => setShowRoadmap(true)}
                      >
                        🗺️ Application Roadmap
                      </button>
                      <button
                        style={styles.aiActionBtn}
                        onClick={() => setShowComparison(true)}
                      >
                        ⚖️ Compare Schemes
                      </button>
                    </div>
                  </div>
                )}

                {recommendationLoading && (
                  <div style={styles.recommendationBox}>
                    <div style={styles.loadingText}>⏳ AI is analyzing schemes for you...</div>
                  </div>
                )}

                {/* Selected scheme panel (shows confidence + quick why) */}
                {selectedScheme && (
                  <div style={styles.selectedSchemePanel}>
                    <div style={styles.selectedSchemeHeader}>
                      <h4 style={styles.panelSchemeName}>{selectedScheme.schemeName}</h4>
                      <p style={styles.panelDescription}>{selectedScheme.description}</p>
                    </div>
                    <div style={styles.panelBody}>
                      <div style={{ flex: 1 }}>
                        <ConfidenceScore schemeName={selectedScheme.schemeName} scheme={selectedScheme} formData={formData} />
                      </div>
                      <div style={{ flex: 1, marginLeft: 18 }}>
                        <p style={styles.sectionTitle}>🔎 Quick Why?</p>
                        {selectedExplanationLoading && <div style={styles.loadingText}>Analyzing...</div>}
                        {!selectedExplanationLoading && selectedExplanation && (
                          <div style={styles.reasonsList}>
                            {(selectedExplanation.reasons || []).slice(0,4).map((r, i) => (
                              <div key={i} style={styles.reasonItem}>{r}</div>
                            ))}
                          </div>
                        )}
                        {!selectedExplanationLoading && !selectedExplanation && (
                          <div style={styles.reasonsList}>
                            <div style={styles.reasonItem}>Select 'Show Details' on the card for criteria</div>
                          </div>
                        )}
                        <div style={{ marginTop: 12 }}>
                          <button style={styles.aiActionBtn} onClick={() => setShowExplainer(true)}>Open Detailed Explanation</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {stateResults.length > 0 && (
                  <div style={styles.schemeSection}>
                    <div style={styles.sectionDivider}>🏛️ {formData.state} State Schemes ({stateResults.length})</div>
                    <div style={styles.schemeGrid}>
                      {stateResults.map((scheme) => (
                        <SchemeCard 
                          key={scheme.id} 
                          scheme={scheme}
                          formData={formData}
                          selectedScheme={selectedScheme}
                          onSelectScheme={setSelectedScheme}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {centralResults.length > 0 && (
                  <div style={styles.schemeSection}>
                    <div style={styles.sectionDivider}>🇮🇳 Central Government Schemes ({centralResults.length})</div>
                    <div style={styles.schemeGrid}>
                      {centralResults.map((scheme) => (
                      <SchemeCard 
                        key={scheme.id} 
                        scheme={scheme}
                        formData={formData}
                        selectedScheme={selectedScheme}
                        onSelectScheme={setSelectedScheme}
                      />
                    ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>😕</div>
                <h4 style={styles.noResultsTitle}>No Schemes Found</h4>
                <p style={styles.noResultsText}>Your criteria don't match any available schemes</p>
                <div style={styles.suggestionBox}>
                  <p style={styles.suggestionTitle}>💡 Try adjusting:</p>
                  <div style={styles.suggestionList}>
                    <div style={styles.suggestionItem}>• <strong>Income</strong>: Reduce it (most schemes max ₹2-5 lakhs)</div>
                    <div style={styles.suggestionItem}>• <strong>Employment</strong>: Match with purpose (Farmer→Farmer Support)</div>
                    <div style={styles.suggestionItem}>• <strong>Purpose</strong>: Try Health, Education, or Women Welfare</div>
                    <div style={styles.suggestionItem}>• <strong>Caste</strong>: Select SC/ST/OBC for more options</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Modal Components */}
        <ConfidenceModal
          scheme={selectedScheme || recommendation?.bestScheme}
          formData={formData}
          isOpen={showConfidenceModal}
          onClose={() => setShowConfidenceModal(false)}
        />

        <EligibilityExplainer 
          schemes={results || []} 
          formData={formData}
          isOpen={showExplainer}
          onClose={() => setShowExplainer(false)}
        />

        <RoadmapModal 
          schemeName={selectedScheme?.schemeName || recommendation?.bestScheme?.schemeName}
          formData={formData}
          isOpen={showRoadmap}
          onClose={() => setShowRoadmap(false)}
        />

        <ComparisonView 
          schemes={results || []}
          formData={formData}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fd 0%, #f0f4ff 100%)",
    padding: "30px 20px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "35px",
    textAlign: "center",
  },
  title: {
    fontSize: "38px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6c757d",
    margin: 0,
  },
  form: {
    background: "white",
    borderRadius: "14px",
    padding: "35px",
    boxShadow: "0 2px 12px rgba(0, 102, 204, 0.1)",
    marginBottom: "35px",
    border: "1px solid #e8eef7",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0a1428",
    marginBottom: "7px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  input: {
    padding: "11px 13px",
    border: "1.5px solid #dde0e8",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "#fafbfc",
  },
  select: {
    padding: "11px 13px",
    border: "1.5px solid #dde0e8",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "white",
    transition: "all 0.2s ease",
    outline: "none",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%230066cc' d='M5 8L0 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 11px center",
    paddingRight: "33px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  submitBtn: {
    flex: 1,
    padding: "13px 22px",
    background: "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: "0 3px 12px rgba(0, 102, 204, 0.25)",
  },
  resetBtn: {
    padding: "13px 22px",
    background: "#f0f0f0",
    color: "#0a1428",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  resultsSection: {
    background: "white",
    borderRadius: "14px",
    padding: "35px",
    boxShadow: "0 2px 12px rgba(0, 102, 204, 0.1)",
    border: "1px solid #e8eef7",
    animation: "slideIn 0.5s ease",
  },
  resultHeader: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    marginBottom: "35px",
    paddingBottom: "25px",
    borderBottom: "2px solid #e8eef7",
  },
  resultCount: {
    fontSize: "44px",
    fontWeight: "700",
    color: "#0066cc",
    minWidth: "60px",
  },
  resultTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 3px 0",
  },
  resultSubtitle: {
    fontSize: "13px",
    color: "#6c757d",
    margin: 0,
  },
  schemeSection: {
    marginBottom: "35px",
  },
  sectionDivider: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0a1428",
    marginBottom: "16px",
    paddingBottom: "10px",
    borderBottom: "2px solid #e8eef7",
  },
  schemeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "14px",
  },
  schemeCard: {
    background: "linear-gradient(135deg, #f8fafb 0%, #f0f4ff 100%)",
    border: "1.5px solid #dde0e8",
    borderRadius: "10px",
    padding: "16px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
  },
  schemeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
  },
  schemeName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0a1428",
    margin: 0,
    lineHeight: "1.3",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "700",
    backgroundColor: "#0066cc",
    color: "white",
    padding: "3px 10px",
    borderRadius: "16px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  benefit: {
    fontSize: "13px",
    color: "#4a5568",
    margin: "0 0 0 0",
    lineHeight: "1.5",
  },
  expandedContent: {
    marginTop: "14px",
    paddingTop: "14px",
    borderTop: "1px solid #dde0e8",
  },
  criteria: {
    marginBottom: "0",
  },
  criteriaLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 8px 0",
  },
  criteriaList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "6px",
  },
  criteriaItem: {
    fontSize: "12px",
    color: "#0066cc",
    background: "white",
    padding: "6px 8px",
    borderRadius: "5px",
    border: "1px solid #dde0e8",
    display: "block",
  },
  schemeCardSelected: {
    border: "2px solid rgba(0,102,204,0.18)",
    background: "linear-gradient(135deg, #f0f7ff 0%, #f8fbff 100%)",
  },
  selectedIndicator: {
    position: "absolute",
    right: "12px",
    top: "12px",
    background: "#e6f4ff",
    color: "#0052a3",
    padding: "6px 10px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "12px",
  },
  selectedSchemePanel: {
    background: "white",
    border: "1.5px solid #e8eef7",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "18px",
    boxShadow: "0 6px 18px rgba(0,102,204,0.06)",
  },
  selectedSchemeHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  panelSchemeName: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0a1428",
    margin: 0,
  },
  panelDescription: {
    fontSize: "13px",
    color: "#4a5568",
    margin: 0,
  },
  panelBody: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0066cc",
    margin: "0 0 8px 0",
  },
  reasonsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  reasonItem: {
    fontSize: "13px",
    color: "#4a5568",
    background: "#f0f7ff",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #d4e3ff",
  },
  warningItem: {
    fontSize: "13px",
    color: "#991b1b",
    background: "#fff5f5",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #fecaca",
  },
  noResults: {
    textAlign: "center",
    padding: "50px 20px",
  },
  noResultsIcon: {
    fontSize: "56px",
    marginBottom: "16px",
  },
  noResultsTitle: {
    fontSize: "19px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 6px 0",
  },
  noResultsText: {
    fontSize: "13px",
    color: "#6c757d",
    margin: 0,
  },
  suggestionBox: {
    marginTop: "24px",
    padding: "16px",
    background: "#f0f7ff",
    borderRadius: "8px",
    border: "1px solid #d4e3ff",
  },
  suggestionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0066cc",
    margin: "0 0 10px 0",
  },
  suggestionList: {
    display: "grid",
    gap: "8px",
  },
  suggestionItem: {
    fontSize: "13px",
    color: "#0a1428",
    lineHeight: "1.5",
  },
  recommendationBox: {
    background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    border: "3px solid #ff9800",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 8px 24px rgba(255, 152, 0, 0.25)",
    animation: "slideIn 0.5s ease",
  },
  recommendationHeader: {
    marginBottom: "20px",
  },
  aiIcon: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#e65100",
    marginBottom: "10px",
    display: "block",
  },
  recommendationAdvice: {
    fontSize: "15px",
    color: "#bf360c",
    fontWeight: "600",
    margin: 0,
    lineHeight: "1.6",
  },
  topSchemeCard: {
    background: "white",
    border: "2px solid #ff9800",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
  },
  topSchemeIcon: {
    fontSize: "32px",
    minWidth: "50px",
    textAlign: "center",
  },
  topSchemeContent: {
    flex: 1,
  },
  topSchemeName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 10px 0",
  },
  topSchemeReason: {
    fontSize: "14px",
    color: "#4a5568",
    margin: 0,
    lineHeight: "1.6",
  },
  recommendationConfidence: {
    fontSize: "13px",
    color: "#0066cc",
    margin: "8px 0 0 0",
    fontWeight: "600",
  },
  confidenceReason: {
    fontSize: "12px",
    color: "#4a5568",
    fontWeight: "400",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#e65100",
    fontWeight: "600",
    padding: "20px",
    animation: "pulse 2s ease-in-out infinite",
  },
  aiActionButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "2px solid #ffb74d",
  },
  aiActionBtn: {
    padding: "14px 18px",
    background: "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: "0 4px 12px rgba(0, 102, 204, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};


// simple heuristic used when AI isn't available or fails
function heuristicRecommendation(schemes) {
  if (!schemes || schemes.length === 0) return null;
  let best = null;
  let bestScore = -Infinity;
  schemes.forEach(s => {
    let score = 0;
    const age = Number(s.minAge || 0);
    // arbitrary scoring: lower income and match on range
    if (s.incomeLimit) score += 30 - Math.min(30, s.incomeLimit / 100000);
    score += (s.minAge && s.maxAge ? 20 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  });
  return {
    bestScheme: {
      schemeName: best.schemeName,
      reason: `Heuristic picked based on low income limit and broad age range`,
    },
    overallAdvice: `Based on your criteria, ${best.schemeName} appears most suitable.`
  };
}

export default EligibilityForm;