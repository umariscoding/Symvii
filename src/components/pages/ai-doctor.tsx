'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Moon, Sun, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleDarkMode, initializeTheme } from '@/redux/features/themeSlice';
import { useRouter } from 'next/navigation';

export default function AIDoctorPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState({
    symptom: '',
    sex: '',
    age: '',
    country: ''
  });

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/ai-doctor');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return null;
  }

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      sex: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/ai-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      const data = await response.json()
      setResult(data.data.consultation)
    } catch (error) {
      console.error('Error:', error)
      setResult('An error occurred while processing your request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="bg-[#FAF7F0] dark:bg-[#4A4947] text-[#4A4947] dark:text-[#FAF7F0] min-h-screen">
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
                  <span className="text-xl font-semibold text-[#B17457] dark:text-[#D8D2C2]">Symvii</span>
                </Link>
                <Link href="/" className="text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457]">
                  Home
                </Link>
              </div>
              <Button onClick={handleDarkModeToggle} variant="ghost" size="icon">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">AI Doctor Consultation</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="symptom">Enter symptom</Label>
                    <Textarea
                      id="symptom"
                      name="symptom"
                      placeholder="Describe your symptoms here..."
                      className="mt-1 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                      rows={4}
                      value={formData.symptom}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sex">Sex at birth</Label>
                    <Select onValueChange={handleSelectChange} value={formData.sex}>
                      <SelectTrigger className="w-full mt-1 pl-3 bg-white dark:bg-background-dark shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-background-dark shadow-md dark:shadow-background-dark/30">
                        <SelectItem 
                          value="male" 
                          className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-background-secondary-light dark:hover:bg-primary/20 transition-colors duration-300"
                        >
                          Male
                        </SelectItem>
                        <SelectItem 
                          value="female" 
                          className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-background-secondary-light dark:hover:bg-primary/20 transition-colors duration-300"
                        >
                          Female
                        </SelectItem>
                        <SelectItem 
                          value="other" 
                          className="text-[#4A4947] dark:text-[#FAF7F0] hover:bg-background-secondary-light dark:hover:bg-primary/20 transition-colors duration-300"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      type="number" 
                      id="age" 
                      name="age"
                      placeholder="Enter your age" 
                      className="mt-1 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country of residence or recently visited</Label>
                    <Input 
                      id="country" 
                      name="country"
                      placeholder="Enter country" 
                      className="mt-1 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-[#4A4947]/30"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Analyzing...' : 'Submit'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">AI Doctor Disclaimer</h2>
                <p className="mb-4">
                  This AI doctor is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Provides general health information</li>
                  <li>Not a substitute for professional medical advice</li>
                  <li>Cannot diagnose specific conditions</li>
                  <li>Seek immediate medical attention for emergencies</li>
                </ul>
                <p className="mb-4">
                  Remember, your health is important. When in doubt, always consult with a healthcare professional.
                </p>
                <a 
                  href="https://en.wikipedia.org/wiki/Artificial_intelligence_in_healthcare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-[#B17457] hover:bg-[#D8D2C2] text-[#FAF7F0] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-[#B17457]/30">
                    Learn More About AI in Healthcare <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
          {result && (
            <Card className="mt-8 bg-white dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">AI Doctor's Analysis</h2>
                <div dangerouslySetInnerHTML={{ __html: result }} />
              </CardContent>
            </Card>
          )}
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
    </div>
  )
}
