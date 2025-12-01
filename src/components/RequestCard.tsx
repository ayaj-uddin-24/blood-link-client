import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Phone, Calendar, Hospital } from 'lucide-react';
import type { BloodRequest } from '@/data/mockData';
import { urgencyLevels } from '@/data/mockData';

interface RequestCardProps {
  request: BloodRequest;
  onRespond: (request: BloodRequest) => void;
}

const RequestCard = ({ request, onRespond }: RequestCardProps) => {
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

  const getUrgencyInfo = (urgency: string) => {
    return urgencyLevels.find(level => level.value === urgency) || urgencyLevels[0];
  };

  const urgencyInfo = getUrgencyInfo(request.urgency);

  const isExpired = new Date(request.requiredBy) < new Date();
  const daysDiff = Math.ceil((new Date(request.requiredBy).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Card className={`shadow-soft hover:shadow-medium transition-slow ${request.urgency === 'critical' ? 'border-destructive border-2' : ''
      } ${isExpired ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-foreground">Patient: {request.patientName}</h3>
              <Badge className={`${getBloodGroupColor(request.bloodGroup)} font-bold`}>
                {request.bloodGroup} Needed
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className={urgencyInfo.color}>
                {urgencyInfo.label} Priority
              </span>
              {daysDiff > 0 ? (
                <span className="text-warning">Required in {daysDiff} days</span>
              ) : (
                <span className="text-destructive font-semibold">URGENT - Due today!</span>
              )}
            </div>
          </div>
          <Badge
            variant={request.status === 'active' ? 'default' : 'secondary'}
            className={request.status === 'fulfilled' ? 'bg-success text-success-foreground' : ''}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Hospital className="h-4 w-4 text-primary" />
          <span className="font-medium">{request.hospitalName}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{request.location}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Required by: {new Date(request.requiredBy).toLocaleDateString()}</span>
        </div>

        {request.description && (
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
            <strong>Details:</strong> {request.description}
          </div>
        )}

        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <span>Contact: {request.contactInfo}</span>
          </div>

          {request.status === 'active' && !isExpired && (
            <Button
              onClick={() => onRespond(request)}
              size="sm"
              className="gradient-hero hover:opacity-90 transition-base"
            >
              I Can Help
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;