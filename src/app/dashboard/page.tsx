"use client";

import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Label } from "@/components/ui/label"
import { SigninSchema } from "@/schemas";
import { z } from "zod";
import Link from "next/link";
import { HabitForm } from "@/components/habit-form";
// export default function Dashboard() {

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
//         </div>
//     </>
//   );
// }


export default function Dashboard() {

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
    <HabitForm />
    </>
  );
};

