"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toggleDarkMode, initializeTheme } from "@/redux/features/themeSlice";
import GaugeChart from "react-gauge-chart";
import { useTranslation } from 'react-i18next';

export default function BMICalculator() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [bmi, setBMI] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if ((height || (feet && inches)) && weight) {
      let heightInMeters: number;

      // Handle different height unit conversions
      if (heightUnit === "ft") {
        heightInMeters =
          parseFloat(feet) * 0.3048 + parseFloat(inches) * 0.0254;
      } else {
        heightInMeters = parseFloat(height);
        if (heightUnit === "in") heightInMeters = heightInMeters * 0.0254;
        else if (heightUnit === "cm") heightInMeters = heightInMeters / 100;
      }

      let weightInKg = parseFloat(weight);
      if (weightUnit === "lbs") weightInKg = weightInKg * 0.453592;

      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBMI(parseFloat(calculatedBMI.toFixed(2)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const calculateRotation = (bmi: number) => {
    const minBMI = 15;
    const maxBMI = 40;
    const rotation = ((bmi - minBMI) / (maxBMI - minBMI)) * 180 - 90;
    return Math.min(Math.max(rotation, -90), 90);
  };

  const getGaugeValue = (bmi: number) => {
    const minBMI = 15;
    const maxBMI = 40;
    return Math.min(Math.max((bmi - minBMI) / (maxBMI - minBMI), 0), 1);
  };

  // Add BMI ranges for the gauge chart
  const bmiRanges = [
    { label: t('bmiCalculator.results.categories.underweight'), range: "< 18.5", color: "#D8D2C2" },
    { label: t('bmiCalculator.results.categories.normal'), range: "18.5-24.9", color: "#B17457" },
    { label: t('bmiCalculator.results.categories.overweight'), range: "25-29.9", color: "#E6A57E" },
    { label: t('bmiCalculator.results.categories.obese'), range: "≥ 30", color: "#8B4513" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-[#FAF7F0] dark:bg-[#4A4947] text-[#4A4947] dark:text-[#FAF7F0] min-h-screen">
        <nav className="fixed top-4 left-4 right-4 z-40">
          <div className="container mx-auto px-6 py-3 bg-[#D8D2C2] dark:bg-[#3A3937] rounded-full shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-12 w-12 flex items-center justify-center">
                    <Image
                      src={darkMode ? "/Artboard-2.svg" : "/Artboard-1.svg"}
                      alt={darkMode ? "Symvii Logo Dark" : "Symvii Logo Light"}
                      width={48}
                      height={48}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl font-semibold text-[#B17457] dark:text-[#D8D2C2]">
                    Symvii
                  </span>
                </Link>
                <Link
                  href="/"
                  className="text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457]"
                >
                  {t('login.navigation.home')}
                </Link>
              </div>
              <Button
                onClick={handleDarkModeToggle}
                variant="ghost"
                size="icon"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {t('bmiCalculator.title')}
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <form onSubmit={calculateBMI} className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="height">{t('bmiCalculator.form.height.label')}</Label>
                      <div className="flex mt-1">
                        {heightUnit === "ft" ? (
                          <div className="flex w-full">
                            <Input
                              id="feet"
                              type="number"
                              value={feet}
                              onChange={(e) => setFeet(e.target.value)}
                              min="0"
                              placeholder={t('bmiCalculator.form.height.placeholder.ft')}
                              required
                              className="rounded-r-none shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                            />
                            <Input
                              id="inches"
                              type="number"
                              value={inches}
                              onChange={(e) => setInches(e.target.value)}
                              min="0"
                              max="11"
                              placeholder={t('bmiCalculator.form.height.placeholder.in')}
                              required
                              className="rounded-none shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                            />
                          </div>
                        ) : (
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            min="0"
                            required
                            className="rounded-r-none shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                          />
                        )}
                        <Select
                          value={heightUnit}
                          onValueChange={(value) => {
                            setHeightUnit(value);
                            // Reset height values when switching units
                            setHeight("");
                            setFeet("");
                            setInches("");
                          }}
                        >
                          <SelectTrigger className="w-[80px] rounded-l-none bg-white dark:bg-[#4A4947] shadow-sm dark:shadow-[#4A4947]/20">
                            <SelectValue placeholder={t('bmiCalculator.form.units.placeholder')} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-md dark:shadow-[#4A4947]/30">
                            <SelectItem
                              value="cm"
                              className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#B17457]/20"
                            >
                              cm
                            </SelectItem>
                            <SelectItem
                              value="in"
                              className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#B17457]/20"
                            >
                              in
                            </SelectItem>
                            <SelectItem
                              value="ft"
                              className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#B17457]/20"
                            >
                              ft
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="weight">{t('bmiCalculator.form.weight.label')}</Label>
                      <div className="flex mt-1">
                        <Input
                          id="weight"
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          min="0"
                          required
                          className="rounded-r-none shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                        />
                        <Select
                          value={weightUnit}
                          onValueChange={setWeightUnit}
                        >
                          <SelectTrigger className="w-[80px] rounded-l-none bg-white dark:bg-[#4A4947] shadow-sm dark:shadow-[#4A4947]/20 transition-all duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-[#4A4947] border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2]">
                            <SelectValue placeholder={t('bmiCalculator.form.units.placeholder')} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-md dark:shadow-[#4A4947]/30">
                            <SelectItem
                              value="kg"
                              className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#B17457]/20"
                            >
                              kg
                            </SelectItem>
                            <SelectItem
                              value="lbs"
                              className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#B17457]/20"
                            >
                              lbs
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-[#4A4947]/30"
                  >
                    {t('bmiCalculator.form.calculate')}
                  </Button>
                </form>
                {bmi !== null && (
                  <div className="mt-6 space-y-4">
                    <div className="w-full h-[200px]">
                      <GaugeChart
                        id="bmi-gauge"
                        nrOfLevels={4}
                        colors={bmiRanges.map((range) => range.color)}
                        percent={getGaugeValue(bmi)}
                        textColor={darkMode ? "#D8D2C2" : "#4A4947"}
                        needleColor="#B17457"
                        needleBaseColor="#B17457"
                        arcWidth={0.3}
                        cornerRadius={0}
                        formatTextValue={() => bmi.toString()}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#B17457] dark:text-[#D8D2C2]">
                        {t('bmiCalculator.results.bmi')}: {bmi}
                      </p>
                      <p className="text-xl mt-2 text-[#B17457] dark:text-[#D8D2C2]">
                        {t('bmiCalculator.results.category')}: {t(`bmiCalculator.results.categories.${getBMICategory(bmi).toLowerCase().replace(' ', '')}`)}
                      </p>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
                        {bmiRanges.map((range, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="h-2 w-full mb-1"
                              style={{ backgroundColor: range.color }}
                            ></div>
                            <p className="font-medium">{range.label}</p>
                            <p className="text-xs opacity-75">{range.range}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {t('bmiCalculator.info.title')}
                </h2>
                <p className="mb-4">
                  {t('bmiCalculator.info.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>{t('bmiCalculator.info.categories.underweight')}</li>
                  <li>{t('bmiCalculator.info.categories.normal')}</li>
                  <li>{t('bmiCalculator.info.categories.overweight')}</li>
                  <li>{t('bmiCalculator.info.categories.obese')}</li>
                </ul>
                <p className="mb-4">
                  {t('bmiCalculator.info.disclaimer')}
                </p>
                <a
                  href="https://en.wikipedia.org/wiki/Body_mass_index"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-[#4A4947]/30">
                    {t('bmiCalculator.info.learnMore')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
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
                  <span className="text-2xl font-bold text-white">{t('footer.brand.name')}</span>
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
                      <Link
                        href="#features"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.product.items.features')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#benefits"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.product.items.benefits')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#testimonials"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.product.items.testimonials')}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">{t('footer.navigation.tools.title')}</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/bmi-calculator"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.tools.items.bmiCalculator')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ai-doctor"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.tools.items.aiDoctor')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/symptoms-tracker"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.tools.items.symptomsTracker')}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">{t('footer.navigation.support.title')}</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#faqs"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {t('footer.navigation.support.items.faqs')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#contact"
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
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
