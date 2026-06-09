import * as React from "react"
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  Receipt,
  CreditCard,
  TrendingDown,
  Users,
  Wallet,
  Settings,
  Shield,
  Database,
  ChevronDown,
  Building2,
  Table2, 
  CalendarDays,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const navigationItems = [
  {
    id: "dashboard",
    title: "Tableau de bord",
    icon: LayoutDashboard
  },
]

const modulesConfig = [
  {
    id: "projects_group",
    title: "Projets",
    icon: FolderKanban,
    items: [
      { id: "projects", title: "Table", icon: Table2, path: "/projects" },
      { id: "map", title: "Map", icon: MapPin, path: "/projects/map" },
      { id: "calendar", title: "Cal", icon: CalendarDays, path: "/projects/calendar" },
    ],
  },
  {
    id: "finance_group",
    title: "Finance",
    icon: Receipt,
    items: [
      { id: "billing", title: "Facturation", icon: Receipt, path: "/finance/billing" },
      { id: "payments", title: "Paiements", icon: CreditCard, path: "/finance/payments" },
      { id: "expenses", title: "Dépenses", icon: TrendingDown, path: "/finance/expenses" },
    ],
  },
  {
    id: "HR_group",
    title: "Collaborateurs",
    icon: Users,
    items: [
      { id: "employes", title: "Employés", icon: Users, path: "/hr/employees" },
      { id: "paie", title: "Paie", icon: Wallet, path: "/hr/payroll" },
    ],
  },
  {
    id: "admin",
    title: "Administration",
    icon: Settings,
    items: [
      { id: "users", title: "Utilisateurs", icon: Users, path: "/admin/users" },
      { id: "roles", title: "Rôles & Permissions", icon: Shield, path: "/admin/roles" },
      { id: "config", title: "Configuration", icon: Database, path: "/admin/config" },
    ],
  },
]

export default function AppSidebar() {
  
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-accent-green text-white shadow-sm">
                <Building2 className="size-4" />
              </div>
                 <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sidebar-foreground">PiloTop</span>
                <span className="text-[10px] uppercase font-semibold text-sidebar-foreground/50 tracking-widest">
                  Topographie
                </span>
              </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/${item.id}`}
                    tooltip={item.title}

                  >
                    <Link to={`/${item.id}`}>
                    <item.icon className="size-3" />
                    <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Modules */}
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modulesConfig.map((module) => (
                <div key={module.id}>
                  {module.id === "projects_group" ? (
                    <div className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith("/projects")}>
                          <Link to="/projects">
                            <module.icon className="size-4" />
                            <span>{module.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuSub className="block">
                        {module.items.map((item) => (
                          <SidebarMenuSubItem key={item.id}>
                            <SidebarMenuSubButton asChild isActive={pathname === (item.path || `/${item.id}`)}>
                              <Link to={item.path || `/${item.id}`}>
                                <item.icon className="size-3" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </div>
                  ) : (
                    <Collapsible key={module.id} defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={module.title}>
                            <module.icon className="size-4" />
                            <span>{module.title}</span>
                            <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {module.items.map((item: any) => (
                              <SidebarMenuSubItem key={item.id}>
                                <SidebarMenuSubButton asChild isActive={pathname === (item.path || `/${item.id}`)}>
                                  <Link to={item.path || `/${item.id}`}>
                                    <item.icon className="size-3" />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER - Removed user info and logout as requested */}
    </Sidebar>
  )
}
