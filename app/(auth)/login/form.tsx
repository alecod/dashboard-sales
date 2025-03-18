// components/Form.tsx
"use client";

import { createLoginFetch } from "@/actions/auth/create-login";
import { LoadingModal } from "@/components/global/loading";
import { Header } from "@/components/header/header-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuthHook } from "@/hooks/auth-hook";
import { routes } from "@/routes/routes";
import { type SignInFormData, signInSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold, PiEyeBold, PiEyeSlashBold } from "react-icons/pi";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();
  const { setUser } = useAuthHook();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (
      data: SignInFormData
    ): Promise<{
      user: {
        user_id: string;
        name: string;
        email: string;
        created_at: string;
        updated_at: string;
        birth_date: string;
        deleted_at: string;
      };
      access_token: string;
      refresh_token: string;
    }> => {
      const res = await createLoginFetch({
        email: data.email,
        password: data.password,
      });

      if ((res && !res.data) || res?.serverError) {
        throw new Error("Error when logging in. check the data and try again");
      }

      return res?.data;
    },
    onSuccess(data) {
      Cookies.set("k_r_t", `Bearer ${data?.refresh_token}`, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });
      Cookies.set("k_a_t", `Bearer ${data?.access_token}`, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
      });
      setUser(data.user);
      router.push(routes.dashboard);
    },
    onError() {
      toast({
        title: "Erro ao realizar login.",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <LoadingModal show={isPending} />

      <div className="mx-auto w-full p-4 lg:w-[30rem]">
        <Header title="Bem-vindo de volta! Por favor, entre para continuar." />
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
            <p className="h-1 text-xs text-destructive">
              {errors.email?.message}
            </p>
          </div>

          <div className="relative mt-2 flex flex-col gap-3">
            <Label htmlFor="password">Senha</Label>
            <Input
              placeholder="Digite sua senha"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              className="absolute inset-y-0 right-0 top-3 flex cursor-pointer items-center pr-3"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <PiEyeSlashBold className="text-gray-500" />
              ) : (
                <PiEyeBold className="text-gray-500" />
              )}
            </button>
            <p className="h-1 text-xs text-destructive">
              {errors.password?.message}
            </p>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <Link href={routes.auth.forgot} className="text-xs underline">
              Esqueceu a senha?
            </Link>
          </div>

          <Button className="mt-5 w-full" size="lg">
            Entrar
            <PiArrowRightBold className="ml-2 h-4 w-4" />
          </Button>

          <p className="mt-5">
            Não tem uma conta?{" "}
            <Link href={routes.auth.signup} className="font-bold">
              Cadastre-se agora!
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
