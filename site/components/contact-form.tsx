"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/actions";

const initial: ContactState = { status: "idle", message: "" };

const field =
  "mt-0.5 w-full rounded-[10px] border-2 border-ink bg-paper px-1.5 py-1 text-base placeholder:text-ink-soft/60 focus:outline-none focus-visible:border-cobalt focus-visible:ring-2 focus-visible:ring-cobalt/30 aria-[invalid=true]:border-tomato";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);

  if (state.status === "sent") {
    return (
      <div role="status" className="flex h-full flex-col justify-center gap-1 py-4">
        <p className="font-display text-3xl font-extrabold tracking-tight">Klikk. Den er sendt.</p>
        <p className="text-ink-soft">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} noValidate className="flex flex-col gap-2">
      <div>
        <label htmlFor="name" className="font-semibold">
          Navn
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          aria-invalid={!!err.name}
          aria-describedby={err.name ? "name-error" : undefined}
          className={field}
        />
        {err.name && (
          <p id="name-error" className="mt-0.5 text-sm text-tomato">
            {err.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="font-semibold">
          E-post
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={!!err.email}
          aria-describedby={err.email ? "email-error" : undefined}
          className={field}
        />
        {err.email && (
          <p id="email-error" className="mt-0.5 text-sm text-tomato">
            {err.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="message" className="font-semibold">
          Hva vil du bygge?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Fortell litt om prosjektet, hva du har i dag og når du trenger det."
          defaultValue={state.values?.message}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? "message-error" : undefined}
          className={`${field} resize-y`}
        />
        {err.message && (
          <p id="message-error" className="mt-0.5 text-sm text-tomato">
            {err.message}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_site">La dette feltet stå tomt</label>
        <input id="company_site" name="company_site" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border-2 border-ink bg-tomato px-3 py-1 font-semibold text-ink shadow-brick transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-0 disabled:opacity-60"
        >
          {pending ? "Sender …" : "Send"}
        </button>
        <p aria-live="polite" className="text-sm text-ink-soft">
          {state.status === "error" ? state.message : "Meldingen går rett til meg."}
        </p>
      </div>
      <p className="text-xs text-ink-soft">
        Jeg bruker opplysningene bare til å svare deg. Les mer i{" "}
        <a href="/personvernserklering" className="underline underline-offset-2">
          personvernerklæringen
        </a>
        .
      </p>
    </form>
  );
}
