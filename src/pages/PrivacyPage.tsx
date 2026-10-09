import type { ReactNode } from 'react'
import { addressLines, business, phones } from '../content/site'
import { SiteShell } from '../components/SiteShell'

const UPDATED = '7 October 2026'

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
              {business.name} is run by {business.proprietors}. We are the data controller for the personal details you
              give us through this website.
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
              We use these details only to contact you, arrange your measure and prepare your quotation. Our lawful bases
              are your consent, given when you submit the form, and taking steps at your request before entering into a
              contract with you. We never sell your details or use them for marketing.
            </p>
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
          </Section>

          <Section title="Maps">
            <p>
              The map in our showroom section is built from OpenStreetMap images. To show them, your browser sends
              your IP address to the OpenStreetMap Foundation, which uses it only to deliver the map, under the{' '}
              <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">
                OpenStreetMap privacy policy
              </a>
              .
            </p>
            <p>
              The interactive Google map only loads if you tap
              &ldquo;Show interactive map&rdquo;. Once loaded, Google receives your IP address and device information
              and may set cookies, under the{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
              . If you never tap the button, nothing is sent to Google from that section.
            </p>
          </Section>

          <Section title="WhatsApp and Facebook">
            <p>
              If you message us on WhatsApp or visit our Facebook page, Meta handles that information under its own
              privacy terms. We only use what you send us to answer your enquiry.
            </p>
          </Section>

          <Section title="How long we keep your details">
            <p>TODO_CONFIRM retention period for enquiries that do not go ahead and for completed jobs.</p>
          </Section>

          <Section title="Your rights">
            <p>
              Under UK data protection law you can ask to see the details we hold about you, ask us to correct or delete
              them, object to or restrict how we use them, and withdraw your consent at any time. Email{' '}
              <a href={`mailto:${business.email}`}>{business.email}</a> and we will reply within one month.
            </p>
            <p>
              If you are unhappy with how we have handled your details, you can complain to the Information
              Commissioner&apos;s Office at{' '}
              <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                ico.org.uk
              </a>{' '}
              or on 0303 123 1113.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              This website does not set cookies of its own, and Cloudflare Web Analytics is cookieless. Cookies may only
              be set by Turnstile when you use the booking form, or by Google if you choose to load the interactive map.
            </p>
          </Section>
        </div>
      </article>
    </SiteShell>
  )
}
