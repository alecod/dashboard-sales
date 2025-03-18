"use client";
import { createSignupFetch } from "@/actions/auth/create-signup";
import { LoadingModal } from "@/components/global/loading";
import { Header } from "@/components/header/header-auth";
import { ModalPrivacyAndPolicies } from "@/components/modal/modal-privacy-polices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuthHook } from "@/hooks/auth-hook";
import { routes } from "@/routes/routes";
import { formatCPF } from "@/utils/format-cpf";
import { type SignUpFormData, signUpSchema } from "@/validators/auth";
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
    formState: { errors },
    setValue,
    handleSubmit,
    register,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuthHook();
  const { toast } = useToast();
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setValue("cpf", formattedCPF);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (data: SignUpFormData) => {
      const res = await createSignupFetch({
        name: data.name,
        email: data.email,
        password: data.password,
        cpf: data.cpf,
      });
      if (res?.serverError || (res && !res.data)) {
        throw new Error("Error when logging in. check the data and try again");
      }
      return res?.data;
    },

    onSuccess: (data) => {
      Cookies.set("k_r_t", `Bearer ${data?.refresh_token}`, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });
      Cookies.set("k_a_t", `Bearer ${data?.access_token}`, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
      });
      setUser(data.user);
      toast({
        title: "Cadastro efetuado com sucesso!",
        description: "Seja bem vindo ao Dashboard",
        variant: "success",
      });
      router.push(routes.welcome);
    },
    onError: (error: { message: string | string[] }) => {
      toast({
        title: "Erro no cadastro",
        description: "Verifique seus dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const openPoliciesModal = () => {
    setShowPoliciesModal(true);
  };

  const handleAcceptPolicies = () => {
    setValue("accept_policies", true);
    setShowPoliciesModal(false);
  };

  return (
    <div className="mx-auto w-full p-4 lg:w-[30rem]">
      <LoadingModal show={isPending} />
      <Header title="Seja bem vindo ao Dashboard" />
      <form
        className="mt-5"
        onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            placeholder="Digite seu nome completo"
            type="text"
            {...register("name")}
          />
          <p className="h-1 text-xs text-destructive">{errors.name?.message}</p>
        </div>
        <div className="mt-2 flex flex-col gap-3">
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
            type="button"
            className="absolute inset-y-0 right-0 top-3 flex cursor-pointer items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
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
        <div className="mt-2 flex flex-col gap-3">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            placeholder="Digite seu CPF"
            type="text"
            {...register("cpf")}
            maxLength={14}
            onChange={handleCPFChange}
          />
          <p className="h-1 text-xs text-destructive">{errors.cpf?.message}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Switch
            className="w-10"
            onCheckedChange={(checked) => setValue("accept_policies", checked)}
          />

          <span className="text-sm">
            Eu aceito as{" "}
            <button
              type="button"
              className="text-white underline"
              onClick={openPoliciesModal}
            >
              políticas de dados e privacidade
            </button>
          </span>
        </div>
        {errors?.accept_policies && (
          <p className="h-1 text-xs text-destructive">
            {errors.accept_policies.message}
          </p>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="mt-5 w-full"
          size="lg"
        >
          Cadastrar
          <PiArrowRightBold className="ml-2 h-4 w-4" />
        </Button>
        <p className="mt-5">
          Já tem uma conta?{" "}
          <Link href={routes.auth.signin} className="font-bold">
            Entrar
          </Link>
        </p>
      </form>
      {showPoliciesModal && (
        <ModalPrivacyAndPolicies
          open={showPoliciesModal}
          onAccept={handleAcceptPolicies}
          onOpenChange={setShowPoliciesModal}
          onClose={() => setShowPoliciesModal(false)}
        />
      )}
    </div>
  );
}
