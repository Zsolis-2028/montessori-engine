import Link from 'next/link'
import { colors } from '@/lib/theme'

const CONTACT_EMAIL = 'montessoriengine@gmail.com'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Arial, sans-serif' }}>
      {/* Nav */}
      <header
        style={{
          background: colors.navy,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors.gold, display: 'inline-block' }} />
          <strong style={{ color: '#fff', fontSize: 18 }}>Montessori Engine</strong>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="#features" className="nav-link">Features</a>
          <Link href="/terms" className="nav-link">Pricing</Link>
          <Link href="/login" className="nav-link">Log In</Link>
          <Link
            href="/signup"
            style={{ background: colors.gold, color: colors.navy, textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 6 }}
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: colors.navy, padding: '88px 24px 96px', textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(245,200,0,0.12)',
            color: colors.gold,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.3,
            padding: '6px 14px',
            borderRadius: 999,
            marginBottom: 24,
          }}
        >
          Purpose-built for Montessori classrooms
        </span>
        <h1 className="hero-title" style={{ color: '#fff', fontWeight: 800, marginBottom: 18, lineHeight: 1.15 }}>
          The all-in-one platform for<br />
          <span style={{ color: colors.gold }}>Montessori educators</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Plan authentic activities, write observation notes, build daily plans, and track every
          child&rsquo;s progress — all in one place, designed around how Montessori teachers actually work.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn-gold">Start your 30-day free trial</Link>
          <a href="#features" className="btn-outline">See what&rsquo;s inside</a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 20 }}>
          No credit card required &middot; FERPA-aligned &middot; Your school set up in minutes
        </p>
      </section>

      {/* Stats strip */}
      <section style={{ background: colors.navyMuted, padding: '28px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
          {[
            ['5', 'AI-assisted teaching tools'],
            ['5', 'Montessori curriculum areas tracked'],
            ['100%', 'Teacher-driven, no guessing'],
            ['1', 'Platform for your whole school'],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: colors.gold, fontSize: 30, fontWeight: 800 }}>{num}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, maxWidth: 160 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '72px 24px', maxWidth: 1000, margin: '0 auto', scrollMarginTop: 70 }}>
        <h2 style={{ color: colors.navy, textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
          Everything your classroom needs
        </h2>
        <p style={{ color: colors.textMuted, textAlign: 'center', fontSize: 16, maxWidth: 560, margin: '0 auto 44px' }}>
          Five tools that work together — from the first lesson idea to a full picture of each child&rsquo;s development.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
          {[
            {
              emoji: '🎯',
              title: 'Activity Generator',
              desc: 'Pick age range, area, and materials — get a full activity plan with direct and indirect aims, presentation steps, and extensions.',
            },
            {
              emoji: '📝',
              title: 'Observation Note Writer',
              desc: 'Jot what you saw in plain language. It becomes a professional Montessori observation note with developmental significance and follow-up.',
            },
            {
              emoji: '📅',
              title: 'Daily Activity Planner',
              desc: 'Generate a full day plan for your room — morning through end of day, with materials, setup, and what to observe.',
            },
            {
              emoji: '📊',
              title: 'Progress Tracking',
              desc: 'Mark each student on every material as Introduced, Practicing, or Mastered across all five Montessori areas — a living record of their journey.',
            },
            {
              emoji: '📈',
              title: 'Development Reports',
              desc: 'A school-wide view of every child’s progress and recent activity, ready to share with directors and parents.',
            },
            {
              emoji: '📚',
              title: 'Your Activity Library',
              desc: 'Save the lessons you love, reuse them anytime, and export clean PDFs for your binder or your team.',
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: 14,
                padding: 26,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 12 }}>{card.emoji}</div>
              <h3 style={{ color: colors.navy, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 14, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#fff', padding: '72px 24px', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ color: colors.navy, textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 44 }}>
            Up and running in three steps
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              ['1', 'Sign up', 'Create your account and your school workspace is set up automatically — no IT, no setup calls.'],
              ['2', 'Teach with it', 'Generate activities, write observations, and plan your days with tools that speak Montessori.'],
              ['3', 'Track & share', 'Record each child’s progress and turn it into clear reports for your directors and families.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: colors.navy,
                    color: colors.gold,
                    fontWeight: 800,
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  {num}
                </div>
                <h3 style={{ color: colors.navy, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why different */}
      <section style={{ background: colors.navy, padding: '72px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 30, fontWeight: 800, marginBottom: 16 }}>
            Not general AI. Montessori AI.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            General-purpose tools are built for everyone — which means they&rsquo;re not built for you.
            Every workflow and every output here is designed around authentic Montessori practice.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left', maxWidth: 560, margin: '0 auto' }}>
            {[
              ['General AI Tools', 'Montessori Engine'],
              ['Generic responses', 'Authentic Montessori terminology'],
              ['Requires prompt skills', 'Just fill in a form'],
              ['No school context', 'Connected to your school'],
              ['Nothing to track', 'Progress tracking built in'],
              ['Starts fresh every time', 'Saves your work'],
            ].map(([left, right], i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: 6, color: i === 0 ? colors.gold : 'rgba(255,255,255,0.6)', fontWeight: i === 0 ? 700 : 400, fontSize: 14 }}>{left}</div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: 6, color: i === 0 ? colors.gold : '#fff', fontWeight: i === 0 ? 700 : 400, fontSize: 14 }}>{right}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / trust */}
      <section style={{ padding: '72px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ color: colors.navy, textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
          Built to protect student data
        </h2>
        <p style={{ color: colors.textMuted, textAlign: 'center', fontSize: 16, maxWidth: 580, margin: '0 auto 44px' }}>
          Children&rsquo;s data deserves real protection. Security is built into the foundation, not bolted on.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {[
            ['🔒', 'FERPA-aligned', 'Designed to support your school’s FERPA compliance. Your school owns its data — always.'],
            ['🛡️', 'Encrypted end to end', 'Data is encrypted at rest (AES-256) and in transit (TLS) on SOC 2 Type II infrastructure.'],
            ['🏫', 'Per-school isolation', 'Database-enforced row level security means one school can never see another’s students.'],
            ['🚫', 'Never sold', 'We do not sell, rent, or trade your data or your students’ data. Ever.'],
          ].map(([emoji, title, desc]) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{emoji}</div>
              <h3 style={{ color: colors.navy, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: colors.navy, padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 30, fontWeight: 800, marginBottom: 12 }}>
          Give your teachers their time back
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
          Spend less time on paperwork and more time with the children. Start free today.
        </p>
        <Link href="/signup" className="btn-gold">Start your 30-day free trial</Link>
      </section>

      {/* Footer */}
      <footer style={{ background: colors.navy, padding: '28px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 10 }}>
          © 2026 Montessori Engine. Built for educators who change lives.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Pricing</Link>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Terms of Service</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

      {/* Interactions & responsive polish */}
      <style>{`
        .nav-link {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 6px;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .hero-title { font-size: 46px; }
        .btn-gold {
          display: inline-block;
          background: var(--color-gold);
          color: var(--color-navy);
          font-weight: 700;
          font-size: 16px;
          padding: 14px 30px;
          border-radius: 8px;
          text-decoration: none;
        }
        .btn-gold:hover { filter: brightness(0.95); }
        .btn-outline {
          display: inline-block;
          background: transparent;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          padding: 14px 30px;
          border-radius: 8px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.35);
        }
        .btn-outline:hover { background: rgba(255,255,255,0.08); }
        @media (max-width: 640px) {
          .hero-title { font-size: 32px; }
          .nav-link { display: none; }
        }
      `}</style>
    </div>
  )
}
