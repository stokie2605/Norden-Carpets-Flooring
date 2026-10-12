import type { ReactNode } from 'react'
import { addressLines, business, links, phones } from '../content/site'
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

export default function TermsPage() {
  return (
    <SiteShell>
      <article className="container-x max-w-3xl py-14 sm:py-20">
        <p className="eyebrow">Terms and conditions</p>
        <h1 className="mt-3 text-section font-extrabold">Our terms for measuring and fitting</h1>
        <p className="mt-4 text-ink-soft">
          Last updated {UPDATED}. These terms apply when you accept a quote from us. They are written in plain English,
          and nothing in them affects your legal rights.
        </p>

        <div className="mt-10">
          <Section title="Who we are">
            <p>{business.legalLine}</p>
            <address className="not-italic">
              <span className="block">{business.name}</span>
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">
                Telephone <a href={phones.showroom.href}>{phones.showroom.display}</a> or{' '}
                <a href={phones.mobile.href}>{phones.mobile.display}</a>
              </span>
              <span className="block">
                Email <a href={`mailto:${business.email}`}>{business.email}</a>
              </span>
            </address>
          </Section>

          <Section title="Measuring and quotes">
            <ul>
              <li>Measuring and quotes are free, and there&apos;s no obligation to go ahead.</li>
              <li>
                Your quote lists the flooring, underlay, fittings and work included. It is valid for 30 days.
              </li>
              <li>
                We work out how much flooring you need from our own measurements. If we get those wrong, we put it right
                at our cost.
              </li>
              <li>
                Sometimes we only find a problem once old flooring is lifted, such as an uneven or damp floor. If that
                happens we will explain it and agree any extra work and cost with you before we do it.
              </li>
            </ul>
          </Section>

          <Section title="Going ahead">
            <p>
              Our agreement starts when you accept your quote, whether you tell us in person, by phone, by email or on
              WhatsApp. We will confirm what you have ordered and your fitting date in writing.
            </p>
          </Section>

          <Section title="Your right to cancel">
            <p>
              If you agree to go ahead anywhere other than our showroom, for example in your home after a measure, or by
              phone, email or WhatsApp, you can cancel within 14 days without giving a reason.
            </p>
            <ul>
              <li>To cancel, just tell us clearly by phone, email or letter. You can use the form below, but you don&apos;t have to.</li>
              <li>We will refund anything you have paid within 14 days of you telling us.</li>
              <li>
                If you want fitting to happen within the 14 days, we will ask you to confirm that in writing. You can
                still cancel, but you will pay for any work already done and for flooring already cut to the size of
                your rooms.
              </li>
            </ul>
            <p>
              If you agree to go ahead in our showroom, this cancellation right doesn&apos;t apply, but your other
              legal rights still do.
            </p>
          </Section>

          <Section title="Cancellation form">
            <p>Copy this into an email or letter if it helps:</p>
            <div className="rounded-2xl border border-line bg-bg-alt p-5 text-ink">
              <p>
                To: {business.name}, {addressLines.join(', ')}. Email: {business.email}
              </p>
              <p className="mt-3">
                I/We hereby give notice that I/We cancel my/our contract for the supply of the following goods and
                service:
              </p>
              <p className="mt-3">Ordered on:</p>
              <p>Name of customer(s):</p>
              <p>Address of customer(s):</p>
              <p>Signature of customer(s) (only if sent on paper):</p>
              <p>Date:</p>
            </div>
          </Section>

          <Section title="Paying">
            <ul>
              <li>We don&apos;t ask for a deposit.</li>
              <li>You pay in full on the day your fitting is finished, once you&apos;re happy with it.</li>
              <li>You can pay by bank transfer, debit or credit card, or cash.</li>
            </ul>
          </Section>

          <Section title="Before fitting day">
            <ul>
              <li>
                Please clear small items, ornaments and breakables from the rooms. Our team will move most furniture
                for you.
              </li>
              <li>We lift and take away your old flooring, and that&apos;s included in your quote.</li>
              <li>
                Doors sometimes need trimming to clear new flooring. We will tell you beforehand if we think yours will.
              </li>
              <li>If you need to change your fitting date, please give us as much notice as you can.</li>
            </ul>
          </Section>

          <Section title="Our work and your guarantee">
            <ul>
              <li>Every job is fitted by our own team, with reasonable care and skill.</li>
              <li>
                If anything isn&apos;t right with our fitting, tell us and we will come back and put it right. Our
                fitting is guaranteed for 12 months.
              </li>
              <li>Any manufacturer&apos;s guarantee on the flooring itself is passed on to you in full.</li>
              <li>
                Flooring can vary slightly in colour and pattern from showroom samples, because it comes from different
                batches. We will always show you a sample of what we are ordering.
              </li>
            </ul>
            <p>
              Under the Consumer Rights Act 2015, the flooring we supply must be of satisfactory quality, fit for
              purpose and as described, and our work must be carried out with reasonable care and skill. These terms
              never take those rights away.
            </p>
          </Section>

          <Section title="If something goes wrong">
            <p>
              Please tell Dave or Wendy straight away on <a href={phones.showroom.href}>{phones.showroom.display}</a> or
              by email at <a href={`mailto:${business.email}`}>{business.email}</a>. We will reply within 2 working days and do our best to sort it out.
            </p>
            <p>
              If we can&apos;t agree, the Citizens Advice consumer helpline can give you free, independent advice on
              0808 223 1133 or at{' '}
              <a href="https://www.citizensadvice.org.uk/consumer/" target="_blank" rel="noopener noreferrer">
                citizensadvice.org.uk
              </a>
              .
            </p>
          </Section>

          <Section title="Your details">
            <p>
              We only use your details to arrange and carry out your job. Our <a href={links.privacy}>privacy notice</a>{' '}
              explains how we look after them.
            </p>
          </Section>

          <Section title="The law">
            <p>These terms are governed by the law of England and Wales.</p>
          </Section>
        </div>
      </article>
    </SiteShell>
  )
}
