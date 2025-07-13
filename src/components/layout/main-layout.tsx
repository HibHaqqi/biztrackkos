import { SidebarProvider, Sidebar, SidebarInset, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";
import { headers } from 'next/headers';
import { cookies } from "next/headers";

export async function MainLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') || '';
  const session = (await cookies()).get('session');
  
  // Don't show the sidebar on the login page.
  if (pathname === '/login' || !session?.value) {
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
