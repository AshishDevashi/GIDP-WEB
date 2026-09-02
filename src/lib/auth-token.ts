const TOKEN_COOKIE = "gidp_token";
const MAX_AGE = 60 * 60 * 24 * 7;

// Readable by JS so middleware and client share one source; move to an
// HttpOnly cookie set by the backend when it supports it.
export const authToken = {
  get(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`),
    );
    return match ? decodeURIComponent(match[1]) : null;
  },

  set(token: string) {
    if (typeof document === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  },

  clear() {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  },
};

export { TOKEN_COOKIE };
