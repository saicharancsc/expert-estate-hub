import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, MapPin, Phone, Mail, Calendar, Star, 
  MessageSquare, Home, Bath, Car, Square, 
  Eye, Heart, Share, DollarSign 
} from "lucide-react";

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
    rating: 4.8,
    notes: "Looking for modern amenities, prefers high-rise buildings with city views.",
    conversations: [
      { date: "2024-01-15", type: "call", summary: "Discussed budget increase and timeline" },
      { date: "2024-01-12", type: "email", summary: "Sent 3 new property matches" },
      { date: "2024-01-10", type: "meeting", summary: "Toured downtown condos" },
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
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-warning text-warning" />
          <span className="font-semibold">{client.rating}</span>
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
              <Button variant="professional" className="w-full">
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
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">Matched Properties</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Property Matches</h3>
                <Badge variant="outline">{client.matchedProperties.length} total matches</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {client.matchedProperties.map((property, index) => (
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
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="conversations" className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Conversations</h3>
              
              <div className="space-y-3">
                {client.conversations.map((conversation, index) => (
                  <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
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
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}