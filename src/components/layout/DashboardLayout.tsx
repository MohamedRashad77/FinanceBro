"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  LayoutDashboard,
  CreditCard,
  PieChart,
  Menu,
  Globe
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFinanceStore, CurrencyCode } from "@/store/useFinanceStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SideNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Insights", href: "/insights", icon: PieChart },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`inline-flex items-center justify-start w-full rounded-md px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RoleSwitcher() {
  const { role, setRole } = useFinanceStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md bg-secondary px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        Role: {role}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setRole("Admin")}>
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("Viewer")}>
          Viewer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const currencies: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (â‚¬)" },
  { code: "GBP", label: "British Pound (Â£)" },
  { code: "INR", label: "Indian Rupee (â‚¹)" },
  { code: "JPY", label: "Japanese Yen (Â¥)" },
];

function CurrencySwitcher() {
  const { currency, setCurrency } = useFinanceStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Globe className="h-[1.2rem] w-[1.2rem] mr-2" />
        {currency}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={currency === c.code ? "bg-accent" : ""}
          >
            {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 p-4">
        <div className="flex items-center gap-2 mb-8 px-2 font-bold text-xl">
          <LayoutDashboard className="h-6 w-6" />
          <span>Finance UI</span>
        </div>
        <SideNavigation />
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex h-16 items-center border-b px-4 lg:px-6 justify-between md:justify-end gap-4">
          <div className="md:hidden flex items-center gap-2 font-bold">
            <Menu className="h-6 w-6" />
            <span>Finance UI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <CurrencySwitcher />
            <RoleSwitcher />
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}