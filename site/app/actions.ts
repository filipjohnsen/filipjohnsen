"use server";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public, unauthenticated form: validate everything and never trust the client.
 * Messages are forwarded as JSON to CONTACT_WEBHOOK_URL when it is set
 * (e.g. a Slack/Discord/Zapier/Resend relay). Without it they are only logged.
 */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const name = value("name");
  const email = value("email");
  const message = value("message");
  const values = { name, email, message };

  // Honeypot: real people never see or fill this field.
  if (value("company_site")) return { status: "sent", message: "Takk!" };

  const errors: ContactState["errors"] = {};
  if (name.length < 1 || name.length > 100) errors.name = "Skriv navnet ditt, så jeg vet hvem jeg svarer.";
  if (!EMAIL.test(email) || email.length > 200) errors.email = "Den e-postadressen ser ikke helt riktig ut.";
  if (message.length < 10) errors.message = "Skriv gjerne litt mer, minst en setning.";
  if (message.length > 5000) errors.message = "Det var mye! Hold det under 5000 tegn, så tar vi resten på e-post.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Noe mangler. Se feltene under.", errors, values };
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "filipjohnsen.no" }),
      });
      if (!res.ok) throw new Error(`Webhook svarte ${res.status}`);
    } else {
      console.info("[kontakt] CONTACT_WEBHOOK_URL er ikke satt. Melding:", { name, email, length: message.length });
    }
  } catch (error) {
    console.error("[kontakt] Klarte ikke å sende melding:", error);
    return {
      status: "error",
      message: "Meldingen kom ikke fram. Prøv igjen, eller send en e-post til hei@filipjohnsen.no.",
      values,
    };
  }

  return { status: "sent", message: "Takk! Jeg svarer vanligvis innen et par dager." };
}
