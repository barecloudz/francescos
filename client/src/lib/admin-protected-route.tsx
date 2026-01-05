import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useAuth } from "@/hooks/use-supabase-auth";

export function AdminProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading, profileLoading } = useAuth();

  // Check if user is authenticated and has admin privileges
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin' || user.isAdmin === true);

  // Show loading while either initial auth or profile is loading
  // This prevents premature redirect before we know the actual role from database
  if (isLoading || (user && profileLoading)) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Not authenticated or not an admin - redirect to login
  if (!user || !isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}