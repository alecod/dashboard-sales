"use client";
import { updatePasswordFetch } from "@/actions/auth/update-password";
import { LoadingModal } from "@/components/global/loading";
import { Header } from "@/components/header/header-auth";
import { ErrorModal } from "@/components/modal/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { routes } from "@/routes/routes";
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold, PiEyeBold, PiEyeSlashBold } from "react-icons/pi";

export default function Form({
  data: user_data,
}: {
  data: {
    user_id: string;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPassword(data);
  };

  const { mutateAsync: resetPassword, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data: ResetPasswordFormData) => {
      await updatePasswordFetch({
        password: data.password,
        password_confirmation: data.confirmPassword,
        user_id: user_data?.user_id,
      }).then((res) => res?.data);
    },
    onSuccess(data) {
      router.push(routes.auth.signin);
      toast({
        title: "Senha alterada com sucesso!",
        variant: "success",
      });
    },
  });

  return (
    <div className="mx-auto w-full p-4 lg:w-[30rem]">
      <ErrorModal
        open={isErrorModalOpen}
        onOpenChange={setErrorModalOpen}
        messageError="URL invalida, tente novamente"
      />
      <Header title="Redefina sua senha" />
      <LoadingModal show={isPending} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="password">Digite sua nova senha</Label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            className="[&>label>span]:font-medium"
            {...register("password")}
          />
          <button
            className="absolute inset-y-0 right-0 top-6 flex cursor-pointer items-center pr-3"
            type="button"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <PiEyeSlashBold className="text-gray-500" />
            ) : (
              <PiEyeBold className="text-gray-500" />
            )}
          </button>
          {errors?.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="relative mt-5 flex flex-col gap-3">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            className="[&>label>span]:font-medium"
            {...register("confirmPassword")}
          />
          <button
            className="absolute inset-y-0 right-0 top-6 flex cursor-pointer items-center pr-3"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirmPassword(!showConfirmPassword);
            }}
          >
            {showConfirmPassword ? (
              <PiEyeSlashBold className="text-gray-500" />
            ) : (
              <PiEyeBold className="text-gray-500" />
            )}
          </button>
          {errors?.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button className="mt-5 w-full" size="lg">
          Confirmar Alterações
          <PiArrowRightBold className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
