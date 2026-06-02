"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const Dialog = ({
  children,
  open = false,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  // Use a state to handle the "mounted" state for exit animations if needed, 
  // but for simplicity with Tailwind we'll use conditional rendering with a delay or just visibility.
  // Actually, for "smooth" out, we need to keep it in DOM.
  
  const [mounted, setMounted] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted && !open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => onOpenChange?.(false)}
        />
        <div className={cn(
          "z-50 w-full max-w-lg transition-all duration-300 ease-out",
          open ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        )}>
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("Dialog components must be used within a Dialog");
  return context;
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = useDialog();
  return (
    <div
      ref={ref}
      className={cn(
        "relative grid w-full gap-4 border border-white/10 bg-zinc-950 p-6 shadow-lg sm:rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      >
        <X className="h-4 w-4 text-zinc-400" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-zinc-50",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-zinc-500", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
