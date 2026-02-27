import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { Toaster } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthState } from "@/auth";
import MobileNav from "@/components/layout/mobile-nav/mobile-nav";
import DesktopNav from "@/components/layout/desktop-nav/desktop-nav";

interface MyRouterContext {
  auth: AuthState;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="app-root-container mobile-nav-padded-layout">
      <DesktopNav />
      <Outlet />
      <MobileNav />
      <Toaster richColors />
    </div>
  ),
});
