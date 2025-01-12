"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, updateProfile } from '@/redux/features/authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, LogOut, Save, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    password: '',
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { phone: '', password: '' };

    // Validate phone (integers only)
    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
      isValid = false;
    }

    // Validate password
    if (formData.password && !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 symbol';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const result = await dispatch(updateProfile({
      name: formData.name,
      phone: formData.phone,
      country: formData.country,
    }));
    
    if (updateProfile.fulfilled.match(result)) {
      console.log('Profile updated successfully');
      router.push('/');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8 sm:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-6 flex items-center space-x-2 text-[#4A4947] dark:text-[#FAF7F0] hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>

        <Card className="bg-[#FAF7F0] dark:bg-[#4A4947] shadow-xl border border-[#D8D2C2] dark:border-[#B17457]">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UserCircle className="w-12 h-12 text-[#B17457]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#4A4947] dark:text-[#FAF7F0]">
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#4A4947] dark:text-[#FAF7F0]">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#4A4947] dark:text-[#FAF7F0]">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2]"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#4A4947] dark:text-[#FAF7F0]">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2]"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-[#4A4947] dark:text-[#FAF7F0]">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#4A4947] dark:text-[#FAF7F0]">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#3A3937] text-[#4A4947] dark:text-[#FAF7F0] shadow-sm dark:shadow-[#4A4947]/20 border-[#D8D2C2] dark:border-[#B17457] focus:border-[#B17457] dark:focus:border-[#D8D2C2]"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-[#D8D2C2] hover:bg-[#D8D2C2]/90 text-[#4A4947] dark:bg-[#3A3937] dark:hover:bg-[#3A3937]/90 dark:text-[#FAF7F0] transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>

                <Button
                  type="submit"
                  className="flex items-center space-x-2 bg-[#B17457] hover:bg-[#B17457]/90 text-white transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    
  );
} 