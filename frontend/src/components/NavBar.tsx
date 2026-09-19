"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContainer } from "@/infrastructure/container";
import { signOut } from "@/application/auth/sign-out";

export default function NavBar() {
  const router = useRouter();
  const { authProvider } = useAppContainer();

  async function handleSignOut() {
    await signOut(authProvider);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-vinyl-bg/95 px-4 py-3 backdrop-blur">
      <Link href="/" className="font-semibold text-vinyl-accent">
        Bergas
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/search" className="text-gray-300 hover:text-vinyl-accent">
          Buscar por foto
        </Link>
        <Link href="/add" className="text-gray-300 hover:text-vinyl-accent">
          Adicionar
        </Link>
        <button onClick={handleSignOut} className="text-gray-500 hover:text-gray-300">
          Sair
        </button>
      </nav>
    </header>
  );
}
