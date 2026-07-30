import Link from "next/link";
import { colors } from "@/lib/theme";

// Reusable call-to-action block for the SEO resource pages.
export function ResourceCTA({
  heading,
  body,
  buttonLabel = "Start your free 30-day trial",
  href = "/signup",
}: {
  heading: string;
  body: string;
  buttonLabel?: string;
  href?: string;
}) {
  return (
    <div
      style={{
        background: colors.navy,
        borderRadius: 16,
        padding: 28,
        margin: "36px 0",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#fff", fontSize: 22, margin: "0 0 8px" }}>
        {heading}
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 16,
          lineHeight: 1.6,
          margin: "0 auto 20px",
          maxWidth: 520,
        }}
      >
        {body}
      </p>
      <Link
        href={href}
        style={{
          display: "inline-block",
          background: colors.gold,
          color: colors.navy,
          fontWeight: 700,
          fontSize: 16,
          padding: "13px 28px",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        {buttonLabel}
      </Link>
      <p
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 13,
          margin: "12px 0 0",
        }}
      >
        No credit card required
      </p>
    </div>
  );
}
