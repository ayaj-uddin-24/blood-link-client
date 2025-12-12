import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Weight,
  Heart,
  Edit,
  Save,
  Award,
  Clock,
  AlertCircle,
  Stethoscope,
  Loader2
} from 'lucide-react';
import { bloodGroups } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    preferredDonationType: 'Whole Blood',
    medicalConditions: '',
  });
  const [donationHistory, setDonationHistory] = useState([]);

  const { toast } = useToast();

  // Mock donation types and achievements
  const donationTypes = ['Whole Blood', 'Plasma', 'Platelets', 'Power Red'];
  const achievements = [
    { name: 'First Time Donor', description: 'Completed your first donation', unlocked: true },
    { name: 'Bronze Donor', description: '5+ donations', unlocked: true },
    { name: 'Silver Donor', description: '10+ donations', unlocked: true },
    { name: 'Gold Donor', description: '20+ donations', unlocked: false },
    { name: 'Life Saver', description: 'Impacted 30+ lives', unlocked: true },
  ];

  // Fetch profile and history on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast({ title: "Error", description: "Please log in to view profile.", variant: "destructive" });
          return;
        }

        // Fetch profile
        const profileResponse = await fetch('http://localhost:3000/api/v1/donor/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();
        setFormData({
          name: profileData.data.fullName,
          email: profileData.data.email,
          phone: profileData.data.phoneNumber,
          dateOfBirth: profileData.data.dateOfBirth.split('T')[0],
          gender: profileData.data.gender.toLowerCase(),
          bloodGroup: profileData.data.bloodGroup,
          weight: profileData.data.weight.toString(),
          address: profileData.data.address,
          emergencyContactName: '',
          emergencyContactPhone: '',
          preferredDonationType: 'Whole Blood',
          medicalConditions: '',
        });

        // Fetch donation history
        const historyResponse = await fetch('http://localhost:3000/donations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setDonationHistory(historyData.donations || []);
        }
      } catch (error) {
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  // Calculate dynamic stats from history
  const completedDonations = donationHistory.filter(d => d.status === 'completed');
  const totalDonations = completedDonations.length;
  const livesImpacted = totalDonations * 3; // Assuming 3 lives per donation
  const firstDonationDate = completedDonations.length > 0 ? new Date(Math.min(...completedDonations.map(d => new Date(d.date).getTime()))) : null;
  const yearsAsDonor = firstDonationDate ? Math.floor((new Date().getTime() - firstDonationDate.getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;
  const lastDonationDate = completedDonations.length > 0 ? new Date(Math.max(...completedDonations.map(d => new Date(d.date).getTime()))) : null;
  const nextEligibleDate = lastDonationDate ? new Date(lastDonationDate.getTime() + 56 * 24 * 60 * 60 * 1000) : null;
  const daysToNext = nextEligibleDate ? Math.max(0, Math.ceil((nextEligibleDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const stats = [
    { label: 'Total Donations', value: totalDonations.toString(), icon: Heart },
    { label: 'Lives Impacted', value: livesImpacted.toString(), icon: Award },
    { label: 'Years as Donor', value: yearsAsDonor.toString(), icon: Calendar },
    { label: 'Next Eligible', value: `${daysToNext} days`, icon: Clock },
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
        bloodGroup: formData.bloodGroup,
        weight: parseInt(formData.weight),
        address: formData.address,
      };

      const response = await fetch('http://localhost:3000/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colors = {
      'O+': 'bg-primary text-primary-foreground',
      'O-': 'bg-destructive text-destructive-foreground',
      'A+': 'bg-success text-success-foreground',
      'A-': 'bg-warning text-warning-foreground',
      'B+': 'bg-blue-600 text-white',
      'B-': 'bg-purple-600 text-white',
      'AB+': 'bg-orange-600 text-white',
      'AB-': 'bg-pink-600 text-white',
    };
    return colors[bloodGroup as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground';
  };

  const handleScheduleDonation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/schedule-donation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: formData.preferredDonationType }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule donation');
      }

      toast({
        title: "Donation Scheduled",
        description: "You've successfully scheduled your next donation. Check your email for details.",
      });

      // Refetch history
      const historyResponse = await fetch('http://localhost:3000/donations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setDonationHistory(historyData.donations || []);
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-card shadow-soft border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{formData.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={`${getBloodGroupColor(formData.bloodGroup)} font-bold`}>
                    {formData.bloodGroup} Donor
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-success">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>Active Donor</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? "gradient-hero hover:opacity-90" : ""}
                variant={isEditing ? "default" : "outline"}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
              <Button onClick={handleScheduleDonation} variant="secondary">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Donation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="history">Donation History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing ? 'Edit your profile information below' : 'Your registered donor information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>Full Name</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth" className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Date of Birth</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>Gender</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange('gender', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-primary" />
                      <span>Blood Group</span>
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      <span>Weight (kg)</span>
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-primary" />
                      <span>Preferred Donation Type</span>
                    </Label>
                    <Select
                      value={formData.preferredDonationType}
                      onValueChange={(value) => handleSelectChange('preferredDonationType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {donationTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Address</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactName" className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <span>Emergency Contact Name</span>
                    </Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactPhone" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>Emergency Contact Phone</span>
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="medicalConditions" className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span>Medical Conditions/Allergies (optional)</span>
                    </Label>
                    <textarea
                      id="medicalConditions"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 w-full h-24 border border-input rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>
                  Your complete blood donation history and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donationHistory.map((donation, index) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-full">
                          <Heart className="h-5 w-5 text-success" fill="currentColor" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            Donation #{donationHistory.length - index} - {donation.type}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {donation.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Next Donation Eligibility</h4>
                  <p className="text-sm text-muted-foreground">
                    You can donate again after <strong>{nextEligibleDate ? nextEligibleDate.toLocaleDateString() : 'N/A'}</strong> ({daysToNext} days remaining).
                    Regular blood donors can donate every 56 days (8 weeks).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Milestones and badges for your donation journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((ach) => (
                    <Card key={ach.name} className={`shadow-soft ${ach.unlocked ? 'border-primary' : 'opacity-70'}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Award className={`h-5 w-5 ${ach.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span>{ach.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                        <Badge variant={ach.unlocked ? "default" : "secondary"} className="mt-2">
                          {ach.unlocked ? 'Unlocked' : 'Locked'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;