import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, MapPin, Phone, Mail, Calendar, Star, 
  MessageSquare, Home, Bath, Car, Square, 
  Eye, Heart, Share, DollarSign, Bookmark, 
  CalendarDays, Clock, X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, this would come from API
const mockClientData = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    location: "Downtown Seattle",
    status: "Active",
    priority: "High",
    preferences: "Modern condos, 2-3 bedrooms, downtown location",
    budget: "$800,000 - $1,200,000",
    possessionTimeline: "3-6 months",
    propertyConfiguration: "2-3 bedrooms, 2+ bathrooms, parking included",
    preferredLocations: "Downtown Seattle, Belltown, Capitol Hill",
    lastContact: "2024-01-15",
    notes: "Looking for modern amenities, prefers high-rise buildings with city views.",
    conversations: [
      { date: "2024-01-15", type: "call(Bot)", summary: "Discussed budget increase and timeline" },
      { date: "2024-01-12", type: "WhatsApp Bot", summary: "Sent 3 new property matches" },
      { date: "2024-01-10", type: "WebBot", summary: "Toured downtown condos" },
      { date: "2024-01-08", type: "call", summary: "Initial consultation and needs assessment" }
    ],
    matchedProperties: [
      {
        id: "p1",
        title: "Modern Downtown Condo",
        address: "123 Pine St, Seattle",
        price: "$950,000",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        parking: 1,
        image: "/api/placeholder/300/200",
        status: "Active",
        match: 95
      },
      {
        id: "p2", 
        title: "Luxury High-Rise Unit",
        address: "456 First Ave, Seattle",
        price: "$1,150,000",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1500,
        parking: 2,
        image: "/api/placeholder/300/200",
        status: "Active",
        match: 92
      },
      {
        id: "p3",
        title: "Urban Loft Space",
        address: "789 Second St, Seattle",
        price: "$875,000",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        parking: 1,
        image: "/api/placeholder/300/200",
        status: "Pending",
        match: 88
      }
    ]
  }
};

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [shortlistedProperties, setShortlistedProperties] = useState<any[]>([]);
  const [availableProperties, setAvailableProperties] = useState<any[]>(
    mockClientData[id as keyof typeof mockClientData]?.matchedProperties || []
  );
  const [siteVisitDialog, setSiteVisitDialog] = useState(false);
  const [siteVisitProperty, setSiteVisitProperty] = useState<any>(null);
  const [siteVisitDate, setSiteVisitDate] = useState("");
  const [siteVisitTime, setSiteVisitTime] = useState("");
  const [siteVisitNotes, setSiteVisitNotes] = useState("");
  const [siteVisits, setSiteVisits] = useState<any[]>([]); // <-- Add this after other useState hooks
  const [openConversation, setOpenConversation] = useState<number | null>(null);
  const [meetingDialog, setMeetingDialog] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);
  const { toast } = useToast();
  
  const client = mockClientData[id as keyof typeof mockClientData];

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Client not found</h2>
          <Button onClick={() => navigate("/clients")}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  const getMatchColor = (match: number) => {
    if (match >= 90) return "default";
    if (match >= 80) return "secondary";
    return "outline";
  };

  const handleShortList = (property: any) => {
    setShortlistedProperties(prev => [...prev, property]);
    setAvailableProperties(prev => prev.filter(p => p.id !== property.id));
    toast({
      title: "Property Shortlisted",
      description: `${property.title} has been added to your shortlist.`,
    });
  };

  const handleSiteVisit = (property: any) => {
    setSiteVisitProperty(property);
    setSiteVisitDialog(true);
  };

  const handleRemoveFromShortlist = (property: any) => {
    setShortlistedProperties(prev => prev.filter(p => p.id !== property.id));
    setAvailableProperties(prev => [...prev, property]);
    toast({
      title: "Property Removed",
      description: `${property.title} has been removed from your shortlist.`,
    });
  };

  const scheduleSiteVisit = () => {
    if (!siteVisitDate || !siteVisitTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the site visit.",
        variant: "destructive",
      });
      return;
    }

    // Add new site visit to state
    setSiteVisits(prev => [
      ...prev,
      {
        property: siteVisitProperty,
        date: siteVisitDate,
        time: siteVisitTime,
        notes: siteVisitNotes,
      }
    ]);

    toast({
      title: "Site Visit Scheduled",
      description: `Site visit for ${siteVisitProperty?.title} scheduled for ${siteVisitDate} at ${siteVisitTime}.`,
    });

    // Reset form
    setSiteVisitDialog(false);
    setSiteVisitProperty(null);
    setSiteVisitDate("");
    setSiteVisitTime("");
    setSiteVisitNotes("");
  };

  const handleScheduleMeeting = () => {
    if (!meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the meeting.",
        variant: "destructive",
      });
      return;
    }
    setMeetings(prev => [
      ...prev,
      {
        clientId: client.id,
        clientName: client.name,
        date: meetingDate,
        time: meetingTime,
        notes: meetingNotes,
      }
    ]);
    toast({
      title: "Meeting Scheduled",
      description: `Meeting for ${client.name} scheduled for ${meetingDate} at ${meetingTime}.`,
    });
    setMeetingDialog(false);
    setMeetingDate("");
    setMeetingTime("");
    setMeetingNotes("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{client.location}</span>
            <Badge variant="default">{client.status}</Badge>
            <Badge variant="destructive">{client.priority} Priority</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Client Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last contact: {new Date(client.lastContact).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Site Visits Card */}
          <Card>
            <CardHeader>
              <CardTitle>Site Visits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {siteVisits.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No site visits scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {siteVisits.map((visit, idx) => (
                    <Card key={idx} className="bg-muted/50">
                      <CardContent className="p-3 flex flex-col gap-1">
                        <div className="font-semibold">{visit.property?.title}</div>
                        <div className="text-xs text-muted-foreground">{visit.property?.address}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {visit.date} at {visit.time}
                        </div>
                        {visit.notes && (
                          <div className="text-xs text-muted-foreground italic">{visit.notes}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Property Type</p>
                <p className="text-sm text-muted-foreground">{client.preferences}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Budget Range</p>
                <p className="text-sm text-muted-foreground font-semibold text-success">{client.budget}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Possession Timeline</p>
                <p className="text-sm text-muted-foreground">{client.possessionTimeline}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Property Configuration</p>
                <p className="text-sm text-muted-foreground">{client.propertyConfiguration}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Preferred Locations</p>
                <p className="text-sm text-muted-foreground">{client.preferredLocations}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{client.notes}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="professional" className="w-full" onClick={() => setMeetingDialog(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="accent" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Properties
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Client
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="properties" className="space-y-6 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="properties">Matched Properties</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Property Matches</h3>
                <Badge variant="outline">{availableProperties.length} available matches</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {availableProperties.map((property, index) => (
                  <Card 
                    key={property.id}
                    className="cursor-pointer hover:shadow-hover transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="relative">
                      <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
                        <Home className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <Badge 
                        variant={getMatchColor(property.match) as any}
                        className="absolute top-2 right-2"
                      >
                        {property.match}% match
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{property.title}</h4>
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                        <p className="text-lg font-bold text-success mt-1">{property.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          {property.bedrooms} bed
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms} bath
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          {property.sqft} sqft
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              tabIndex={-1}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{property.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                                <Home className="h-16 w-16 text-muted-foreground" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Address</p>
                                  <p className="text-sm text-muted-foreground">{property.address}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Price</p>
                                  <p className="text-sm font-semibold text-success">{property.price}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Bedrooms</p>
                                  <p className="text-sm text-muted-foreground">{property.bedrooms}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Bathrooms</p>
                                  <p className="text-sm text-muted-foreground">{property.bathrooms}</p>
                                </div>
                                {/* Add more property details here if needed */}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShortList(property)}
                        >
                          <Bookmark className="h-4 w-4 mr-1" />
                          Short List
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shortlisted Properties</h3>
                <Badge variant="outline">{shortlistedProperties.length} shortlisted</Badge>
              </div>
              
              {shortlistedProperties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No properties shortlisted yet</p>
                  <p className="text-sm">Click "Short List" on any property to add it here</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {shortlistedProperties.map((property, index) => (
                    <Card 
                      key={property.id}
                      className="cursor-pointer hover:shadow-hover transition-all duration-200 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
                          <Home className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <Badge 
                          variant={getMatchColor(property.match) as any}
                          className="absolute top-2 right-2"
                        >
                          {property.match}% match
                        </Badge>
                        <Badge 
                          variant="default"
                          className="absolute top-2 left-2"
                        >
                          <Bookmark className="h-3 w-3 mr-1" />
                          Shortlisted
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{property.title}</h4>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                          <p className="text-lg font-bold text-success mt-1">{property.price}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            {property.bedrooms} bed
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {property.bathrooms} bath
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {property.sqft} sqft
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setSelectedProperty(property)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{property.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                                  <Home className="h-16 w-16 text-muted-foreground" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Address</p>
                                    <p className="text-sm text-muted-foreground">{property.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Price</p>
                                    <p className="text-sm font-semibold text-success">{property.price}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Bedrooms</p>
                                    <p className="text-sm text-muted-foreground">{property.bedrooms}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Bathrooms</p>
                                    <p className="text-sm text-muted-foreground">{property.bathrooms}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSiteVisit(property)}
                          >
                            <CalendarDays className="h-4 w-4 mr-1" />
                            Site Visit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveFromShortlist(property)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="conversations" className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Conversations</h3>
              
              <div className="space-y-3">
                {client.conversations.map((conversation, index) => (
                  <div key={index}>
                    <Card
                      className="animate-slide-up cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setOpenConversation(openConversation === index ? null : index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{conversation.type}</p>
                              <p className="text-sm text-muted-foreground">{conversation.summary}</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(conversation.date).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    {openConversation === index && (
                      <div className="bg-muted border border-border rounded-b-lg p-4 text-sm animate-fade-in">
                        <strong>Conversation Summary:</strong>
                        <div className="mt-2 text-muted-foreground">
                          {conversation.summary}
                        </div>
                        {/* You can add more detailed bot/client messages here if available */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Site Visit Scheduling Dialog */}
      <Dialog open={siteVisitDialog} onOpenChange={setSiteVisitDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Site Visit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{siteVisitProperty?.title}</h4>
              <p className="text-sm text-muted-foreground">{siteVisitProperty?.address}</p>
              <p className="text-sm font-semibold text-success">{siteVisitProperty?.price}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visit-date">Date</Label>
                <Input
                  id="visit-date"
                  type="date"
                  value={siteVisitDate}
                  onChange={(e) => setSiteVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit-time">Time</Label>
                <select
                  id="visit-time"
                  value={siteVisitTime}
                  onChange={(e) => setSiteVisitTime(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="">--:--</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="12:30 AM">12:30 AM</option>
                  <option value="1:00 AM">1:00 AM</option>
                  <option value="1:30 AM">1:30 AM</option>
                  <option value="2:00 AM">2:00 AM</option>
                  <option value="2:30 AM">2:30 AM</option>
                  <option value="3:00 AM">3:00 AM</option>
                  <option value="3:30 AM">3:30 AM</option>
                  <option value="4:00 AM">4:00 AM</option>
                  <option value="4:30 AM">4:30 AM</option>
                  <option value="5:00 AM">5:00 AM</option>
                  <option value="5:30 AM">5:30 AM</option>
                  <option value="6:00 AM">6:00 AM</option>
                  <option value="6:30 AM">6:30 AM</option>
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="7:30 AM">7:30 AM</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="8:30 AM">8:30 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="2:30 PM">2:30 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="3:30 PM">3:30 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="4:30 PM">4:30 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="5:30 PM">5:30 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="6:30 PM">6:30 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="7:30 PM">7:30 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="8:30 PM">8:30 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="9:30 PM">9:30 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="10:30 PM">10:30 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
                  <option value="11:30 PM">11:30 PM</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visit-notes">Notes (Optional)</Label>
              <Textarea
                id="visit-notes"
                placeholder="Add any special requirements or notes for the site visit..."
                value={siteVisitNotes}
                onChange={(e) => setSiteVisitNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSiteVisitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleSiteVisit}>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Scheduling Dialog */}
      <Dialog open={meetingDialog} onOpenChange={setMeetingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{client.name}</h4>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Time</Label>
                <select
                  id="meeting-time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="">--:--</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="12:30 AM">12:30 AM</option>
                  <option value="1:00 AM">1:00 AM</option>
                  <option value="1:30 AM">1:30 AM</option>
                  <option value="2:00 AM">2:00 AM</option>
                  <option value="2:30 AM">2:30 AM</option>
                  <option value="3:00 AM">3:00 AM</option>
                  <option value="3:30 AM">3:30 AM</option>
                  <option value="4:00 AM">4:00 AM</option>
                  <option value="4:30 AM">4:30 AM</option>
                  <option value="5:00 AM">5:00 AM</option>
                  <option value="5:30 AM">5:30 AM</option>
                  <option value="6:00 AM">6:00 AM</option>
                  <option value="6:30 AM">6:30 AM</option>
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="7:30 AM">7:30 AM</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="8:30 AM">8:30 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="2:30 PM">2:30 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="3:30 PM">3:30 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="4:30 PM">4:30 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="5:30 PM">5:30 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="6:30 PM">6:30 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="7:30 PM">7:30 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="8:30 PM">8:30 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="9:30 PM">9:30 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="10:30 PM">10:30 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
                  <option value="11:30 PM">11:30 PM</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-notes">Notes (Optional)</Label>
              <Textarea
                id="meeting-notes"
                placeholder="Add any special requirements or notes for the meeting..."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMeetingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleMeeting}>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}