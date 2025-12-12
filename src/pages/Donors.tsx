/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Users,
  Phone,
  Clock,
  Heart,
  Star,
  SlidersHorizontal,
  Map,
  List,
  Grid3X3,
  AlertCircle,
  UserCheck,
  Zap,
  Shield
} from 'lucide-react';
import { bloodGroups } from '../data/mockData';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('distance');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [maxDistance, setMaxDistance] = useState(10);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [contactedDonors, setContactedDonors] = useState(new Set());

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date(2025, 9, 4); // October 04, 2025
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch donors from backend
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/donor');
        if (!response.ok) {
          throw new Error('Failed to fetch donors');
        }
        const data = await response.json();
        const mappedDonors = data.donors.map((donor: any) => ({
          id: donor._id,
          name: donor.fullName,
          bloodGroup: donor.bloodGroup,
          gender: donor.gender,
          age: calculateAge(donor.dateOfBirth),
          location: donor.address,
          phone: donor.phoneNumber,
          email: donor.email,
          lastDonation: null,
          donationCount: 0,
          isAvailable: true,
          rating: 5.0,
          verified: false,
          distance: Math.floor(Math.random() * 20) + 1, // Simulated distance
          responseTime: ['< 30 mins', '< 1 hour', '< 2 hours'][Math.floor(Math.random() * 3)],
          profileImage: donor.gender === 'Male' ? '👨' : donor.gender === 'Female' ? '👩' : '🧑'
        }));
        setDonors(mappedDonors);
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };

    fetchDonors();
  }, []);

  // Get unique locations from donors
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(donors.map((donor: any) => donor.location))];
    return uniqueLocations.sort();
  }, [donors]);

  // Filter and sort donors
  const filteredDonors = useMemo(() => {
    let filtered = donors.filter((donor: any) => {
      const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBloodGroup = selectedBloodGroup === 'all' || donor.bloodGroup === selectedBloodGroup;
      const matchesGender = selectedGender === 'all' || donor.gender.toLowerCase() === selectedGender;
      const matchesLocation = selectedLocation === 'all' || donor.location === selectedLocation;
      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && donor.isAvailable) ||
        (availabilityFilter === 'unavailable' && !donor.isAvailable);
      const matchesDistance = donor.distance <= maxDistance;

      return matchesSearch && matchesBloodGroup && matchesGender && matchesLocation && matchesAvailability && matchesDistance;
    });

    // Sort donors
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'donations':
          return b.donationCount - a.donationCount;
        case 'response':
          // eslint-disable-next-line no-case-declarations
          const responseOrder = { '< 30 mins': 0, '< 1 hour': 1, '< 2 hours': 2 };
          return (responseOrder[a.responseTime] || 3) - (responseOrder[b.responseTime] || 3);
        default:
          return 0;
      }
    });

    // Emergency mode: prioritize available donors
    if (emergencyMode) {
      filtered = filtered.filter((donor: any) => donor.isAvailable);
    }

    return filtered;
  }, [donors, searchTerm, selectedBloodGroup, selectedGender, selectedLocation, availabilityFilter, maxDistance, sortBy, emergencyMode]);

  const handleContactDonor = (donor: any) => {
    setContactedDonors(prev => new Set([...prev, donor.id]));
    alert(`Contacting ${donor.name}...\nPhone: ${donor.phone}\nEmail: ${donor.email}`);
  };

  const toggleFavorite = (donorId: string | number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(donorId)) {
        newFavorites.delete(donorId);
      } else {
        newFavorites.add(donorId);
      }
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBloodGroup('all');
    setSelectedGender('all');
    setSelectedLocation('all');
    setAvailabilityFilter('all');
    setMaxDistance(10);
  };

  const DonorCard = ({ donor, isListView = false }: { donor: any; isListView?: boolean }) => (
    <Card className={`group hover:shadow-lg transition-all duration-200 border ${donor.isAvailable ? 'border-green-200 hover:border-green-300' : 'border-gray-200'} ${isListView ? 'mb-4' : ''}`}>
      <CardContent className={`p-4 ${isListView ? 'flex items-center space-x-4' : ''}`}>
        {/* Profile Section */}
        <div className={`${isListView ? 'flex items-center space-x-4 flex-1' : 'text-center mb-4'}`}>
          <div className="relative">
            <div className={`${isListView ? 'w-12 h-12' : 'w-16 h-16 mx-auto'} bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-2xl mb-2`}>
              {donor.profileImage}
            </div>
            {donor.isAvailable && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className={isListView ? 'flex-1' : ''}>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{donor.name}</h3>
              {donor.verified && <Shield className="h-4 w-4 text-blue-500" />}
            </div>

            <div className="flex items-center justify-center space-x-2 mb-2">
              <Badge
                variant={donor.isAvailable ? "default" : "secondary"}
                className={donor.isAvailable ? "bg-green-100 text-green-800" : ""}
              >
                {donor.bloodGroup}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {donor.gender}, {donor.age}
              </Badge>
            </div>

            <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span>{donor.location}</span>
              <span className="text-xs">({donor.distance} km)</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {!isListView && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-lg font-bold text-red-600">{donor.donationCount}</div>
              <div className="text-xs text-gray-500">Donations</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-lg font-bold">{donor.rating}</span>
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className={`${isListView ? 'flex items-center space-x-4' : 'space-y-2'}`}>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Responds in {donor.responseTime}</span>
          </div>
          {isListView && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{donor.rating}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {donor.donationCount} donations
              </Badge>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`${isListView ? 'flex items-center space-x-2' : 'flex space-x-2 mt-4'}`}>
          <Button
            size="sm"
            onClick={() => handleContactDonor(donor)}
            disabled={!donor.isAvailable || contactedDonors.has(donor.id)}
            className={`flex-1 ${contactedDonors.has(donor.id) ? 'bg-gray-500' : ''}`}
          >
            {contactedDonors.has(donor.id) ? (
              <>
                <UserCheck className="h-4 w-4 mr-1" />
                Contacted
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 mr-1" />
                Contact
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleFavorite(donor.id)}
            className={favorites.has(donor.id) ? 'text-red-600 border-red-600' : ''}
          >
            <Heart className={`h-4 w-4 ${favorites.has(donor.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">Find Blood Donors</h1>
                {emergencyMode && (
                  <Badge className="bg-red-600 text-white animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    Emergency Mode
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {donors.length} registered donors • {filteredDonors.filter((d: any) => d.isAvailable).length} available now
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setEmergencyMode(!emergencyMode)}
                variant={emergencyMode ? "destructive" : "outline"}
                size="sm"
                className={emergencyMode ? "animate-pulse" : ""}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {emergencyMode ? 'Exit Emergency' : 'Emergency Mode'}
              </Button>
              <div className="text-right">
                <div className="text-xl font-bold text-red-600">{filteredDonors.length}</div>
                <div className="text-xs text-gray-500">Results</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Search className="h-5 w-5 text-red-600 mr-2" />
                Search & Filter
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="h-8 px-3"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, location, or blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Blood Group:</label>
                <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {bloodGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="donations">Most Donations</SelectItem>
                    <SelectItem value="response">Response Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location: string) => (
                          <SelectItem key={location} value={location}>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {location}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Donors</SelectItem>
                        <SelectItem value="available">Available Only</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Max Distance: {maxDistance} km
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {filteredDonors.length} of {donors.length} donors
                  </div>
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <Card className="shadow-sm mb-6">
            <CardContent className="p-8 text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
              <p className="text-gray-600 mb-4">Interactive map showing donor locations would be displayed here</p>
              <Button onClick={() => setViewMode('grid')} variant="outline">
                Switch to Grid View
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {filteredDonors.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donors Found</h3>
              <p className="text-gray-600 mb-4">
                No donors match your current search criteria. Try adjusting your filters.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'list' ? 'space-y-0' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {filteredDonors.map((donor: any) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Donors;