"use client";

import { useState } from "react";
import { Input, Divider, Button } from "@nextui-org/react";
import GoogleButton from "./google-button";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/lib/validators/auth.validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export type TSignInSchema = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
  });
  const isButtonDisable =
    !(!!watch("email") && !!watch("password")) || isSigningIn;

  async function handleSignIn(formValue: TSignInSchema) {
    try {
      setIsSigningIn(true);

      const res = await signIn("credentials", {
        email: formValue.email,
        password: formValue.password,
        redirect: false,
      });

      router.refresh();

      if (res?.ok) {
        router.push("/");
      }

      if (res?.error) {
        toast.error("Invalid Credentials");
      }

      setIsSigningIn(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      className="mx-4 flex w-full max-w-[500px] flex-col gap-4"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <h2 className="text-2xl font-semibold">Sign in to your account</h2>
      <div className="flex flex-col gap-3">
        <Input
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          size="md"
          variant="bordered"
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          {...register("email")}
        />

        <Input
          type={isPasswordVisible ? "text" : "password"}
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          size="md"
          variant="bordered"
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          {...register("password")}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsPasswordVisible((prevState) => !prevState)}
            >
              {isPasswordVisible ? (
                <FaEyeSlash className="pointer-events-none text-lg text-default-400" />
              ) : (
                <FaEye className="pointer-events-none text-lg text-default-400" />
              )}
            </button>
          }
        />

        <Button
          type="submit"
          color="secondary"
          size="md"
          variant="solid"
          isLoading={isSigningIn}
          isDisabled={isButtonDisable}
          className="font-semibold text-white"
        >
          Sign in
        </Button>
      </div>

      <div className="flex w-full items-center gap-4">
        <Divider className="w-[30%] sm:w-[35%]" />
        <p className="w-full text-center text-[.75rem] opacity-60  md:text-[.875rem]">
          Or sign up with
        </p>
        <Divider className="w-[30%] sm:w-[35%]" />
      </div>

      <GoogleButton />
      <p className="text-center text-sm">
        Dont have an account?{" "}
        <Link href="/sign-up" className="text-primary-500">
          Sign up
        </Link>
      </p>
    </form>
  );
}
