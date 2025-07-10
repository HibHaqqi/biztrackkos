import { SidebarProvider, Sidebar, SidebarInset, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { cookies } from "next/headers";
import { LogoutButton } from "./logout-button";

export async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get('session');
  
  if (!session || !session.value) {
    return <>{children}</>;
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
        <SidebarFooter>
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
