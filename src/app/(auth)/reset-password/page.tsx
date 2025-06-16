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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useTransition } from "react";
import { sendResetPasswordEmail } from "@/actions/reset-password-email";
import { ResetPasswordEmailSchema } from "@/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const ERROR_MESSAGE =
    "Please verify your email before resetting password!" as const;
     const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordEmailSchema>>({
    resolver: zodResolver(ResetPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordEmailSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      sendResetPasswordEmail(values, false).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

   const verify = (values: z.infer<typeof ResetPasswordEmailSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      sendResetPasswordEmail(values, true).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };



  return (
    <Card className="max-w-md mx-auto mt-30 bg-card text-card-foreground">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
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
            <FormError message={error} />
            <FormSuccess message={success} />

            {error === ERROR_MESSAGE ? (
              <Button
                type="button"
                className="w-full mt-4 font-bold"
                onClick= {() => {
                  verify(form.getValues());
                }}
              >
                Send verification email
              </Button>
            ) : (
              <Button
                disabled={isPending}
                type="submit"
                className="w-full mt-4 font-bold"
              >
                Send Reset Link
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
