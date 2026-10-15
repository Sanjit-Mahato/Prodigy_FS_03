export const CATEGORIES = [
  { id: 'smartphones', label: 'Smartphones', description: 'Latest flagship & budget phones' },
  { id: 'laptops', label: 'Laptops', description: 'Powerhouse workstations & ultrabooks' },
  { id: 'audio', label: 'Audio', description: 'Headphones, earbuds & wireless speakers' },
  { id: 'wearables', label: 'Wearables', description: 'Smartwatches & fitness trackers' },
  { id: 'accessories', label: 'Accessories', description: 'Chargers, cables, cases & stands' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Dell',
  'ASUS',
  'Bose',
  'Logitech',
  'Google',
  'OnePlus',
  'Anker',
] as const;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
] as const;

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
] as const;

export const STORE_DETAILS = {
  name: 'ElectroMart Delhi Flagship',
  shortName: 'ElectroMart Delhi',
  tagline: 'Premier Electronics Retailer • Same-Day Store Pickup',
  address: {
    street: 'Plot 18, Commercial Complex, Nehru Place',
    city: 'New Delhi',
    state: 'Delhi',
    zip: '110019',
    full: 'Plot 18, Commercial Complex, Nehru Place, New Delhi, Delhi 110019',
    short: 'Nehru Place, New Delhi',
  },
  contact: {
    phone: '+91 (011) 2641-5678',
    email: 'support@electromart.in',
    carePhone: '+91 98765 43210',
  },
  hours: {
    monSat: '10:00 AM – 8:30 PM IST',
    sun: '11:00 AM – 7:00 PM IST',
  },
  shipping: {
    freeShippingThreshold: 999,
    standardShippingFee: 99,
  },
};

export const FAQS = [
  {
    question: 'What is the return policy for electronics?',
    answer:
      'We offer a 30-day hassle-free return policy on all electronics. Items must be in their original packaging with all included accessories. Defective items can be replaced immediately within 14 days.',
  },
  {
    question: 'How long does local delivery take?',
    answer:
      'Orders placed before 2:00 PM IST are eligible for same-day delivery within Delhi NCR. Standard delivery takes 1-2 business days across India.',
  },
  {
    question: 'Do you offer warranty on products?',
    answer:
      'All products come with the standard manufacturer warranty (typically 1-2 years). We also offer an optional 2-year ElectroCare extended warranty at checkout.',
  },
  {
    question: 'Can I pick up my order in-store?',
    answer:
      'Yes! Choose "In-Store Pickup" at checkout and your order will be ready within 2 hours at our Nehru Place branch. Bring your order confirmation email and a valid ID.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery for orders within Delhi NCR.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order is placed, you can track its status in real-time on the Orders page using your order ID. We will also send SMS and email updates at every stage.',
  },
];
