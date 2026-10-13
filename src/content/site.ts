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
  terms: '/terms',
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

export const team = [
  { name: 'Dave', role: 'Fitter' },
  { name: 'Tom', role: 'Fitter' },
  { name: 'Jake', role: 'Fitter' },
  { name: 'Wendy', role: 'Admin' },
] as const

export type MaterialId = 'carpets' | 'lvt' | 'laminate'

// Customer reviews are copied word for word from our Facebook and Google pages. Cut only with "...", never reword.
// No customer names anywhere: each review shows only where it came from. Only our own team are named.
export type Review = { quote: string; source?: 'facebook' | 'google' }

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
    image: 'tab-carpets-03',
    imageAlt: 'Neutral flecked carpet fitted across a living room and round two curved bottom steps',
    review: {
      quote: 'Very happy with our gorgeous carpet. Very good value and quality and a brilliant service from start to finish.',
    },
  },
  {
    id: 'lvt',
    label: 'Vinyl',
    headline: 'Vinyl that looks like wood or tile',
    pitch:
      "It's waterproof and easy to wipe clean, so it's ideal where things get messy. Choose wood effect planks or patterned tiles like these, all laid by our own fitters.",
    bestFor: ['Kitchens', 'Bathrooms', 'Open plan living'],
    image: 'tab-vinyl-03',
    imageAlt: 'Grey and white patterned tile effect vinyl fitted across a bathroom floor, round the toilet and up to the shower',
    review: { quote: 'Excellent service, love my new carpet and lino, thankyou.' },
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
    },
  },
]

export const proof = {
  rating: '96%',
  ratingLabel: 'recommend us on Facebook',
  ratingSource: 'Based on 24 Facebook reviews',
  google: {
    rating: '4.9',
    label: 'out of 5 on Google',
    source: 'Based on 19 Google reviews',
  },
  featured: {
    quote:
      'Fitted our whole house with carpets and laminate flooring, looks amazing. Really happy with the results, definitely recommend and will use them again!',
    detail: 'Facebook review',
  },
  // Strongest first: on phones these are a swipe row, so the best ones are seen first.
  reviews: [
    {
      quote:
        "Great service and advice on picking the perfect carpet... They even chopped up the old one and put it in my car so I could take it to the dump. I'm definitely using Norden Carpets again.",
      source: 'google',
    },
    {
      quote:
        'Professional and friendly service. Carpets laid and are fabulous. Thank you Dave, you went over and above, kept me in the loop every step of the way',
    },
    {
      quote:
        'Absolutely amazing carpets and fitting! We had our lounge, hall, stairs and landing carpeted and it looks fabulous!',
    },
    {
      quote: 'Excellent friendly service from all at norden carpets. Very happy with the finish and quality.',
      source: 'google',
    },
    {
      quote: 'I have had many carpets from Dave over the years and he has always done a great job...',
    },
    {
      quote: 'Good selection no pushy staff a hassle free experience and very helpful worth a visit to get a new carpet or flooring',
      source: 'google',
    },
  ] as readonly Review[],
} as const

// Real installation photos from the team only. Shown in the Our work slideshow.
// One photo per job, and none of these may appear anywhere else on the page.
// Full room shots come first, then stairs, landings and smaller rooms.
// width and height are the photo's real shape, so it is always shown whole.
export const installations: readonly { image: string; alt: string; caption: string; width: number; height: number }[] = [
  {
    image: 'work-oak-lounge-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Natural oak effect laminate fitted across a bright living room',
    caption: 'Oak laminate, living room',
  },
  {
    image: 'work-dining-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Light oak effect laminate fitted through a long dining room',
    caption: 'Oak laminate, dining room',
  },
  {
    image: 'work-lounge-laminate-02',
    width: 1024,
    height: 768,
    alt: 'Grey wood effect laminate fitted across a living room with a fireplace',
    caption: 'Wood effect laminate, lounge',
  },
  {
    image: 'work-feature-wall-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Grey oak effect laminate fitted across a living room with a feature wall',
    caption: 'Grey laminate, lounge',
  },
  {
    image: 'work-kitchen-laminate-02',
    width: 1024,
    height: 1365,
    alt: 'Wood effect laminate fitted through a kitchen with an island',
    caption: 'Wood effect laminate, kitchen',
  },
  {
    image: 'work-grey-lounge-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Grey oak effect laminate fitted across a living room',
    caption: 'Grey laminate, living room',
  },
  {
    image: 'work-garden-room-01',
    width: 1024,
    height: 1365,
    alt: 'Dark oak effect laminate fitted in a garden room with patio doors',
    caption: 'Dark oak laminate, garden room',
  },
  {
    image: 'work-hallway-transition-01',
    width: 1024,
    height: 1365,
    alt: 'Oak effect laminate hallway floor with carpeted stairs and a patterned vinyl doorway',
    caption: 'Oak laminate, hallway',
  },
  {
    image: 'work-leopard-carpet-01',
    width: 1024,
    height: 1360,
    alt: 'Leopard print carpet fitted up a staircase and across the landing',
    caption: 'Leopard print stairs and landing',
  },
  {
    image: 'work-cream-carpet-01',
    width: 1024,
    height: 1820,
    alt: 'Cream carpet fitted along a landing and down the stairs, with oak and black spindles',
    caption: 'Cream carpet, stairs and landing',
  },
  {
    image: 'work-stair-runner-01',
    width: 768,
    height: 1024,
    alt: 'Beige carpet fitted up a staircase with black painted edges',
    caption: 'Stair carpet, painted edges',
  },
  {
    image: 'work-stairs-carpet-02',
    width: 1024,
    height: 1365,
    alt: 'Black and white chevron carpet fitted across a landing',
    caption: 'Chevron carpet, landing',
  },
  {
    image: 'work-cloakroom-vinyl-01',
    width: 1024,
    height: 1365,
    alt: 'Wood effect vinyl fitted in a narrow cloakroom',
    caption: 'Wood effect vinyl, cloakroom',
  },
  {
    image: 'work-utility-vinyl-01',
    width: 1024,
    height: 1820,
    alt: 'Grey patterned tile effect vinyl fitted across a utility room floor',
    caption: 'Patterned vinyl, utility room',
  },
]

// Headings, intros and button labels used across the page.
export const copy = {
  hero: {
    eyebrow: 'Family run business',
    titleStart: 'Welcome to',
    titleAccent: 'Norden Carpets & Flooring.',
    intro:
      "Hi, we're Dave and Wendy. We've been fitting floors across Rochdale for over 30 years, and every job is fitted by our own team: Dave, Tom and Jake.",
    reassurance: "Measuring and quotes are free, and there's no obligation.",
    ctaBook: 'Book a free measurement',
    ctaCall: 'Call',
    trustFitters: 'Our own fitters',
    trustShowroom: 'Showroom at Tenterhouse Mill',
    imageAlt: 'Grey oak flooring fitted across a room with glazed doors',
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
    intro: "Floors we've fitted in homes around Rochdale. Swipe through, or tap a photo to see it full size.",
    openPhoto: 'See full size:',
    empty: 'New installation photos coming soon.',
    slideshowLabel: 'Photos of recent jobs',
    previous: 'Previous photo',
    next: 'Next photo',
    close: 'Close',
    of: 'of',
  },
  team: {
    title: 'Meet the team.',
    intro: "We're a small family team. You'll deal with the same people from your first call to the fit.",
    review: { quote: 'Such a lovely, super friendly team.' },
  },
  reviews: {
    reviewSource: 'Facebook review',
    googleSource: 'Google review',
    facebookLink: 'Read our reviews',
    eyebrow: 'Reviews',
    title: 'What our customers say.',
  },
  showroom: {
    eyebrow: 'Showroom',
    title: 'Come and see us at Tenterhouse Mill.',
    coverage: 'Free home measures across Rochdale and Greater Manchester.',
    vanAlt: 'The Norden Carpets & Flooring van, with our name and phone number on the side',
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
    'Carpets, vinyl, laminate and underlay, supplied and fitted across Rochdale and Greater Manchester. Family run for over 30 years, with our own fitters. Book a free measure.',
} as const
