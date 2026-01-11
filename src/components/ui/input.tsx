import * as React from "react";
import { cn } from "@/lib/utils";

// Input bileşeni - form alanları için
export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Temel stiller
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    // Placeholder stili
                    "placeholder:text-muted-foreground",
                    // Focus durumu
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    // Disabled durumu
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    // Dosya input özel stili
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
