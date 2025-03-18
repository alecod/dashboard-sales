import Link from "next/link";

export function Footer() {
  return (
    <footer className="container mt-10 w-full mb-3">
      <div className="flex h-14 items-center justify-center gap-5 flex-col">
        <p className="text-center text-xs leading-loose text-muted-foreground md:text-sm lg:text-left">
        
        </p>
        <div className="flex items-center gap-2 justify-center mb-3">
          <Link
            href="/about/terms-and-conditions"
            className="text-xs text-muted-foreground underline text-center"
          >
            Termos e Condições
          </Link>
          <Link
            href="/about/privacy-policy"
            className="text-xs text-muted-foreground underline text-center"
          >
            Politica de Privacidade
          </Link>
          <Link
            href="/about/cookies-policy"
            className="text-xs text-muted-foreground underline text-center"
          >
            Politica de Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
