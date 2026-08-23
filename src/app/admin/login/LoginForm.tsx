"use client";
import { useActionState } from "react";
import { login } from "./actions";
export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return <form action={action} className="admin-login-form">
    <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
    {state.error && <p className="admin-error" role="alert">{state.error}</p>}
    <button className="admin-primary" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
