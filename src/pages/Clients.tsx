import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Phone, Mail, Calendar, Star, List, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

// Mock client data
const mockClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    location: "Downtown Seattle",
    priority: "High",
    preferences: "Modern condos, 2-3 bedrooms",
    lastContact: "2024-01-15",
    matchedProperties: 5
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 234-5678",
    location: "Bellevue",
    priority: "Medium",
    preferences: "Family homes, good schools",
    lastContact: "2024-01-12",
    matchedProperties: 3
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 345-6789",
    location: "Capitol Hill",
    priority: "High",
    preferences: "Historic buildings, walkable",
    lastContact: "2024-01-14",
    matchedProperties: 7
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "(555) 456-7890",
    location: "Fremont",
    priority: "Low",
    preferences: "Fixer-uppers, investment",
    lastContact: "2024-01-08",
    matchedProperties: 2
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "destructive";
    case "Medium": return "warning";
    case "Low": return "secondary";
    default: return "secondary";
  }
};

// Helper to get progress stage for each client (mock logic)
const getClientProgress = (clientId: string) => {
  if (clientId === "1") return "Site Visit";
  if (clientId === "2") return "Short List";
  return "Meeting";
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientPriorities, setClientPriorities] = useState<Record<string, string>>(
    Object.fromEntries(mockClients.map(client => [client.id, client.priority]))
  );
  const [view, setView] = useState<'grid' | 'list'>("grid");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [siteVisitFilter, setSiteVisitFilter] = useState<string | null>(null);

  // Add state to track shortlisted counts for each client (simulate for demo)
  const [shortlistedCounts, setShortlistedCounts] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem("shortlistedCounts");
    return stored ? JSON.parse(stored) : { "1": 0, "2": 0, "3": 0, "4": 0 };
  });

  useEffect(() => {
    localStorage.setItem("shortlistedCounts", JSON.stringify(shortlistedCounts));
  }, [shortlistedCounts]);

  // Simulate moving a property to shortlist for demo (in real app, this would be triggered by an action)
  const handleShortListDemo = (clientId: string) => {
    setShortlistedCounts(prev => ({
      ...prev,
      [clientId]: (prev[clientId] || 0) + 1
    }));
  };

  // Update filteredClients to apply filters
  const filteredClients = mockClients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.preferences.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || clientPriorities[client.id] === priorityFilter;
    // For demo, assume client 1 has site visit, others do not
    const hasSiteVisit = client.id === "1";
    const matchesSiteVisit = !siteVisitFilter || (siteVisitFilter === "yes" ? hasSiteVisit : !hasSiteVisit);
    return matchesSearch && matchesPriority && matchesSiteVisit;
  });

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handlePriorityChange = (clientId: string, newPriority: string) => {
    setClientPriorities(prev => ({
      ...prev,
      [clientId]: newPriority
    }));
    toast({
      title: "Priority Updated",
      description: `Client priority has been changed to ${newPriority}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
        <p className="text-muted-foreground">
          Manage your client relationships and track their property preferences
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, location, or preferences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">Filter</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 rounded-lg border border-border shadow-xl p-4">
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Priority</div>
                <div className="flex gap-2">
                  {["High", "Medium", "Low"].map(p => (
                    <Button
                      key={p}
                      size="sm"
                      variant={priorityFilter === p ? "professional" : "outline"}
                      className={`rounded-full px-4 ${priorityFilter === p ? 'ring-2 ring-accent' : ''}`}
                      onClick={() => setPriorityFilter(priorityFilter === p ? null : p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Site Visit</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={siteVisitFilter === "yes" ? "professional" : "outline"}
                    className={`rounded-full px-4 ${siteVisitFilter === 'yes' ? 'ring-2 ring-accent' : ''}`}
                    onClick={() => setSiteVisitFilter(siteVisitFilter === "yes" ? null : "yes")}
                  >
                    Has Site Visit
                  </Button>
                  <Button
                    size="sm"
                    variant={siteVisitFilter === "no" ? "professional" : "outline"}
                    className={`rounded-full px-4 ${siteVisitFilter === 'no' ? 'ring-2 ring-accent' : ''}`}
                    onClick={() => setSiteVisitFilter(siteVisitFilter === "no" ? null : "no")}
                  >
                    No Site Visit
                  </Button>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-end">
                <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground" onClick={() => { setPriorityFilter(null); setSiteVisitFilter(null); setFilterPopoverOpen(false); }}>
                  <X className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="professional">
          Add Client
        </Button>
        <div className="flex gap-2 ml-auto">
          <Button
            variant={view === 'grid' ? 'professional' : 'outline'}
            size="icon"
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={view === 'list' ? 'professional' : 'outline'}
            size="icon"
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Client Grid/List */}
      {view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client, index) => (
            <Card 
              key={client.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-hover hover:scale-[1.02] animate-slide-up border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleClientClick(client.id)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {client.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {client.location}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="accent" size="sm" className="pointer-events-none cursor-default h-7 px-3 text-xs font-normal">
                    {getClientProgress(client.id)}
                  </Button>
                  <Badge variant={getPriorityColor(clientPriorities[client.id]) as any}>{clientPriorities[client.id]} Priority</Badge>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={clientPriorities[client.id]}
                      onValueChange={(value) => handlePriorityChange(client.id, value)}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="High">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Preferences</p>
                  <p className="text-sm text-muted-foreground">{client.preferences}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Last contact: {new Date(client.lastContact).toLocaleDateString()}
                  </div>
                  <Badge variant="outline">
                    {shortlistedCounts[client.id] || 0} shortlisted, {client.matchedProperties} matched
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredClients.map((client, index) => (
            <Card
              key={client.id}
              className="flex flex-row items-center gap-4 p-4 cursor-pointer hover:shadow-hover animate-slide-up border-border"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleClientClick(client.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Button variant="accent" size="sm" className="pointer-events-none cursor-default h-7 px-3 text-xs font-normal">
                      {getClientProgress(client.id)}
                    </Button>
                    <Badge variant={getPriorityColor(clientPriorities[client.id]) as any}>{clientPriorities[client.id]}</Badge>
                    <span className="font-semibold text-lg truncate">{client.name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {client.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Last contact: {new Date(client.lastContact).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Preferences:</span>
                    {client.preferences}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Matches:</span>
                    {client.matchedProperties}
                  </div>
                </div>
              </div>
              <div onClick={e => e.stopPropagation()} className="flex flex-col gap-2 min-w-[120px]">
                <Select
                  value={clientPriorities[client.id]}
                  onValueChange={(value) => handlePriorityChange(client.id, value)}
                >
                  <SelectTrigger className="w-28 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline">
                  {shortlistedCounts[client.id] || 0} shortlisted, {client.matchedProperties} matched
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No clients found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or add a new client.
          </p>
          <Button variant="professional">Add Your First Client</Button>
        </div>
      )}
    </div>
  );
}