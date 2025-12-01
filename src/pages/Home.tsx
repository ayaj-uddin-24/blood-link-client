import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  Users,
  Clock,
  Award,
  UserPlus,
  CheckCircle,
  MapPin,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Users, label: 'Registered Donors', value: '2,500+', color: 'text-blue-600' },
    { icon: Heart, label: 'Lives Saved', value: '15,000+', color: 'text-red-500' },
    { icon: Clock, label: 'Blood Units Donated', value: '8,200+', color: 'text-green-600' },
    { icon: Award, label: 'Active Requests', value: '24', color: 'text-purple-600' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Smart Donor Matching',
      description: 'AI-powered matching system connects you with compatible donors in your area instantly.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Emergency Response',
      description: 'Critical blood requests are prioritized with instant notifications to nearby donors.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Shield,
      title: 'Verified & Secure',
      description: 'All donors are verified with secure, encrypted communication for your safety.',
      color: 'from-green-500 to-green-600',
    },
  ];

  const testimonials = [
    {
      name: 'Mahfuz Uddin',
      role: 'Blood Recipient',
      text: 'BloodLink saved my life during emergency surgery. Found a donor in just 15 minutes!',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Sourob Hossen',
      role: 'Emergency Physician',
      text: 'This platform has revolutionized how we handle blood emergencies in our hospital.',
      avatar: '👨‍⚕️'
    },
    {
      name: 'Habibur Rahman',
      role: 'Regular Donor',
      text: 'Donating blood has never been easier. The app keeps me informed about local needs.',
      avatar: '🩸'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Full Screen Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Red Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-red-600/85" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="max-w-5xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white text-sm font-medium">Trusted platform • Lives saved daily</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Save Lives Through
              <span className="block text-red-100">
                Blood Donation
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect with blood donors and recipients in your area.
              <br className="hidden sm:block" />
              <span className="font-semibold">Make a real difference today.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="group">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold text-base px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register as Donor
                </Button>
              </div>

              <div className="group">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold text-base px-8 py-3 rounded-lg transition-all duration-200"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Find Donors
                </Button>
              </div>
            </div>

            {/* Compact Stats in Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                  <Icon className="h-5 w-5 text-white mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-white/80 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="absolute bottom-6 right-6 z-20">
          <Button className="bg-red-700 hover:bg-red-800 text-white rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-200">
            <Heart className="h-5 w-5" fill="currentColor" />
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How BloodLink Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform connects blood donors with those in need, creating a community that saves lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <Card key={title} className="group hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${color} rounded-lg mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the heroes who make BloodLink possible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-300/20 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Heart className="h-12 w-12 text-white" fill="currentColor" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Save Lives?
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of heroes who are making a difference in their communities.
            <span className="font-semibold"> Your blood type is needed right now.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="group">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 transition-all duration-300 px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/25 hover:scale-105 transform">
                Start Saving Lives Today
                <Heart className="h-6 w-6 ml-3 group-hover:scale-110 transition-transform" fill="currentColor" />
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transform transition-all duration-300"
            >
              <MapPin className="h-6 w-6 mr-3" />
              Find Local Requests
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
