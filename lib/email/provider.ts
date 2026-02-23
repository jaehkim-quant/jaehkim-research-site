import { Resend } from "resend";

type EnvMap = Record<string, string | undefined>;

export type EmailProviderName = "resend" | "noop" | "ses";
export type EmailProviderSetting = EmailProviderName | "auto";

export type SendEmailInput = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export type SendEmailResult = {
  provider: EmailProviderName;
  skipped?: boolean;
  messageId?: string | null;
};

export class EmailProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailProviderError";
  }
}

export function resolveEmailProvider(
  env: EnvMap = process.env
): EmailProviderName {
  const configured = normalizeEmailProvider(env.EMAIL_PROVIDER);

  if (configured && configured !== "auto") {
    return configured;
  }

  if (env.RESEND_API_KEY) {
    return "resend";
  }

  return "noop";
}

export function getDefaultEmailFrom(env: EnvMap = process.env) {
  return env.EMAIL_FROM || "JaehKim Research <onboarding@resend.dev>";
}

export async function sendEmail(
  input: SendEmailInput,
  env: EnvMap = process.env
): Promise<SendEmailResult> {
  const provider = resolveEmailProvider(env);

  switch (provider) {
    case "resend":
      return sendWithResend(input, env);
    case "noop":
      console.warn(
        `[email] Skipping email send because no provider is configured. Subject="${input.subject}"`
      );
      return { provider: "noop", skipped: true };
    case "ses":
      return sendWithSes(input, env);
    default: {
      const exhaustiveCheck: never = provider;
      throw new EmailProviderError(
        `Unsupported email provider: ${exhaustiveCheck}`
      );
    }
  }
}

function normalizeEmailProvider(value?: string): EmailProviderSetting | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (
    normalized === "auto" ||
    normalized === "resend" ||
    normalized === "noop" ||
    normalized === "ses"
  ) {
    return normalized;
  }

  throw new EmailProviderError(
    `Invalid EMAIL_PROVIDER value "${value}". Expected one of: auto, resend, noop, ses.`
  );
}

async function sendWithResend(
  input: SendEmailInput,
  env: EnvMap
): Promise<SendEmailResult> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new EmailProviderError(
      "RESEND_API_KEY is required when using the resend email provider."
    );
  }

  const resend = new Resend(apiKey);
  const response = await resend.emails.send({
    from: input.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo,
  });

  if (response.error) {
    throw new EmailProviderError(
      `Resend email send failed: ${response.error.message}`
    );
  }

  return {
    provider: "resend",
    messageId: response.data?.id ?? null,
  };
}

async function sendWithSes(
  _input: SendEmailInput,
  env: EnvMap
): Promise<SendEmailResult> {
  const missing = ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"].filter(
    (key) => !env[key]
  );

  throw new EmailProviderError(
    missing.length > 0
      ? `EMAIL_PROVIDER=ses is selected, but required env vars are missing: ${missing.join(", ")}.`
      : "EMAIL_PROVIDER=ses is selected, but SES email implementation is not yet installed. Add an AWS SES provider (AWS SDK) before enabling it in production."
  );
}
