"use client";

import { createForgotFetch } from "@/actions/auth/create-forgot";
import { LoadingModal } from "@/components/global/loading";
import { Header } from "@/components/header/header-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { routes } from "@/routes/routes";
import { type RecoveryFormData, recoverySchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";

export default function Form() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["recovery-password"],
    mutationFn: async (data: RecoveryFormData) => {
      const res = await createForgotFetch({
        email: data.email,
      });

      if (res && res.data === false) {
        throw new Error("Error when logging in. check the data and try again");
      }
    },

    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setIsEmailSent(true);
    },

    onError() {
      toast({
        title: "Erro no localizar email",
        description: "Verifique seu email e tente novamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <LoadingModal show={isPending} />
      <div className="mx-auto w-full p-4 lg:w-[30rem]">
        <Header
          title={
            isEmailSent
              ? ""
              : "Esqueceu a senha? Solicite um email para acessar sua conta."
          }
        />
        {isEmailSent ? (
          <div className="mt-5 flex flex-col justify-start gap-2">
            <p className="text-white text-[1.5rem] font-bold">Email enviado</p>
            <p>
              Enviamos um email de recuperação de senha para{" "}
              <span className="text-[#19dbfe]">{email}</span>. Nele contém um
              link único para você trocar de senha.
            </p>
            <Button className="mt-5 w-full" size="lg">
              Ir para o Login
              <PiArrowRightBold className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <form
            className="mt-5"
            onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                placeholder="Digite seu e-mail"
                type="email"
                {...register("email")}
              />
              {errors?.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button className="mt-5 w-full" size="lg">
              Redefinir Senha
              <PiArrowRightBold className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-5">
              Não tem uma conta?{" "}
              <Link href={routes.auth.signup} className="font-bold">
                Cadastre-se agora!
              </Link>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
