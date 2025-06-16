"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas";
import { useTransition } from "react";
import { useState } from "react";
import { resetPassword } from "@/actions/reset-password";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// ... other imports

export default function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { email: string };
}) {
  // Similar form setup but for new password
  // Use params.token and searchParams.email

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const SUCCESS_MESSAGE = "Password reset successfully!" as const;
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const token = params.token;
  const email = searchParams.email;

  function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setError("");
    setSuccess("");
    startTransition(() => {
      //start the transition to indicate that a state update is pending, it knows when revalidatepath(), revalidateTag(), or other actions are called and completed
      resetPassword(values, token, email).then((data) => {
        setError(data.error || "");
        setSuccess(data.success || "");
      });
    });
  }

  return (
    <Card className="max-w-md mx-auto mt-30 bg-card text-card-foreground">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormError message={error} />
            <FormSuccess message={success} />
            {success === SUCCESS_MESSAGE ? (
              <Button
                type="button"
                className="w-full mt-4 font-bold"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </Button>
            ) : (
              <Button
                disabled={isPending}
                type="submit"
                className="w-full mt-4 font-bold"
              >
                Reset Password{" "}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
