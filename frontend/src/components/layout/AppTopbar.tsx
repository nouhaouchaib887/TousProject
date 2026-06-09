import React, { useEffect, useState } from "react"
import { Bell, Search, ChevronDown, LogOut, User, Settings, Moon, Sun } from "lucide-react"

// Import de votre logique d'authentification
import { useAuth } from "@/features/Auth/hooks/useAuth" 


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { logout } from "@/features/Auth/api/authService"

export default function Topbar() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // 1. Récupération de l'utilisateur réel via le hook
  const { user, isLoading } = useAuth()

  // 2. Gestion des valeurs par défaut si l'utilisateur n'est pas encore chargé
  const displayName = user ? `${user.firstname} ${user.lastname}` : "Chargement..."
  const displayEmail = user?.email || ""
  
  // 3. Calcul des initiales pour l'AvatarFallback
  const initials = user 
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase() 
    : "..."

  // 4. Fonction de déconnexion
  const handleLogout = async () => {
    console.log("Déconnexion cliquée")  
    await logout()
   
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center gap-4 border-b border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-foreground)] px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6 opacity-20" />

      {/* Recherche */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--header-foreground)] opacity-50" />
        <Input
          type="search"
          placeholder="Rechercher un dossier..."
          className="pl-9 bg-black/5 dark:bg-white/5 border-transparent focus:bg-black/10 dark:focus:bg-white/10 text-[var(--header-foreground)]"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Toggle Dark Mode */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--header-foreground)]"
        >
          {isDark ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5" />}
        </Button>

        {/* Notifications (Statique pour l'instant) */}
        <Button variant="ghost" size="icon" className="relative hover:bg-black/5 dark:hover:bg-white/5 text-[var(--header-foreground)]">
          <Bell className="size-5" />
          <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px] bg-accent-green text-white">
            3
          </Badge>
        </Button>

        <Separator orientation="vertical" className="h-6 opacity-20" />

        {/* Menu Utilisateur Dynamique */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-black/5 dark:hover:bg-white/5 text-[var(--header-foreground)]">
              {/* <Avatar className="size-8 ring-1 ring-[var(--header-border)]">
                {/* On utilise l'avatar de l'user ou un placeholder */}
               {/*  <AvatarImage src={user?.avatar} alt={displayName} />
                <AvatarFallback className="bg-brand-600 text-white text-[10px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar> */}
              
              <div className="flex flex-col items-start text-left hidden md:flex">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">{displayEmail}</span>
              </div>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 bg-background border-border">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{displayName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {displayEmail}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 hover:bg-primary/10">
              <User className="mr-2 size-4" />
              Mon Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 hover:bg-primary/10">
              <Settings className="mr-2 size-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Action de déconnexion réelle */}
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
