import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'sans-serif' }}>
      <TopBar />

      <div style={{ maxWidth: 720, margin: '50px auto', padding: '0 24px 80px' }}>
        <h1 style={{ color: colors.navy, marginBottom: 4 }}>Privacy Policy</h1>
        <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 0, marginBottom: 40 }}>
          Effective date: June 26, 2026
        </p>

        <Section title="Overview">
          Montessori Engine ("we", "us", or "our") is a SaaS platform built for Montessori educators.
          We take the privacy of teachers, students, and schools seriously. This policy explains what
          data we collect, how we use it, and the protections we have in place.
        </Section>

        <Section title="Data We Collect">
          <p>We collect the following categories of information:</p>
          <ul>
            <li><strong>Account information</strong> — your name, school name, and email address provided at signup.</li>
            <li><strong>Authentication credentials</strong> — passwords are hashed and never stored in plain text.</li>
            <li><strong>Educational content</strong> — activities, observations, lesson plans, and student records you create within the platform.</li>
            <li><strong>Usage data</strong> — page visits and feature interactions used to improve the product. This data is not linked to individual student records.</li>
          </ul>
        </Section>

        <Section title="How We Use Your Data">
          <p>We use your data solely to provide and improve Montessori Engine. Specifically:</p>
          <ul>
            <li>To authenticate you and maintain your session.</li>
            <li>To store and retrieve the educational content you create.</li>
            <li>To send transactional emails (account confirmation, billing receipts).</li>
            <li>To diagnose bugs and improve platform performance.</li>
          </ul>
          <p>We do not use your data or your students' data for advertising, profiling, or any purpose beyond operating the service.</p>
        </Section>

        <Section title="FERPA Compliance">
          Montessori Engine is designed to support school compliance with the Family Educational Rights
          and Privacy Act (FERPA). Student records entered into the platform are owned by the school
          and its authorized educators. We act as a "school official" under FERPA when processing
          student data on your behalf. We do not disclose student education records to any third party
          without the written consent of the parent or eligible student, except as permitted by law.
          Schools remain responsible for obtaining appropriate parental consent before entering student
          data into any third-party platform, including Montessori Engine.
        </Section>

        <Section title="Data Storage and Infrastructure">
          All data is stored using <strong>Supabase</strong>, a managed backend platform built on
          PostgreSQL and hosted on AWS. Data is encrypted at rest (AES-256) and in transit (TLS 1.2+).
          Supabase infrastructure is SOC 2 Type II certified. Your data is stored in the United States.
          We do not transfer personal data to countries without adequate data protection frameworks
          without appropriate safeguards in place.
        </Section>

        <Section title="Security Measures">
          <p>We employ multiple layers of security to protect your data:</p>
          <ul>
            <li><strong>Input sanitization</strong> — all user-submitted content is validated and sanitized to prevent injection attacks.</li>
            <li><strong>Rate limiting</strong> — per-user rate limits are enforced on API requests and AI-generation features to prevent abuse and ensure fair access.</li>
            <li><strong>JWT authentication</strong> — access to platform functions requires a valid, signed JSON Web Token verifying your identity on every request.</li>
            <li><strong>Row level security</strong> — database-enforced policies ensure users and schools can only access data they are authorized to see, scoped at the database layer rather than relying solely on application logic.</li>
          </ul>
        </Section>

        <Section title="We Never Sell Your Data">
          We do not sell, rent, trade, or otherwise transfer your personal information or your
          students' information to any third party for commercial purposes. Ever. Your data is yours.
        </Section>

        <Section title="Data Retention and Deletion">
          Your data is retained for as long as your account is active. If you cancel your subscription,
          your data remains accessible for 30 days to allow for export. After 30 days, your account
          and all associated data are permanently deleted from our systems. You may request early
          deletion at any time by contacting us at the address below.
        </Section>

        <Section title="Cookies">
          We use session cookies strictly necessary to keep you logged in. We do not use advertising
          cookies or third-party tracking cookies.
        </Section>

        <Section title="Changes to This Policy">
          We may update this policy from time to time. When we do, we will update the effective date
          above and notify active users by email. Continued use of the platform after changes
          constitutes acceptance of the updated policy.
        </Section>

        <Section title="Contact Us">
          If you have questions about this policy or wish to request data deletion, please email us at{' '}
          <a href="mailto:montessoriengine@gmail.com" style={{ color: colors.navy }}>
            montessoriengine@gmail.com
          </a>.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ color: colors.navy, fontSize: 18, marginBottom: 10, borderBottom: `2px solid var(--color-gold)`, paddingBottom: 6 }}>
        {title}
      </h2>
      <div style={{ color: '#333', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
    </section>
  )
}
