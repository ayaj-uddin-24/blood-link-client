import { Heart, Users, Clock, Award, Shield } from "lucide-react";

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  gender: string;
  age: number;
  weight: number;
  location: string;
  address: string;
  lastDonation?: string;
  isAvailable: boolean;
  donationCount: number;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  urgency: "low" | "medium" | "high" | "critical";
  hospitalName: string;
  contactInfo: string;
  location: string;
  requestDate: string;
  requiredBy: string;
  status: "active" | "fulfilled" | "expired";
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  gender: string;
  dateOfBirth: string;
  weight: number;
  address: string;
  isDonor: boolean;
  lastDonation?: string;
  donationCount: number;
}

// Mock donors data
export const mockDonors: Donor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0123",
    bloodGroup: "O+",
    gender: "Female",
    age: 28,
    weight: 65,
    location: "Downtown",
    address: "123 Main St, Downtown",
    lastDonation: "2024-01-15",
    isAvailable: true,
    donationCount: 12,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1-555-0124",
    bloodGroup: "A+",
    gender: "Male",
    age: 34,
    weight: 78,
    location: "Westside",
    address: "456 Oak Ave, Westside",
    lastDonation: "2024-02-20",
    isAvailable: true,
    donationCount: 8,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1-555-0125",
    bloodGroup: "B-",
    gender: "Female",
    age: 31,
    weight: 62,
    location: "East District",
    address: "789 Pine Rd, East District",
    lastDonation: "2024-01-08",
    isAvailable: true,
    donationCount: 15,
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "+1-555-0126",
    bloodGroup: "AB+",
    gender: "Male",
    age: 42,
    weight: 82,
    location: "North Hills",
    address: "321 Elm St, North Hills",
    lastDonation: "2024-03-01",
    isAvailable: false,
    donationCount: 6,
  },
  {
    id: "5",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1-555-0127",
    bloodGroup: "O-",
    gender: "Female",
    age: 26,
    weight: 58,
    location: "South Bay",
    address: "654 Cedar Ln, South Bay",
    lastDonation: "2024-02-14",
    isAvailable: true,
    donationCount: 10,
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1-555-0128",
    bloodGroup: "A-",
    gender: "Male",
    age: 38,
    weight: 75,
    location: "Central Park",
    address: "987 Maple Dr, Central Park",
    lastDonation: "2024-01-30",
    isAvailable: true,
    donationCount: 14,
  },
];

// Mock blood requests data
export const mockBloodRequests: BloodRequest[] = [
  {
    id: "1",
    patientName: "John Smith",
    bloodGroup: "O+",
    urgency: "critical",
    hospitalName: "City General Hospital",
    contactInfo: "+1-555-0200",
    location: "Downtown",
    requestDate: "2024-03-15",
    requiredBy: "2024-03-16",
    status: "active",
    description: "Urgent surgery requirement",
  },
  {
    id: "2",
    patientName: "Lisa Anderson",
    bloodGroup: "A-",
    urgency: "high",
    hospitalName: "St. Mary's Medical Center",
    contactInfo: "+1-555-0201",
    location: "Westside",
    requestDate: "2024-03-14",
    requiredBy: "2024-03-17",
    status: "active",
    description: "Post-accident treatment",
  },
  {
    id: "3",
    patientName: "Robert Brown",
    bloodGroup: "B+",
    urgency: "medium",
    hospitalName: "Regional Medical Center",
    contactInfo: "+1-555-0202",
    location: "North Hills",
    requestDate: "2024-03-13",
    requiredBy: "2024-03-20",
    status: "active",
    description: "Chemotherapy support",
  },
  {
    id: "4",
    patientName: "Anna Davis",
    bloodGroup: "AB-",
    urgency: "high",
    hospitalName: "University Hospital",
    contactInfo: "+1-555-0203",
    location: "East District",
    requestDate: "2024-03-12",
    requiredBy: "2024-03-18",
    status: "fulfilled",
    description: "Pregnancy complications",
  },
];

// Blood group compatibility data
export const bloodGroupCompatibility = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const stats = [
  {
    icon: Users,
    label: "Registered Donors",
    value: "2,500+",
    color: "text-blue-600",
  },
  {
    icon: Heart,
    label: "Lives Saved",
    value: "15,000+",
    color: "text-red-500",
  },
  {
    icon: Clock,
    label: "Blood Units Donated",
    value: "8,200+",
    color: "text-green-600",
  },
  {
    icon: Award,
    label: "Active Requests",
    value: "24",
    color: "text-purple-600",
  },
];

export const features = [
  {
    icon: Users,
    title: "Smart Donor Matching",
    description:
      "AI-powered matching system connects you with compatible donors in your area instantly.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Emergency Response",
    description:
      "Critical blood requests are prioritized with instant notifications to nearby donors.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Verified & Secure",
    description:
      "All donors are verified with secure, encrypted communication for your safety.",
    color: "from-green-500 to-green-600",
  },
];

export const testimonials = [
  {
    name: "Mahfuz Uddin",
    role: "Blood Recipient",
    text: "BloodLink saved my life during emergency surgery. Found a donor in just 15 minutes!",
    avatar: "👩‍⚕️",
  },
  {
    name: "Dr. Sourob Hossen",
    role: "Emergency Physician",
    text: "This platform has revolutionized how we handle blood emergencies in our hospital.",
    avatar: "👨‍⚕️",
  },
  {
    name: "Habibur Rahman",
    role: "Regular Donor",
    text: "Donating blood has never been easier. The app keeps me informed about local needs.",
    avatar: "🩸",
  },
];

export const categoryMap = {
  "fake-profile": "fake people",
  harassment: "harassment",
  spam: "spam",
  "inappropriate-behavior": "rude behavior",
  fraud: "fraud",
  other: "other",
};

export const statuses = ["Under Review", "Resolved", "Dismissed"];

export const displayCategoryMap = {
  "fake people": "Fake Profile",
  harassment: "Harassment",
  spam: "Spam",
  "rude behavior": "Inappropriate Behavior",
  fraud: "Fraud",
  other: "Other",
};

export const reportCategories = [
  { value: "fake-profile", label: "Fake Profile", icon: "User" },
  { value: "harassment", label: "Harassment", icon: "NoEntry" },
  { value: "spam", label: "Spam", icon: "Envelope" },
  {
    value: "inappropriate-behavior",
    label: "Inappropriate Behavior",
    icon: "Warning",
  },
  { value: "fraud", label: "Fraud", icon: "DollarSign" },
  { value: "other", label: "Other", icon: "HelpCircle" },
];

export const getStatusStyles = (status) => {
  const styles = {
    "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Dismissed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getPriorityStyles = (priority) => {
  const styles = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-blue-100 text-blue-800",
  };
  return styles[priority] || "bg-gray-100 text-gray-800";
};

export const getCategoryIcon = (category) => {
  const map = {
    "Fake Profile": "User",
    Harassment: "NoEntry",
    Spam: "Envelope",
    "Inappropriate Behavior": "Warning",
    Fraud: "DollarSign",
    Other: "HelpCircle",
  };
  return map[category] || "HelpCircle";
};

export const urgencyLevels = [
  {
    value: "low",
    label: "Low Priority",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    value: "medium",
    label: "Medium Priority",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    value: "high",
    label: "High Priority",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    value: "critical",
    label: "Critical/Emergency",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

export const colors = {
  "O+": "bg-primary text-primary-foreground",
  "O-": "bg-destructive text-destructive-foreground",
  "A+": "bg-success text-success-foreground",
  "A-": "bg-warning text-warning-foreground",
  "B+": "bg-blue-600 text-white",
  "B-": "bg-purple-600 text-white",
  "AB+": "bg-orange-600 text-white",
  "AB-": "bg-pink-600 text-white",
};
