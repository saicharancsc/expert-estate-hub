import { NavLink, useNavigate } from "react-router-dom";
import { Users, Calendar, Info, Building2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


const navigationItems = [
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    description: "Manage client relationships"
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Schedule and track meetings"
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
    description: "Platform information"
  }
];

export function Sidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear any stored auth data here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/signin");
  };
  return (
    <div className="flex h-screen w-72 flex-col bg-gradient-subtle border-r border-border shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-border">
        <div className="flex h-20 w-20 items-center justify-center bg-white overflow-hidden">
          <img src="/relaiLogo.png" alt="Relai Logo" className="h-20 w-20 object-contain" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Expert Dashboard</h1>
          {/* <p className="text-sm text-muted-foreground">Expert Dashboard</p> */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-hover"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                  )} 
                />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className={cn(
                    "text-xs opacity-75",
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-accent-foreground/80"
                  )}>
                    {item.description}
                  </span>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-3">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
        
        {/* <div className="rounded-lg bg-accent/10 p-3"> */}
          {/* <p className="text-xs font-medium text-accent">Professional Edition</p>
          <p className="text-xs text-muted-foreground mt-1">
            Advanced real estate management tools
          </p> */}
        {/* </div> */}
      </div>
    </div>
  );
}