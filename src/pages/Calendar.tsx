import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User, Video, Phone, MessageSquare, ChevronDown } from "lucide-react";

type FilterPeriod = "today" | "tomorrow" | "week" | "month";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const thisWeekDate = new Date(today);
thisWeekDate.setDate(today.getDate() + 3);
const thisMonthDate = new Date(today);
thisMonthDate.setDate(today.getDate() + 10);

const mockMeetings = [
  {
    id: "m1",
    clientId: "1",
    clientName: "Sarah Johnson",
    date: today.toISOString().split('T')[0],
    time: "09:00 AM",
    type: "Site Visit",
    location: "123 Pine St, Seattle",
    status: "confirmed",
    description: "On-site property tour for new listing.",
    duration: "1 hour",
    meetingType: "in-person"
  },
  {
    id: "m2",
    clientId: "2",
    clientName: "Michael Chen",
    date: today.toISOString().split('T')[0],
    time: "11:30 AM",
    type: "Virtual Consultation",
    location: "Zoom",
    status: "pending",
    description: "Discuss investment opportunities and financing.",
    duration: "45 minutes",
    meetingType: "virtual"
  },
  {
    id: "m3",
    clientId: "3",
    clientName: "Emily Rodriguez",
    date: tomorrow.toISOString().split('T')[0],
    time: "02:00 PM",
    type: "Contract Review",
    location: "Office",
    status: "confirmed",
    description: "Review and sign purchase agreement.",
    duration: "30 minutes",
    meetingType: "in-person"
  },
  {
    id: "m4",
    clientId: "4",
    clientName: "David Kim",
    date: thisWeekDate.toISOString().split('T')[0],
    time: "04:00 PM",
    type: "Phone Follow-up",
    location: "Phone Call",
    status: "cancelled",
    description: "Check in on property search progress.",
    duration: "20 minutes",
    meetingType: "phone"
  },
  {
    id: "m5",
    clientId: "1",
    clientName: "Sarah Johnson",
    date: thisMonthDate.toISOString().split('T')[0],
    time: "10:15 AM",
    type: "Inspection",
    location: "789 Second St, Seattle",
    status: "pending",
    description: "Meet inspector at property for evaluation.",
    duration: "1.5 hours",
    meetingType: "in-person"
  },
  {
    id: "m6",
    clientId: "5",
    clientName: "Priya Patel",
    date: thisWeekDate.toISOString().split('T')[0],
    time: "03:30 PM",
    type: "Virtual Tour",
    location: "Google Meet",
    status: "confirmed",
    description: "Remote walkthrough of new apartment.",
    duration: "1 hour",
    meetingType: "virtual"
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
  const [meetingTypeFilter, setMeetingTypeFilter] = useState("all");
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

  const filteredMeetings = filterMeetings(activeFilter).filter(meeting => {
    if (meetingTypeFilter === "all") return true;
    if (meetingTypeFilter === "propertyvisits") return meeting.type.toLowerCase().includes("visit");
    if (meetingTypeFilter === "meetings") return meeting.type.toLowerCase().includes("meeting") || meeting.type.toLowerCase().includes("consultation") || meeting.type.toLowerCase().includes("review") || meeting.type.toLowerCase().includes("tour") || meeting.type.toLowerCase().includes("follow-up") || meeting.type.toLowerCase().includes("inspection");
    return true;
  });

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
          <div className="flex gap-2 items-center">
            {/* New filter dropdown */}
            <div className="relative inline-block">
              <select
                className="appearance-none border rounded px-3 py-1.5 text-sm pr-8 focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-background hover:bg-accent/10 cursor-pointer"
                value={meetingTypeFilter}
                onChange={e => setMeetingTypeFilter(e.target.value)}
              >
                <option value="all">ALL</option>
                <option value="propertyvisits">Property Visits</option>
                <option value="meetings">Meetings</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="professional">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
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
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-muted font-semibold text-muted-foreground text-sm">
                  <div>Time</div>
                  <div>Type</div>
                  <div>Client</div>
                  <div>Location</div>
                  <div>Date</div>
                  <div>Status</div>
                </div>
                {filteredMeetings.map((meeting, index) => {
                  const MeetingIcon = getMeetingIcon(meeting.meetingType);
                  return (
                    <div
                      key={meeting.id}
                      className="grid grid-cols-6 gap-4 items-center px-6 py-4 hover:bg-accent/30 cursor-pointer transition-all"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleMeetingClick(meeting.clientId)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{meeting.time}</span>
                        <span className="text-xs text-muted-foreground">{meeting.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MeetingIcon className="h-4 w-4" />
                        <span>{meeting.type}</span>
                      </div>
                      <div>{meeting.clientName}</div>
                      <div className="flex items-center gap-1">
                        {/* <MapPin className="h-4 w-4" /> */}
                        {/* Only show location text for non-virtual meetings */}
                        {meeting.meetingType !== "virtual" && <span>{meeting.location}</span>}
                        {/* Add Zoom button for virtual meetings */}
                        {meeting.meetingType === "virtual" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="ml-2"
                            onClick={e => {
                              e.stopPropagation();
                              window.open("https://zoom.us/j/1234567890", "_blank");
                            }}
                          >
                            Join Zoom
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <Badge variant={getStatusColor(meeting.status) as any}>{meeting.status}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}