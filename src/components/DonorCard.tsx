import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MapPin, Calendar, Award } from 'lucide-react';
import { colors, type Donor } from '@/data/mockData';

interface DonorCardProps {
  donor: Donor;
  onContact: (donor: Donor) => void;
}

const DonorCard = ({ donor, onContact }: DonorCardProps) => {
  const getBloodGroupColor = (bloodGroup: string) => {
    return colors[bloodGroup as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-slow hover:-translate-y-1 gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(donor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{donor.name}</h3>
              <p className="text-sm text-muted-foreground">{donor.gender}, {donor.age} years</p>
            </div>
          </div>
          <Badge
            className={`${getBloodGroupColor(donor.bloodGroup)} font-bold text-sm px-3 py-1`}
          >
            {donor.bloodGroup}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{donor.location}</span>
        </div>

        {donor.lastDonation && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Last donated: {new Date(donor.lastDonation).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Award className="h-4 w-4 text-primary" />
          <span>{donor.donationCount} donations</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${donor.isAvailable ? 'bg-success' : 'bg-muted'}`} />
          <span className={`text-sm ${donor.isAvailable ? 'text-success' : 'text-muted-foreground'}`}>
            {donor.isAvailable ? 'Available to donate' : 'Not available'}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => onContact(donor)}
          disabled={!donor.isAvailable}
          className="w-full gradient-hero hover:opacity-90 transition-base"
          size="sm"
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact Donor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DonorCard;