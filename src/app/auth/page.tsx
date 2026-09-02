import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AuthTabs } from "@/features/auth/components/auth-tabs";
import { siteConfig } from "@/config/nav";

export const metadata = { title: "Sign in" };

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <span className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold">
          G
        </span>
        <div className="leading-tight">
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="text-muted-foreground text-sm">
            {siteConfig.description}
          </p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full max-w-md" />}>
        <AuthTabs />
      </Suspense>
    </div>
  );
}
