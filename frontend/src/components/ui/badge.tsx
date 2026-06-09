import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 bg-brand-600 text-white",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
