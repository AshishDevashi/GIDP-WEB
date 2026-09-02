"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";

type AuthTab = "login" | "register";

export function AuthTabs() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const [tab, setTab] = useState<AuthTab>("login");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">
          {tab === "login" ? "Sign in to GIDP" : "Create your GIDP account"}
        </CardTitle>
        <CardDescription>
          {tab === "login"
            ? "Sign in to continue to the internal developer portal."
            : "Get onboarded to the internal developer portal."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={tab} onValueChange={(value) => setTab(value as AuthTab)}>
          <TabsList className="mb-5">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm redirectTo={redirectTo} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm redirectTo={redirectTo} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
