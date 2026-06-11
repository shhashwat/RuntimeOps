"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth";

import { tokenStorage } from "@/lib/auth/token";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);

      const data = await authApi.register(name, email, password);

      tokenStorage.setTokens(data.accessToken, data.refreshToken);

      router.push("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-2 overflow-hidden bg-[#f8f8f8]">
      <div className="absolute left-10 top-10 font-mono text-xs tracking-[0.3em] text-muted-foreground">
        DEPLOY • MONITOR • OPERATE
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h1
          className="
      text-[18vw]
      font-black
      tracking-tight
      text-transparent
      select-none
      stroke-text
    "
        >
          RUNTIMEOPS
        </h1>
      </div>

      <Card
        className="
    relative
    z-10
    w-full
    max-w-lg
    p-10
    bg-white/70
    backdrop-blur-xl
    border-white/50
    shadow-[0_10px_60px_rgba(0,0,0,0.08)]
  "
      >
        <div className="space-y-2 text-center">
          <h1 className="font-mono text-4xl font-bold tracking-tight">
            RuntimeOps
          </h1>

          <p className="text-muted-foreground">Deploy with confidence.</p>
        </div>

        <Input
          className="
    h-12
    bg-white/70
    backdrop-blur
  "
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          className="
    h-12
    bg-white/70
    backdrop-blur
  "
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <Input
            className="
    h-12
    bg-white/70
    backdrop-blur
  "
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          disabled={
            loading || !name.trim() || !email.trim() || !password.trim()
          }
          className="
    h-12
    w-full
    bg-black
    text-white
    hover:bg-black/90
    font-mono
  "
          onClick={handleRegister}
        >
          {loading ? "Creating..." : "Register"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </Card>

      <div className="absolute bottom-10 left-10 font-mono text-xs text-muted-foreground">
        BUILT FOR MODERN ENGINEERING TEAMS
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-xs text-muted-foreground">
        STATUS: OPERATIONAL{" "}
        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500" />
      </div>
    </div>
  );
}
