import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  Users,
  UserPlus,
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  Award,
  TrendingUp,
  Search,
  Bell,
  Activity,
  Droplet,
  Phone,
  Mail,
  ChevronRight,
  Star
} from 'lucide-react';
import { useState, useEffect } from 'react';

const stats = [
  { icon: Users, label: 'Active Donors', value: '50K+' },
  { icon: Heart, label: 'Lives Saved', value: '12K+' },
  { icon: Droplet, label: 'Blood Units', value: '25K+' },
  { icon: MapPin, label: 'Cities', value: '150+' },
];

const features = [
  {
    icon: Search,
    title: 'Find Donors Instantly',
    description: 'Search for blood donors by blood type, location, and availability in real-time.',
    color: 'from-red-500 to-pink-600'
  },
  {
    icon: UserPlus,
    title: 'Easy Registration',
    description: 'Sign up as a donor in minutes and start making a difference in your community.',
    color: 'from-rose-500 to-red-600'
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Get alerted when your blood type is urgently needed nearby.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: Shield,
    title: 'Safe & Verified',
    description: 'All donors and recipients are verified to ensure safety and trust.',
    color: 'from-red-600 to-rose-700'
  },
  {
    icon: Activity,
    title: 'Track Your Impact',
    description: 'Monitor your donation history and see the lives you have touched.',
    color: 'from-rose-600 to-pink-700'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our team is always available to assist with urgent blood requests.',
    color: 'from-pink-600 to-red-700'
  },
];

const testimonials = [
  {
    avatar: '👨‍⚕️',
    name: 'Dr. Sarah Ahmed',
    role: 'Emergency Physician',
    text: 'BloodLink has revolutionized how we handle emergency blood requests. Response times are 70% faster.',
    rating: 5
  },
  {
    avatar: '🙋‍♂️',
    name: 'Michael Chen',
    role: 'Regular Donor',
    text: 'I have donated 15 times through BloodLink. Knowing exactly where my blood goes is incredibly rewarding.',
    rating: 5
  },
  {
    avatar: '👩‍👧',
    name: 'Priya Sharma',
    role: 'Grateful Recipient',
    text: 'When my daughter needed blood urgently, BloodLink connected us with donors within 30 minutes. Forever grateful.',
    rating: 5
  },
];

const urgentRequests = [
  { bloodType: 'O-', hospital: 'City General Hospital', time: '2 hours ago', units: 3 },
  { bloodType: 'AB+', hospital: 'Metro Medical Center', time: '4 hours ago', units: 2 },
  { bloodType: 'B-', hospital: 'Regional Health Institute', time: '6 hours ago', units: 4 },
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Home = () => {
  const [activeBloodType, setActiveBloodType] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern & Clean */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-red-200 rounded-full px-5 py-2 mb-8 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-700 text-sm font-medium">Live • 234 donors online now</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Every Drop
              </span>
              <br />
              <span className="text-gray-900">Counts</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join the largest blood donation network. Connect with donors and save lives in your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <UserPlus className="h-5 w-5 mr-2" />
                Become a Donor
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Blood
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <Icon className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Grid Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-50 rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4 text-red-600" />
              <span className="text-red-600 text-sm font-semibold">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose BloodLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern platform with powerful features designed for donors and recipients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="group hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-red-200">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${color} rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Requests Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4">
              <Bell className="h-4 w-4 text-red-600 animate-pulse" />
              <span className="text-red-600 text-sm font-semibold">Urgent</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-xl text-gray-600">
              Help someone in need right now
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {urgentRequests.map((request, index) => (
              <Card key={index} className="border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-red-100 rounded-lg px-4 py-2">
                      <div className="text-3xl font-bold text-red-600">{request.bloodType}</div>
                    </div>
                    <div className="text-sm text-gray-500">{request.time}</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{request.hospital}</h3>
                  <p className="text-sm text-gray-600 mb-4">Need {request.units} units urgently</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg">
                    <Heart className="h-4 w-4 mr-2" />
                    Respond Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Type Compatibility */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Know Your Blood Type
            </h2>
            <p className="text-xl text-gray-600">
              Understand compatibility and who you can help
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {bloodTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveBloodType(activeBloodType === type ? null : type)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${activeBloodType === type
                  ? 'bg-red-600 text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {activeBloodType && (
            <div className="mt-12 max-w-2xl mx-auto bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Blood Type {activeBloodType}
              </h3>
              <p className="text-gray-700 mb-4">
                People with {activeBloodType} blood can donate to certain blood types and receive from specific donors.
              </p>
              <div className="flex gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Learn More
                </Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Register as {activeBloodType} Donor
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-50 rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
              <span className="text-yellow-600 text-sm font-semibold">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stories That Inspire
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-500 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-24 bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Phone className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Need Blood Urgently?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Our 24/7 emergency helpline connects you with nearby donors instantly
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Card className="bg-white p-6 rounded-2xl shadow-2xl">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="bg-red-100 rounded-full p-4">
                    <Phone className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Emergency Hotline</div>
                    <div className="text-2xl font-bold text-gray-900">1-800-BLOOD</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white p-6 rounded-2xl shadow-2xl">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="bg-red-100 rounded-full p-4">
                    <Mail className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Email Support</div>
                    <div className="text-xl font-bold text-gray-900">help@bloodlink.com</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;