"use client";

import Link from "next/link";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { signin } from "@/actions/signin";
import { useTransition } from "react";
import { SigninSchema } from "@/schemas";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GoogleLogo } from "@/components/auth/google-logo";
import { verifyEmail } from "@/actions/verify-email";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  let hasVerified = false;

  useEffect(() => {
    const token = searchParams?.get("token");
    const email = searchParams?.get("email");

    const verify = async () => {
      // Early return if no token or email, or if already verifying/verified
      if (!token || !email || hasVerified) return;

      setSuccess("Verifying your account...");

      const result = await verifyEmail(token, email);

      if (result.error) {
        if (result.error === "User already verified") {
          if (!hasVerified) {
            setSuccess("Your account is already verified. Please sign in.");
            const newSearchParams = new URLSearchParams(
              searchParams?.toString()
            );
            newSearchParams.delete("token");
            newSearchParams.delete("email");
            router.replace(`?${newSearchParams.toString()}`, { scroll: false });
          }
          return;
        }
        if (result.error === "Token expired") {
          setSuccess("");
          setError(
            "The verification link has expired. Please request a new one."
          );
        } else {
          setSuccess("");
          setError(result.error);
        }
        return;
      }

      if (result.success) {
        hasVerified = true;
        setSuccess(result.success);
        const newSearchParams = new URLSearchParams(searchParams?.toString());
        newSearchParams.delete("token");
        newSearchParams.delete("email");
        router.replace(`?${newSearchParams.toString()}`, { scroll: false });
        return;
      }
    };

    if (token && email) {
      verify();
    }

    // Check for OAuth error
    if (searchParams?.get("error") === "OAuthAccountNotLinked") {
      setUrlError("Email already in use with different provider!");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("error");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, hasVerified]);

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { update } = useSession();

  function onSubmit(values: z.infer<typeof SigninSchema>) {
    setError("");
    setSuccess("");
    setUrlError("");
    startTransition(() => {
      //start the transition to indicate that a state update is pending, it knows when revalidatepath(), revalidateTag(), or other actions are called and completed
      signin(values).then(async (data) => {
        setError(data?.error || "");
        setSuccess(data?.success || "");
        if (!data?.error) {
          await update();
          router.push(DEFAULT_LOGIN_REDIRECT);
        }
      });
    });
  }

  const Social = (provider: "google") => {
    signIn(provider, {
      //as we have redirect url with the signIn that we use for server actions, we can use the same here with the client action as callbackUrl
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <>
      <Card className="max-w-md mx-auto mt-30 bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-xl font-bold">Welcome!</CardTitle>
          {/* <CardDescription className="text-xs">Sign in to your account</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {" "}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={isPending}
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Link
                  href="/reset-password"
                  className="text-sm font-medium text-gray-900 dark:text-gray-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <FormError message={error || urlError} />
              <FormSuccess message={success} />
              <Button
                disabled={isPending}
                type="submit"
                className="w-full mt-4 font-bold"
              >
                SIGN IN
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                type="button"
                className="w-full gap-2"
                onClick={() => {
                  Social("google");
                }}
              >
                <GoogleLogo />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Continue with Google
                </span>
              </Button>

              <p className="text-sm text-center mt-2">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
