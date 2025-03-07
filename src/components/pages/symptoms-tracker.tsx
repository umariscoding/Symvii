"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Plus, Trash2, Pencil, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleDarkMode, initializeTheme } from '@/redux/features/themeSlice';
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';

interface DayData {
  day: string;
  date: string;
  dosage: number;
  unit: string;
  symptom?: string;
  medicineName?: string;
}

interface SymptomsGraph {
  id: string;
  name: string;
  data: DayData[];
}

// Add this interface for the bar click event
interface BarClickData {
  day: string;
  dosage: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const exportToCSV = (data: DayData[], graphName: string) => {
  // Filter out entries with 0 dosage and no symptoms
  const filteredData = data.filter(row => row.dosage > 0 || row.symptom);

  // Calculate total and average dosage
  const totalDosage = filteredData.reduce((sum, row) => sum + row.dosage, 0);
  const avgDosage = totalDosage / filteredData.length || 0;

  // Create CSV content
  const csvContent = [
    ['Date', 'Medicine Name', 'Unit', 'Symptom', 'Dosage'].join(','), // Moved Unit after Medicine Name
    ...filteredData.map(row => [
      row.date,
      row.medicineName || '',
      row.unit || '',  // Moved unit here
      row.symptom || '',
      row.dosage
    ].join(',')),
    '', // Empty line for spacing
    ['Total Dosage', '', '', '', totalDosage].join(','),
    ['Average Dosage', '', '', '', avgDosage.toFixed(2)].join(',')
  ].join('\n');

  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${graphName}_symptoms_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Add this function near the top with other utility functions
function getShortDay(day: string): string {
  return day.charAt(0);
}

// Add this constant for symptoms list
const SYMPTOMS_LIST = [
  "Acid and chemical burns",
  "Allergies",
  "Animal and human bites",
  "Ankle problems",
  "Back problems",
  "Blisters",
  "Bowel incontinence",
  "Breast pain",
  "Breast swelling in men",
  "Breathlessness and cancer",
  "Burns and scalds",
  "Calf problems",
  "Cancer-related fatigue",
  "Catarrh",
  "Chronic pain",
  "Constipation",
  "Cold sore",
  "Cough",
  "Cuts and grazes",
  "Chest pain",
  "Dehydration",
  "Diarrhoea",
  "Dizziness (lightheadedness)",
  "Dry mouth",
  "Earache",
  "Eating and digestion with cancer",
  "Elbow problems",
  "Farting",
  "Feeling of something in your throat (Globus)",
  "Fever in adults",
  "Fever in children",
  "Flu",
  "Foot problems",
  "Genital symptoms",
  "Hair loss and cancer",
  "Hay fever",
  "Headaches",
  "Hearing loss",
  "Hip problems",
  "Indigestion",
  "Itchy bottom",
  "Itchy skin",
  "Insect bites and stings",
  "Knee problems",
  "Living well with COPD",
  "Living with chronic pain",
  "Migraine",
  "Mouth ulcer",
  "Neck problems",
  "Nipple discharge",
  "Nipple inversion (inside out nipple)",
  "Nosebleed",
  "Pain and cancer",
  "Skin rashes in children",
  "Shortness of breath",
  "Shoulder problems",
  "Soft tissue injury advice",
  "Sore throat",
  "Stomach ache and abdominal pain",
  "Sunburn",
  "Swollen glands",
  "Testicular lumps and swellings",
  "Thigh problems",
  "Tick bites",
  "Tinnitus",
  "Toothache",
  "Urinary incontinence",
  "Urinary incontinence in women",
  "Urinary tract infection (UTI)",
  "Urinary tract infection (UTI) in children",
  "Vaginal discharge",
  "Vertigo",
  "Vomiting in adults",
  "Vomiting in children and babies",
  "Warts and verrucas",
  "Wrist, hand and finger problems"
];

export default function SymptomsTrackerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [graphs, setGraphs] = useState<SymptomsGraph[]>([]);
  const [newGraphName, setNewGraphName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedGraphId, setSelectedGraphId] = useState<string>("");
  const [newDosage, setNewDosage] = useState("");
  const [newSymptom, setNewSymptom] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[new Date().getDay()]);
  const [isEditingName, setIsEditingName] = useState<string>("");
  const [editedName, setEditedName] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getWeekStart(new Date())
  );
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newUnit, setNewUnit] = useState("mg");
  const [formErrors, setFormErrors] = useState({
    medicineName: '',
    dosage: '',
    date: '',
    unit: ''
  });
  const [symptomSuggestions, setSymptomSuggestions] = useState<string[]>([]);
  const { t } = useTranslation();

  // Define available units using translations
  const DOSAGE_UNITS = [
    "mg", // milligrams
    "g",  // grams
    "ml", // milliliters
    "mcg", // micrograms
    "IU", // International Units
    "tablets",
    "capsules"
  ];

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/symptoms-tracker');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Separate effect for loading
  useEffect(() => {
    const loadGraphs = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch('https://symvii.com/api/api/medicine-graphs', {
            credentials: 'include'
          });
          const data = await response.json();
          setGraphs(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error(t('symptomsTracker.messages.loadError'), error);
          setGraphs([]);
        }
      }
    };

    loadGraphs();
  }, [isAuthenticated, t]);

  // Separate effect for saving
  useEffect(() => {
    const saveGraphs = async () => {
      if (isAuthenticated && graphs.length > 0) {
        try {
          await fetch('https://symvii.com/api/api/medicine-graphs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(graphs),
          });
        } catch (error) {
          console.error(t('symptomsTracker.messages.saveError'), error);
        }
      }
    };

    // Add a debounce to prevent too frequent saves
    const timeoutId = setTimeout(saveGraphs, 1000);
    return () => clearTimeout(timeoutId);
  }, [graphs, isAuthenticated, t]);

  if (loading || !isAuthenticated) {
    return null;
  }

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleAddGraph = () => {
    if (newGraphName.trim()) {
      const weekStart = getWeekStart(new Date(selectedDate));
      const newGraph: SymptomsGraph = {
        id: Date.now().toString(),
        name: newGraphName,
        data: Array.from({ length: 7 }, (_, i) => {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + i);
          return {
            day: DAYS[i],
            date: date.toISOString().split('T')[0],
            dosage: 0,
            unit: "mg",
          };
        }),
      };
      setGraphs([...graphs, newGraph]);
      setNewGraphName("");
      setIsDialogOpen(false);
    }
  };

  const handleUpdateDosage = (graphId: string) => {
    setSelectedGraphId(graphId);
    
    const graph = graphs.find(g => g.id === graphId);
    const dayData = graph?.data.find(d => d.date === selectedDate);
    if (dayData) {
      setNewDosage(dayData.dosage.toString());
      setNewSymptom(dayData.symptom || '');
      setNewMedicineName(dayData.medicineName || '');
      setNewUnit(dayData.unit || 'mg');
    } else {
      setNewDosage('');
      setNewSymptom('');
      setNewMedicineName('');
      setNewUnit('mg');
    }
    
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteGraph = (graphId: string) => {
    setGraphs(graphs.filter((graph) => graph.id !== graphId));
  };

  const handleDosageSubmit = () => {
    setFormErrors({
      medicineName: '',
      dosage: '',
      date: '',
      unit: ''
    });

    let hasError = false;

    if (!newMedicineName.trim()) {
      setFormErrors(prev => ({
        ...prev,
        medicineName: t('symptomsTracker.form.medicineName.error')
      }));
      hasError = true;
    }

    if (!newDosage) {
      setFormErrors(prev => ({
        ...prev,
        dosage: t('symptomsTracker.form.dosage.error')
      }));
      hasError = true;
    }

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    selectedDateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj.getTime() > today.getTime()) {
      setFormErrors(prev => ({
        ...prev,
        date: t('symptomsTracker.form.dosage.futureDate')
      }));
      hasError = true;
    }

    if (!newUnit) {
      setFormErrors(prev => ({
        ...prev,
        unit: t('symptomsTracker.form.unit.error')
      }));
      hasError = true;
    }

    if (hasError) return;

    const dosageValue = Math.min(Number(newDosage), 20);
    const dayOfWeek = DAYS[selectedDateObj.getDay()];

    setGraphs(
      graphs.map((graph) => {
        if (graph.id === selectedGraphId) {
          const existingDataIndex = graph.data.findIndex(
            (d) => d.date === selectedDate
          );

          if (existingDataIndex >= 0) {
            const newData = [...graph.data];
            newData[existingDataIndex] = {
              ...newData[existingDataIndex],
              dosage: dosageValue,
              unit: newUnit,
              symptom: newSymptom,
              medicineName: newMedicineName,
            };
            return { ...graph, data: newData };
          } else {
            const newData = [...graph.data, {
              day: dayOfWeek,
              date: selectedDate,
              dosage: dosageValue,
              unit: newUnit,
              symptom: newSymptom,
              medicineName: newMedicineName,
            }];
            newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return { ...graph, data: newData };
          }
        }
        return graph;
      })
    );
    setIsUpdateDialogOpen(false);
    setNewDosage("");
    setNewSymptom("");
    setNewMedicineName("");
    setNewUnit("mg");
  };

  const handleUpdateName = async (graphId: string) => {
    if (editedName.trim()) {
      const updatedGraphs = graphs.map((graph) =>
        graph.id === graphId ? { ...graph, name: editedName.trim() } : graph
      );
      setGraphs(updatedGraphs);
      setIsEditingName("");
      setEditedName("");
    }
  };

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }

  function formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    const today = new Date();
    
    // Set both dates to midnight for proper comparison
    today.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);

    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
      setCurrentWeekStart(newDate);
    } else {
      newDate.setDate(newDate.getDate() + 7);
      
      // Check if any graph has data for the new week
      const hasDataForWeek = graphs.some(graph => {
        const weekStart = newDate.toISOString().split('T')[0];
        const weekEnd = new Date(newDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        
        return graph.data.some(entry => {
          const entryDate = entry.date;
          return entryDate >= weekStart && 
                 entryDate <= weekEndStr && 
                 (entry.dosage > 0 || entry.symptom);
        });
      });

      // Allow navigation if there's data or if it's not a future week
      if (hasDataForWeek || newDate <= today) {
        setCurrentWeekStart(newDate);
      }
    }
  };

  // Add this utility function to get week end date
  function getWeekEnd(date: Date): Date {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    return endDate;
  }

  // Add this function to filter data for the current week
  function getWeekData(data: DayData[], weekStart: Date): DayData[] {
    return DAYS.map((day, index) => {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + index);
      const dateStr = currentDate.toLocaleDateString('en-CA');
      
      const existingData = data.find(d => d.date === dateStr);
      
      return {
        day: day,
        date: dateStr,
        dosage: existingData ? existingData.dosage : 0,
        unit: existingData ? existingData.unit : "mg",
        symptom: existingData?.symptom,
        medicineName: existingData?.medicineName
      };
    });
  }

  // Add this function to check if form is valid
  const isFormValid = () => {
    return newMedicineName.trim() !== '' && newDosage !== '';
  };

  // Add this function to handle symptom input changes
  const handleSymptomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSymptom(value);
    setFormErrors(prev => ({ ...prev, symptom: '' }));

    // Filter suggestions based on input
    if (value.length > 0) {
      const filtered = SYMPTOMS_LIST.filter(symptom =>
        symptom.toLowerCase().includes(value.toLowerCase())
      );
      setSymptomSuggestions(filtered);
    } else {
      setSymptomSuggestions([]);
    }
  };

  // Add this function to handle suggestion selection
  const handleSymptomSuggestionClick = (suggestion: string) => {
    setNewSymptom(suggestion);
    setSymptomSuggestions([]);
  };

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 overflow-x-hidden`}>
      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <nav className="fixed top-4 left-4 right-4 z-40">
          <div className="container mx-auto px-6 py-3 bg-background-secondary-light dark:bg-background-secondary-dark rounded-full shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-10 w-10 flex items-center justify-center">
                    <Image
                      src={darkMode ? "/Artboard-2.svg" : "/Artboard-1.svg"}
                      alt={darkMode ? "Symvii Logo Dark" : "Symvii Logo Light"}
                      width={48}
                      height={48}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl font-semibold text-primary dark:text-background-secondary-light">{t('branding.name')}</span>
                </Link>
                <Link href="/" className="text-text-light dark:text-background-secondary-light hover:text-primary dark:hover:text-primary">
                  {t('symptomsTracker.navigation.home')}
                </Link>
              </div>
              <Button onClick={handleDarkModeToggle} variant="ghost" size="icon">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {t('symptomsTracker.title')}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            {/* Week Navigation Card */}
            <Card className="w-full bg-white/50 dark:bg-[#3A3937]/50 border-none shadow-lg">
              <CardContent className="flex items-center justify-between p-4">
                <Button
                  onClick={() => navigateWeek('prev')}
                  variant="ghost"
                  className="hover:bg-[#B17457]/10 text-[#B17457] hover:text-[#B17457] transition-all duration-300"
                  size="sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-[#B17457] to-[#D8D2C2] bg-clip-text text-transparent">
                    {formatDateForDisplay(currentWeekStart)}
                    <span className="mx-2 text-[#B17457]">→</span>
                    {formatDateForDisplay(getWeekEnd(currentWeekStart))}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {t('symptomsTracker.weekNavigation.weekOverview')}
                  </p>
                </div>
                
                <Button
                  onClick={() => navigateWeek('next')}
                  variant="ghost"
                  className="hover:bg-[#B17457]/10 text-[#B17457] hover:text-[#B17457] transition-all duration-300 disabled:opacity-50"
                  size="sm"
                  disabled={
                    // Check if next week has any data
                    !graphs.some(graph => {
                      const nextWeekStart = new Date(currentWeekStart);
                      nextWeekStart.setDate(nextWeekStart.getDate() + 7);
                      const weekStart = nextWeekStart.toISOString().split('T')[0];
                      const weekEnd = new Date(nextWeekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      const weekEndStr = weekEnd.toISOString().split('T')[0];
                      
                      return graph.data.some(entry => 
                        entry.date >= weekStart && 
                        entry.date <= weekEndStr && 
                        (entry.dosage > 0 || entry.symptom)
                      );
                    }) && 
                    // And if it's not the current week or earlier
                    getWeekEnd(currentWeekStart) >= new Date(new Date().setHours(0, 0, 0, 0))
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex-1 sm:flex-none bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300 shadow-md hover:shadow-lg dark:shadow-[#4A4947]/30"
                  >
                    <Plus className="mr-2 h-4 w-4" /> {t('symptomsTracker.buttons.addRecord')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#FAF7F0] dark:bg-[#4A4947] border border-[#D8D2C2] dark:border-[#B17457]">
                  <DialogHeader>
                    <DialogTitle className="text-[#4A4947] dark:text-[#FAF7F0]">
                      {t('symptomsTracker.dialog.addRecord.title')}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label
                        htmlFor="graphName"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        {t('symptomsTracker.dialog.addRecord.symptomName.label')}
                      </Label>
                      <Input
                        id="graphName"
                        value={newGraphName}
                        onChange={(e) => setNewGraphName(e.target.value)}
                        placeholder={t('symptomsTracker.dialog.addRecord.symptomName.placeholder')}
                        className="mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0]"
                      />
                    </div>
                    <Button
                      onClick={handleAddGraph}
                      className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300"
                    >
                      {t('symptomsTracker.buttons.createGraph')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent className="bg-[#FAF7F0] dark:bg-[#4A4947] border border-[#D8D2C2] dark:border-[#B17457]">
              <DialogHeader>
                <DialogTitle className="text-[#4A4947] dark:text-[#FAF7F0]">
                  {t('symptomsTracker.dialog.updateDosage.title')}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label
                    htmlFor="date"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('symptomsTracker.form.date.label')}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setFormErrors(prev => ({ ...prev, date: '' }));
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    className={`mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] ${
                      formErrors.date ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="medicineName"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('symptomsTracker.form.medicineName.label')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="medicineName"
                    value={newMedicineName}
                    onChange={(e) => {
                      setNewMedicineName(e.target.value);
                      setFormErrors(prev => ({ ...prev, medicineName: '' }));
                    }}
                    placeholder={t('symptomsTracker.form.medicineName.placeholder')}
                    className={`mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] ${
                      formErrors.medicineName ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {formErrors.medicineName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.medicineName}</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="dosage"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('symptomsTracker.form.dosage.placeholder')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dosage"
                    type="number"
                    value={newDosage}
                    onChange={(e) => {
                      setNewDosage(e.target.value);
                      setFormErrors(prev => ({ ...prev, dosage: '' }));
                    }}
                    placeholder={t('symptomsTracker.form.dosage.placeholder')}
                    min="0"
                    max="20"
                    className={`mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] ${
                      formErrors.dosage ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {formErrors.dosage && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.dosage}</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="unit"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('symptomsTracker.form.unit.label')} <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="unit"
                    value={newUnit}
                    onChange={(e) => {
                      setNewUnit(e.target.value);
                      setFormErrors(prev => ({ ...prev, unit: '' }));
                    }}
                    className={`w-full mt-1 px-3 py-2 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] rounded-md border ${
                      formErrors.unit ? 'border-red-500' : 'border-[#B17457]/20'
                    } focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent`}
                    required
                  >
                    {DOSAGE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  {formErrors.unit && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.unit}</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="symptom"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('symptomsTracker.form.symptom.placeholder')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="symptom"
                      value={newSymptom}
                      onChange={handleSymptomChange}
                      placeholder={t('aiDoctor.consultation.form.symptom.label')}
                      className="mt-1 bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0]"
                    />
                    {symptomSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#3A3937] border border-[#D8D2C2] dark:border-[#B17457] rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {symptomSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-[#B17457]/10 text-[#4A4947] dark:text-[#FAF7F0]"
                            onClick={() => handleSymptomSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleDosageSubmit}
                  className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid()}
                >
                  {t('symptomsTracker.dialog.updateDosage.title')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid gap-8">
            {graphs.map((graph) => (
              <Card
                key={graph.id}
                className="bg-white/50 dark:bg-[#4A4947]/90 shadow-xl border-none hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    {isEditingName === graph.id ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-2xl font-bold bg-white/50 dark:bg-[#3A3937]/50 border-[#B17457]/20 focus:border-[#B17457] transition-all duration-300"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateName(graph.id);
                            if (e.key === 'Escape') {
                              setIsEditingName("");
                              setEditedName("");
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleUpdateName(graph.id)}
                          className="bg-[#B17457] hover:bg-[#B17457]/90 text-white"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#B17457] to-[#D8D2C2] bg-clip-text text-transparent">
                          {graph.name}
                        </h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setIsEditingName(graph.id);
                            setEditedName(graph.name);
                          }}
                          className="h-8 w-8 hover:bg-[#B17457]/10 text-[#B17457]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button
                        onClick={() => handleUpdateDosage(graph.id)}
                        className="bg-[#B17457] hover:bg-[#B17457]/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Plus className="mr-2 h-4 w-4" /> {t('symptomsTracker.buttons.addDosage')}
                      </Button>
                      <Button
                        onClick={() => exportToCSV(graph.data, graph.name)}
                        variant="outline"
                        className="border-[#B17457]/20 hover:bg-[#B17457]/10 transition-all duration-300"
                      >
                        <Download className="mr-2 h-4 w-4" /> {t('symptomsTracker.buttons.export')}
                      </Button>
                      <Button
                        onClick={() => handleDeleteGraph(graph.id)}
                        variant="outline"
                        className="border-[#B17457]/20 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full overflow-hidden bg-white/80 dark:bg-[#3A3937]/80 rounded-xl p-4 shadow-inner">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={getWeekData(graph.data, currentWeekStart)}
                        margin={{ 
                          top: 20, 
                          right: 10, // reduced right margin
                          left: 10,  // reduced left margin
                          bottom: 5 
                        }}
                      >
                        <defs>
                          <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF6B6B" stopOpacity={1} />
                            <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.7} />
                          </linearGradient>
                          <linearGradient id="regularNeonGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#B17457" stopOpacity={1} />
                            <stop offset="100%" stopColor="#B17457" stopOpacity={0.7} />
                          </linearGradient>
                          <filter id="neonGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={darkMode ? "#D8D2C2" : "#4A4947"}
                          opacity={0.2}
                          horizontal={true}
                          vertical={true}
                          strokeWidth={1}
                        />
                        <XAxis
                          dataKey="day"
                          stroke={darkMode ? "#FAF7F0" : "#4A4947"}
                          tick={{ 
                            fontSize: 12, 
                            fontWeight: 500 
                          }}
                          tickFormatter={(value) => {
                            // Use window.innerWidth to determine screen size
                            return typeof window !== 'undefined' && window.innerWidth < 640 
                              ? getShortDay(value) 
                              : value;
                          }}
                          tickLine={{
                            stroke: darkMode ? "#D8D2C2" : "#4A4947",
                            opacity: 0.3,
                          }}
                          axisLine={{
                            stroke: darkMode ? "#D8D2C2" : "#4A4947",
                            opacity: 0.3,
                          }}
                        />
                        <YAxis
                          domain={[0, 20]}
                          stroke={darkMode ? "#FAF7F0" : "#4A4947"}
                          tick={{ fontSize: 12, fontWeight: 500 }}
                          tickLine={{
                            stroke: darkMode ? "#D8D2C2" : "#4A4947",
                            opacity: 0.3,
                          }}
                          axisLine={{
                            stroke: darkMode ? "#D8D2C2" : "#4A4947",
                            opacity: 0.3,
                          }}
                          tickCount={5}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#4A4947" : "#FAF7F0",
                            border: `1px solid ${darkMode ? "#B17457" : "#D8D2C2"}`,
                            color: darkMode ? "#FAF7F0" : "#4A4947",
                            borderRadius: "8px",
                            padding: "8px 12px",
                          }}
                          formatter={(value: number, name: string, props: any) => {
                            const dataPoint = props.payload;
                            return [
                              <>
                                <div className="font-semibold">{dataPoint.date}</div>
                                {dataPoint.medicineName && (
                                  <div className="text-sm">{`Medicine: ${dataPoint.medicineName}`}</div>
                                )}
                                <div>{`${value} ${dataPoint.unit || 'doses'}`}</div>
                                {dataPoint.symptom && (
                                  <div className="text-sm opacity-80">{`Symptoms: ${dataPoint.symptom}`}</div>
                                )}
                              </>,
                              "",
                            ];
                          }}
                          labelFormatter={() => ""}
                          cursor={{
                            fill: darkMode ? "#D8D2C2" : "#4A4947",
                            opacity: 0.1,
                          }}
                        />
                        <Bar
                          dataKey="dosage"
                          radius={[4, 4, 0, 0]}
                          onClick={(data: any) => {
                            const barData = data as unknown as BarClickData;
                            handleUpdateDosage(graph.id);
                          }}
                        >
                          {getWeekData(graph.data, currentWeekStart).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              cursor="pointer"
                              fill={entry.symptom ? "url(#neonGradient)" : "url(#regularNeonGradient)"}
                              filter="url(#neonGlow)"
                              className="transition-all duration-300"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    
      {/* Footer */}
      <footer className="bg-[#4A4947] dark:bg-[#2A2927] py-16">
        <div className="container mx-auto px-4">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 space-y-8 md:space-y-0">
            {/* Brand Section */}
            <div className="max-w-sm">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10">
                  <Image
                    src="/Artboard-2.svg"
                    alt="Symvii Logo"
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-white">
                  {t('branding.name')}
                </span>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('footer.brand.description')}
              </p>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-8">
              <div>
                <h3 className="text-white font-semibold mb-4">{t('footer.navigation.product.title')}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.product.items.features')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#benefits" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.product.items.benefits')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.product.items.testimonials')}
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">{t('footer.navigation.tools.title')}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/bmi-calculator" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.tools.items.bmiCalculator')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/ai-doctor" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.tools.items.aiDoctor')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/symptoms-tracker" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.tools.items.symptomsTracker')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">{t('footer.navigation.support.title')}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#faqs" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.support.items.faqs')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      {t('footer.navigation.support.items.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">{t('footer.navigation.connect.title')}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="https://twitter.com/symvii" 
                      target="_blank"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {t('footer.navigation.connect.items.twitter')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="https://linkedin.com/company/symvii" 
                      target="_blank"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {t('footer.navigation.connect.items.linkedin')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="https://github.com/symvii" 
                      target="_blank"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {t('footer.navigation.connect.items.github')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-700">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
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
