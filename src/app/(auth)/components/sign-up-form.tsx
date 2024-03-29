"use client";

import { useState } from "react";
import { Input, Divider, Button } from "@nextui-org/react";
import GoogleButton from "./google-button";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/lib/validators/auth.validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { useSignUp } from "@/lib/services/auth.api";

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const { mutate: signUpMutation, isPending } = useSignUp();
  const isButtonDisabled = !(
    !!watch("email") &&
    !!watch("password") &&
    !!watch("confirmPassword")
  );

  function handleSignUp(formData: TSignUpSchema) {
    signUpMutation(formData);
  }

  return (
    <form
      className="mx-4 flex w-full max-w-[500px] flex-col gap-4"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <h2 className="text-2xl font-semibold">Create an account</h2>
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

        <Input
          type={isConfirmPasswordVisible ? "text" : "password"}
          label="Confirm password"
          labelPlacement="outside"
          placeholder="Re-enter your password"
          size="md"
          variant="bordered"
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() =>
                setIsConfirmPasswordVisible((prevState) => !prevState)
              }
            >
              {isConfirmPasswordVisible ? (
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
          isLoading={isPending}
          className="font-semibold text-white"
          isDisabled={isButtonDisabled}
        >
          Sign up
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
        Have an account?{" "}
        <Link href="/sign-in" className="text-primary-500">
          Sign in
        </Link>
      </p>
    </form>
  );
}
