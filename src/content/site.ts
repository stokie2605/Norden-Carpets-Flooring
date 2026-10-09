// Single source of truth for every piece of client copy and business data.
// Anything still to be confirmed by the client is marked TODO_CONFIRM.
// The production build (CF_PAGES_BRANCH=main) fails while any marker reaches dist/.

export const business = {
  name: 'Norden Carpets & Flooring',
  proprietors: 'David & Wendy Wilshaw',
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
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Tenterhouse+Mill,+Greenbooth+Road,+Norden,+Rochdale+OL12+7TD&output=embed',
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

export type MaterialId = 'carpets' | 'lvt' | 'laminate' | 'underlay'

export type Material = {
  id: MaterialId
  label: string
  headline: string
  pitch: string
  bestFor: readonly string[]
  image: string
  imageAlt: string
}

export const materials: readonly Material[] = [
  {
    id: 'carpets',
    label: 'Carpets',
    headline: 'Carpets that feel good and last',
    pitch:
      "Twists, loops, saxonies and stain resistant polypropylene. Every carpet goes down on good underlay, with gripper and door bars, and it's fitted by our own team.",
    bestFor: ['Bedrooms', 'Lounges', 'Stairs and landings'],
    image: 'carpet',
    imageAlt: 'Close up of a grey loop pile carpet texture',
  },
  {
    id: 'lvt',
    label: 'Vinyl',
    headline: 'Luxury vinyl and herringbone',
    pitch:
      "Looks like wood or stone, but it's waterproof and easy to keep clean. It works well with underfloor heating, and we lay it as planks, tiles or herringbone on a properly levelled floor.",
    bestFor: ['Kitchens', 'Bathrooms', 'Open plan living'],
    image: 'lvt-herringbone',
    imageAlt: 'Warm oak effect planks laid in a herringbone pattern',
  },
  {
    id: 'laminate',
    label: 'Laminate',
    headline: "Wood effect that won't break the bank",
    pitch:
      'Tough click laminate with a realistic grain, laid on acoustic underlay so the room stays quiet. We finish the edges with matching beading or scotia.',
    bestFor: ['Living rooms', 'Dining rooms', 'Rental properties'],
    image: 'laminate',
    imageAlt: 'Bright living room with mid oak laminate flooring',
  },
  {
    id: 'underlay',
    label: 'Underlay',
    headline: 'Good underlay makes all the difference',
    pitch:
      'Even a great carpet feels thin on cheap underlay. We use high density PU foam underlay. It helps your carpet last longer, keeps the room warmer and feels softer underfoot.',
    bestFor: ['All carpeted rooms', 'Stairs (high density)', 'Over underfloor heating'],
    image: 'roll-ends',
    imageAlt: 'Close up of grey patterned carpet',
  },
]

export const proof = {
  rating: '96%',
  ratingLabel: 'of customers recommend us',
  // Platform behind the 96% rating (Google, Facebook, Checkatrade?).
  ratingSource: 'TODO_CONFIRM rating source',
  featured: {
    // Exact wording to be pasted from the published review. Never paraphrase.
    quote: 'TODO_CONFIRM Charlotte Simpson review text',
    author: 'Charlotte Simpson',
    detail: 'TODO_CONFIRM review platform and date',
  },
  // Further verified reviews, verbatim, with author and source. Empty until supplied.
  reviews: [] as readonly { quote: string; author: string; source: string }[],
} as const

// Real installation photos from the team only. Shown in the Our work section.
// Add entries after running `npm run images` on files in design-source/installations.
export const installations: readonly { image: string; alt: string; caption: string }[] = []

// Headings, intros and button labels used across the page.
export const copy = {
  hero: {
    eyebrow: `Family run in Norden, Rochdale, for ${business.yearsInTrade} years`,
    titleStart: 'Floors fitted by the people who',
    titleAccent: 'own the shop.',
    intro: "We're Dave and Wendy Wilshaw, and we've been fitting floors across Rochdale for over 30 years.",
    introMore: 'Every floor is fitted by Dave, Tom or Jake.',
    reassurance: "Measuring and quotes are free, and there's no obligation.",
    badge: 'Our own fitters',
    badgeBody: 'Dave, Tom and Jake do the fitting, and Wendy helps with admin.',
    imageAlt: 'Bright bedroom with a soft neutral carpet',
  },
  cta: {
    book: 'Book a free measure',
    bookShort: 'Free measure',
    callShowroom: 'Call the showroom',
    callShort: 'Call us',
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
    // Shown on preview builds only, until real photos are added to `installations`.
    empty: 'TODO_CONFIRM installation photos from the client, grouped by material',
  },
  team: {
    title: 'Meet the team.',
    intro: "We're a small family team. You'll deal with the same people from your first call to the fit.",
  },
  reviews: {
    eyebrow: 'Reviews',
    title: 'What our customers say.',
  },
  showroom: {
    eyebrow: 'Showroom and areas we cover',
    title: 'Come and see us at Tenterhouse Mill.',
    // Followed by the list of towns.
    introStart: 'We measure up for free in',
    introEnd: "and we're happy to travel further if you ask.",
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
