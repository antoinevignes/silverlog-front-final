import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { Toaster } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthState } from "@/auth";
import MobileNav from "@/components/layout/mobile-nav/mobile-nav";

interface MyRouterContext {
  auth: AuthState;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="mobile-nav-padded-layout">
      <Outlet />
      <MobileNav />
      <Toaster richColors />
    </div>
  ),
});
