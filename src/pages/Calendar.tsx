import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User, Video, Phone, MessageSquare } from "lucide-react";

type FilterPeriod = "today" | "tomorrow" | "week" | "month";

const mockMeetings = [
  {
    id: "m1",
    clientId: "1",
    clientName: "Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "Property Tour",
    location: "Downtown Seattle",
    status: "confirmed",
    description: "Tour modern condos in downtown area",
    duration: "2 hours",
    meetingType: "in-person"
  },
  {
    id: "m2", 
    clientId: "2",
    clientName: "Michael Chen",
    date: "2024-01-15",
    time: "2:30 PM", 
    type: "Initial Consultation",
    location: "Virtual Meeting",
    status: "confirmed",
    description: "Discuss family home requirements and budget",
    duration: "1 hour",
    meetingType: "virtual"
  },
  {
    id: "m3",
    clientId: "3", 
    clientName: "Emily Rodriguez",
    date: "2024-01-16",
    time: "9:00 AM",
    type: "Contract Review",
    location: "Office",
    status: "pending",
    description: "Review offer documents for historic property",
    duration: "1.5 hours",
    meetingType: "in-person"
  },
  {
    id: "m4",
    clientId: "1",
    clientName: "Sarah Johnson", 
    date: "2024-01-18",
    time: "11:00 AM",
    type: "Follow-up Call",
    location: "Phone Call",
    status: "confirmed",
    description: "Discuss feedback from recent property tours",
    duration: "30 minutes",
    meetingType: "phone"
  }
];

const filterButtons = [
  { id: "today", label: "Today", period: "today" as FilterPeriod },
  { id: "tomorrow", label: "Tomorrow", period: "tomorrow" as FilterPeriod },
  { id: "week", label: "This Week", period: "week" as FilterPeriod },
  { id: "month", label: "This Month", period: "month" as FilterPeriod }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed": return "default";
    case "pending": return "secondary";
    case "cancelled": return "destructive";
    default: return "outline";
  }
};

const getMeetingIcon = (type: string) => {
  switch (type) {
    case "virtual": return Video;
    case "phone": return Phone;
    default: return User;
  }
};

export default function Calendar() {
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>("today");
  const navigate = useNavigate();

  const filterMeetings = (period: FilterPeriod) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return mockMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      
      switch (period) {
        case "today":
          return meetingDate.toDateString() === today.toDateString();
        case "tomorrow":
          return meetingDate.toDateString() === tomorrow.toDateString();
        case "week":
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return meetingDate >= weekStart && meetingDate <= weekEnd;
        case "month":
          return meetingDate.getMonth() === today.getMonth() && 
                 meetingDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  };

  const filteredMeetings = filterMeetings(activeFilter);

  const handleMeetingClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleLaunchMeeting = (meetingId: string, type: string) => {
    // Placeholder for meeting launch functionality
    console.log(`Launching ${type} meeting ${meetingId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Calendar & Meetings</h1>
        <p className="text-muted-foreground">
          Manage your scheduled meetings and appointments with clients
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {filterButtons.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.period ? "professional" : "outline"}
            onClick={() => setActiveFilter(filter.period)}
            className="transition-all duration-200"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Meeting Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredMeetings.length}</p>
                <p className="text-sm text-muted-foreground">Total Meetings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredMeetings.filter(m => m.status === "confirmed").length}
                </p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredMeetings.filter(m => m.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredMeetings.filter(m => m.meetingType === "virtual").length}
                </p>
                <p className="text-sm text-muted-foreground">Virtual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Meetings for {filterButtons.find(f => f.period === activeFilter)?.label}
          </h2>
          <Button variant="professional">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {filteredMeetings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No meetings scheduled</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any meetings scheduled for this period.
            </p>
            <Button variant="professional">Schedule Your First Meeting</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredMeetings.map((meeting, index) => {
              const MeetingIcon = getMeetingIcon(meeting.meetingType);
              
              return (
                <Card 
                  key={meeting.id}
                  className="cursor-pointer hover:shadow-hover transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleMeetingClick(meeting.clientId)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Time & Type */}
                      <div className="flex-shrink-0 text-center">
                        <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-2">
                          <MeetingIcon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <p className="text-sm font-medium">{meeting.time}</p>
                        <p className="text-xs text-muted-foreground">{meeting.duration}</p>
                      </div>
                      
                      {/* Meeting Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{meeting.type}</h3>
                            <p className="text-muted-foreground">with {meeting.clientName}</p>
                          </div>
                          <Badge variant={getStatusColor(meeting.status) as any}>
                            {meeting.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {meeting.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {meeting.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(meeting.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            variant="professional"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchMeeting(meeting.id, meeting.meetingType);
                            }}
                          >
                            {meeting.meetingType === "virtual" && <Video className="h-4 w-4 mr-2" />}
                            {meeting.meetingType === "phone" && <Phone className="h-4 w-4 mr-2" />}
                            {meeting.meetingType === "in-person" && <User className="h-4 w-4 mr-2" />}
                            Launch Meeting
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMeetingClick(meeting.clientId);
                            }}
                          >
                            View Client
                          </Button>
                          <Button variant="ghost" size="sm">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}