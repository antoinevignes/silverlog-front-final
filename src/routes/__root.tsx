import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { Toaster } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthState } from "@/auth";

interface MyRouterContext {
  auth: AuthState;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  ),
});
