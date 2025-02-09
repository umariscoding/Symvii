"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Send,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight,
  ActivitySquare,
  Bell,
  BarChart3,
  Link2,
  Menu,
  UserCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleDarkMode, initializeTheme } from '@/redux/features/themeSlice';
import { useRouter } from 'next/navigation';

type Testimonial = {
  id: number;
  text: string;
  author: string;
  location: string;
};

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "Symvii's AI health tracking has revolutionized my daily routine. The platform is user-friendly and offers essential insights that empower me to manage my health with ease. Living in San Francisco, it's a must-have tool for proactive health maintenance.",
      author: "Oliver Smith",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      text: "Symvii is a game-changer for managing my health. Its AI capabilities provide invaluable insights and make tracking my condition straightforward and stress-free. In New York, it's the ideal solution for anyone seeking effective, tech-driven health management.",
      author: "Emma Thompson",
      location: "New York City, NY",
    },
    {
      id: 3,
      text: "Symvii has transformed my approach to health management. Their AI tracking is intuitive and provides real-time insights that help me stay on top of my condition effortlessly. Being in Greenwich, it's the perfect solution for anyone wanting innovative health support.",
      author: "James Wilson",
      location: "Greenwich, London",
    },
  ];

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative bg-[#FAF7F0] dark:bg-[#4A4947] text-[#4A4947] dark:text-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 container mx-auto">
          What Our Users Say
        </h2>

        <div className="max-w-4xl mx-auto relative">
          <div
            className="absolute -left-4 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none"
            style={{ width: "calc(100% + 2rem)" }}
          >
            <button
              onClick={handlePrevious}
              className="pointer-events-auto p-3 rounded-full bg-[#4A4947]/10 dark:bg-white/10 
                       backdrop-blur-sm hover:bg-[#4A4947]/20 dark:hover:bg-white/20 
                       transition-all duration-300 group shadow-lg hover:shadow-xl"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-[#4A4947] dark:text-white group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={handleNext}
              className="pointer-events-auto p-3 rounded-full bg-[#4A4947]/10 dark:bg-white/10 
                       backdrop-blur-sm hover:bg-[#4A4947]/20 dark:hover:bg-white/20 
                       transition-all duration-300 group shadow-lg hover:shadow-xl"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-[#4A4947] dark:text-white group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          <div className="overflow-hidden px-4 md:px-8">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-[300px] flex flex-col justify-center"
            >
              <span className="text-4xl text-[#B17457] font-serif mb-4">"</span>

              <p
                className="text-lg md:text-xl mb-8 leading-relaxed 
                          font-light tracking-wide max-w-3xl text-[#4A4947] dark:text-white/90"
              >
                {testimonials[currentIndex].text}
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-xl text-[#B17457]">
                  {testimonials[currentIndex].author}
                </p>
                <p className="text-base text-[#4A4947]/80 dark:text-white/80">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-start space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 
                          ${
                            index === currentIndex
                              ? "bg-[#B17457] w-8"
                              : "bg-[#4A4947]/20 dark:bg-white/40 hover:bg-[#4A4947]/40 dark:hover:bg-white/60"
                          }`}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: index === currentIndex ? 1.1 : 1 }}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  index,
  reverse = false,
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  index: number;
  reverse?: boolean;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: index * 0.2 },
        },
        hidden: {
          opacity: 0,
          y: 50,
          transition: { duration: 0.6, delay: index * 0.2 },
        },
      }}
      className="relative h-[400px] rounded-3xl overflow-hidden"
    >
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 p-8 md:p-12 flex items-center">
        <div className="max-w-2xl">
          <h3 className="text-3xl font-bold text-[#FAF7F0] mb-4">{title}</h3>
          <p className="text-lg text-[#D8D2C2]">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Here you would typically send this data to your backend
    console.log(`Contact form submitted: ${name}, ${email}, ${message}`);
    // You could also send an email here using a service like SendGrid or AWS SES
    // For this example, we'll just log it
  };

  return (
    <div
      className={`min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 overflow-x-hidden`}
    >
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-40">
        <div className="container mx-auto px-6 py-3 bg-background-secondary-light dark:bg-background-secondary-dark rounded-full shadow-lg">
          <div className="flex items-center justify-between">
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
              <span className="text-xl font-semibold text-primary dark:text-background-secondary-light">
                Symvii
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-text-light dark:text-background-secondary-light hover:text-primary dark:hover:text-primary"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-text-light dark:text-background-secondary-light hover:text-primary dark:hover:text-primary"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-text-light dark:text-background-secondary-light hover:text-primary dark:hover:text-primary"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("faqs")}
                className="text-text-light dark:text-background-secondary-light hover:text-primary dark:hover:text-primary"
              >
                FAQs
              </button>
              <div className="relative group">
                <button className="text-text-light dark:text-background-secondary-light hover:text-primary dark:hover:text-primary">
                  Tools
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#FAF7F0] dark:bg-[#4A4947] ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      href="/bmi-calculator"
                      className="block px-4 py-2 text-sm text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#3A3937]"
                      role="menuitem"
                    >
                      BMI Calculator
                    </Link>
                    <Link
                      href="/ai-doctor"
                      className="block px-4 py-2 text-sm text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#3A3937]"
                      role="menuitem"
                    >
                      AI Doctor
                    </Link>
                    <Link
                      href="/symptoms-tracker"
                      className="block px-4 py-2 text-sm text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#3A3937]"
                      role="menuitem"
                    >
                      Symptoms Tracker
                    </Link>
                    <Link
                      href="/medical-history"
                      className="block px-4 py-2 text-sm text-[#4A4947] dark:text-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#3A3937]"
                      role="menuitem"
                    >
                      Medical History
                    </Link>
                  </div>
                </div>
              </div>
              {isAuthenticated ? (
                <div className="relative group">
                  <Button 
                    variant="ghost"
                    className="flex items-center space-x-2 text-text-light dark:text-background-secondary-light"
                    onClick={() => router.push('/profile')}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>{user?.name || 'Profile'}</span>
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button 
                    className="bg-primary hover:bg-primary-hover text-white rounded-full px-6"
                  >
                    Login
                  </Button>
                </Link>
              )}
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

            {/* Mobile Menu */}
            <div className="flex items-center space-x-4 md:hidden">
              <Button
                onClick={handleDarkModeToggle}
                variant="ghost"
                size="icon"
                className="text-text-light dark:text-background-secondary-light"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-text-light dark:text-background-secondary-light"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-[#FAF7F0] dark:bg-[#4A4947] border-l border-[#D8D2C2] dark:border-[#3A3937] [&>button]:text-[#4A4947] dark:[&>button]:text-[#D8D2C2]"
                >
                  <div className="flex items-center space-x-2 mb-8">
                    <div className="h-12 w-12 flex items-center justify-center">
                      <Image
                        src={darkMode ? "/Artboard-2.svg" : "/Artboard-1.svg"}
                        alt={
                          darkMode ? "Symvii Logo Dark" : "Symvii Logo Light"
                        }
                        width={48}
                        height={48}
                        priority
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xl font-semibold text-[#B17457] dark:text-[#D8D2C2]">
                      Symvii
                    </span>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="mt-2 space-y-2 pl-4">
                      <Link
                        href="/bmi-calculator"
                        className="block text-sm text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457]"
                      >
                        BMI Calculator
                      </Link>
                      <Link
                        href="/ai-doctor"
                        className="block text-sm text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457]"
                      >
                        AI Doctor
                      </Link>
                      <Link
                        href="/symptoms-tracker"
                        className="block text-sm text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457]"
                      >
                        Symptoms Tracker
                      </Link>
                    </div>

                    <Link href="/login">
                      <Button 
                        className="bg-[#B17457] hover:bg-[#B17457]/90 text-white rounded-full px-8 py-3"
                      >
                        Login
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Fixed Background */}
      <section
        className="pt-40 pb-16 px-4 relative min-h-screen bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/hero2.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <h1 className="text-5xl font-bold leading-tight">
                Your Personal AI-Powered Health Assistant
              </h1>
              {/* <p className="text-xl">
              A health service offering an AI-driven platform designed to support early detection and effective management of medical conditions. With our tools, you can track pre-existing conditions, monitor symptoms for new diagnoses, and make informed decisions about your health through AI-powered insights and professional guidance.
              </p> */}
              {!isAuthenticated && (
                <div className="space-x-4">
                  <Link href="/login">
                    <Button 
                      className="bg-[#B17457] hover:bg-[#B17457]/90 text-white rounded-full px-8 py-3"
                    >
                      Login
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="text-[#B17457] dark:text-[#B17457] border-[#B17457] dark:border-[#B17457] 
                               hover:bg-[#B17457]/10 dark:hover:bg-[#B17457]/10 
                               rounded-full px-8 py-3"
                    onClick={() => scrollToSection('faqs')}
                  >
                    Learn more
                  </Button>
                </div>
              )}
            </div>
            <div className="relative">
              <Tabs defaultValue="symptoms" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#FAF7F0] dark:bg-[#4A4947] bg-opacity-20 backdrop-blur-sm rounded-t-xl">
                  <TabsTrigger
                    value="symptoms"
                    className="text-[#4A4947] dark:text-[#FAF7F0] transition-transform duration-300 transform hover:scale-105 active:scale-100"
                  >
                    Symptoms
                  </TabsTrigger>
                  <TabsTrigger
                    value="diagnosis"
                    className="text-[#4A4947] dark:text-[#FAF7F0] transition-transform duration-300 transform hover:scale-105 active:scale-100"
                  >
                    Diagnosis
                  </TabsTrigger>
                  <TabsTrigger
                    value="treatment"
                    className="text-[#4A4947] dark:text-[#FAF7F0] transition-transform duration-300 transform hover:scale-105 active:scale-100"
                  >
                    Treatment
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="symptoms"
                  className="bg-[#FAF7F0] dark:bg-[#4A4947] bg-opacity-20 backdrop-blur-sm rounded-b-xl p-6 transition-opacity duration-300 ease-in-out opacity-100"
                >
                  <h3 className="text-xl font-semibold text-[#4A4947] dark:text-[#FAF7F0] mb-4">
                    Track Your Symptoms
                  </h3>
                  <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                    Log and monitor your symptoms over time. Our AI analyzes
                    patterns to provide insights into your health.
                  </p>
                </TabsContent>
                <TabsContent
                  value="diagnosis"
                  className="bg-[#FAF7F0] dark:bg-[#4A4947] bg-opacity-20 backdrop-blur-sm rounded-b-xl p-6 transition-opacity duration-300 ease-in-out opacity-100"
                >
                  <h3 className="text-xl font-semibold text-[#4A4947] dark:text-[#FAF7F0] mb-4">
                    AI-Assisted Diagnosis
                  </h3>
                  <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                    Our advanced AI helps identify potential health issues based
                    on your symptoms and medical history.
                  </p>
                </TabsContent>
                <TabsContent
                  value="treatment"
                  className="bg-[#FAF7F0] dark:bg-[#4A4947] bg-opacity-20 backdrop-blur-sm rounded-b-xl p-6 transition-opacity duration-300 ease-in-out opacity-100"
                >
                  <h3 className="text-xl font-semibold text-[#4A4947] dark:text-[#FAF7F0] mb-4">
                    Personalized Treatment Plans
                  </h3>
                  <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                    Receive tailored treatment recommendations and track your
                    progress towards better health.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Precise Health Monitoring Section */}
      <section className="relative min-h-[600px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/human1.jpg"
            alt="Health Monitoring Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-24 flex items-center min-h-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Precise health monitoring system
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Empower your health journey with Symvii's innovative AI-driven
              solutions, delivering precise insights for better management in
              Greater London.
            </p>
            <Link href="/symptoms-tracker">
              <Button
                className="bg-[#B17457] hover:bg-[#B17457]/90 text-white rounded-full px-8 py-6 
                            text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Track now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-4 bg-[#FAF7F0] dark:bg-[#4A4947]"
      >
        <div className="container mx-auto text-center max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6 text-[#4A4947] dark:text-[#FAF7F0]"
          >
            Built to understand your health better.
          </motion.h2>
          <p className="text-xl text-[#4A4947] dark:text-[#FAF7F0] mb-12">
            Symvii creates innovative healthcare management software to help
            individuals take control of their well-being. Our AI-powered
            platform functions as a personal health companion, simplifying
            symptom tracking, vital sign monitoring, and maintaining a detailed
            medical history.
          </p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link href="/login">
                <Button 
                  className="bg-[#B17457] hover:bg-[#B17457]/90 text-white rounded-full px-8 py-3"
                >
                  Login
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-[#B17457] dark:text-[#B17457] border-[#B17457] dark:border-[#B17457] 
                           hover:bg-[#B17457]/10 dark:hover:bg-[#B17457]/10 
                           rounded-full px-8 py-3"
                onClick={() => scrollToSection('faqs')}
              >
                Learn more
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 px-4 bg-[#FAF7F0] dark:bg-[#4A4947]">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-16 text-center text-[#4A4947] dark:text-[#FAF7F0]"
          >
            Track Health Easily
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-6 p-4 bg-[#B17457] rounded-full">
                <ActivitySquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4A4947] dark:text-[#FAF7F0]">
                Personalized Health Monitoring
              </h3>
              <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                Track your health conditions with AI-driven insights tailored to
                your unique needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-6 p-4 bg-[#B17457] rounded-full">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4A4947] dark:text-[#FAF7F0]">
                Real-Time Condition Alerts
              </h3>
              <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                Receive instant notifications on any significant changes in your
                health condition.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-6 p-4 bg-[#B17457] rounded-full">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4A4947] dark:text-[#FAF7F0]">
                Comprehensive Data Analysis
              </h3>
              <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                Gain a deeper understanding of your health trends through
                detailed data analytics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-6 p-4 bg-[#B17457] rounded-full">
                <Link2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4A4947] dark:text-[#FAF7F0]">
                Seamless Integration Solutions
              </h3>
              <p className="text-[#4A4947] dark:text-[#FAF7F0]">
                Easily integrate our tracking tools with your existing
                healthcare systems.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-24 px-4 bg-[#FAF7F0] dark:bg-[#4A4947]"
      >
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-12 text-center"
          >
            <span className="text-[#B17457]">BENEFITS</span>
            <br />
            <span className="text-5xl text-[#4A4947] dark:text-[#FAF7F0]">
              More than just a health journal
            </span>
          </motion.h2>
          <div className="space-y-8">
            <BenefitSection
              title="AI-Powered Health Analysis"
              description="Our advanced AI technology provides comprehensive health assessments, helping you understand your body's signals and potential health concerns."
              imageSrc="/assets/benefits1.jpg"
              imageAlt="AI Health Analysis"
              index={0}
            />
            <BenefitSection
              title="Continuous Health Monitoring"
              description="Track vital signs, symptoms, and medications over time with our intuitive monitoring features, allowing you to see patterns and improvements in your health."
              imageSrc="/assets/benefits2.jpg"
              imageAlt="Health Monitoring"
              index={1}
            />
            <BenefitSection
              title="Professional Medical Insights"
              description="Receive personalized health recommendations and insights based on your medical history and current symptoms, validated by healthcare professionals."
              imageSrc="/assets/benefits3.jpg"
              imageAlt="Medical Insights"
              index={2}
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#FAF7F0] dark:bg-[#4A4947]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-[#4A4947] dark:text-[#FAF7F0] leading-tight"
            >
              Manage Chronic Illness with Symvii in Greater London
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-[#4A4947]/80 dark:text-[#FAF7F0]/80 leading-relaxed"
            >
              Symvii offers AI-powered symptom reporting and health tracking for
              those seeking a diagnosis. Based in Greater London, we help
              individuals with chronic illnesses monitor their conditions
              effectively. Trust Symvii to support your health journey.
            </motion.p>

            {!isAuthenticated && (
              <Link href="/login">
                <Button
                  className="mt-4 bg-[#B17457] hover:bg-[#B17457]/90 text-white rounded-full px-8 py-3 
                         shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Add the TestimonialSlider here */}
      <section id="testimonials">
        <TestimonialSlider />
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-24 px-4 bg-[#FAF7F0] dark:bg-[#4A4947]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-4 dark:text-[#FAF7F0]"
              >
                Questions?
              </motion.h2>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold mb-8 dark:text-[#FAF7F0]"
              >
                Answers.
              </motion.h2>
              {!isAuthenticated && (
                <Link href="/login">
                  <Button className="bg-[#4A4947] dark:bg-[#FAF7F0] hover:bg-[#D8D2C2] dark:hover:bg-[#3A3937] text-[#FAF7F0] dark:text-[#4A4947] rounded-full px-8 py-3">
                    Login
                  </Button>
                </Link>
              )}
            </div>
            <div className="md:w-1/2">
              <Accordion
                variant="splitted"
                className="text-left"
                itemClasses={{
                  title: "text-left",
                  trigger:
                    "px-4 py-0 data-[hover=true]:bg-[#D8D2C2] dark:data-[hover=true]:bg-[#3A3937] rounded-lg h-14 flex items-center",
                  indicator: "text-medium",
                  content: "text-sm px-4",
                }}
              >
                <AccordionItem
                  key="1"
                  aria-label="What is Symvii and how does it work?"
                  title="What is Symvii and how does it work?"
                  indicator={({ isOpen }) => (
                    <ChevronDown
                      className={`text-[#4A4947] dark:text-[#FAF7F0] transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                >
                  Symvii is a comprehensive health monitoring platform that uses
                  AI to help you document symptoms, track vital signs, and
                  manage your overall health. Simply input your health data or
                  concerns, and our AI will provide personalized insights and
                  recommendations to help you make informed healthcare
                  decisions.
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="What medical conditions can Symvii help monitor?"
                  title="What medical conditions can Symvii help monitor?"
                  indicator={({ isOpen }) => (
                    <ChevronDown
                      className={`text-[#4A4947] dark:text-[#FAF7F0] transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                >
                  Symvii is designed to assist with a wide range of medical
                  conditions, including chronic diseases, cardiovascular health,
                  respiratory conditions, and general wellness monitoring. Our
                  AI has been trained on diverse medical data to provide
                  comprehensive health insights.
                </AccordionItem>
                <AccordionItem
                  key="3"
                  aria-label="How accurate is the AI in analyzing health conditions?"
                  title="How accurate is the AI in analyzing health conditions?"
                  indicator={({ isOpen }) => (
                    <ChevronDown
                      className={`text-[#4A4947] dark:text-[#FAF7F0] transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                >
                  Our AI system has been trained on millions of medical records
                  and validated by healthcare professionals. While highly
                  accurate, Symvii is designed as a support tool and should not
                  replace professional medical diagnosis or treatment.
                </AccordionItem>
                <AccordionItem
                  key="4"
                  aria-label="Is my medical data secure with Symvii?"
                  title="Is my medical data secure with Symvii?"
                  indicator={({ isOpen }) => (
                    <ChevronDown
                      className={`text-[#4A4947] dark:text-[#FAF7F0] transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                >
                  Absolutely. We understand the sensitivity of medical
                  information and take data security seriously. All your health
                  data is encrypted and stored securely following HIPAA and GDPR
                  guidelines. Your medical information is never shared without
                  your explicit consent.
                </AccordionItem>
                <AccordionItem
                  key="5"
                  aria-label="What should I do if Symvii identifies a potential health concern?"
                  title="What should I do if Symvii identifies a potential health concern?"
                  indicator={({ isOpen }) => (
                    <ChevronDown
                      className={`text-[#4A4947] dark:text-[#FAF7F0] transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                >
                  If Symvii detects a potential health concern, it will provide
                  detailed information about the condition and recommend
                  appropriate next steps, including whether you should consult a
                  healthcare provider. We always encourage seeking professional
                  medical advice for any concerning health issues.
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Form */}
      <section
        id="contact"
        className="py-24 px-4 bg-[#FAF7F0] dark:bg-[#4A4947]"
      >
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center dark:text-[#FAF7F0]">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-[#4A4947] dark:text-[#FAF7F0]"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      className="w-full shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-[#4A4947] dark:text-[#FAF7F0]"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-[#4A4947] dark:text-[#FAF7F0]"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      className="w-full shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2] bg-white dark:bg-[#4A4947]"
                      rows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-[#4A4947]/30"
                  >
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6 text-[#4A4947] dark:text-[#FAF7F0]">
                  Get in Touch
                </h3>
                <p className="text-[#4A4947] dark:text-[#FAF7F0] mb-8">
                  Have questions or feedback? We'd love to hear from you. Fill
                  out the form and we'll get back to you as soon as possible.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#B17457] p-3 rounded-full">
                      <Phone className="w-6 h-6 text-[#FAF7F0]" />
                    </div>
                    <span className="text-[#4A4947] dark:text-[#FAF7F0]">
                      +1 (555) 123-4567
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#B17457] p-3 rounded-full">
                      <Mail className="w-6 h-6 text-[#FAF7F0]" />
                    </div>
                    <span className="text-[#4A4947] dark:text-[#FAF7F0]">
                      contact@symvii.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#B17457] p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-[#FAF7F0]" />
                    </div>
                    <span className="text-[#4A4947] dark:text-[#FAF7F0]">
                      123 Health Street, Med City, MC 12345
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
                  Symvii
                </span>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering healthcare through AI-driven insights and personalized tracking, making health management seamless and intelligent.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#benefits" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      Benefits
                    </Link>
                  </li>
                  <li>
                    <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      Testimonials
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Tools</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/bmi-calculator" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      BMI Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/ai-doctor" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      AI Doctor
                    </Link>
                  </li>
                  <li>
                    <Link href="/symptoms-tracker" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      Symptoms Tracker
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#faqs" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
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
  );
}
