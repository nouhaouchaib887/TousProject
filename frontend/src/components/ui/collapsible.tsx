import * as React from "react"
import { cn } from "@/lib/utils"

export const Collapsible = ({ children, className, defaultOpen = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  return (
    <div 
      className={cn("w-full", className)} 
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
        }
        return child
      })}
    </div>
  )
}

export const CollapsibleTrigger = ({ children, asChild, isOpen, setIsOpen, ...props }: any) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      "data-state": isOpen ? "open" : "closed"
    })
  }

  return (
    <button 
      type="button"
      onClick={handleClick} 
      data-state={isOpen ? "open" : "closed"} 
      className="w-full flex items-center"
      {...props}
    >
      {children}
    </button>
  )
}

export const CollapsibleContent = ({ children, isOpen, className, ...props }: any) => {
  if (!isOpen) return null
  
  return (
    <div className={cn("overflow-hidden transition-all", className)} {...props}>
      {children}
    </div>
  )
}
