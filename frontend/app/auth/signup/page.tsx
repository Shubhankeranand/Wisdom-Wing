"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    graduationYear: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerWithEmail(form);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-bg lg:grid-cols-2">
      <section className="hidden bg-surfaceAlt p-12 lg:block">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Step 1 of 2</p>
          <h1 className="text-4xl font-bold">Join your college network.</h1>
          <p className="max-w-lg text-base leading-7 text-textMuted">
            Create an account, then upload your college ID to unlock verified posting, answers, and
            community access.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-textMuted">Step 1 of 2: Basic Info</p>
            <h1 className="text-3xl font-bold">Create your account</h1>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-lg border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="First name"
                value={form.firstName}
                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
              />
              <input
                className="rounded-lg border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="Last name"
                value={form.lastName}
                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
              />
              <input
                className="rounded-lg border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none md:col-span-2"
                placeholder="College email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                className="rounded-lg border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
              <input
                className="rounded-lg border border-border bg-bg px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="Graduation year"
                value={form.graduationYear}
                onChange={(event) =>
                  setForm((current) => ({ ...current, graduationYear: event.target.value }))
                }
              />
            </div>
            <div className="rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 p-6 text-center">
              <p className="font-medium">Upload college ID</p>
              <p className="mt-2 text-sm text-textMuted">Drop a PDF, JPG, or PNG to unlock verified status.</p>
            </div>
            {error ? <p className="text-sm text-rose-500">{error}</p> : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <Button
            variant="secondary"
            className="w-full"
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                await loginWithGoogle();
                router.push("/dashboard");
              } catch (caughtError) {
                setError(caughtError instanceof Error ? caughtError.message : "Unable to continue");
              } finally {
                setLoading(false);
              }
            }}
          >
            Continue with Google
          </Button>
        </Card>
      </section>
    </main>
  );
}
