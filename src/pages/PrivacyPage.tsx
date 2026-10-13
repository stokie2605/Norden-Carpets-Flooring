import type { ReactNode } from 'react'
import { addressLines, business, phones } from '../content/site'
import { SiteShell } from '../components/SiteShell'

const UPDATED = '12 October 2026'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-soft [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      <article className="container-x max-w-3xl py-14 sm:py-20">
        <p className="eyebrow">Privacy notice</p>
        <h1 className="mt-3 text-section font-extrabold">How we look after your details</h1>
        <p className="mt-4 text-ink-soft">Last updated {UPDATED}.</p>

        <div className="mt-10">
          <Section title="Who we are">
            <p>
              {business.legalLine} As a sole trader, {business.legalName} is the data controller for the personal
              details you give us through this website, by phone, by email, on WhatsApp or in our showroom.
            </p>
            <address className="not-italic">
              <span className="block">{business.name}</span>
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">
                Telephone <a href={phones.showroom.href}>{phones.showroom.display}</a>
              </span>
              <span className="block">
                Email <a href={`mailto:${business.email}`}>{business.email}</a>
              </span>
            </address>
          </Section>

          <Section title="What we collect and why">
            <p>When you request a free measure we collect:</p>
            <ul>
              <li>your name, phone number and, if you give it, your email address</li>
              <li>your postcode, the type of flooring you are interested in and a preferred visit time</li>
              <li>any notes you choose to add about the job</li>
            </ul>
            <p>
              If you go ahead with a job, we also keep your address, your room measurements, the details of your order
              and any photos of your rooms you send us.
            </p>
            <p>
              We use these details only to contact you, arrange your measure, prepare your quote and carry out the job. We never sell
              your details or use them for marketing.
            </p>
            <p>Under UK data protection law, we rely on these lawful bases:</p>
            <ul>
              <li>
                <strong>Steps before a contract:</strong> you have asked us for a measure and a quote, and we need your
                details to give you one.
              </li>
              <li>
                <strong>Contract:</strong> once you accept a quote, we need your details to fit your flooring and honour
                our guarantee.
              </li>
              <li>
                <strong>Legal obligation:</strong> we must keep invoices and payment records for tax purposes.
              </li>
              <li>
                <strong>Legitimate interests:</strong> keeping the booking form free of spam, counting visits to the
                website without identifying you, and keeping a record of enquiries and jobs so we can answer questions
                about them later.
              </li>
            </ul>
          </Section>

          <Section title="Do you have to give us your details?">
            <p>
              No, but we need your name, phone number and postcode to arrange a measure. Without them we can&apos;t book
              the visit. Your email address and notes are optional.
            </p>
            <p>We don&apos;t make any automated decisions about you. A real person reads every request.</p>
          </Section>

          <Section title="Who processes your details for us">
            <ul>
              <li>
                <strong>Cloudflare</strong> hosts this website and runs the booking form. Cloudflare Turnstile checks
                that the form is being used by a person rather than a bot, which involves processing your IP address and
                browser signals. Cloudflare Web Analytics counts visits without cookies and without identifying you.
              </li>
              <li>
                <strong>Resend</strong> delivers your form submission to our inbox by email. Resend is based in the
                United States, so your details are transferred outside the UK. That transfer is protected by the
                safeguards in Resend&apos;s data processing agreement, such as the UK International Data Transfer
                Addendum to the EU Standard Contractual Clauses.
              </li>
              <li>
                <strong>Google</strong> provides our email inbox, where your request is stored once it arrives.
              </li>
            </ul>
            <p>
              Cloudflare and Google are based in the United States and may process your details outside the UK. Both
              protect these transfers with safeguards approved under UK law, including the UK Extension to the EU-US
              Data Privacy Framework.
            </p>
          </Section>

          <Section title="Directions">
            <p>
              The &ldquo;Get directions&rdquo; button opens Google Maps in a new tab. Nothing is sent to Google unless
              you tap it, and from then on the{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>{' '}
              applies.
            </p>
          </Section>

          <Section title="WhatsApp and Facebook">
            <p>
              If you message us on WhatsApp or visit our Facebook page, Meta handles that information under its own
              privacy terms. We only use what you send us to answer your enquiry.
            </p>
          </Section>

          <Section title="How long we keep your details">
            <ul>
              <li>If your enquiry doesn&apos;t go ahead, we delete your details after one month.</li>
              <li>
                If we do the job, we keep your contact and job details until it&apos;s finished and paid for and our 12
                month fitting guarantee has ended, then delete them.
              </li>
              <li>We keep invoices and payment records for as long as HMRC requires.</li>
            </ul>
          </Section>

          <Section title="Your rights">
            <p>Under UK data protection law you can ask us to:</p>
            <ul>
              <li>give you a copy of the details we hold about you</li>
              <li>correct anything that is wrong</li>
              <li>delete your details</li>
              <li>limit how we use them</li>
              <li>send them to you, or to another company, in a common digital format (data portability)</li>
            </ul>
            <p>
              You can also object at any time to us using your details for our legitimate interests, and we will stop
              unless we have a strong reason to carry on, such as dealing with a legal claim.
            </p>
            <p>
              To do any of this, email <a href={`mailto:${business.email}`}>{business.email}</a> or call{' '}
              <a href={phones.showroom.href}>{phones.showroom.display}</a>. It&apos;s free, and we will reply within one
              month.
            </p>
            <p>
              If you are unhappy with how we have handled your details, please tell us first so we can put it right.
              You can also complain to the Information
              Commissioner&apos;s Office at{' '}
              <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                ico.org.uk
              </a>{' '}
              or on 0303 123 1113.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              This website does not set cookies of its own, and Cloudflare Web Analytics is cookieless. Turnstile may set
              cookies when you use the booking form. They are strictly necessary to protect the form from spam, so we
              don&apos;t ask for consent for them.
            </p>
          </Section>
        </div>
      </article>
    </SiteShell>
  )
}
