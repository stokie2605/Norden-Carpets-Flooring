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
  email: 'norden.carpetsandflooring@gmail.com',
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
} as const

export const addressLines = [
  business.address.unit,
  business.address.street,
  `${business.address.locality}, ${business.address.town}`,
  business.address.postcode,
] as const

export const hours = [
  { days: 'Monday to Friday', time: '09:00 to 16:00' },
  { days: 'Saturday', time: '09:00 to 12:00' },
  { days: 'Sunday', time: 'Closed' },
] as const

export const towns = ['Norden', 'Bamford', 'Birtle', 'Edenfield', 'Ramsbottom', 'Rochdale'] as const

export const team = [
  { name: 'Dave', role: 'Fitter' },
  { name: 'Tom', role: 'Fitter' },
  { name: 'Jake', role: 'Fitter' },
  { name: 'Wendy', role: 'Admin' },
] as const

export const nav = [
  { label: 'Flooring', href: '#flooring' },
  { label: 'Our work', href: '#work' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Showroom', href: '#showroom' },
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
    headline: 'Carpets that feel good and last',
    pitch:
      'Twists, loops, saxonies and stain resistant polypropylene from leading UK mills. Optional underlay, grippers, and door bars can be supplied and fitted with your carpet by our own team.',
    bestFor: ['Bedrooms', 'Lounges', 'Stairs and landings'],
    image: 'tab-carpets',
    imageAlt: 'Neutral carpet runner and landing fitted to stairs',
    review: {
      quote: 'Very happy with our gorgeous carpet. Very good value and quality and a brilliant service from start to finish.',
      author: 'Caroline',
    },
  },
  {
    id: 'lvt',
    label: 'Vinyl',
    headline: 'Luxury vinyl and herringbone',
    pitch:
      'The look of real wood or stone, waterproof and easy to keep clean. Laid as planks, tiles or herringbone patterns by our own fitters on a prepared subfloor.',
    bestFor: ['Kitchens', 'Bathrooms', 'Open plan living'],
    image: 'tab-vinyl',
    imageAlt: 'Geometric patterned vinyl flooring fitted neatly in a bathroom',
    review: { quote: 'Excellent service, love my new carpet and lino, thankyou.', author: 'Joanne' },
  },
  {
    id: 'laminate',
    label: 'Laminate',
    headline: 'Smart wood effect built for busy rooms',
    pitch:
      'Hard wearing click laminate with realistic wood grain. Fitted on acoustic underlay so rooms stay quiet, and neatly edged with matching beading.',
    bestFor: ['Living rooms', 'Dining rooms', 'Rental properties'],
    image: 'tab-laminate',
    imageAlt: 'Wide plank light oak laminate flooring fitted in an open hallway',
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
    alt: 'Close up of a black and white chevron carpet runner fitted to stairs and landing',
    caption: 'Chevron stair runner and landing',
  },
  {
    image: 'work-herringbone-01',
    alt: 'Oak herringbone luxury vinyl flooring fitted across a living room',
    caption: 'Oak herringbone LVT',
  },
  {
    image: 'work-kitchen-laminate-01',
    alt: 'Open plan modern kitchen fitted with wide plank wood effect flooring around an island',
    caption: 'Open plan kitchen and diner',
  },
  {
    image: 'work-lounge-laminate-02',
    alt: 'Light grey laminate flooring fitted in a living room with bay window',
    caption: 'Grey oak laminate in lounge',
  },
  {
    image: 'work-hallway-transition-01',
    alt: 'Oak laminate hallway floor meeting carpeted stairs and patterned vinyl doorway threshold',
    caption: 'Hallway with multi-floor transitions',
  },
  {
    image: 'work-garden-room-01',
    alt: 'Rustic oak laminate flooring fitted in a bright sunroom with bifold doors',
    caption: 'Sunroom with bifold doors',
  },
]

// Headings, intros and button labels used across the page.
export const copy = {
  hero: {
    eyebrow: `Family run in Norden, Rochdale, for ${business.yearsInTrade} years`,
    titleStart: 'Welcome to',
    titleAccent: 'Norden Carpets & Flooring.',
    intro:
      "Hi, we're Dave and Wendy. We've been fitting floors across Rochdale for over 30 years. Dave, Tom and Jake do the fitting, and Wendy helps with admin.",
    reassurance: "Measuring and quotes are free, and there's no obligation.",
    badge: 'Our own fitters',
    badgeBody: 'Dave, Tom and Jake do the fitting, and Wendy helps with admin.',
    imageAlt: 'Grand double-flight staircase with neutral patterned carpet runner and wooden balustrade',
  },
  cta: {
    bookShort: 'Free measure',
    callShort: 'Call us',
    whatsapp: 'WhatsApp us',
    whatsappFloating: 'Message us on WhatsApp',
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
    eyebrow: 'Reviews',
    title: 'What our customers say.',
  },
  showroom: {
    eyebrow: 'Showroom and areas we cover',
    title: 'Come and see us at Tenterhouse Mill.',
    intro: "We do free home measures within about 25km of our Norden showroom.",
    mapPin: 'Norden showroom',
    mapRadius: 'About 25km',
  },
  footer: {
    blurb: 'Carpets, vinyl, laminate and underlay, supplied and fitted by our own team.',
  },
} as const

export const seo = {
  title: 'Carpets & Flooring in Rochdale | Norden Carpets & Flooring',
  description:
    'Carpets, vinyl, laminate and underlay, supplied and fitted across Rochdale and Ramsbottom. Family run for over 30 years, with our own fitters. Book a free measure.',
} as const
