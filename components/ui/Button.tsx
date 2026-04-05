import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all vaultrix-border",
          "disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,17,16,1)]",
          {
            "bg-primary text-white": variant === "primary",
            "bg-secondary text-dark": variant === "secondary",
            "bg-transparent text-dark border-dark hover:bg-muted/10": variant === "outline",
            "bg-transparent text-dark border-transparent hover:bg-muted/10": variant === "ghost",
            "h-12 px-6 text-base": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-16 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
