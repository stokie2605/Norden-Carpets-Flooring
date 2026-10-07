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

export const towns = ['Norden', 'Bamford', 'Birtle', 'Edenfield', 'Ramsbottom', 'Bury', 'Rochdale'] as const

export const team = [
  { name: 'Dave', role: 'Proprietor and master fitter' },
  { name: 'Wendy', role: 'Proprietor, showroom and design advice' },
  { name: 'Tom', role: 'Fitter' },
  { name: 'Liam', role: 'Fitter' },
] as const

export const nav = [
  { label: 'Flooring', href: '#flooring' },
  { label: 'Subfloors', href: '#subfloors' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Showroom', href: '#showroom' },
] as const

export type MaterialId = 'carpets' | 'lvt' | 'laminate' | 'safety' | 'roll-ends'

export type Material = {
  id: MaterialId
  label: string
  headline: string
  pitch: string
  price: string
  priceNote: string
  bestFor: readonly string[]
  image: string
  imageAlt: string
}

export const materials: readonly Material[] = [
  {
    id: 'carpets',
    label: 'Carpets',
    headline: 'Soft underfoot, built to last',
    pitch:
      'Twists, loops, saxonies and stain resistant polypropylene from leading UK mills. Every carpet goes down on quality underlay with gripper and door bars fitted by our own team.',
    price: 'From £16',
    priceNote: 'per sqm',
    bestFor: ['Bedrooms', 'Lounges', 'Stairs and landings'],
    image: 'carpet',
    imageAlt: 'Close up of a grey loop pile carpet texture',
  },
  {
    id: 'lvt',
    label: 'LVT',
    headline: 'Luxury vinyl tile and herringbone',
    pitch:
      'The look of real wood or stone with none of the upkeep. Waterproof, warm with underfloor heating and laid in plank, tile or herringbone patterns on a perfectly smoothed subfloor.',
    price: 'From £26',
    priceNote: 'per sqm',
    bestFor: ['Kitchens', 'Hallways', 'Open plan living'],
    image: 'lvt-herringbone',
    imageAlt: 'Warm oak effect planks laid in a herringbone pattern',
  },
  {
    id: 'laminate',
    label: 'Laminate',
    headline: 'Smart wood effect on a budget',
    pitch:
      'Hard wearing click laminate with realistic grain and an acoustic underlay to keep rooms quiet. Finished with matching beading or scotia for a clean edge.',
    price: 'From £18',
    priceNote: 'per sqm',
    bestFor: ['Living rooms', 'Dining rooms', 'Rental properties'],
    image: 'laminate',
    imageAlt: 'Bright living room with mid oak laminate flooring',
  },
  {
    id: 'safety',
    label: 'Safety Flooring',
    headline: 'Slip resistant flooring for wet and busy areas',
    pitch:
      'Commercial grade safety vinyl for kitchens, bathrooms, care settings and workplaces. Welded seams and coved edges where hygiene matters.',
    price: 'Priced on survey',
    priceNote: 'free measure',
    bestFor: ['Bathrooms and wet rooms', 'Commercial kitchens', 'Care homes and clinics'],
    image: 'safety',
    imageAlt: 'Clean commercial corridor with pale hard flooring',
  },
  {
    id: 'roll-ends',
    label: 'Roll Ends',
    headline: 'Quality remnants at a fraction of the price',
    pitch:
      'Ends of rolls from top ranges, ideal for smaller rooms, offices and box rooms. Pop into the showroom to see what is in stock this week.',
    price: 'From £45',
    priceNote: 'per remnant',
    bestFor: ['Box rooms', 'Home offices', 'Landlord refits'],
    image: 'roll-ends',
    imageAlt: 'Grey patterned carpet tile texture',
  },
]

export const subfloorSteps = [
  {
    title: 'Moisture checks',
    body: 'We test concrete and screed with a meter before anything goes down. Damp floors ruin vinyl and adhesive, so we find it first and fix it properly.',
  },
  {
    title: 'Latex screeding',
    body: 'Uneven or patched floors are levelled with a latex smoothing compound. The result is a flat, sound base that stops ridges and seams showing through.',
  },
  {
    title: 'Ply and hardboard',
    body: 'Timber floors are overlaid with ply or hardboard and fixed at close centres, so LVT and vinyl stay flat and squeak free for years.',
  },
  {
    title: 'Precision fitting',
    body: 'Dave, Wendy, Tom and Liam fit every job themselves. No subcontractors, no strangers in your home, and one team accountable from measure to finish.',
  },
] as const

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

// Real installation photos from the team only. The gallery is hidden while empty.
// Add entries after running `npm run images` on files in design-source/installations.
export const installations: readonly { image: string; alt: string; caption: string }[] = []

export const seo = {
  title: 'Carpets & Flooring in Rochdale | Norden Carpets & Flooring',
  description:
    'Carpets, LVT, laminate and safety flooring supplied and fitted across Rochdale, Bury and Ramsbottom. 30+ years, in-house fitters. Book a free measure.',
} as const
