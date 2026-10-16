// Single source of truth for every piece of client copy and business data.
// Anything still to be confirmed by the client is marked TODO_CONFIRM.
// The production build (CF_PAGES_BRANCH=main) fails while any marker reaches dist/.

export const business = {
  name: 'Norden Carpets & Flooring',
  proprietors: 'David & Wendy Wilshaw',
  // Sole trader, not VAT registered, so no company or VAT number to show.
  legalName: 'David Wilshaw',
  legalLine: 'Norden Carpets & Flooring is the trading name of David Wilshaw, sole trader.',
  yearsInTrade: '45+',
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
  showroom: { label: 'Showroom', display: '01706 659962', href: 'tel:+441706659962' },
  mobile: { label: 'Mobile', display: '07904 322879', href: 'tel:+447904322879' },
} as const

export const links = {
  whatsapp:
    "https://wa.me/447904322879?text=Hi%20Dave%20and%20Wendy,%20I'd%20like%20to%20send%20some%20room%20photos%20for%20a%20flooring%20quote.",
  facebook: 'https://www.facebook.com/nordencarpetsandflooring',
  googleReviews: 'https://www.google.com/search?q=norden+carpets',
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
  { days: 'Monday to Friday', time: '9am to 4:30pm' },
  { days: 'Saturday', time: '9am to 12pm' },
  { days: 'Sunday', time: 'Closed' },
] as const

export const team = [
  { name: 'Dave', role: 'Owner' },
  { name: 'Wendy', role: 'Owner' },
  { name: 'Tom', role: 'Fitter' },
  { name: 'Jake', role: 'Fitter' },
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

// Real installation photos from the team only. Shown in the Our work grid and full size viewer.
// One photo per job, and none of these may appear anywhere else on the page.
// The grid shows the first four, so add new jobs to the top. The viewer shows them all.
// width and height are the photo's real shape, so it is always shown whole.
export const installations: readonly { image: string; alt: string; caption: string; width: number; height: number }[] = [
  {
    image: 'work-grey-bedroom-02',
    width: 1024,
    height: 1365,
    alt: 'Soft grey carpet fitted across a bedroom with a white wooden bed',
    caption: 'Bedroom',
  },
  {
    image: 'work-oatmeal-lounge-01',
    width: 1024,
    height: 1365,
    alt: 'Oatmeal carpet fitted across a living room with a dining table by the window',
    caption: 'Living room',
  },
  {
    image: 'work-herringbone-carpet-stairs-01',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted up a staircase with dark wood spindles',
    caption: 'Stairs',
  },
  {
    image: 'work-leopard-carpet-01',
    width: 1024,
    height: 1360,
    alt: 'Leopard print carpet fitted up a staircase and across the landing',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-plum-bedroom-01',
    width: 900,
    height: 1600,
    alt: 'Plum carpet fitted across a bedroom with built in grey wardrobes and a dressing table',
    caption: 'Bedroom',
  },
  {
    image: 'work-chevron-stairs-02',
    width: 1024,
    height: 1365,
    alt: 'Black and white chevron carpet fitted up a staircase with white spindles',
    caption: 'Stairs',
  },
  {
    image: 'work-striped-bedroom-01',
    width: 1024,
    height: 1365,
    alt: 'Freshly fitted grey carpet across a bedroom floor',
    caption: 'Bedroom',
  },
  {
    image: 'work-cream-carpet-01',
    width: 1024,
    height: 1820,
    alt: 'Cream carpet fitted along a landing and down the stairs, with oak and black spindles',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-grey-hall-carpet-01',
    width: 1024,
    height: 768,
    alt: 'Grey carpet fitted across a hallway and up the first stairs',
    caption: 'Hallway and stairs',
  },
  {
    image: 'work-grey-chevron-stairs-01',
    width: 1024,
    height: 1365,
    alt: 'Grey chevron carpet fitted up a long straight staircase',
    caption: 'Stairs',
  },
  {
    image: 'work-bedroom-carpet-01',
    width: 819,
    height: 2000,
    alt: 'Mink carpet fitted across a bedroom',
    caption: 'Bedroom',
  },
  {
    image: 'work-stair-runner-01',
    width: 768,
    height: 1024,
    alt: 'Beige carpet fitted up a staircase with black painted edges',
    caption: 'Stairs',
  },
  {
    image: 'work-grey-landing-01',
    width: 1024,
    height: 1365,
    alt: 'Grey carpet fitted along a landing with cream spindles',
    caption: 'Landing',
  },
  {
    image: 'work-speckled-stairs-01',
    width: 1024,
    height: 1365,
    alt: 'Speckled oatmeal carpet fitted up a long staircase',
    caption: 'Stairs',
  },
  {
    image: 'work-grey-bedroom-01',
    width: 1024,
    height: 1365,
    alt: 'Grey carpet fitted across a bedroom with a white bed frame',
    caption: 'Bedroom',
  },
  {
    image: 'work-dark-chevron-stairs-01',
    width: 712,
    height: 1600,
    alt: 'Brown and cream chevron carpet fitted up a narrow staircase',
    caption: 'Stairs',
  },
  {
    image: 'work-herringbone-carpet-hall-01',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted through a long hallway to the stairs',
    caption: 'Hallway',
  },
  {
    image: 'work-oatmeal-stairs-01',
    width: 768,
    height: 1024,
    alt: 'Oatmeal carpet fitted up a staircase with a turn at the bottom',
    caption: 'Stairs',
  },
  {
    image: 'work-stairs-carpet-02',
    width: 1024,
    height: 1365,
    alt: 'Black and white chevron carpet fitted across a landing',
    caption: 'Landing',
  },
  {
    image: 'work-grey-landing-02',
    width: 1024,
    height: 1365,
    alt: 'Grey carpet fitted along a narrow landing',
    caption: 'Landing',
  },
  {
    image: 'work-leopard-stairs-02',
    width: 1024,
    height: 1360,
    alt: 'Leopard print carpet fitted up a staircase with black spindles',
    caption: 'Stairs',
  },
  {
    image: 'work-plum-bedroom-02',
    width: 1024,
    height: 576,
    alt: 'Plum carpet fitted across a bedroom with grey fitted wardrobes',
    caption: 'Bedroom',
  },
  {
    image: 'work-beige-stairs-01',
    width: 768,
    height: 1024,
    alt: 'Beige carpet fitted up a straight staircase',
    caption: 'Stairs',
  },
  {
    image: 'work-striped-bedroom-02',
    width: 1024,
    height: 768,
    alt: 'Freshly fitted grey carpet across a bedroom with a chest of drawers',
    caption: 'Bedroom',
  },
  {
    image: 'work-grey-winding-stairs-01',
    width: 1024,
    height: 1365,
    alt: 'Grey carpet fitted round winding stairs',
    caption: 'Winding stairs',
  },
  {
    image: 'work-cream-landing-02',
    width: 1024,
    height: 1820,
    alt: 'Cream carpet fitted along a bright landing with oak spindles',
    caption: 'Landing',
  },
  {
    image: 'work-grey-chevron-stairs-02',
    width: 1024,
    height: 1365,
    alt: 'Grey chevron carpet seen from the top of a long staircase',
    caption: 'Stairs',
  },
  {
    image: 'work-stair-runner-02',
    width: 768,
    height: 1024,
    alt: 'Beige stair carpet with black painted edges, seen from the top',
    caption: 'Stairs',
  },
  {
    image: 'work-bedroom-carpet-02',
    width: 819,
    height: 2000,
    alt: 'Mink carpet fitted across a bedroom floor',
    caption: 'Bedroom',
  },
  {
    image: 'work-dark-chevron-stairs-02',
    width: 712,
    height: 1600,
    alt: 'Brown and cream chevron carpet seen from the top of a narrow staircase',
    caption: 'Stairs',
  },
  {
    image: 'work-oak-herringbone-stairs-01',
    width: 1134,
    height: 2016,
    alt: 'Cream herringbone carpet fitted down oak stairs and across the landing, seen from above',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-cream-herringbone-landing-01',
    width: 1134,
    height: 2016,
    alt: 'Cream herringbone carpet fitted across a landing at the top of oak stairs',
    caption: 'Landing',
  },
  {
    image: 'work-leopard-landing-01',
    width: 1536,
    height: 2040,
    alt: 'Leopard print carpet fitted across a landing and down the stairs, with pink walls',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-leopard-landing-02',
    width: 1536,
    height: 2040,
    alt: 'Leopard print carpet fitted across a landing and down a staircase with a dark banister',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-leopard-stairs-03',
    width: 1536,
    height: 2040,
    alt: 'Leopard print carpet fitted up a long staircase with dark spindles',
    caption: 'Stairs',
  },
  {
    image: 'work-leopard-stairs-04',
    width: 1536,
    height: 2040,
    alt: 'Leopard print carpet fitted up a straight staircase with a black banister and pink walls',
    caption: 'Stairs',
  },
  {
    image: 'work-cream-herringbone-landing-02',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted across a landing and down the stairs, seen from above',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-cream-herringbone-stairs-02',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted up a staircase with dark wood spindles and a curved bottom step',
    caption: 'Stairs',
  },
  {
    image: 'work-cream-herringbone-hall-01',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted along a long upstairs hallway',
    caption: 'Hallway',
  },
  {
    image: 'work-cream-herringbone-hall-02',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted along a landing beside wood spindles',
    caption: 'Landing',
  },
  {
    image: 'work-cream-herringbone-stairs-03',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet on a turning staircase with dark wood spindles, seen from above',
    caption: 'Stairs',
  },
  {
    image: 'work-cream-herringbone-stairs-04',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted down a staircase into the hallway',
    caption: 'Stairs and hallway',
  },
  {
    image: 'work-cream-herringbone-landing-03',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted across a landing at the top of the stairs',
    caption: 'Landing',
  },
  {
    image: 'work-cream-herringbone-hall-03',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted across a downstairs hallway to the foot of the stairs',
    caption: 'Hallway',
  },
  {
    image: 'work-cream-herringbone-landing-04',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted across a landing beside the stairs',
    caption: 'Landing',
  },
  {
    image: 'work-cream-herringbone-stairs-05',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted up a staircase with wood spindles',
    caption: 'Stairs',
  },
  {
    image: 'work-cream-herringbone-stairs-06',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet on the stairs and landing, seen from above',
    caption: 'Stairs and landing',
  },
  {
    image: 'work-cream-herringbone-hall-04',
    width: 900,
    height: 1600,
    alt: 'Cream herringbone carpet fitted along an upstairs hallway',
    caption: 'Hallway',
  },
  {
    image: 'work-chevron-stairs-03',
    width: 1536,
    height: 2048,
    alt: 'Black and white chevron carpet fitted up a staircase with a white balustrade',
    caption: 'Stairs',
  },
  {
    image: 'work-chevron-stairs-04',
    width: 1536,
    height: 2048,
    alt: 'Black and white chevron carpet fitted up a winding staircase beside white spindles',
    caption: 'Stairs',
  },
  {
    image: 'work-chevron-stairs-05',
    width: 1536,
    height: 2048,
    alt: 'Black and white chevron carpet fitted down a staircase, seen from the top step',
    caption: 'Stairs',
  },
  {
    image: 'work-grey-bedroom-03',
    width: 819,
    height: 2000,
    alt: 'Soft grey carpet fitted across a bedroom',
    caption: 'Bedroom',
  },
  {
    image: 'work-speckled-landing-01',
    width: 768,
    height: 1024,
    alt: 'Speckled oatmeal carpet fitted across a landing at the top of the stairs',
    caption: 'Landing',
  },
  {
    image: 'work-speckled-stairs-02',
    width: 1200,
    height: 1600,
    alt: 'Speckled carpet fitted down a staircase with a dark wood banister',
    caption: 'Stairs',
  },
  {
    image: 'work-mushroom-hall-01',
    width: 768,
    height: 1024,
    alt: 'Mushroom carpet fitted along a hallway and up the stairs',
    caption: 'Hallway and stairs',
  },
  {
    image: 'work-mushroom-stairs-01',
    width: 768,
    height: 1024,
    alt: 'Mushroom carpet fitted up the bottom steps and across the floor',
    caption: 'Stairs',
  },
  {
    image: 'work-leopard-roll-01',
    width: 819,
    height: 2000,
    alt: 'Leopard print carpet unrolled and ready to cut',
    caption: 'Ready to fit',
  },
  {
    image: 'work-leopard-roll-02',
    width: 819,
    height: 2000,
    alt: 'A roll of leopard print carpet laid out ready for fitting',
    caption: 'Ready to fit',
  },
  {
    image: 'work-leopard-roll-03',
    width: 819,
    height: 2000,
    alt: 'Leopard print carpet unrolled on the floor ready to cut',
    caption: 'Ready to fit',
  },
  {
    image: 'work-leopard-roll-04',
    width: 819,
    height: 2000,
    alt: 'Close up of leopard print carpet being unrolled before fitting',
    caption: 'Ready to fit',
  },
  {
    image: 'work-herringbone-01',
    width: 1024,
    height: 1365,
    alt: 'Grey oak effect herringbone flooring fitted across an empty living room',
    caption: 'Living room',
  },
  {
    image: 'work-oak-herringbone-01',
    width: 1024,
    height: 456,
    alt: 'Oak effect herringbone flooring through a living room with a white corner sofa and a wall fireplace',
    caption: 'Living room',
  },
  {
    image: 'work-oak-lounge-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Natural oak effect laminate fitted across a bright living room',
    caption: 'Living room',
  },
  {
    image: 'work-dining-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Light oak effect laminate fitted through a long dining room',
    caption: 'Dining room',
  },
  {
    image: 'work-hallway-transition-01',
    width: 1024,
    height: 1365,
    alt: 'Oak effect laminate hallway floor with carpeted stairs and a patterned vinyl doorway',
    caption: 'Hallway',
  },
  {
    image: 'work-lounge-laminate-02',
    width: 1024,
    height: 768,
    alt: 'Grey wood effect laminate fitted across a living room with a fireplace',
    caption: 'Living room',
  },
  {
    image: 'work-feature-wall-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Grey oak effect laminate fitted across a living room with a feature wall',
    caption: 'Living room',
  },
  {
    image: 'work-kitchen-laminate-01',
    width: 1024,
    height: 768,
    alt: 'Wood effect laminate fitted through a kitchen with an island',
    caption: 'Kitchen',
  },
  {
    image: 'work-grey-lounge-laminate-01',
    width: 1024,
    height: 1365,
    alt: 'Grey oak effect laminate fitted across a living room',
    caption: 'Living room',
  },
  {
    image: 'work-garden-room-01',
    width: 1024,
    height: 1365,
    alt: 'Dark oak effect laminate fitted in a garden room with patio doors',
    caption: 'Garden room',
  },
  {
    image: 'work-cloakroom-vinyl-01',
    width: 1024,
    height: 1365,
    alt: 'Wood effect vinyl fitted in a narrow cloakroom',
    caption: 'Cloakroom',
  },
  {
    image: 'work-utility-vinyl-01',
    width: 1024,
    height: 1820,
    alt: 'Grey patterned tile effect vinyl fitted across a utility room floor',
    caption: 'Utility room',
  },
]

// Headings, intros and button labels used across the page.
export const copy = {
  hero: {
    eyebrow: 'Family run business',
    titleStart: 'Welcome to',
    titleAccent: 'Norden Carpets & Flooring.',
    intro:
      "Hi, we're Dave and Wendy. We've been fitting carpets, vinyl and laminate flooring across Rochdale for over 45 years, and every job is fitted by our own fitters, Tom and Jake.",
    reassurance: "Quotes are free, and there's no obligation.",
    enter: 'Tap to step inside',
    ctaBook: 'Get a free quote',
    ctaCall: 'Call',
    trustFitters: 'Our own fitters',
    trustYearsLabel: 'years fitting flooring',
    imageAlt: 'The Norden Carpets & Flooring shopfront at Tenterhouse Mill, with the doors open onto the showroom',
  },
  cta: {
    bookShort: 'Get quote',
    callShort: 'Call us',
    whatsapp: 'WhatsApp us',
    backToTop: 'Back to top',
    directions: 'Get directions',
  },
  flooring: {
    eyebrow: 'Flooring',
    // Two lines on desktop, as in the design.
    titleLines: ['Floors for every room', 'and every budget.'],
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
    seeAll: 'See all',
    photos: 'photos',
  },
  team: {
    title: 'Meet the team.',
    intro: "We're a small family team. You'll deal with the same people from your first call to the fit.",
    review: { quote: 'Such a lovely, super friendly team.' },
  },
  reviews: {
    reviewSource: 'Facebook review',
    googleSource: 'Google review',
    facebookLink: 'Facebook',
    googleLink: 'Google',
    eyebrow: 'Reviews',
    title: 'What our customers say.',
    readAll: 'Read our reviews',
    tapNext: 'Tap for the next review',
    startAgain: 'Tap to start again',
    swipeNext: 'Swipe for the next review',
    swipeMore: 'Swipe for more',
    read: 'read',
    of: 'of',
    deckLabel: 'Customer reviews',
    goTo: 'Show review',
  },
  booking: {
    eyebrow: 'Free, no obligation',
    title: 'Get a free quote',
    intro: 'Tell us a little about the job. Dave or Wendy will call you back to arrange a free home measure.',
    materialLegend: 'What would you like fitted?',
    name: 'Your name',
    phone: 'Phone number',
    postcode: 'Postcode',
    notes: 'Anything else we should know?',
    optional: '(optional)',
    notesPlaceholder: 'Rooms, stairs, or when you need it fitted',
    consentStart: "I'm happy for you to contact me about my quote, as set out in the",
    consentLink: 'privacy notice',
    submit: 'Send my request',
    sending: 'Sending...',
    close: 'Close quote form',
    reply: 'We usually call back within one working day.',
    securityPrompt: 'Please complete the security check above the button.',
    securityFailed: 'The security check could not load. Please refresh, or call us on',
    successEyebrow: 'Request sent',
    successTitle: 'Thank you',
    successBody: (name: string, phone: string) =>
      `Thanks ${name}. Dave or Wendy will call you on ${phone} to arrange your free measure and quote, usually within one working day.`,
    done: 'Done',
    errorTitle: "Sorry, that didn't send",
    errorBody: 'Your details have not been lost. You can try again or reach us directly.',
    back: 'Back to the form',
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
    'Carpets, vinyl, laminate and underlay, supplied and fitted across Rochdale and Greater Manchester. Family run for over 45 years, with our own fitters. Book a free measure.',
} as const
