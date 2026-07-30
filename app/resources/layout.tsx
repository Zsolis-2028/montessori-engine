import type { ReactNode } from "react";
import Link from "next/link";
import { colors } from "@/lib/theme";

// Public marketing shell for the /resources SEO pages.
// Plain server-rendered header + footer (no app nav, no auth) so the
// content is fully crawlable by search engines.
export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: colors.navy,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: colors.gold,
              display: "inline-block",
            }}
          />
          <strong style={{ color: "#fff", fontSize: 18 }}>
            Montessori Engine
          </strong>
        </Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href="/resources"
            style={{
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Resources
          </Link>
          <Link
            href="/signup"
            style={{
              background: colors.gold,
              color: colors.navy,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: 6,
            }}
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {children}

      <footer
        style={{
          background: colors.navy,
          padding: "28px 24px",
          textAlign: "center",
          marginTop: 40,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 14,
            margin: "0 0 12px",
          }}
        >
          Montessori Engine — AI tools built for Montessori educators.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}
          >
            Home
          </Link>
          <Link
            href="/resources"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}
          >
            Resources
          </Link>
          <Link
            href="/privacy"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
