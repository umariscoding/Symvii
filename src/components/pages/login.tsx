"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, User, Phone, MapPin, Moon, Sun } from "lucide-react";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleDarkMode, initializeTheme } from '@/redux/features/themeSlice';
import { login, signup, clearError } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showError, setShowError] = useState(false);
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const router = useRouter();
  const error = useAppSelector((state) => state.auth.error);
  const loading = useAppSelector((state) => state.auth.loading);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (isLogin) {
      const loginData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };
      
      const resultAction = await dispatch(login(loginData));
      if (login.fulfilled.match(resultAction)) {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectPath);
        } else {
          router.push('/');
        }
      }
    } else {
      const signupData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        country: formData.get('Country') as string,
      };
      
      const resultAction = await dispatch(signup(signupData));
      if (signup.fulfilled.match(resultAction)) {
        router.push('/');
      }
    }
  };

  const handleInputChange = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <>
        <nav className="fixed top-4 left-0 right-0 z-40 px-4">
          <div className="container mx-auto px-6 py-3 bg-[#D8D2C2] dark:bg-[#3A3937] rounded-full shadow-lg">
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
                  <span className="text-xl font-semibold text-[#B17457] dark:text-[#D8D2C2]">
                    {t('branding.name')}
                  </span>
                </Link>
                <Link href="/" className="text-[#4A4947] dark:text-[#D8D2C2] hover:text-[#B17457] dark:hover:text-[#B17457]">
                  {t('login.navigation.home')}
                </Link>
              </div>
              <Button onClick={handleDarkModeToggle} variant="ghost" size="icon">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>

      <div
        className={`min-h-screen pt-24 bg-background-light dark:bg-background-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-md w-full space-y-8">
          <Card className="bg-background-light dark:bg-background-dark shadow-xl border border-background-secondary-light dark:border-primary">
            <CardContent className="p-6">
              <div 
                className={`mb-6 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 transform transition-all duration-300 ease-in-out ${
                  error && showError 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {error === 'Invalid email or password' 
                    ? t('login.error.invalidCredentials')
                    : error}
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-6 text-center text-[#4A4947] dark:text-[#FAF7F0]">
                {isLogin ? t('login.title.login') : t('login.title.signup')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        {t('login.form.name.label')}
                      </Label>
                      <div className="mt-1 relative">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder={t('login.form.name.placeholder')}
                          className="pl-10 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                        />
                        <User className="h-5 w-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        {t('login.form.phone.label')}
                      </Label>
                      <div className="mt-1 relative">
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder={t('login.form.phone.placeholder')}
                          className="pl-10 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                        />
                        <Phone className="h-5 w-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="country"
                        className="text-[#4A4947] dark:text-[#FAF7F0]"
                      >
                        {t('login.form.country.label')}
                      </Label>
                      <div className="mt-1 relative">
                        <Input
                          id="country"
                          name="Country"
                          type="text"
                          required
                          placeholder={t('login.form.country.placeholder')}
                          className="pl-10 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                        />
                        <MapPin className="h-5 w-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label
                    htmlFor="email"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('login.form.email.label')}
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={handleInputChange}
                      className="pl-10 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                    />
                    <Mail className="h-5 w-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-[#4A4947] dark:text-[#FAF7F0]"
                  >
                    {t('login.form.password.label')}
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-10 w-full shadow-sm dark:shadow-background-dark/20 border-background-secondary-light dark:border-primary focus:border-primary dark:focus:border-background-secondary-light bg-white dark:bg-background-dark"
                    />
                    <Lock className="h-5 w-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg dark:shadow-background-dark/30 group"
                  disabled={loading}
                >
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      {isLogin ? "Sign in" : "Create account"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#B17457] hover:text-[#B17457]/80 transition-colors duration-300"
                >
                  {isLogin ? t('login.toggleAccount.signup') : t('login.toggleAccount.login')}
                </button>
              </div>
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
    {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </>
  );
}
