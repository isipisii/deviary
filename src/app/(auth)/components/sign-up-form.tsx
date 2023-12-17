"use client";

import { useState } from "react";
import { Input, Divider, Button } from "@nextui-org/react";
import GoogleButton from "./google-button";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/lib/validators/auth-validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";

import { useSignUp } from "@/lib/services/auth.api";
import { useRouter } from 'next-nprogress-bar';

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });  
  const { mutate: signUpMutation, isPending } = useSignUp()
  const isButtonDisabled = !(
    !!watch("email") && 
    !!watch("password") && 
    !!watch("confirmPassword")
  ) 

  function handleSignUp(formData: TSignUpSchema) {
    signUpMutation(formData)
  }

  return (
    <form
      className="max-w-[500px] w-full flex flex-col gap-4 mx-4"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <h2 className="font-semibold text-2xl">Create an account</h2>
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
                <FaEyeSlash className="text-lg text-default-400 pointer-events-none" />
              ) : (
                <FaEye className="text-lg text-default-400 pointer-events-none" />
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
              onClick={() => setIsConfirmPasswordVisible((prevState) => !prevState)}
            >
              {isConfirmPasswordVisible ? (
                <FaEyeSlash className="text-lg text-default-400 pointer-events-none" />
              ) : (
                <FaEye className="text-lg text-default-400 pointer-events-none" />
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
          className="text-white font-semibold"
          isDisabled={isButtonDisabled}
        >
          Sign up
        </Button>
      </div>

      <div className="flex gap-4 w-full items-center">
        <Divider className="w-[35%]" />
        <p className="w-full text-center opacity-60 text-sm">
          Or sign up with
        </p>
        <Divider className="w-[35%]" />
      </div>

      <GoogleButton />
      <p className="text-center text-sm">
        Have an account? <Link href="/sign-in" className="text-primary-500">Sign in</Link>
      </p>
    </form>
  );
}
