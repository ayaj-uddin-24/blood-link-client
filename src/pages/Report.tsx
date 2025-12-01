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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertCircle,
    User,
    Mail,
    Flag,
    Clock,
    FileText,
    ShieldCheck,
    Search,
    Filter,
    RotateCcw,
    Eye,
    Plus,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';

const Report = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState('view');
    const [formData, setFormData] = useState({
        reportedUserType: 'blood donor',
        reportedUserId: '',
        reportCategory: '',
        description: '',
        anonymous: false,
        evidenceUrl: '',
    });

    // Category mapping for backend/frontend
    const categoryMap = {
        'fake-profile': 'fake people',
        'harassment': 'harassment',
        'spam': 'spam',
        'inappropriate-behavior': 'rude behavior',
        'fraud': 'fraud',
        'other': 'other',
    };

    const reverseCategoryMap = {
        'fake people': 'Fake Profile',
        'harassment': 'Harassment',
        'spam': 'Spam',
        'rude behavior': 'Inappropriate Behavior',
        'fraud': 'Fraud',
        'other': 'Other',
    };

    const reportCategories = [
        { value: 'fake-profile', label: 'Fake Profile', icon: '👤' },
        { value: 'harassment', label: 'Harassment', icon: '🚫' },
        { value: 'spam', label: 'Spam', icon: '📧' },
        { value: 'inappropriate-behavior', label: 'Inappropriate Behavior', icon: '⚠️' },
        { value: 'fraud', label: 'Fraud', icon: '💰' },
        { value: 'other', label: 'Other', icon: '❓' },
    ];

    const statuses = ['Under Review', 'Resolved', 'Dismissed'];

    // Fetch reports from backend
    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: '1',
                limit: '100'
            });
            if (filterCategory !== 'all') params.append('category', categoryMap[filterCategory] || filterCategory);
            if (filterStatus !== 'all') params.append('anonymous', 'false');

            const response = await fetch(`http://localhost:3000/api/v1/reports`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const data = await response.json();
            const mappedReports = data.reports.map((report) => ({
                id: report._id,
                date: report.createdAt.split('T')[0],
                reportedUser: report.userIdentification || 'Anonymous',
                category: reverseCategoryMap[report.reportCategory] || report.reportCategory,
                status: 'Under Review',
                description: report.detailedDescription,
                evidence: report.supportingEvidence || '',
                resolutionNotes: '',
                priority: 'Medium',
                anonymous: report.anonymous,
            }));
            setReports(mappedReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            alert('Error fetching reports: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }); // Refetch when switching tabs if needed

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

    const handleCheckboxChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            anonymous: checked
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const submitData = {
                userType: formData.reportedUserType,
                userIdentification: formData.anonymous ? undefined : formData.reportedUserId,
                reportCategory: categoryMap[formData.reportCategory] || formData.reportCategory,
                detailedDescription: formData.description,
                supportingEvidence: formData.evidenceUrl,
                anonymous: formData.anonymous,
            };

            const response = await fetch('http://localhost:3000/api/v1/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit report');
            }

            // Refetch reports after successful submission
            await fetchReports();

            // Reset form
            setFormData({
                reportedUserType: 'blood donor',
                reportedUserId: '',
                reportCategory: '',
                description: '',
                anonymous: false,
                evidenceUrl: '',
            });
            setActiveTab('view');
            alert('Report submitted successfully!');
        } catch (error) {
            alert('Error submitting report: ' + (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status) => {
        const styles = {
            'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
            'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Dismissed': 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getPriorityStyles = (priority) => {
        const styles = {
            'High': 'bg-red-100 text-red-800 border-red-300',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Low': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return styles[priority] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Fake Profile': '👤',
            'Harassment': '🚫',
            'Spam': '📧',
            'Inappropriate Behavior': '⚠️',
            'Fraud': '💰',
            'Other': '❓'
        };
        return icons[category] || '❓';
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('all');
        setFilterStatus('all');
    };

    const stats = {
        total: reports.length,
        underReview: reports.filter(r => r.status === 'Under Review').length,
        resolved: reports.filter(r => r.status === 'Resolved').length,
        dismissed: reports.filter(r => r.status === 'Dismissed').length,
    };

    if (loading && activeTab === 'view') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Modern Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 backdrop-blur-sm bg-white/90">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                                    <ShieldCheck className="h-8 w-8 text-white" />
                                </div>
                                Community Safety Center
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Report safety concerns and track your submissions to maintain a trusted community environment.
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                                <div className="text-sm text-gray-600">Total Reports</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-4 text-center border border-amber-200">
                                <div className="text-2xl font-bold text-amber-700">{stats.underReview}</div>
                                <div className="text-sm text-gray-600">Under Review</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 text-center border border-emerald-200">
                                <div className="text-2xl font-bold text-emerald-700">{stats.resolved}</div>
                                <div className="text-sm text-gray-600">Resolved</div>
                            </div>
                            <div className="bg-gradient-to-br from-rose-50 to-red-100 rounded-xl p-4 text-center border border-rose-200">
                                <div className="text-2xl font-bold text-rose-700">{stats.dismissed}</div>
                                <div className="text-sm text-gray-600">Dismissed</div>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-lg rounded-xl p-1 h-14 border border-gray-200">
                        <TabsTrigger value="view" className="text-base py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                            <Eye className="h-5 w-5 mr-2" />
                            View Reports
                        </TabsTrigger>
                        <TabsTrigger value="create" className="text-base py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                            <Plus className="h-5 w-5 mr-2" />
                            New Report
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="view" className="space-y-6">
                        {/* Enhanced Search and Filters */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center text-xl text-gray-900">
                                        <Search className="h-6 w-6 text-blue-600 mr-3" />
                                        Search & Filter Reports
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Search by user, description, or report ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl text-lg"
                                    />
                                </div>

                                {showFilters && (
                                    <div className="border-t border-gray-100 pt-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">Category</Label>
                                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                                    <SelectTrigger className="border-gray-200 rounded-xl h-11">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Categories</SelectItem>
                                                        {reportCategories.map((cat) => (
                                                            <SelectItem key={cat.value} value={cat.value}>
                                                                <span className="flex items-center">
                                                                    <span className="mr-2">{cat.icon}</span>
                                                                    {cat.label}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">Status</Label>
                                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                    <SelectTrigger className="border-gray-200 rounded-xl h-11">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Statuses</SelectItem>
                                                        {statuses.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">Actions</Label>
                                                <Button
                                                    onClick={clearFilters}
                                                    variant="outline"
                                                    className="w-full h-11 rounded-xl border-gray-200 hover:bg-gray-50"
                                                >
                                                    <RotateCcw className="h-4 w-4 mr-2" />
                                                    Clear Filters
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Enhanced Reports Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredReports.map((report) => (
                                <Card
                                    key={report.id}
                                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white"
                                >
                                    <CardHeader className={`pb-3 ${report.status === 'Under Review' ? 'bg-gradient-to-r from-amber-50 to-orange-50' : report.status === 'Resolved' ? 'bg-gradient-to-r from-emerald-50 to-green-50' : 'bg-gradient-to-r from-rose-50 to-red-50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                                    <span className="text-2xl mr-2">{getCategoryIcon(report.category)}</span>
                                                    Report #{report.id}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-gray-600 flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {new Date(report.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </CardDescription>
                                            </div>
                                            <div className="flex flex-col space-y-2 items-end">
                                                <Badge className={`${getStatusStyles(report.status)} px-3 py-1 font-medium text-xs rounded-full`}>
                                                    {report.status}
                                                </Badge>
                                                <Badge className={`${getPriorityStyles(report.priority)} px-2 py-1 text-xs rounded-full`}>
                                                    {report.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-800">{report.reportedUser}</span>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Flag className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <Badge className="bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">
                                                    {report.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-700 line-clamp-3">
                                                {report.description}
                                            </p>
                                        </div>

                                        {report.evidence && (
                                            <div className="space-y-3 animate-in fade-in duration-200">
                                                <div className="flex items-center space-x-2 text-blue-600">
                                                    <FileText className="h-4 w-4" />
                                                    <a href={report.evidence} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                                                        View Evidence
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredReports.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reports Found</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Try adjusting your search criteria or filters to find what you're looking for.
                                </p>
                                <Button onClick={clearFilters} variant="outline" className="rounded-xl">
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="create">
                        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-b border-gray-100">
                                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                                    <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-xl mr-4">
                                        <AlertCircle className="h-6 w-6 text-white" />
                                    </div>
                                    Submit New Safety Report
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-lg">
                                    Help us maintain a safe community by providing detailed information about your concern.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="reportedUserType" className="flex items-center space-x-2 text-base font-semibold text-gray-700">
                                            <User className="h-5 w-5 text-blue-600" />
                                            <span>User Type</span>
                                        </Label>
                                        <Select
                                            value={formData.reportedUserType}
                                            onValueChange={(value) => handleSelectChange('reportedUserType', value)}
                                        >
                                            <SelectTrigger className="border-gray-200 focus:border-blue-400 h-12 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="blood donor">🩸 Blood Donor</SelectItem>
                                                <SelectItem value="recipient">🏥 Recipient</SelectItem>
                                                <SelectItem value="other">👥 Other User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="reportedUserId" className="flex items-center space-x-2 text-base font-semibold text-gray-700">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                            <span>User Identification</span>
                                        </Label>
                                        <Input
                                            id="reportedUserId"
                                            name="reportedUserId"
                                            value={formData.reportedUserId}
                                            onChange={handleChange}
                                            placeholder="Enter user ID, email, or username"
                                            className="border-gray-200 focus:border-blue-400 h-12 rounded-xl text-base"
                                        />
                                    </div>

                                    <div className="lg:col-span-2 space-y-3">
                                        <Label htmlFor="reportCategory" className="flex items-center space-x-2 text-base font-semibold text-gray-700">
                                            <Flag className="h-5 w-5 text-blue-600" />
                                            <span>Report Category</span>
                                        </Label>
                                        <Select
                                            value={formData.reportCategory}
                                            onValueChange={(value) => handleSelectChange('reportCategory', value)}
                                        >
                                            <SelectTrigger className="border-gray-200 focus:border-blue-400 h-12 rounded-xl">
                                                <SelectValue placeholder="Select the type of issue you're reporting" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {reportCategories.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        <span className="flex items-center text-base">
                                                            <span className="mr-3 text-lg">{cat.icon}</span>
                                                            {cat.label}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="lg:col-span-2 space-y-3">
                                        <Label htmlFor="description" className="flex items-center space-x-2 text-base font-semibold text-gray-700">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            <span>Detailed Description</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Please provide a detailed description of the incident, including dates, times, and any relevant context that will help us investigate..."
                                            className="min-h-[150px] border-gray-200 focus:border-blue-400 rounded-xl text-base resize-none"
                                        />
                                    </div>

                                    <div className="lg:col-span-2 space-y-3">
                                        <Label htmlFor="evidenceUrl" className="flex items-center space-x-2 text-base font-semibold text-gray-700">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            <span>Supporting Evidence (Optional)</span>
                                        </Label>
                                        <Input
                                            id="evidenceUrl"
                                            name="evidenceUrl"
                                            value={formData.evidenceUrl}
                                            onChange={handleChange}
                                            placeholder="Provide links to screenshots, documents, or other supporting evidence"
                                            className="border-gray-200 focus:border-blue-400 h-12 rounded-xl text-base"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl border border-blue-200">
                                            <Checkbox
                                                id="anonymous"
                                                checked={formData.anonymous}
                                                onCheckedChange={handleCheckboxChange}
                                                className="border-blue-300"
                                            />
                                            <Label htmlFor="anonymous" className="text-base font-medium text-gray-700 cursor-pointer">
                                                Submit this report anonymously
                                                <div className="text-sm text-gray-500 mt-1">Your identity will remain completely confidential throughout the investigation process.</div>
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab('view')}
                                        className="h-12 px-8 rounded-xl border-gray-200 text-base"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !formData.reportedUserId || !formData.reportCategory || !formData.description}
                                        className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-base font-semibold transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Submitting Report...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-5 w-5 mr-2" />
                                                Submit Safety Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Report;