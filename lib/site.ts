type EnvMap = Record<string, string | undefined>;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function resolveSiteUrl(env: EnvMap = process.env) {
  const candidate =
    env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL || "http://localhost:3000";

  return trimTrailingSlash(candidate);
}
