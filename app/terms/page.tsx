import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'sans-serif' }}>
      <TopBar />

      <div style={{ maxWidth: 720, margin: '50px auto', padding: '0 24px 80px' }}>
        <h1 style={{ color: colors.navy, marginBottom: 4 }}>Terms of Service</h1>
        <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 0, marginBottom: 40 }}>
          Effective date: June 26, 2026
        </p>

        <Section title="Acceptance of Terms">
          By creating an account or using Montessori Engine ("the Service"), you agree to be bound
          by these Terms of Service. If you do not agree to these terms, do not use the Service.
          These terms constitute a binding agreement between you (or the school you represent) and
          Montessori Engine.
        </Section>

        <Section title="Free Trial">
          New accounts receive a <strong>30-day free trial</strong> with full access to all features.
          No credit card is required to start your trial. At the end of the trial period, your account
          will be paused unless you add a payment method and subscribe. Your data is preserved during
          a paused account for 30 days.
        </Section>

        <Section title="Subscription and Pricing">
          After the free trial, the Service is billed at <strong>$200 per month</strong> per school.
          This flat rate covers unlimited teachers and classrooms within a single school location.
          Billing is charged monthly to the payment method on file. All prices are in USD. We reserve
          the right to change pricing with 60 days' written notice to active subscribers.
        </Section>

        <Section title="Payment">
          Payments are processed securely through our payment provider. Your payment information is
          never stored on Montessori Engine servers. Invoices are issued at the start of each billing
          cycle. If a payment fails, we will retry up to three times over seven days and notify you
          by email. Accounts with failed payments will be suspended after the retry period.
        </Section>

        <Section title="Cancellation">
          You may cancel your subscription at any time from your account settings or by contacting
          support. Cancellation takes effect at the end of the current billing period — you will not
          be charged for the following month. We do not offer prorated refunds for partial months.
          After cancellation, your account and data remain accessible until the end of the paid period,
          then enter a 30-day grace period for data export before permanent deletion.
        </Section>

        <Section title="Data Ownership">
          You own your data. All content you create in Montessori Engine — including activities,
          observations, student records, and lesson plans — belongs to you and your school. We do
          not claim any intellectual property rights over your content. You may export your data at
          any time. Upon account deletion, your data is permanently removed from our systems within
          30 days.
        </Section>

        <Section title="Acceptable Use">
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You may not:</p>
          <ul>
            <li>Use the Service to store or transmit unlawful, harmful, or offensive content.</li>
            <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure.</li>
            <li>Resell or sublicense access to the Service without written permission.</li>
            <li>Use the Service in a way that violates FERPA or other applicable education privacy laws.</li>
            <li>Attempt to circumvent, disable, or exceed rate limits or other technical restrictions put in place to prevent abuse.</li>
            <li>Use automated means (bots, scripts, scrapers) to interact with the Service outside of its documented APIs.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service or the data it contains.</li>
          </ul>
          <p>
            Repeated rate limit violations or other abusive activity may result in temporary throttling,
            suspension, or permanent termination of your account, at our discretion and without prior
            notice where necessary to protect the Service or other users. We will make reasonable efforts
            to notify you of enforcement action taken against your account except where doing so would
            undermine our ability to prevent abuse.
          </p>
        </Section>

        <Section title="Service Availability">
          We strive for high availability but do not guarantee uninterrupted access to the Service.
          Planned maintenance will be communicated in advance where possible. We are not liable for
          any damages resulting from downtime or service interruptions.
        </Section>

        <Section title="Limitation of Liability">
          To the maximum extent permitted by applicable law, Montessori Engine shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages, including loss
          of data or profits, arising out of or related to your use of the Service. Our total
          liability to you for any claim shall not exceed the fees you paid in the three months
          preceding the claim.
        </Section>

        <Section title="Changes to These Terms">
          We may update these Terms from time to time. We will notify active subscribers by email
          at least 30 days before material changes take effect. Continued use of the Service after
          the effective date of changes constitutes acceptance of the updated Terms.
        </Section>

        <Section title="Contact">
          For questions about these Terms, contact us at{' '}
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
