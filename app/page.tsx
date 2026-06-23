import Link from 'next/link'
import { colors } from '@/lib/theme'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'Arial, sans-serif' }}>

      {/* Nav */}
      <header style={{ background: colors.navy, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors.gold, display: 'inline-block' }} />
          <strong style={{ color: '#fff', fontSize: 18 }}>Montessori Engine</strong>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, padding: '8px 16px' }}>
            Log In
          </Link>
          <a href="mailto:zach.solis@icloud.com" style={{ background: colors.gold, color: colors.navy, textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 6 }}>
            Request Access
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: colors.navy, padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
          AI Tools Built for<br />
          <span style={{ color: colors.gold }}>Montessori Educators</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Generate activities, write observation notes, and plan full days — in seconds. Built specifically for Montessori teachers, not general AI.
        </p>
        <a href="mailto:zsolis2028@gmail.com" style={{
          display: 'inline-block',
          background: colors.gold,
          color: colors.navy,
          fontWeight: 700,
          fontSize: 16,
          padding: '14px 32px',
          borderRadius: 8,
          textDecoration: 'none',
        }}>
          Request Access
        </a>
      </section>

      {/* 3 Agents */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ color: colors.navy, textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>
          3 AI Agents. One Platform.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            {
              emoji: '🎯',
              title: 'Activity Generator',
              desc: 'Select age range, domain, and materials — get a full Montessori activity plan with presentation steps, safety notes, and extensions.',
            },
            {
              emoji: '📝',
              title: 'Observation Note Writer',
              desc: 'Jot down what you saw in plain language. We turn it into a professional Montessori observation note with developmental significance.',
            },
            {
              emoji: '📅',
              title: 'Daily Activity Planner',
              desc: 'Generate a full day plan for your infant or toddler room — morning through end of day, with materials, setup, and what to observe.',
            },
          ].map((card) => (
            <div key={card.title} style={{
              background: '#fff',
              border: `1px solid #d0d8ea`,
              borderRadius: 12,
              padding: 28,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{card.emoji}</div>
              <h3 style={{ color: colors.navy, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 14 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why not ChatGPT */}
      <section style={{ background: colors.navy, padding: '64px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Why not just use ChatGPT?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            ChatGPT is a blank canvas. You have to know what to ask and how to ask it. Montessori Engine is built for one job — and everything is already set up for Montessori teachers. No prompting skills needed. Just fill in the form and click generate.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left', maxWidth: 560, margin: '0 auto' }}>
            {[
              ['ChatGPT', 'Montessori Engine'],
              ['Generic responses', 'Montessori-specific output'],
              ['Requires prompting skills', 'Just fill in a form'],
              ['No school context', 'Connected to your school'],
              ['Starts fresh every time', 'Saves your activities'],
            ].map(([left, right], i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: 6, color: i === 0 ? colors.gold : 'rgba(255,255,255,0.6)', fontWeight: i === 0 ? 700 : 400, fontSize: 14 }}>{left}</div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: 6, color: i === 0 ? colors.gold : '#fff', fontWeight: i === 0 ? 700 : 400, fontSize: 14 }}>{right}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ color: colors.navy, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Ready to save hours every week?
        </h2>
        <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 32 }}>
          Join Montessori schools already using AI to work smarter.
        </p>
        <a href="mailto:zsolis2028@gmail.com" style={{
          display: 'inline-block',
          background: colors.navy,
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          padding: '14px 32px',
          borderRadius: 8,
          textDecoration: 'none',
        }}>
          Request Access
        </a>
      </section>

     {/* Footer */}
      <footer style={{ background: colors.navy, padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>© 2026 Montessori Engine. Built for educators who change lives.</p>
      </footer>

    </div>
  )
}