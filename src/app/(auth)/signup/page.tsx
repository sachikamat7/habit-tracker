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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/schemas";
import { signup } from "@/actions/signup";
import { useTransition, useState } from "react";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GoogleLogo } from "@/components/auth/google-logo";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | undefined>("");

  useEffect(() => {
    // Check for OAuth error on initial load
    if (searchParams?.get("error") === "OAuthAccountNotLinked") {
      setUrlError("Email already in use with different provider!");

      // Remove the error parameter from URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("error");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignupSchema>) {
    setError("");
    setSuccess("");
    startTransition(() => {
      //start the transition to indicate that a state update is pending, it knows when revalidatepath(), revalidateTag(), or other actions are called and completed
      signup(values).then((data) => {
        setError(data.error || "");
        setSuccess(data.success || "");
      });
    });
  }

  const Social = (provider: "google") => {
    form.clearErrors();
    signIn(provider, {
      //as we have redirect url with the signIn that we use for server actions, we can use the same here with the client action as callbackUrl
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <>
      <Card className="max-w-md mx-auto mt-30 bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-xl font-bold">Sign Up</CardTitle>
          <CardDescription className="text-xs italic">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {" "}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2  gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="password"
                            placeholder="Confirm Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormError message={error || urlError} />
              <FormSuccess message={success} />
              <Button type="submit" className="w-full mt-4 font-bold">
                SIGN UP
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
                className="w-full gap-3 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                onClick={() => Social("google")}
              >
                <GoogleLogo />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Continue with Google
                </span>
              </Button>

              <p className="text-sm text-center mt-2">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
