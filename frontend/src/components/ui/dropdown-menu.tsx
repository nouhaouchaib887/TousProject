import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { open, setOpen })
        }
        return child
      })}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, asChild, open, setOpen }: any) => {
  const handleClick = () => setOpen(!open)
  
  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
    })
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

const DropdownMenuContent = ({ children, open, align = "end", className }: any) => {
  if (!open) return null

  return (
    <div className={cn(
      "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
      align === "end" ? "right-0" : "left-0",
      className
    )}>
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, className, onClick }: any) => (
  <div
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
)

const DropdownMenuLabel = ({ children, className }: any) => (
  <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
    {children}
  </div>
)

const DropdownMenuSeparator = ({ className }: any) => (
  <div className={cn("-mx-1 my-1 h-px bg-slate-100", className)} />
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
