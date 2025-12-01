/* eslint-disable no-case-declarations */
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Heart,
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Hospital,
  Calendar,
  Droplet,
  Share2,
  Bell,
  CheckCircle,
  Users,
  Zap,
  MessageCircle,
  Eye,
  Shield,
  Loader2
} from 'lucide-react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels = [
  { value: 'low', label: 'Low Priority', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'high', label: 'High Priority', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { value: 'critical', label: 'Critical/Emergency', color: 'text-red-600', bgColor: 'bg-red-100' }
];

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('urgency');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('view');

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    urgency: '',
    hospitalName: '',
    contactInfo: '',
    location: '',
    requiredBy: '',
    unitsNeeded: '',
    description: '',
    emergencyContact: '',
    doctorName: '',
    medicalCondition: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [respondedRequests, setRespondedRequests] = useState(new Set());

  // Fetch requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '100'
      });
      // Add filters if needed for server-side, but keeping client-side for now
      const response = await fetch(`http://localhost:3000/api/v1/blood-requests?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blood requests');
      }
      const data = await response.json();
      const mappedRequests = data.bloodRequests.map((req) => ({
        id: req._id,
        patientName: req.patientName,
        bloodGroup: req.bloodGroup,
        urgency: req.urgencyLevel.toLowerCase(),
        hospitalName: req.hospitalName,
        contactInfo: req.primaryContact,
        location: req.location,
        requiredBy: req.requiredBy.split('T')[0],
        description: req.medicalReason,
        requestDate: req.createdAt.split('T')[0],
        status: 'active', // Default; can extend backend for status
        responses: 0, // Default; can add field later
        views: 0, // Default
        verified: false // Default; can add verification field
      }));
      setRequests(mappedRequests);
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      alert('Error fetching blood requests: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Get unique locations
  const locations = useMemo(() => {
    const unique = [...new Set(requests.map(req => req.location))];
    return unique.sort();
  }, [requests]);

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    const filtered = requests.filter(request => {
      const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBloodGroup = filterBloodGroup === 'all' || request.bloodGroup === filterBloodGroup;
      const matchesUrgency = filterUrgency === 'all' || request.urgency === filterUrgency;
      const matchesLocation = filterLocation === 'all' || request.location === filterLocation;

      return matchesSearch && matchesBloodGroup && matchesUrgency && matchesLocation;
    });

    // Sort requests
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'urgency':
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        case 'date':
          return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
        case 'deadline':
          return new Date(a.requiredBy).getTime() - new Date(b.requiredBy).getTime();
        case 'responses':
          return b.responses - a.responses;
        default:
          return 0;
      }
    });

    return filtered;
  }, [requests, searchTerm, filterBloodGroup, filterUrgency, filterLocation, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        urgencyLevel: formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1),
        unitsNeeded: parseInt(formData.unitsNeeded) || 1,
        requiredBy: formData.requiredBy,
        hospitalName: formData.hospitalName,
        doctorName: formData.doctorName,
        primaryContact: formData.contactInfo,
        emergencyContact: formData.emergencyContact,
        location: formData.location,
        medicalReason: formData.medicalCondition,
        additionalInformation: formData.additionalInfo,
        detailsDescription: formData.description,
      };

      const response = await fetch('http://localhost:3000/api/v1/blood-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      // Refetch requests after successful creation
      await fetchRequests();

      // Reset form
      setFormData({
        patientName: '',
        bloodGroup: '',
        urgency: '',
        hospitalName: '',
        contactInfo: '',
        location: '',
        requiredBy: '',
        unitsNeeded: '',
        description: '',
        emergencyContact: '',
        doctorName: '',
        medicalCondition: '',
        additionalInfo: ''
      });

      setActiveTab('view');
      alert('Blood request submitted successfully! Donors will be notified.');
    } catch (error) {
      alert('Error submitting request: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRespond = (request) => {
    setRespondedRequests(prev => new Set([...prev, request.id]));
    setRequests(prev => prev.map(req =>
      req.id === request.id
        ? { ...req, responses: req.responses + 1 }
        : req
    ));
    alert(`Thank you for responding to ${request.patientName}'s request!`);
  };

  const handleShare = (request) => {
    if (navigator.share) {
      navigator.share({
        title: `Urgent Blood Request - ${request.bloodGroup}`,
        text: `${request.patientName} needs ${request.bloodGroup} blood at ${request.hospitalName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterBloodGroup('all');
    setFilterUrgency('all');
    setFilterLocation('all');
  };

  const getUrgencyBadge = (urgency) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level ? (
      <Badge className={`${level.bgColor} ${level.color} border-0`}>
        {urgency === 'critical' && <Zap className="h-3 w-3 mr-1" />}
        {level.label}
      </Badge>
    ) : null;
  };

  const getTimeRemaining = (requiredBy) => {
    const now = new Date();
    const deadline = new Date(requiredBy);
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.ceil(diff / (1000 * 60 * 60));

    if (hours < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (hours < 24) return { text: `${hours}h left`, color: 'text-red-600' };
    if (hours < 72) return { text: `${Math.ceil(hours / 24)}d left`, color: 'text-orange-600' };
    return { text: `${Math.ceil(hours / 24)}d left`, color: 'text-green-600' };
  };

  const RequestCard = ({ request }) => {
    const timeRemaining = getTimeRemaining(request.requiredBy);
    const isResponded = respondedRequests.has(request.id);

    return (
      <Card className={`transition-all duration-200 hover:shadow-lg border-l-4 ${request.urgency === 'critical' ? 'border-l-red-500 bg-red-50/30' :
        request.urgency === 'high' ? 'border-l-orange-500 bg-orange-50/30' :
          request.urgency === 'medium' ? 'border-l-yellow-500 bg-yellow-50/30' :
            'border-l-green-500 bg-green-50/30'
        }`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Droplet className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{request.patientName}</span>
                  {request.verified && <Shield className="h-4 w-4 text-blue-500" />}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  {getUrgencyBadge(request.urgency)}
                  <Badge variant="outline" className="bg-red-600 text-white border-red-600">
                    {request.bloodGroup}
                  </Badge>
                  {request.status === 'fulfilled' && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Fulfilled
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${timeRemaining.color}`}>
                {timeRemaining.text}
              </div>
              <div className="text-xs text-gray-500">
                Req: {new Date(request.requestDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Hospital className="h-4 w-4 text-gray-500" />
              <span>{request.hospitalName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Needed by: {new Date(request.requiredBy).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{request.responses} responses • {request.views} views</span>
            </div>
          </div>

          {request.description && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{request.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => handleRespond(request)}
              disabled={isResponded || request.status === 'fulfilled'}
              className={isResponded ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isResponded ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Responded
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-1" />
                  I Can Help
                </>
              )}
            </Button>

            <Button size="sm" variant="outline" onClick={() => handleShare(request)}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>

            <Button size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-1" />
              Contact
            </Button>

            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const activeRequests = filteredRequests.filter(req => req.status === 'active');
  const criticalRequests = activeRequests.filter(req => req.urgency === 'critical');
  const stats = {
    total: requests.length,
    active: requests.filter(r => r.status === 'active').length,
    critical: requests.filter(r => r.urgency === 'critical').length,
    fulfilled: requests.filter(r => r.status === 'fulfilled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blood requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-7 w-7 text-red-600 mr-3" />
                Blood Requests
              </h1>
              <p className="text-gray-600 mt-1">
                Request blood or help save lives by responding to urgent needs
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">{stats.active}</div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-lg font-bold text-red-600">{stats.critical}</div>
                <div className="text-xs text-gray-600">Critical</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-600">{stats.fulfilled}</div>
                <div className="text-xs text-gray-600">Fulfilled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">
              <Eye className="h-4 w-4 mr-2" />
              View Requests ({activeRequests.length})
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            {/* Search and Filters */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <Search className="h-5 w-5 text-red-600 mr-2" />
                    Search & Filter
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by patient name, hospital, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {showFilters && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Blood Group</Label>
                        <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Blood Groups</SelectItem>
                            {bloodGroups.map(group => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Urgency</Label>
                        <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Urgency Levels</SelectItem>
                            {urgencyLevels.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Location</Label>
                        <Select value={filterLocation} onValueChange={setFilterLocation}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgency">Urgency Level</SelectItem>
                            <SelectItem value="date">Request Date</SelectItem>
                            <SelectItem value="deadline">Deadline</SelectItem>
                            <SelectItem value="responses">Most Responses</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Showing {filteredRequests.length} of {requests.length} requests
                      </div>
                      <Button onClick={clearFilters} variant="outline" size="sm">
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            {criticalRequests.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-red-800">
                    Critical Emergency Requests ({criticalRequests.length})
                  </h2>
                </div>
                <div className="grid gap-4">
                  {criticalRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            )}

            {/* All Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Heart className="h-5 w-5 text-red-600 mr-2" />
                  All Requests
                </h2>
                {activeRequests.length > 0 && (
                  <Button size="sm" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Me of New Requests
                  </Button>
                )}
              </div>

              {filteredRequests.length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
                    <p className="text-gray-600 mb-4">
                      No requests match your current filters. Try adjusting your search criteria.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Plus className="h-6 w-6 text-red-600 mr-2" />
                  Create Blood Request
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out this form to post a blood request. All information will be shared with potential donors to help save lives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        required
                        value={formData.patientName}
                        onChange={handleChange}
                        placeholder="Full name of patient"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Blood Group Needed *</Label>
                      <Select onValueChange={(value) => handleSelectChange('bloodGroup', value)} value={formData.bloodGroup}>
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
                      <Label className="mb-2 block">Urgency Level *</Label>
                      <Select onValueChange={(value) => handleSelectChange('urgency', value)} value={formData.urgency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <span className={level.color}>{level.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="unitsNeeded">Units Needed</Label>
                      <Input
                        id="unitsNeeded"
                        name="unitsNeeded"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.unitsNeeded}
                        onChange={handleChange}
                        placeholder="Number of units"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="requiredBy">Required By *</Label>
                      <Input
                        id="requiredBy"
                        name="requiredBy"
                        type="date"
                        required
                        value={formData.requiredBy}
                        onChange={handleChange}
                        className="mt-1"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hospitalName">Hospital/Medical Center *</Label>
                      <Input
                        id="hospitalName"
                        name="hospitalName"
                        required
                        value={formData.hospitalName}
                        onChange={handleChange}
                        placeholder="Name of hospital or medical facility"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="doctorName">Doctor/Physician Name</Label>
                      <Input
                        id="doctorName"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleChange}
                        placeholder="Attending physician name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactInfo">Primary Contact *</Label>
                      <Input
                        id="contactInfo"
                        name="contactInfo"
                        required
                        value={formData.contactInfo}
                        onChange={handleChange}
                        placeholder="Phone number or email"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Alternative contact information"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="location">Location/Address *</Label>
                      <Input
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, area or complete hospital address"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="medicalCondition">Medical Condition/Reason</Label>
                      <Input
                        id="medicalCondition"
                        name="medicalCondition"
                        value={formData.medicalCondition}
                        onChange={handleChange}
                        placeholder="Surgery, accident, medical condition, etc."
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Input
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any other relevant information"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide a detailed description of the situation"
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    By submitting this form, you agree to share this information with potential blood donors. Please ensure all details are accurate to facilitate timely assistance.
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BloodRequests;