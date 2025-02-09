"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toggleDarkMode, initializeTheme } from "@/redux/features/themeSlice";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Condition {
  id: string;
  title: string;
  description: string;
  diagnosis_date: string;
  medications: string[];
}

export default function MedicalHistoryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
  });
  const [newCondition, setNewCondition] = useState({
    title: "",
    description: "",
    diagnosis_date: new Date().toISOString().split('T')[0],
    medications: [] as string[],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState("");

  const CONDITIONS_LIST = [
    "Abdominal aortic aneurysm",
    "Achilles tendinopathy",
    "Acne",
    "Acute cholecystitis",
    "Acute lymphoblastic leukaemia",
    "Acute lymphoblastic leukaemia: Children",
    "Acute lymphoblastic leukaemia: Teenagers and young adults",
    "Acute myeloid leukaemia",
    "Acute myeloid leukaemia: Children",
    "Acute myeloid leukaemia: Teenagers and young adults",
    "Acute pancreatitis",
    "Addison's disease",
    "Adenomyosis",
    "Alcohol-related liver disease",
    "Allergic rhinitis",
    "Allergies",
    "Alzheimer's disease",
    "Anal cancer",
    "Anaphylaxis",
    "Angina",
    "Angioedema",
    "Ankle sprain",
    "Ankle avulsion fracture",
    "Ankylosing spondylitis",
    "Anorexia nervosa",
    "Anxiety",
    "Anxiety disorders in children",
    "Appendicitis",
    "Arterial thrombosis",
    "Arthritis",
    "Asbestosis",
    "Asthma",
    "Ataxia",
    "Atopic eczema",
    "Atrial fibrillation",
    "Attention deficit hyperactivity disorder (ADHD)",
    "Autism",
    "Back problems",
    "Bacterial vaginosis",
    "Benign prostate enlargement",
    "Bile duct cancer (cholangiocarcinoma)",
    "Binge eating",
    "Bipolar disorder",
    "Bladder cancer",
    "Blood poisoning (sepsis)",
    "Bone cancer",
    "Bone cancer: Teenagers and young adults",
    "Bowel cancer",
    "Bowel incontinence",
    "Bowel polyps",
    "Brain stem death",
    "Brain tumours",
    "Brain tumours: Children",
    "Brain tumours: Teenagers and young adults",
    "Breast cancer (female)",
    "Breast cancer (male)",
    "Bronchiectasis",
    "Bronchitis",
    "Bulimia nervosa",
    "Bunion",
    "Carcinoid syndrome and carcinoid tumours",
    "Cardiovascular disease",
    "Carpal tunnel syndrome",
    "Catarrh",
    "Cellulitis",
    "Cerebral palsy",
    "Cervical cancer",
    "Cervical spondylosis",
    "Chest and rib injury",
    "Chest infection",
    "Chickenpox",
    "Chilblains",
    "Chlamydia",
    "Chronic fatigue syndrome",
    "Chronic kidney disease",
    "Chronic lymphocytic leukaemia",
    "Chronic myeloid leukaemia",
    "Chronic obstructive pulmonary disease (COPD)",
    "Chronic pain",
    "Chronic pancreatitis",
    "Cirrhosis",
    "Clavicle (collar bone) fracture",
    "Clostridium difficile",
    "Coeliac disease",
    "Cold sore",
    "Coma",
    "Common cold",
    "Concussion",
    "Congenital heart disease",
    "Conjunctivitis",
    "Constipation",
    "Coronary heart disease",
    "Coronavirus (COVID-19)",
    "Coronavirus (COVID-19): Longer-term effects (long COVID)",
    "Costochondritis",
    "Cough",
    "Crohn's disease",
    "Croup",
    "Cystic fibrosis",
    "Cystitis",
    "Deafblindness",
    "Deep vein thrombosis",
    "Degenerative cervical myelopathy",
    "Dehydration",
    "Delirium",
    "Dementia",
    "Dental abscess",
    "Depression",
    "Dermatitis herpetiformis",
    "Diabetic retinopathy",
    "Diarrhoea",
    "Discoid eczema",
    "Diverticular disease and diverticulitis",
    "Dizziness (Lightheadedness)",
    "Down's syndrome",
    "Dry mouth",
    "Dysphagia (swallowing problems)",
    "Dystonia",
    "Earache",
    "Earwax build-up",
    "Ebola virus disease",
    "Ectopic pregnancy",
    "Elbow (radial head or neck) fracture",
    "Edwards' syndrome",
    "Endometriosis",
    "Epilepsy",
    "Erectile dysfunction (impotence)",
    "Escherichia coli (E. coli) O157",
    "Ewing sarcoma",
    "Ewing sarcoma: Children",
    "Eye cancer",
    "Eating disorders",
    "Yellow fever",
    "Zika virus",
    "Farting",
    "Febrile seizures",
    "Feeling of something in your throat (Globus)",
    "Fever in adults",
    "Fever in children",
    "Fibroids",
    "Fibromyalgia",
    "Flu",
    "Foetal alcohol syndrome",
    "Food allergy",
    "Food poisoning",
    "Fragility fracture of the hip",
    "Frozen shoulder",
    "Functional neurological disorder (FND)",
    "Fungal nail infection",
    "Gallbladder cancer",
    "Gallstones",
    "Ganglion cyst",
    "Gastroenteritis",
    "Gastro-oesophageal reflux disease (GORD)",
    "Genital herpes",
    "Genital symptoms",
    "Genital warts",
    "Germ cell tumours",
    "Glandular fever",
    "Golfers elbow",
    "Gonorrhoea",
    "Gout",
    "Greater trochanteric pain syndrome",
    "Gum disease",
    "Haemorrhoids (piles)",
    "Hand, foot and mouth disease",
    "Hay fever",
    "Head and neck cancer",
    "Head lice and nits",
    "Headaches",
    "Hearing loss",
    "Heart attack",
    "Heart block",
    "Heart failure",
    "Heart palpitations",
    "Hepatitis A",
    "Hepatitis B",
    "Hepatitis C",
    "Hiatus hernia",
    "High blood pressure (hypertension)",
    "High cholesterol",
    "HIV",
    "Hives",
    "Hodgkin lymphoma",
    "Hodgkin lymphoma: Children",
    "Hodgkin lymphoma: Teenagers and young adults",
    "Huntington's disease",
    "Hydrocephalus",
    "Hyperglycaemia (high blood sugar)",
    "Hyperhidrosis",
    "Hypoglycaemia (low blood sugar)",
    "Idiopathic pulmonary fibrosis",
    "If your child has cold or flu symptoms",
    "Impetigo",
    "Indigestion",
    "Ingrown toenail",
    "Infertility",
    "Inflammatory bowel disease (IBD)",
    "Inherited heart conditions",
    "Insomnia",
    "Iron deficiency anaemia",
    "Irritable bowel syndrome (IBS)",
    "Itching",
    "Itchy bottom",
    "Itchy skin",
    "Joint hypermobility",
    "Kaposi's sarcoma",
    "Kidney cancer",
    "Kidney infection",
    "Kidney stones",
    "Labyrinthitis",
    "Lactose intolerance",
    "Laryngeal (larynx) cancer",
    "Laryngitis",
    "Leg cramps",
    "Lichen planus",
    "Lipoedema",
    "Liver cancer",
    "Liver disease",
    "Liver tumours",
    "Long-term effects of COVID-19",
    "Loss of libido",
    "Low blood pressure",
    "Lung cancer",
    "Lupus",
    "Lyme disease",
    "Lymphoedema",
    "Lymphogranuloma venereum (LGV)",
    "Malaria",
    "Malignant brain tumour (cancerous)",
    "Malnutrition",
    "Managing genital symptoms",
    "Measles",
    "Meningitis",
    "Meniere's disease",
    "Menopause",
    "Mesothelioma",
    "Metacarpal fracture of the hand",
    "Middle ear infection (otitis media)",
    "Migraine",
    "Minor head injury",
    "Miscarriage",
    "Motor neurone disease (MND)",
    "Mouth cancer",
    "Mouth ulcer",
    "Multiple myeloma",
    "Multiple sclerosis (MS)",
    "Multiple system atrophy (MSA)",
    "Mumps",
    "Munchausen's syndrome",
    "Muscular dystrophy",
    "Myalgic encephalomyelitis (ME) or chronic fatigue syndrome (CFS)",
    "Myasthenia gravis",
    "Nasal and sinus cancer",
    "Nasopharyngeal cancer",
    "Neck problems",
    "Neuroblastoma: Children",
    "Neuroendocrine tumours",
    "Non-alcoholic fatty liver disease (NAFLD)",
    "Non-Hodgkin lymphoma",
    "Non-Hodgkin lymphoma: Children",
    "Norovirus",
    "Nosebleed",
    "Obesity",
    "Obsessive compulsive disorder (OCD)",
    "Obstructive sleep apnoea",
    "Oesophageal cancer",
    "Oral thrush in adults",
    "Osteoarthritis",
    "Osteoarthritis of the hip",
    "Osteoarthritis of the knee",
    "Osteoarthritis of the thumb",
    "Osteoporosis",
    "Osteosarcoma",
    "Outer ear infection (otitis externa)",
    "Ovarian cancer",
    "Ovarian cancer: Teenagers and young adults",
    "Ovarian cyst",
    "Overactive thyroid",
    "Pain in the ball of the foot",
    "Paget's disease of the nipple",
    "Pancreatic cancer",
    "Panic disorder",
    "Parkinson's disease",
    "Patau's syndrome",
    "Patellofemoral pain syndrome",
    "Pelvic inflammatory disease",
    "Pelvic organ prolapse",
    "Penile cancer",
    "Peripheral neuropathy",
    "Personality disorder",
    "PIMS",
    "Plantar heel pain",
    "Pleurisy",
    "Pneumonia",
    "Polio",
    "Polycystic ovary syndrome (PCOS)",
    "Polymyalgia rheumatica",
    "Post-concussion syndrome",
    "Post-polio syndrome",
    "Post-traumatic stress disorder (PTSD)",
    "Postural orthostatic tachycardia syndrome (PoTS)",
    "Postnatal depression",
    "Pregnancy and baby",
    "Pressure ulcers",
    "Progressive supranuclear palsy (PSP)",
    "Prostate cancer",
    "Psoriasis",
    "Psoriatic arthritis",
    "Psychosis",
    "Pubic lice",
    "Pulmonary hypertension",
    "Phobias",
    "Rare conditions",
    "Rare tumours",
    "Raynaud's phenomenon",
    "Reactive arthritis",
    "Restless legs syndrome",
    "Respiratory syncytical virus (RSV)",
    "Retinoblastoma: Children",
    "Rhabdomyosarcoma",
    "Rheumatoid arthritis",
    "Ringworm and other fungal infections",
    "Rosacea",
    "Scabies",
    "Scarlet fever",
    "Schizophrenia",
    "Sciatica",
    "About scoliosis",
    "Seasonal affective disorder (SAD)",
    "Sepsis",
    "Septic shock",
    "Severe head injury",
    "Shingles",
    "Shortness of breath",
    "Sickle cell disease",
    "Sinusitis",
    "Sjogren's syndrome",
    "Skin cancer (melanoma)",
    "Skin cancer (non-melanoma)",
    "Skin light sensitivity (photosensitivity)",
    "Skin rashes in children",
    "Slapped cheek syndrome",
    "Soft tissue sarcomas",
    "Soft tissue sarcomas: Teenagers and young adults",
    "Sore throat",
    "Spina bifida",
    "Spinal stenosis",
    "Spleen problems and spleen removal",
    "Stillbirth",
    "Stomach ache and abdominal pain",
    "Stomach cancer",
    "Stomach ulcer",
    "Streptococcus A (strep A)",
    "Stress, anxiety and low mood",
    "Stroke",
    "Subacromial pain syndrome",
    "Sudden infant death syndrome (SIDS)",
    "Suicide",
    "Sunburn",
    "Supraventricular tachycardia",
    "Swollen glands",
    "Syphilis",
    "Self-harm",
    "Tennis elbow",
    "Testicular cancer",
    "Testicular cancer: Teenagers and young adults",
    "Testicular lumps and swellings",
    "Thirst",
    "Threadworms",
    "Thrush",
    "Thumb fracture",
    "Thyroid cancer",
    "Thyroid cancer: Teenagers and young adults",
    "Tick bites",
    "Tinnitus",
    "Tonsillitis",
    "Tooth decay",
    "Toothache",
    "Tourette's syndrome",
    "Transient ischaemic attack (TIA)",
    "Transverse myelitis",
    "Trichomonas infection",
    "Trigeminal neuralgia",
    "Tuberculosis (TB)",
    "Type 1 diabetes",
    "Type 2 diabetes",
    "Ulcerative colitis",
    "Underactive thyroid",
    "Urinary incontinence",
    "Urinary incontinence in women",
    "Urinary tract infection (UTI)",
    "Urinary tract infection (UTI) in children",
    "Urticaria (hives)",
    "Vaginal cancer",
    "Vaginal discharge",
    "Varicose eczema",
    "Varicose veins",
    "Venous leg ulcer",
    "Vertigo",
    "Vitamin B12 or folate deficiency anaemia",
    "Vomiting in adults",
    "Vomiting in children and babies",
    "Vulval cancer",
    "Warts and verrucas",
    "Whiplash",
    "Whooping cough",
    "Wilms' tumour",
    "Wolff-Parkinson-White syndrome",
    "Womb (uterus) cancer",
    "Wrist fracture",
    "Yellow fever",
    "Zika virus"
  ];

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/medical-history");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchConditions = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch(
            "http://localhost:8000/api/medical-conditions",
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          setConditions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching conditions:", error);
          setConditions([]);
        }
      }
    };
    fetchConditions();
  }, [isAuthenticated]);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = {
      title: !newCondition.title ? "Title is required" : "",
      description: !newCondition.description ? "Description is required" : "",
    };

    if (Object.values(errors).some((error) => error)) {
      setFormErrors(errors);
      return;
    }

    try {
      // Format the date to YYYY-MM-DD string for the backend
      const formattedCondition = {
        ...newCondition,
        diagnosis_date: newCondition.diagnosis_date ? new Date(newCondition.diagnosis_date).toISOString().split('T')[0] : null
      };

      const response = await fetch(
        "http://localhost:8000/api/medical-conditions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formattedCondition),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConditions((prevConditions) => [...prevConditions, data]);
        setNewCondition({
          title: "",
          description: "",
          diagnosis_date: new Date().toISOString().split('T')[0],
          medications: []
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding condition:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/medical-conditions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setConditions(conditions.filter((condition) => condition.id !== id));
    } catch (error) {
      console.error("Error deleting condition:", error);
    }
  };

  const filteredConditions = conditions.filter(condition => {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check title
    const titleMatch = condition.title.toLowerCase().includes(searchTermLower);
    
    // Check description
    const descriptionMatch = condition.description.toLowerCase().includes(searchTermLower);
    
    // Check medications
    const medicationsMatch = condition.medications?.some(med => 
      med.toLowerCase().includes(searchTermLower)
    );
    
    // Check diagnosis date
    const dateStr = new Date(condition.diagnosis_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toLowerCase();
    const dateMatch = dateStr.includes(searchTermLower);

    // Return true if any field matches
    return titleMatch || descriptionMatch || medicationsMatch || dateMatch;
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCondition({
      ...newCondition,
      title: value,
    });
    setFormErrors((prev) => ({ ...prev, title: "" }));

    if (value.length > 0) {
      const filtered = CONDITIONS_LIST.filter(condition =>
        condition.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewCondition({
      ...newCondition,
      title: suggestion,
    });
    setSuggestions([]);
  };

  const handleAddMedication = () => {
    if (medicationInput.trim() && !newCondition.medications.includes(medicationInput.trim())) {
      setNewCondition({
        ...newCondition,
        medications: [...newCondition.medications, medicationInput.trim()]
      });
      setMedicationInput("");
    }
  };

  const handleRemoveMedication = (medicationToRemove: string) => {
    setNewCondition({
      ...newCondition,
      medications: newCondition.medications.filter(med => med !== medicationToRemove)
    });
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-[#FAF7F0] dark:bg-[#4A4947] text-[#4A4947] dark:text-[#FAF7F0] min-h-screen">
        {/* Navigation - Made responsive */}
        <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-2">
          <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#D8D2C2] dark:bg-[#3A3937] rounded-none sm:rounded-full shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center">
                    <Image
                      src={darkMode ? "/Artboard-2.svg" : "/Artboard-1.svg"}
                      alt={darkMode ? "Symvii Logo Dark" : "Symvii Logo Light"}
                      width={48}
                      height={48}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-[#B17457] dark:text-[#D8D2C2]">
                    Symvii
                  </span>
                </Link>
                <Link
                  href="/"
                  className="text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457] hidden sm:block"
                >
                  Home
                </Link>
              </div>
              <Button
                onClick={handleDarkModeToggle}
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content - Updated styling */}
        <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-[#B17457] to-[#D8935D] bg-clip-text text-transparent">
              Medical History
            </h1>
            
            {/* Search and Quick Actions - Updated layout */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-10">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/80 dark:bg-[#3A3937]/80 backdrop-blur-sm text-[#4A4947] dark:text-[#FAF7F0] pl-10 h-12 rounded-xl border-2 border-[#D8D2C2] dark:border-[#3A3937] focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-[#B17457] to-[#D8935D] hover:from-[#B17457]/90 hover:to-[#D8935D]/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-medium"
                  >
                    <Plus className="mr-2 h-5 w-5" /> Add Medical Condition
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#FAF7F0] dark:bg-[#4A4947] border border-[#D8D2C2] dark:border-[#B17457] w-[95%] sm:w-full max-w-lg mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#4A4947] dark:text-[#FAF7F0] text-xl sm:text-2xl">
                      Add Medical Condition
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        Condition Title <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="title"
                          value={newCondition.title}
                          onChange={handleTitleChange}
                          placeholder="Enter condition name"
                          className={`mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] ${
                            formErrors.title ? "border-red-500" : ""
                          }`}
                          required
                        />
                        {suggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#3A3937] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-[#4A4947] dark:text-[#FAF7F0]"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {formErrors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.title}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="diagnosis_date"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        Date of Diagnosis <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="diagnosis_date"
                        value={newCondition.diagnosis_date}
                        onChange={(e) => setNewCondition({
                          ...newCondition,
                          diagnosis_date: e.target.value
                        })}
                        className="mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0]"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="medications"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        Medications
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="medications"
                          value={medicationInput}
                          onChange={(e) => setMedicationInput(e.target.value)}
                          placeholder="Enter medication name"
                          className="mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0]"
                        />
                        <Button
                          type="button"
                          onClick={handleAddMedication}
                          className="mt-1 bg-[#B17457] hover:bg-[#B17457]/90"
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newCondition.medications.map((med, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-[#D8D2C2] dark:bg-[#3A3937] px-2 py-1 rounded-full"
                          >
                            <span className="text-sm text-[#4A4947] dark:text-[#FAF7F0]">{med}</span>
                            <button
                              onClick={() => handleRemoveMedication(med)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={newCondition.description}
                        onChange={(e) => {
                          setNewCondition({
                            ...newCondition,
                            description: e.target.value,
                          });
                          setFormErrors((prev) => ({ ...prev, description: "" }));
                        }}
                        placeholder="Enter condition details"
                        className={`mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] ${
                          formErrors.description ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.description}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300"
                    >
                      Add Condition
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Conditions Grid - Updated card styling */}
            <div className="grid gap-6">
              {filteredConditions.map((condition) => (
                <Card 
                  key={condition.id} 
                  className="bg-white/80 dark:bg-[#3A3937]/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-[#D8D2C2]/20 dark:border-[#3A3937]/20"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {/* Header Section - Updated styling */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-[#B17457] to-[#D8935D] bg-clip-text text-transparent">
                            {condition.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {condition.diagnosis_date && (
                              <span className="px-4 py-1.5 rounded-full bg-[#FAF7F0] dark:bg-[#4A4947] text-sm text-[#4A4947] dark:text-[#D8D2C2] font-medium border border-[#B17457]/20 dark:border-[#D8D2C2]/20">
                                Diagnosed: {new Date(condition.diagnosis_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description Section - Updated styling */}
                        <div className="mb-5">
                          <h4 className="text-sm font-semibold text-[#4A4947] dark:text-[#FAF7F0] mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-[#4A4947] dark:text-[#FAF7F0] leading-relaxed bg-[#FAF7F0] dark:bg-[#4A4947] p-4 rounded-xl border border-[#B17457]/10 dark:border-[#D8D2C2]/10">
                            {condition.description}
                          </p>
                        </div>

                        {/* Medications Section - Updated styling */}
                        {condition.medications && condition.medications.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#4A4947] dark:text-[#FAF7F0] mb-2">
                              Current Medications
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {condition.medications.map((med, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-1.5 rounded-full bg-[#D8D2C2]/50 dark:bg-[#3A3937]/50 text-sm text-[#4A4947] dark:text-[#D8D2C2] border border-[#B17457]/20 dark:border-[#D8D2C2]/20 backdrop-blur-sm"
                                >
                                  {med}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete Button - Updated styling */}
                      <Button
                        onClick={() => handleDelete(condition.id)}
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full w-10 h-10 p-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Empty State - Updated styling */}
              {filteredConditions.length === 0 && (
                <div className="text-center py-16 bg-white/80 dark:bg-[#3A3937]/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-[#D8D2C2]/20 dark:border-[#3A3937]/20">
                  <p className="text-[#4A4947] dark:text-[#D8D2C2] text-xl font-medium mb-2">
                    {searchTerm ? 'No conditions found matching your search.' : 'No medical conditions added yet.'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Click the "Add Medical Condition" button to get started.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Made responsive */}
        <footer className="bg-[#4A4947] dark:bg-[#2A2927] py-8 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              {/* Brand Section */}
              <div className="w-full md:max-w-sm">
                <Link href="/" className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10">
                    <Image
                      src="/Artboard-2.svg"
                      alt="Symvii Logo"
                      width={40}
                      height={40}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">Symvii</span>
                </Link>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Empowering healthcare through AI-driven insights and
                  personalized tracking, making health management seamless and
                  intelligent.
                </p>
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-x-16 w-full md:w-auto">
                <div>
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#features"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#benefits"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Benefits
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#testimonials"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Testimonials
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Tools</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/bmi-calculator"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        BMI Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ai-doctor"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        AI Doctor
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/symptoms-tracker"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Symptoms Tracker
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Support</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#faqs"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        FAQs
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#contact"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Connect</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="https://twitter.com/symvii"
                        target="_blank"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Twitter
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://linkedin.com/company/symvii"
                        target="_blank"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        LinkedIn
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://github.com/symvii"
                        target="_blank"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        GitHub
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 text-xs sm:text-sm">
                  &copy; {new Date().getFullYear()} Symvii. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
