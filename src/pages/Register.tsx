import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Mail, Phone, Calendar, MapPin, Weight, Lock } from 'lucide-react';
import { bloodGroups } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(formData.weight) < 50) {
      toast({
        title: "Weight Requirement",
        description: "Donors must weigh at least 50kg to be eligible for donation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
        bloodGroup: formData.bloodGroup,
        weight: parseInt(formData.weight),
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await fetch('http://localhost:3000/api/v1/donor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token for auth 
      localStorage.setItem('token', data.token);

      toast({
        title: "Registration Successful!",
        description: "Welcome to BloodLink! You can now help save lives.",
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-full mb-4">
              <Heart className="h-8 w-8 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Join BloodLink</h2>
          <p className="text-muted-foreground mt-2">Register as a blood donor and help save lives</p>
        </div>

        <Card className="shadow-medium">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Create Your Account</CardTitle>
            <CardDescription>
              Fill in your details to become a registered blood donor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>Phone Number *</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="+1-555-0123"
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Date of Birth *</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>Gender *</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>Blood Group *</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('bloodGroup', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight" className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-primary" />
                    <span>Weight (kg) *</span>
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    required
                    min="45"
                    value={formData.weight}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="65"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimum 50kg required</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Address *</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="123 Main St, City, State"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Password *</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Create a strong password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Confirm Password *</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="bg-accent/20 p-4 rounded-md">
                <h3 className="font-semibold text-foreground mb-2">Donor Requirements:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Age: 18-65 years</li>
                  <li>• Weight: Minimum 50kg</li>
                  <li>• Good general health</li>
                  <li>• No recent illness or medication</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full gradient-hero hover:opacity-90 transition-base"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Creating Account...' : 'Register as Donor'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Sign In Instead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;