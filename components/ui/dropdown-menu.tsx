"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={containerRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)!;
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(!open);
      }
    });
  }

  return (
    <button onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ 
  children, 
  className, 
  align = "right",
  side = "bottom",
  sideOffset = 8
}: { 
  children: React.ReactNode, 
  className?: string,
  align?: "left" | "right" | "end" | "start",
  side?: "top" | "bottom" | "left" | "right",
  sideOffset?: number
}) {
  const { open } = React.useContext(DropdownMenuContext)!;

  if (!open) return null;

  const sideClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2 top-0",
    right: "left-full ml-2 top-0",
  };

  const alignClasses = {
    left: "left-0",
    start: "left-0",
    right: "right-0",
    end: "right-0",
  };

  return (
    <div 
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-1 shadow-xl animate-in fade-in zoom-in-95 duration-200",
        sideClasses[side],
        (side === "top" || side === "bottom") && alignClasses[align],
        className
      )}
      style={{
        [side === "top" ? "marginBottom" : side === "bottom" ? "marginTop" : side === "left" ? "marginRight" : "marginLeft"]: `${sideOffset}px`
      }}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ 
  children, 
  className, 
  onClick,
  variant = "default"
}: { 
  children: React.ReactNode, 
  className?: string,
  onClick?: () => void,
  variant?: "default" | "destructive"
}) {
  const { setOpen } = React.useContext(DropdownMenuContext)!;

  return (
    <button
      className={cn(
        "group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors",
        variant === "destructive" 
          ? "text-rose-400 hover:bg-rose-500/10" 
          : "text-zinc-300 hover:bg-white/5 hover:text-zinc-100",
        className
      )}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-white/5", className)} />
  );
}
