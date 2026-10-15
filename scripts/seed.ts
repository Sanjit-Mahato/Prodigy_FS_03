import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Product } from '../lib/models/Product';
import { User } from '../lib/models/User';
import { Review } from '../lib/models/Review';
import { Order } from '../lib/models/Order';
import { SupportTicket } from '../lib/models/SupportTicket';
import { Cart } from '../lib/models/Cart';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electromart';

const productsData = [
  // --- SMARTPHONES ---
  {
    name: 'Apple iPhone 15 Pro Max',
    slug: 'apple-iphone-15-pro-max',
    description:
      'Forged in aerospace-grade titanium with the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom.',
    price: 139900,
    originalPrice: 159900,
    category: 'smartphones',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '6.7-inch Super Retina XDR OLED 120Hz ProMotion',
      Processor: 'Apple A17 Pro (3nm)',
      Storage: '256GB NVMe',
      Camera: '48MP Main + 12MP Ultra-Wide + 12MP 5x Telephoto',
      Battery: 'Up to 29 hours video playback',
      Connectivity: '5G, Wi-Fi 6E, USB-C 3.0 (10Gbps)',
      Weight: '221g',
    },
    stock: 24,
    rating: 4.9,
    reviewCount: 42,
    featured: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description:
      'Meet Galaxy S24 Ultra with Galaxy AI, titanium frame, built-in S Pen, and an astonishing 200MP camera setup capable of 100x Space Zoom.',
    price: 129999,
    originalPrice: 144999,
    category: 'smartphones',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '6.8-inch Dynamic AMOLED 2X QHD+ 120Hz',
      Processor: 'Snapdragon 8 Gen 3 for Galaxy',
      Storage: '512GB UFS 4.0',
      Camera: '200MP Wide + 50MP 5x Tele + 10MP 3x Tele + 12MP Ultra-Wide',
      Battery: '5000mAh with 45W Fast Charging',
      Connectivity: '5G, Wi-Fi 7, Bluetooth 5.3',
      Weight: '232g',
    },
    stock: 18,
    rating: 4.8,
    reviewCount: 35,
    featured: true,
  },
  {
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    description:
      'The best of Google AI in your pocket. Features Google Tensor G3, revolutionary computational photography with Best Take and Audio Magic Eraser, and 7 years of OS updates.',
    price: 89999,
    originalPrice: 99999,
    category: 'smartphones',
    brand: 'Google',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '6.7-inch Super Actua LTPO OLED 1-120Hz',
      Processor: 'Google Tensor G3 + Titan M2 Security',
      Storage: '128GB',
      Camera: '50MP Octa PD + 48MP Quad PD Telephoto + 48MP Ultra-Wide',
      Battery: '5050mAh with 30W Fast Charge',
      Connectivity: '5G Sub-6/mmWave, Wi-Fi 7',
      Weight: '213g',
    },
    stock: 15,
    rating: 4.7,
    reviewCount: 28,
    featured: false,
  },
  {
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    description:
      'Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3 with 4th Gen Hasselblad Camera system, 2K 120Hz ProXDR display, and blisteringly fast 80W SUPERVOOC charging.',
    price: 64999,
    originalPrice: 69999,
    category: 'smartphones',
    brand: 'OnePlus',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '6.82-inch 2K 120Hz ProXDR LTPO AMOLED',
      Processor: 'Qualcomm Snapdragon 8 Gen 3',
      Storage: '256GB / 12GB LPDDR5X RAM',
      Camera: '50MP Sony LYT-808 + 64MP Periscope + 48MP Ultra-Wide',
      Battery: '5400mAh with 80W Wired + 50W AIRVOOC',
      Connectivity: '5G, Wi-Fi 7, Dual SIM',
      Weight: '220g',
    },
    stock: 20,
    rating: 4.6,
    reviewCount: 19,
    featured: false,
  },
  {
    name: 'Samsung Galaxy Z Flip 5',
    slug: 'samsung-galaxy-z-flip-5',
    description:
      'Pocket-sized perfection. Features a massive 3.4-inch Flex Window cover screen, zero-gap Flex Hinge, and hands-free FlexCam angles for content creators.',
    price: 79999,
    originalPrice: 89999,
    category: 'smartphones',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '6.7-inch Dynamic AMOLED 2X 120Hz + 3.4-inch Cover AMOLED',
      Processor: 'Snapdragon 8 Gen 2 for Galaxy',
      Storage: '256GB UFS 4.0',
      Camera: '12MP Dual Pixel OIS + 12MP Ultra-Wide',
      Battery: '3700mAh with 25W Charging',
      Connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
      Weight: '187g',
    },
    stock: 12,
    rating: 4.5,
    reviewCount: 16,
    featured: false,
  },

  // --- LAPTOPS ---
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    slug: 'apple-macbook-pro-16-m3-max',
    description:
      'Mind-blowing speed with the Apple M3 Max chip. Features a Liquid Retina XDR display, up to 22 hours of battery life, studio-quality mics, and six-speaker sound system.',
    price: 349900,
    originalPrice: 379900,
    category: 'laptops',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '16.2-inch Liquid Retina XDR (3456x2234) 120Hz ProMotion 1600 nits',
      Processor: 'Apple M3 Max (16-core CPU, 40-core GPU)',
      Memory: '48GB Unified Memory',
      Storage: '1TB Superfast SSD',
      Battery: '100Wh, Up to 22 hours',
      Ports: '3x Thunderbolt 4, HDMI 2.1, SDXC slot, MagSafe 3',
      Weight: '2.16 kg',
    },
    stock: 10,
    rating: 4.95,
    reviewCount: 51,
    featured: true,
  },
  {
    name: 'Dell XPS 15 OLED Laptop',
    slug: 'dell-xps-15-oled-laptop',
    description:
      'Immersive 3.5K OLED InfinityEdge touchscreen paired with 13th Gen Intel Core i9 and NVIDIA GeForce RTX 4070 Graphics inside CNC machined aluminum and carbon fiber.',
    price: 219999,
    originalPrice: 239999,
    category: 'laptops',
    brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '15.6-inch 3.5K (3456 x 2160) OLED Touch Display 400 nits',
      Processor: 'Intel Core i9-13900H (14 cores, up to 5.4 GHz)',
      Graphics: 'NVIDIA GeForce RTX 4070 8GB GDDR6',
      Memory: '32GB DDR5 4800MHz',
      Storage: '1TB M.2 PCIe NVMe SSD',
      Battery: '86Whr with ExpressCharge',
      Weight: '1.92 kg',
    },
    stock: 14,
    rating: 4.75,
    reviewCount: 31,
    featured: true,
  },
  {
    name: 'ASUS ROG Zephyrus G16 Gaming Laptop',
    slug: 'asus-rog-zephyrus-g16-gaming-laptop',
    description:
      'Ultra-thin precision CNC aluminum chassis with ROG Nebula OLED 240Hz gaming display, Intel Core Ultra 9 processor, and NVIDIA RTX 4080 with slash lighting.',
    price: 249999,
    originalPrice: 269999,
    category: 'laptops',
    brand: 'ASUS',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '16-inch 2.5K (2560x1600) OLED 240Hz 0.2ms G-Sync',
      Processor: 'Intel Core Ultra 9 185H with AI Boost NPU',
      Graphics: 'NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP)',
      Memory: '32GB LPDDR5X 7467MHz',
      Storage: '2TB PCIe 4.0 NVMe SSD',
      Audio: '6-speaker system with dual-force woofers & Dolby Atmos',
      Weight: '1.85 kg',
    },
    stock: 8,
    rating: 4.85,
    reviewCount: 22,
    featured: false,
  },
  {
    name: 'Apple MacBook Air 13" M3',
    slug: 'apple-macbook-air-13-m3',
    description:
      'Incredibly thin and fast. The M3 chip brings even greater capabilities to the world’s most popular laptop, with up to 18 hours of battery life and support for two external displays.',
    price: 114900,
    originalPrice: 124900,
    category: 'laptops',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '13.6-inch Liquid Retina display with True Tone 500 nits',
      Processor: 'Apple M3 (8-core CPU, 10-core GPU)',
      Memory: '16GB Unified Memory',
      Storage: '512GB SSD',
      Battery: 'Up to 18 hours Apple TV app movie playback',
      Ports: 'MagSafe 3, 2x Thunderbolt / USB 4, Headphone jack',
      Weight: '1.24 kg',
    },
    stock: 25,
    rating: 4.9,
    reviewCount: 64,
    featured: true,
  },
  {
    name: 'ASUS Zenbook 14 OLED',
    slug: 'asus-zenbook-14-oled',
    description:
      'Premium ultraportable laptop featuring a 3K ASUS Lumina OLED 120Hz display, Intel Core Ultra 7 processor with AI acceleration, and 75Wh all-day battery.',
    price: 99999,
    originalPrice: 109999,
    category: 'laptops',
    brand: 'ASUS',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Display: '14.0-inch 3K (2880 x 1800) OLED 16:10 120Hz 0.2ms',
      Processor: 'Intel Core Ultra 7 155H Processor',
      Memory: '16GB LPDDR5X RAM',
      Storage: '1TB M.2 NVMe PCIe 4.0 SSD',
      Battery: '75Whr with Fast USB-C Easy Charge',
      Weight: '1.20 kg',
    },
    stock: 16,
    rating: 4.7,
    reviewCount: 18,
    featured: false,
  },

  // --- AUDIO ---
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    description:
      'Industry-leading noise cancellation optimized automatically with two processors and 8 microphones. Enjoy magnificent high-resolution audio with LDAC and crystal-clear hands-free calling.',
    price: 29990,
    originalPrice: 34990,
    category: 'audio',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Driver: '30mm Carbon fiber composite dome',
      NoiseCancellation: 'Dual Processor V1 + HD Noise Cancelling Processor QN1',
      BatteryLife: '30 hours with ANC on (40 hours ANC off)',
      Charging: '3 min quick charge gives 3 hours playback',
      Bluetooth: 'Version 5.2 with LDAC, AAC, SBC',
      Weight: '250g',
    },
    stock: 35,
    rating: 4.88,
    reviewCount: 96,
    featured: true,
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    slug: 'bose-quietcomfort-ultra-headphones',
    description:
      'World-class noise cancellation, quieter than ever before. Revolutionary spatialized audio for more immersive listening no matter the source.',
    price: 35900,
    originalPrice: 39900,
    category: 'audio',
    brand: 'Bose',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Technology: 'Bose Immersive Audio Spatial Sound',
      NoiseCancellation: 'CustomTune acoustic calibration',
      BatteryLife: 'Up to 24 hours (up to 18 hours with Immersive Audio)',
      Microphones: 'Built-in microphone array for voice clarity',
      Connectivity: 'Bluetooth 5.3, Multipoint pairing',
      Weight: '252g',
    },
    stock: 22,
    rating: 4.82,
    reviewCount: 44,
    featured: false,
  },
  {
    name: 'Apple AirPods Pro (2nd Generation)',
    slug: 'apple-airpods-pro-2nd-generation',
    description:
      'Up to 2x more active noise cancellation. Adaptive Audio transparently tailors noise control to your environment. Personalized Spatial Audio with dynamic head tracking.',
    price: 24900,
    originalPrice: 26900,
    category: 'audio',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Chip: 'Apple H2 headphone chip + Apple U1 in MagSafe Case',
      NoiseCancellation: 'Active Noise Cancellation + Adaptive Audio',
      BatteryLife: 'Up to 6 hours listening (up to 30 hours with case)',
      Case: 'MagSafe Case (USB-C) with speaker and lanyard loop',
      Resistance: 'IP54 dust, sweat, and water resistant',
      Weight: '5.3g per earbud',
    },
    stock: 40,
    rating: 4.92,
    reviewCount: 112,
    featured: true,
  },
  {
    name: 'Sony WF-1000XM5 True Wireless Earbuds',
    slug: 'sony-wf-1000xm5-true-wireless-earbuds',
    description:
      'Astonishing sound quality and the best truly wireless noise-canceling performance. Powered by the Integrated Processor V2 and Dynamic Driver X.',
    price: 23990,
    originalPrice: 26990,
    category: 'audio',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Driver: '8.4mm Dynamic Driver X',
      BatteryLife: '8 hours (earbuds) + 16 hours (case)',
      CodecSupport: 'LDAC, LC3, AAC, SBC with DSEE Extreme',
      Sensors: 'Bone conduction sensors + AI noise reduction',
      WaterResistance: 'IPX4 equivalent',
      Weight: '5.9g per earbud',
    },
    stock: 19,
    rating: 4.75,
    reviewCount: 38,
    featured: false,
  },
  {
    name: 'Bose SoundLink Flex Bluetooth Speaker',
    slug: 'bose-soundlink-flex-bluetooth-speaker',
    description:
      'Clear, deep sound and powerful bass. Rigorously tested to meet IP67 waterproof standards. PositionIQ technology automatically optimizes sound orientation.',
    price: 13900,
    originalPrice: 15900,
    category: 'audio',
    brand: 'Bose',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Durability: 'IP67 Waterproof & Dustproof (It floats!)',
      BatteryLife: 'Up to 12 hours playback',
      Bluetooth: 'Version 4.2 up to 30 ft range',
      Charging: 'USB-C charging cable included',
      Weight: '589g',
    },
    stock: 30,
    rating: 4.8,
    reviewCount: 29,
    featured: false,
  },
  {
    name: 'Anker Soundcore Motion+ Bluetooth Speaker',
    slug: 'anker-soundcore-motion-plus-bluetooth-speaker',
    description:
      'Hi-Res Audio certified with ultra-wide 50Hz to 40kHz frequency range, 30W stereo output, custom EQ app control, and Bluetooth aptX support.',
    price: 8999,
    originalPrice: 10999,
    category: 'audio',
    brand: 'Anker',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Power: '30W Output (Dual tweeters & neodymium woofers)',
      Waterproof: 'IPX7 certified casing',
      Battery: '6700mAh battery providing up to 12 hours playtime',
      AudioTech: 'Qualcomm aptX lossless audio',
      Weight: '1050g',
    },
    stock: 28,
    rating: 4.7,
    reviewCount: 45,
    featured: false,
  },

  // --- WEARABLES ---
  {
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    description:
      'The most rugged and capable Apple Watch ever. Crafted from lightweight aerospace titanium with a 3000-nit display, precision dual-frequency GPS, and up to 72 hours in Low Power Mode.',
    price: 89900,
    originalPrice: 94900,
    category: 'wearables',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Case: '49mm aerospace-grade titanium case',
      Display: 'Always-On Retina OLED 3000 nits max brightness',
      Chip: 'S9 SiP with 4-core Neural Engine',
      Battery: 'Up to 36 hours regular / 72 hours Low Power Mode',
      WaterResistance: '100m water resistance, EN13319 dive computer certified',
      Connectivity: 'Cellular LTE, Dual-frequency GPS (L1 and L5)',
    },
    stock: 14,
    rating: 4.9,
    reviewCount: 37,
    featured: true,
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    slug: 'samsung-galaxy-watch-6-classic',
    description:
      'Timeless style with a rotating physical bezel, sapphire crystal display, comprehensive sleep coaching, and advanced BioActive health sensors.',
    price: 36999,
    originalPrice: 39999,
    category: 'wearables',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Case: '47mm Stainless Steel with Rotating Bezel',
      Display: '1.5-inch Super AMOLED (480x480) Sapphire Crystal',
      Processor: 'Exynos W930 Dual-Core 1.4GHz',
      Sensors: 'Samsung BioActive (ECG, Blood Pressure, BIA Body Composition)',
      Battery: '425mAh with Fast Wireless Charging',
      Durability: '5ATM + IP68 / MIL-STD-810H',
    },
    stock: 17,
    rating: 4.7,
    reviewCount: 26,
    featured: false,
  },
  {
    name: 'Google Pixel Watch 2',
    slug: 'google-pixel-watch-2',
    description:
      'Designed by Google, with the best of Fitbit health tracking. Multi-path heart rate sensor, skin temperature tracking, and continuous electrodermal activity for stress management.',
    price: 32990,
    originalPrice: 35990,
    category: 'wearables',
    brand: 'Google',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Case: '41mm 100% Recycled Aluminum with custom 3D Corning Gorilla Glass 5',
      Display: 'AMOLED 320 ppi with DCI-P3 color 1000 nits',
      Processor: 'Qualcomm 5100 with Cortex M33 co-processor',
      Sensors: 'Multi-path optical HR, cEDA sensor, skin temperature sensor',
      Battery: '24 hours with Always-On display, 75 min to 100%',
      Compatibility: 'Android 9.0 or newer',
    },
    stock: 15,
    rating: 4.6,
    reviewCount: 21,
    featured: false,
  },
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description:
      'Smarter, brighter, mightier. Introducing Double Tap gesture control, a display twice as bright at 2000 nits, and carbon neutral case and band combinations.',
    price: 41900,
    originalPrice: 44900,
    category: 'wearables',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Case: '45mm Midnight Aluminum',
      Display: 'Always-On Retina display up to 2000 nits',
      Chip: 'S9 SiP with 64-bit dual-core processor',
      Sensors: 'Blood Oxygen, ECG, Temperature sensing, Crash Detection',
      Battery: '18 hours all-day battery life (36 hours in Low Power Mode)',
      WaterResistance: '50m swimproof',
    },
    stock: 26,
    rating: 4.85,
    reviewCount: 48,
    featured: false,
  },

  // --- ACCESSORIES ---
  {
    name: 'Logitech MX Master 3S Performance Mouse',
    slug: 'logitech-mx-master-3s-performance-mouse',
    description:
      'An iconic mouse remastered. Quiet Click switches feel satisfying with 90% less click noise, paired with an 8000 DPI sensor tracking on glass and MagSpeed electromagnetic scroll wheel.',
    price: 8995,
    originalPrice: 9995,
    category: 'accessories',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Sensor: 'Darkfield 8000 DPI tracking on any surface including glass',
      ScrollWheel: 'MagSpeed Electromagnetic wheel (scrolling 1000 lines/sec)',
      Connectivity: 'Bluetooth Low Energy & Logi Bolt USB Receiver',
      Battery: 'Rechargeable Li-Po (500 mAh), up to 70 days on full charge',
      Customization: 'Logi Options+ compatible on macOS & Windows',
      Weight: '141g',
    },
    stock: 50,
    rating: 4.95,
    reviewCount: 88,
    featured: true,
  },
  {
    name: 'Logitech MX Mechanical Wireless Keyboard',
    slug: 'logitech-mx-mechanical-wireless-keyboard',
    description:
      'Low-profile mechanical switches delivering next-level typing feel. Smart backlighting automatically illuminates when hands approach and adjusts to ambient light conditions.',
    price: 14995,
    originalPrice: 16995,
    category: 'accessories',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      SwitchType: 'Tactile Quiet Low-Profile Mechanical Switches',
      Backlighting: 'Smart ambient illumination with 6 lighting effects',
      MultiDevice: 'Pair up to 3 devices with Easy-Switch button',
      Battery: 'Up to 15 days (or up to 10 months with backlighting off)',
      Charging: 'USB-C quick charge',
      Weight: '828g',
    },
    stock: 22,
    rating: 4.8,
    reviewCount: 39,
    featured: false,
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    slug: 'anker-737-power-bank-powercore-24k',
    description:
      'Ultra-powerful two-way charging with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the 24,000mAh portable charger at 140W.',
    price: 11999,
    originalPrice: 13999,
    category: 'accessories',
    brand: 'Anker',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      Capacity: '24,000 mAh (recharges iPhone 15 up to 4.9 times)',
      TotalOutput: '140W max across two USB-C ports and one USB-A port',
      SmartDisplay: 'Real-time color digital screen displaying output wattage and battery health',
      RechargeTime: 'Fast 140W recharge in just 52 minutes',
      Protection: 'ActiveShield 2.0 temperature monitoring',
      Weight: '630g',
    },
    stock: 35,
    rating: 4.9,
    reviewCount: 71,
    featured: true,
  },
  {
    name: 'Anker Prime 100W GaN Wall Charger',
    slug: 'anker-prime-100w-gan-wall-charger',
    description:
      'Compact GaN power for laptops, phones, and tablets. Charge 3 devices simultaneously with 2 USB-C ports and 1 USB-A port in a design 43% smaller than original 96W chargers.',
    price: 5999,
    originalPrice: 6999,
    category: 'accessories',
    brand: 'Anker',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      TotalWattage: '100W Power Delivery 3.0',
      Ports: '2x USB-C + 1x USB-A',
      Technology: 'GaNPrime power architecture with ActiveShield 2.0',
      FoldingProngs: 'Yes, ultra-portable travel ready design',
      Compatibility: 'MacBook Pro, iPhone, Galaxy, iPad, ThinkPad, Dell',
      Weight: '183g',
    },
    stock: 45,
    rating: 4.85,
    reviewCount: 56,
    featured: false,
  },
  {
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
    slug: 'dell-ultrasharp-27-4k-usb-c-hub-monitor',
    description:
      'Experience brilliant color and peak contrast on this 27-inch 4K IPS Black monitor with 90W Power Delivery, RJ45 Ethernet, and comprehensive connectivity.',
    price: 48999,
    originalPrice: 52999,
    category: 'accessories',
    brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      ScreenSize: '27-inch 4K UHD (3840 x 2160) at 60 Hz',
      PanelTech: 'IPS Black Technology with 2000:1 contrast ratio',
      ColorAccuracy: '100% sRGB, 98% DCI-P3, Delta E < 2',
      Connectivity: 'USB-C (90W PD), DisplayPort 1.4, HDMI 2.0, RJ45 LAN, 4x USB 3.2',
      Ergonomics: 'Height-adjustable, tilt, swivel, pivot 90°',
      Weight: '6.64 kg with stand',
    },
    stock: 11,
    rating: 4.88,
    reviewCount: 32,
    featured: false,
  },
];

async function seed() {
  console.log('Connecting to database:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB successfully!');

  // Seed / Upsert Users
  console.log('Upserting demo users...');
  const salt = await bcrypt.genSalt(10);
  const userPasswordHash = await bcrypt.hash('password123', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);

  const demoCustomer = await User.findOneAndUpdate(
    { email: 'demo@electromart.com' },
    {
      $set: {
        name: 'Alex Johnson',
        email: 'demo@electromart.com',
        passwordHash: userPasswordHash,
        role: 'customer',
        addresses: [
          {
            label: 'Home',
            street: 'B-42, Defence Colony',
            city: 'New Delhi',
            state: 'Delhi',
            zip: '110024',
            phone: '+91 98765 43210',
          },
          {
            label: 'Office',
            street: 'Tower B, DLF Cyber City, Phase 2',
            city: 'Gurugram',
            state: 'Haryana',
            zip: '122002',
            phone: '+91 98123 45678',
          },
        ],
      },
    },
    { upsert: true, new: true }
  );

  // Also upsert customer@electromart.com and alex@example.com for convenience
  await User.findOneAndUpdate(
    { email: 'alex@example.com' },
    {
      $set: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        passwordHash: userPasswordHash,
        role: 'customer',
        addresses: [
          {
            label: 'Home',
            street: 'B-42, Defence Colony',
            city: 'New Delhi',
            state: 'Delhi',
            zip: '110024',
            phone: '+91 98765 43210',
          },
          {
            label: 'Office',
            street: 'Tower B, DLF Cyber City, Phase 2',
            city: 'Gurugram',
            state: 'Haryana',
            zip: '122002',
            phone: '+91 98123 45678',
          },
        ],
      },
    },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: 'customer@electromart.com' },
    {
      $set: {
        name: 'Alex Johnson',
        email: 'customer@electromart.com',
        passwordHash: userPasswordHash,
        role: 'customer',
        addresses: [
          {
            label: 'Home',
            street: 'B-42, Defence Colony',
            city: 'New Delhi',
            state: 'Delhi',
            zip: '110024',
            phone: '+91 98765 43210',
          },
        ],
      },
    },
    { upsert: true, new: true }
  );

  const demoAdmin = await User.findOneAndUpdate(
    { email: 'admin@electromart.com' },
    {
      $set: {
        name: 'ElectroMart Admin',
        email: 'admin@electromart.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        addresses: [],
      },
    },
    { upsert: true, new: true }
  );

  console.log(`Upserted users: ${demoCustomer.email}, ${demoAdmin.email}`);

  // Upsert Products
  console.log('Upserting products...');
  const upsertedProducts = [];
  for (const p of productsData) {
    const doc = await Product.findOneAndUpdate(
      { slug: p.slug },
      { $set: p },
      { upsert: true, new: true }
    );
    upsertedProducts.push(doc);
  }
  console.log(`Upserted ${upsertedProducts.length} electronic products.`);

  // Seed Reviews for some products
  console.log('Upserting reviews...');
  const iphone = upsertedProducts.find((p) => p.slug === 'apple-iphone-15-pro-max');
  const macbook = upsertedProducts.find((p) => p.slug === 'apple-macbook-pro-16-m3-max');
  const sonyHeadphones = upsertedProducts.find((p) => p.slug === 'sony-wh-1000xm5-wireless-headphones');
  const logiMouse = upsertedProducts.find((p) => p.slug === 'logitech-mx-master-3s-performance-mouse');

  const reviewsToInsert = [];

  if (iphone) {
    reviewsToInsert.push({
      userId: demoCustomer._id,
      productId: iphone._id,
      rating: 5,
      title: 'Best phone I have ever owned!',
      comment:
        'The titanium finish feels incredible in the hand. The 5x camera zoom is crystal sharp, and USB-C makes transferring files so easy.',
      helpful: 14,
    });
  }

  if (macbook) {
    reviewsToInsert.push({
      userId: demoCustomer._id,
      productId: macbook._id,
      rating: 5,
      title: 'Absolute workstation powerhouse',
      comment:
        'Compiles Next.js builds instantly and the Liquid Retina XDR screen is out of this world for video editing. Battery lasts more than a full day.',
      helpful: 28,
    });
  }

  if (sonyHeadphones) {
    reviewsToInsert.push({
      userId: demoCustomer._id,
      productId: sonyHeadphones._id,
      rating: 5,
      title: 'Best noise cancellation on airplanes',
      comment:
        'Wore these on a 10-hour flight across the Atlantic and completely forgot about engine noise. Super light on the head and high-res audio is stunning.',
      helpful: 19,
    });
  }

  if (logiMouse) {
    reviewsToInsert.push({
      userId: demoCustomer._id,
      productId: logiMouse._id,
      rating: 5,
      title: 'Quiet clicks are a game changer in the office',
      comment:
        'The ergonomic shape relieved my wrist strain within days, and the electromagnetic scroll wheel through thousands of lines of code is unmatched.',
      helpful: 9,
    });
  }

  for (const review of reviewsToInsert) {
    await Review.findOneAndUpdate(
      { userId: review.userId, productId: review.productId },
      { $set: review },
      { upsert: true, new: true }
    );
  }
  console.log(`Upserted ${reviewsToInsert.length} verified customer reviews.`);

  // Seed Orders for demo customer
  console.log('Upserting sample customer orders with tracking timeline...');
  if (iphone && logiMouse) {
    await Order.findOneAndUpdate(
      { orderNumber: 'EM-984210' },
      {
        $set: {
          userId: demoCustomer._id,
          orderNumber: 'EM-984210',
          items: [
            {
              productId: iphone._id,
              name: iphone.name,
              price: iphone.price,
              quantity: 1,
              image: iphone.images[0],
            },
            {
              productId: logiMouse._id,
              name: logiMouse.name,
              price: logiMouse.price,
              quantity: 1,
              image: logiMouse.images[0],
            },
          ],
          subtotal: iphone.price + logiMouse.price,
          tax: Math.round((iphone.price + logiMouse.price) * 0.18 * 100) / 100,
          shipping: 0, // Free over ₹999
          total: Math.round((iphone.price + logiMouse.price) * 1.18 * 100) / 100,
          shippingAddress: {
            name: demoCustomer.name,
            street: 'B-42, Defence Colony',
            city: 'New Delhi',
            state: 'Delhi',
            zip: '110024',
            phone: '+91 98765 43210',
          },
          status: 'shipped',
          trackingUpdates: [
            {
              status: 'pending',
              timestamp: new Date(Date.now() - 36 * 3600 * 1000),
              note: 'Order placed and payment authorized.',
            },
            {
              status: 'processing',
              timestamp: new Date(Date.now() - 24 * 3600 * 1000),
              note: 'Items picked and verified at ElectroMart Warehouse.',
            },
            {
              status: 'shipped',
              timestamp: new Date(Date.now() - 6 * 3600 * 1000),
              note: 'Package handed to courier (Tracking #EM-TRK-771890). Estimated delivery tomorrow.',
            },
          ],
          paymentMethod: 'UPI (Google Pay)',
        },
      },
      { upsert: true, new: true }
    );
  }

  if (sonyHeadphones) {
    await Order.findOneAndUpdate(
      { orderNumber: 'EM-975102' },
      {
        $set: {
          userId: demoCustomer._id,
          orderNumber: 'EM-975102',
          items: [
            {
              productId: sonyHeadphones._id,
              name: sonyHeadphones.name,
              price: sonyHeadphones.price,
              quantity: 1,
              image: sonyHeadphones.images[0],
            },
          ],
          subtotal: sonyHeadphones.price,
          tax: Math.round(sonyHeadphones.price * 0.18 * 100) / 100,
          shipping: 0, // Free over ₹999
          total: Math.round(sonyHeadphones.price * 1.18 * 100) / 100,
          shippingAddress: {
            name: demoCustomer.name,
            street: 'Tower B, DLF Cyber City, Phase 2',
            city: 'Gurugram',
            state: 'Haryana',
            zip: '122002',
            phone: '+91 98123 45678',
          },
          status: 'delivered',
          trackingUpdates: [
            {
              status: 'pending',
              timestamp: new Date(Date.now() - 96 * 3600 * 1000),
              note: 'Order confirmed.',
            },
            {
              status: 'processing',
              timestamp: new Date(Date.now() - 72 * 3600 * 1000),
              note: 'Packed with ElectroMart security seal.',
            },
            {
              status: 'shipped',
              timestamp: new Date(Date.now() - 48 * 3600 * 1000),
              note: 'In transit with local delivery partner.',
            },
            {
              status: 'delivered',
              timestamp: new Date(Date.now() - 12 * 3600 * 1000),
              note: 'Delivered to office reception. Signed by recipient.',
            },
          ],
          paymentMethod: 'Credit Card (HDFC ending in 8910)',
        },
      },
      { upsert: true, new: true }
    );
  }

  // Seed sample support ticket
  await SupportTicket.findOneAndUpdate(
    { email: demoCustomer.email, subject: 'Warranty registration for Sony WH-1000XM5' },
    {
      $set: {
        userId: demoCustomer._id,
        name: demoCustomer.name,
        email: demoCustomer.email,
        subject: 'Warranty registration for Sony WH-1000XM5',
        message:
          'Hello, I just purchased the Sony WH-1000XM5 headphones and want to ensure the 2-year ElectroCare warranty is activated.',
        status: 'resolved',
      },
    },
    { upsert: true, new: true }
  );

  console.log('Database seeded successfully with all entities!');
  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
