"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Receipt, Building } from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/transactions", label: "Transactions", icon: Receipt },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            BizTrack Lite
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="w-full justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
