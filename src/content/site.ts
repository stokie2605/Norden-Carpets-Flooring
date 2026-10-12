// Single source of truth for every piece of client copy and business data.
// Anything still to be confirmed by the client is marked TODO_CONFIRM.
// The production build (CF_PAGES_BRANCH=main) fails while any marker reaches dist/.

export const business = {
  name: 'Norden Carpets & Flooring',
  proprietors: 'David & Wendy Wilshaw',
  // Sole trader, not VAT registered, so no company or VAT number to show.
  legalName: 'David Wilshaw',
  legalLine: 'Norden Carpets & Flooring is the trading name of David Wilshaw, sole trader.',
  yearsInTrade: '30+',
  email: 'norden.carpetsflooring@gmail.com',
  address: {
    unit: 'Unit 4, Tenterhouse Mill',
    street: 'Greenbooth Road',
    locality: 'Norden',
    town: 'Rochdale',
    postcode: 'OL12 7TD',
    country: 'GB',
  },
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Tenterhouse+Mill%2C+Greenbooth+Road%2C+Norden%2C+Rochdale+OL12+7TD',
} as const

export const phones = {
  showroom: { label: 'Showroom', display: '01706 659 962', href: 'tel:+441706659962' },
  mobile: { label: 'Mobile', display: '07904 322 879', href: 'tel:+447904322879' },
} as const

export const links = {
  whatsapp:
    "https://wa.me/447904322879?text=Hi%20Dave%20and%20Wendy,%20I'd%20like%20to%20send%20some%20room%20photos%20for%20a%20flooring%20quote.",
  facebook: 'https://www.facebook.com/nordencarpetsandflooring',
  privacy: '/privacy',
  designer: 'https://www.designsystemsweb.co.uk/',
} as const

export const addressLines = [
  business.address.unit,
  business.address.street,
  `${business.address.locality}, ${business.address.town}`,
  business.address.postcode,
] as const

export const hours = [
  { days: 'Monday to Friday', time: '9am to 4pm' },
  { days: 'Saturday', time: '9am to 12pm' },
  { days: 'Sunday', time: 'Closed' },
] as const

export const towns = ['Norden', 'Bamford', 'Birtle', 'Edenfield', 'Ramsbottom', 'Rochdale'] as const

export const team = [
  { name: 'Dave', role: 'Fitter' },
  { name: 'Tom', role: 'Fitter' },
  { name: 'Jake', role: 'Fitter' },
  { name: 'Wendy', role: 'Admin' },
] as const

export type MaterialId = 'carpets' | 'lvt' | 'laminate'

// Customer reviews are copied word for word from our Facebook page. Cut only with "...", never reword.
export type Review = { quote: string; author: string }

export type Material = {
  id: MaterialId
  label: string
  headline: string
  pitch: string
  bestFor: readonly string[]
  image: string
  imageAlt: string
  review?: Review
}

export const materials: readonly Material[] = [
  {
    id: 'carpets',
    label: 'Carpets',
    headline: 'Soft, cosy carpets for every room',
    pitch:
      'Pop into the showroom to feel the samples and pick your colour. We can supply and fit the underlay, grippers and door bars too, all done by our own team.',
    bestFor: ['Bedrooms', 'Lounges', 'Stairs and landings'],
    image: 'tab-carpets-02',
    imageAlt: 'Cream herringbone carpet fitted on a staircase and landing with oak handrails',
    review: {
      quote: 'Very happy with our gorgeous carpet. Very good value and quality and a brilliant service from start to finish.',
      author: 'Caroline',
    },
  },
  {
    id: 'lvt',
    label: 'Vinyl',
    headline: 'Vinyl that looks like wood or tile',
    pitch:
      "It's waterproof and easy to wipe clean, so it's ideal where things get messy. Choose wood effect planks or patterned tiles like these, all laid by our own fitters.",
    bestFor: ['Kitchens', 'Bathrooms', 'Open plan living'],
    image: 'tab-vinyl-02',
    imageAlt: 'Grey and white patterned tile effect vinyl fitted in a bathroom',
    review: { quote: 'Excellent service, love my new carpet and lino, thankyou.', author: 'Joanne' },
  },
  {
    id: 'laminate',
    label: 'Laminate',
    headline: 'Wood effect laminate for busy homes',
    pitch:
      'Hard wearing laminate with a realistic wood look, made for busy family rooms. We finish every edge neatly with matching beading.',
    bestFor: ['Living rooms', 'Dining rooms', 'Rental properties'],
    image: 'tab-laminate',
    imageAlt: 'Rustic oak laminate flooring fitted through a lounge into the dining room',
    review: {
      quote: 'So so happy with the service and the end result. Such good quality flooring.',
      author: 'Hannah',
    },
  },
]

export const proof = {
  rating: '96%',
  ratingLabel: 'recommend us on Facebook',
  ratingSource: 'Based on 24 Facebook reviews',
  highlights: [
    `${business.yearsInTrade} years fitting floors in Rochdale`,
    'Free measure and quote, no obligation',
    'Every job fitted by our own team',
  ],
  featured: {
    quote:
      'Fitted our whole house with carpets and laminate flooring, looks amazing. Really happy with the results, definitely recommend and will use them again!',
    author: 'Charlotte',
    detail: 'Facebook review',
  },
  reviews: [
    {
      quote:
        'Professional and friendly service. Carpets laid and are fabulous. Thank you Dave, you went over and above, kept me in the loop every step of the way',
      author: 'Lesley',
    },
    {
      quote:
        'Absolutely amazing carpets and fitting! We had our lounge, hall, stairs and landing carpeted and it looks fabulous!',
      author: 'Amy',
    },
    {
      quote: 'I have had many carpets from Dave over the years and he has always done a great job...',
      author: 'Rebecca',
    },
  ] as readonly Review[],
} as const

// Real installation photos from the team only. Shown in the Our work section.
export const installations: readonly { image: string; alt: string; caption: string }[] = [
  {
    image: 'work-stairs-carpet-02',
    alt: 'Black and white chevron carpet fitted across a landing',
    caption: 'Black and white chevron carpet on a landing',
  },
  {
    image: 'work-hallway-transition-01',
    alt: 'Oak effect laminate hallway floor with carpeted stairs and a patterned vinyl doorway',
    caption: 'Oak effect laminate in a hallway, with carpet on the stairs',
  },
  {
    image: 'work-hall-carpet-01',
    alt: 'Neutral carpet fitted across a living room and up two curved bottom steps',
    caption: 'Carpet in a living room, fitted round curved steps',
  },
  {
    image: 'work-kitchen-laminate-01',
    alt: 'Wood effect laminate flooring fitted through a kitchen',
    caption: 'Wood effect laminate in a kitchen',
  },
]

// Headings, intros and button labels used across the page.
export const copy = {
  hero: {
    eyebrow: `Family run in Norden, Rochdale, for ${business.yearsInTrade} years`,
    titleStart: 'Welcome to',
    titleAccent: 'Norden Carpets & Flooring.',
    intro:
      "Hi, we're Dave and Wendy. We've been fitting floors across Rochdale for over 30 years, and every job is fitted by our own team: Dave, Tom and Jake.",
    reassurance: "Measuring and quotes are free, and there's no obligation.",
    ctaBook: 'Book a free measure',
    ctaCall: 'Call',
    trustFitters: 'Our own fitters',
    trustShowroom: 'Showroom at Tenterhouse Mill',
    imageAlt: 'Grey oak herringbone flooring fitted across a room with glazed doors',
  },
  cta: {
    bookShort: 'Free measure',
    callShort: 'Call us',
    whatsapp: 'WhatsApp us',
    backToTop: 'Back to top',
    directions: 'Get directions',
  },
  flooring: {
    eyebrow: 'Flooring',
    title: 'Floors for every room and every budget.',
    intro: "Pop into the showroom to see samples. You'll get an exact quote after a free home measure.",
  },
  work: {
    eyebrow: 'Our work',
    title: 'Some of our recent jobs.',
    intro: "Floors we've fitted in homes around Rochdale.",
    empty: 'New installation photos coming soon.',
  },
  team: {
    title: 'Meet the team.',
    intro: "We're a small family team. You'll deal with the same people from your first call to the fit.",
    review: { quote: 'Such a lovely, super friendly team.', author: 'Amy' },
  },
  reviews: {
    reviewSource: 'Facebook review',
    facebookLink: 'Read our reviews',
    eyebrow: 'Reviews',
    title: 'What our customers say.',
  },
  showroom: {
    eyebrow: 'Showroom and areas we cover',
    title: 'Come and see us at Tenterhouse Mill.',
    intro: "We do free home measures within about 15 miles of our Norden showroom.",
    areasTitle: 'Areas we cover',
    mapPin: 'Norden showroom',
    mapRadius: 'About 15 miles',
    mapLabel: 'Map of the areas we cover: about 15 miles around our Norden showroom.',
  },
  footer: {
    blurb: 'Carpets, vinyl, laminate and underlay, supplied and fitted by our own team.',
    facebook: 'Facebook',
    designedBy: 'Website designed by',
    designerName: 'Design Systems Web',
  },
} as const

export const seo = {
  title: 'Carpets & Flooring in Rochdale | Norden Carpets & Flooring',
  description:
    'Carpets, vinyl, laminate and underlay, supplied and fitted across Rochdale and Ramsbottom. Family run for over 30 years, with our own fitters. Book a free measure.',
} as const
