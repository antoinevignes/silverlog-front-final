import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { Toaster } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthState } from "@/auth";
import MobileNav from "@/components/layout/mobile-nav/mobile-nav";
import DesktopNav from "@/components/layout/desktop-nav/desktop-nav";
import Footer from "@/components/layout/footer/footer";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";

interface MyRouterContext {
  auth: AuthState;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ErrorBoundary>
      <div className="app-root-container">
        <DesktopNav />
        <div className="main-content">
          <Outlet />
        </div>
        <Footer />
        <MobileNav />
        <Toaster richColors />
      </div>
    </ErrorBoundary>
  ),
});
