import 'dotenv/config';
import mongoose from 'mongoose';
import Destination from './models/Destination.js';
import District from './models/District.js';
import Review from './models/Review.js';

const MONGODB_URI = process.env.MONGODB_URI;

// ─── DESTINATIONS ───────────────────────────────────────────────
const destinations = [
  {
    destinationId: 'alleppey',
    name: 'Alleppey',
    subtitle: 'Venice of the East',
    category: 'Backwaters',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    description: 'Experience the serene backwaters of Alleppey on a traditional houseboat. Glide through palm-fringed canals and witness stunning sunsets over the lagoons.',
    highlights: ['Houseboat cruises', 'Alappuzha Beach', 'Pathiramanal Island', 'Marari Beach'],
    bestSeason: 'Oct - Mar',
    district: 'Alappuzha',
    weatherTemp: '28°C',
    weatherCondition: 'Partly Cloudy',
    coordinates: { lat: 9.4981, lng: 76.3388 },
  },
  {
    destinationId: 'munnar',
    name: 'Munnar',
    subtitle: 'Hills Draped in Tea',
    category: 'Hills',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1597735881932-d9664c9bbcea?w=600&h=400&fit=crop',
    description: 'Nestled in the Western Ghats, Munnar is a tapestry of rolling tea plantations, misty peaks, and exotic wildlife. A paradise for nature lovers.',
    highlights: ['Tea plantations', 'Eravikulam National Park', 'Top Station', 'Mattupetty Dam'],
    bestSeason: 'Sep - May',
    district: 'Idukki',
    weatherTemp: '22°C',
    weatherCondition: 'Misty',
    coordinates: { lat: 10.0889, lng: 77.0595 },
  },
  {
    destinationId: 'varkala',
    name: 'Varkala',
    subtitle: 'Cliff & Sea',
    category: 'Beach',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&h=400&fit=crop',
    description: 'Dramatic cliffs overlooking the Arabian Sea, natural mineral springs, and a laid-back beach vibe make Varkala an unmissable coastal gem.',
    highlights: ['Varkala Cliff', 'Papanasam Beach', 'Janardanaswamy Temple', 'Anchuthengu Fort'],
    bestSeason: 'Oct - Feb',
    district: 'Thiruvananthapuram',
    weatherTemp: '30°C',
    weatherCondition: 'Sunny',
    coordinates: { lat: 8.7379, lng: 76.7163 },
  },
  {
    destinationId: 'wayanad',
    name: 'Wayanad',
    subtitle: 'Land of Paddy Fields',
    category: 'Wildlife',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626013516976-88e8c2aed837?w=600&h=400&fit=crop',
    description: 'Ancient caves, misty mountain peaks, lush forests, and diverse wildlife sanctuaries — Wayanad is raw nature at its finest.',
    highlights: ['Edakkal Caves', 'Chembra Peak', 'Wayanad Wildlife Sanctuary', 'Banasura Sagar Dam'],
    bestSeason: 'Oct - May',
    district: 'Wayanad',
    weatherTemp: '25°C',
    weatherCondition: 'Pleasant',
    coordinates: { lat: 11.6854, lng: 76.1320 },
  },
  {
    destinationId: 'kovalam',
    name: 'Kovalam',
    subtitle: 'Beach Paradise',
    category: 'Beach',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1579600161224-cebba4a0ea8b?w=600&h=400&fit=crop',
    description: 'Three crescent-shaped beaches lined with coconut palms, a lighthouse with panoramic views, and world-class Ayurvedic resorts.',
    highlights: ['Lighthouse Beach', 'Hawa Beach', 'Samudra Beach', 'Vizhinjam Mosque'],
    bestSeason: 'Sep - Mar',
    district: 'Thiruvananthapuram',
    weatherTemp: '31°C',
    weatherCondition: 'Sunny',
    coordinates: { lat: 8.4004, lng: 76.9787 },
  },
  {
    destinationId: 'thekkady',
    name: 'Thekkady',
    subtitle: 'Spice Capital',
    category: 'Wildlife',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&h=400&fit=crop',
    description: "Home to the Periyar Tiger Reserve, Thekkady is a wildlife enthusiast's dream surrounded by aromatic spice plantations.",
    highlights: ['Periyar Tiger Reserve', 'Spice Plantations', 'Bamboo Rafting', 'Tribal Heritage'],
    bestSeason: 'Sep - May',
    district: 'Idukki',
    weatherTemp: '24°C',
    weatherCondition: 'Cool',
    coordinates: { lat: 9.6000, lng: 77.1667 },
  },
  {
    destinationId: 'fort-kochi',
    name: 'Fort Kochi',
    subtitle: 'Heritage Hub',
    category: 'Heritage',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590123715937-e3e3e3e3e3e3?w=600&h=400&fit=crop',
    description: 'A melting pot of Portuguese, Dutch, and British colonial history. Chinese fishing nets, art galleries, and charming cafés line the waterfront.',
    highlights: ['Chinese Fishing Nets', 'St. Francis Church', 'Mattancherry Palace', 'Jew Town'],
    bestSeason: 'Oct - Mar',
    district: 'Ernakulam',
    weatherTemp: '29°C',
    weatherCondition: 'Partly Cloudy',
    coordinates: { lat: 9.9658, lng: 76.2421 },
  },
  {
    destinationId: 'kumarakom',
    name: 'Kumarakom',
    subtitle: 'Backwater Bliss',
    category: 'Backwaters',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    description: 'Set on the banks of Vembanad Lake, Kumarakom is a cluster of islands famous for its bird sanctuary and luxury houseboats.',
    highlights: ['Kumarakom Bird Sanctuary', 'Vembanad Lake', 'Luxury Houseboats', 'Aruvikkuzhi Waterfall'],
    bestSeason: 'Sep - Mar',
    district: 'Kottayam',
    weatherTemp: '28°C',
    weatherCondition: 'Pleasant',
    coordinates: { lat: 9.6175, lng: 76.4301 },
  },
  {
    destinationId: 'bekal',
    name: 'Bekal',
    subtitle: 'Fort by the Sea',
    category: 'Heritage',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=600&h=400&fit=crop',
    description: 'Home to Kerala\'s largest fort, Bekal offers dramatic sea views, pristine beaches, and a peek into the region\'s martial history.',
    highlights: ['Bekal Fort', 'Bekal Beach', 'Pallikkere Beach', 'Ananthapura Temple'],
    bestSeason: 'Oct - Feb',
    district: 'Kasaragod',
    weatherTemp: '30°C',
    weatherCondition: 'Sunny',
    coordinates: { lat: 12.3918, lng: 75.0329 },
  },
  {
    destinationId: 'athirappilly',
    name: 'Athirappilly',
    subtitle: 'Niagara of India',
    category: 'Waterfalls',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop',
    description: 'Kerala\'s most spectacular waterfall cascading from 80 feet amidst lush tropical forest. A majestic sight during the monsoon season.',
    highlights: ['Athirappilly Falls', 'Vazhachal Falls', 'Charpa Falls', 'Sholayar Dam'],
    bestSeason: 'Jun - Jan',
    district: 'Thrissur',
    weatherTemp: '27°C',
    weatherCondition: 'Humid',
    coordinates: { lat: 10.2853, lng: 76.5697 },
  },
];

// ─── ALL 14 KERALA DISTRICTS WITH ACTIVITIES ────────────────────
const districts = [
  {
    districtId: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    nickname: 'The Evergreen City',
    description: 'The capital city of Kerala, known for the Padmanabhaswamy Temple, beautiful beaches, and rich cultural heritage.',
    image: 'https://images.unsplash.com/photo-1579600161224-cebba4a0ea8b?w=600&h=400&fit=crop',
    coordinates: { lat: 8.5241, lng: 76.9366 },
    population: '33.07 lakh',
    area: '2,192 km²',
    famousFor: ['Padmanabhaswamy Temple', 'Kovalam Beach', 'Varkala Cliff', 'Napier Museum'],
    activities: [
      { name: 'Beach Surfing', icon: '🏄', description: 'Catch waves at Kovalam and Varkala beaches', category: 'Adventure' },
      { name: 'Temple Visits', icon: '🛕', description: 'Explore the legendary Padmanabhaswamy Temple', category: 'Culture' },
      { name: 'Ayurvedic Spa', icon: '💆', description: 'Experience authentic Ayurvedic treatments', category: 'Wellness' },
      { name: 'Museum Tour', icon: '🏛️', description: 'Visit Napier Museum and Natural History Museum', category: 'Culture' },
      { name: 'Cliff Walking', icon: '🚶', description: 'Walk along the dramatic Varkala cliffs', category: 'Nature' },
      { name: 'Lighthouse Visit', icon: '🗼', description: 'Climb the Kovalam Lighthouse for panoramic views', category: 'Sightseeing' },
    ],
  },
  {
    districtId: 'kollam',
    name: 'Kollam',
    nickname: 'Cashew Capital of the World',
    description: 'Known for its cashew industry, Ashtamudi Lake, and as the southern gateway to Kerala\'s backwaters.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    coordinates: { lat: 8.8932, lng: 76.6141 },
    population: '26.29 lakh',
    area: '2,491 km²',
    famousFor: ['Ashtamudi Lake', 'Thirumullavaram Beach', 'Jatayu Earth Centre', 'Cashew Industry'],
    activities: [
      { name: 'Backwater Cruise', icon: '🛶', description: 'Cruise through Ashtamudi Lake on a kettuvallam', category: 'Nature' },
      { name: 'Jatayu Rock Visit', icon: '🦅', description: 'Visit the world\'s largest bird sculpture at Jatayu Earth Centre', category: 'Adventure' },
      { name: 'Cashew Factory Tour', icon: '🥜', description: 'See how cashews are processed in local factories', category: 'Culture' },
      { name: 'Beach Relaxation', icon: '🏖️', description: 'Unwind at Thirumullavaram Beach', category: 'Leisure' },
      { name: 'Fishing', icon: '🎣', description: 'Try traditional fishing in the backwaters', category: 'Adventure' },
    ],
  },
  {
    districtId: 'pathanamthitta',
    name: 'Pathanamthitta',
    nickname: 'Headquarters of Pilgrimage Tourism',
    description: 'A major pilgrimage centre home to Sabarimala Temple, surrounded by dense forests and rivers.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&h=400&fit=crop',
    coordinates: { lat: 9.2648, lng: 76.7870 },
    population: '11.95 lakh',
    area: '2,637 km²',
    famousFor: ['Sabarimala Temple', 'Perunthenaruvi Waterfall', 'Gavi', 'Konni Elephant Camp'],
    activities: [
      { name: 'Sabarimala Pilgrimage', icon: '🛕', description: 'Visit the world-famous Ayyappa Temple at Sabarimala', category: 'Pilgrimage' },
      { name: 'Elephant Camp Visit', icon: '🐘', description: 'Interact with elephants at Konni Elephant Training Centre', category: 'Wildlife' },
      { name: 'Gavi Eco-Tourism', icon: '🌿', description: 'Trek through the pristine forests of Gavi', category: 'Nature' },
      { name: 'Waterfall Trekking', icon: '💧', description: 'Hike to Perunthenaruvi Waterfall', category: 'Adventure' },
      { name: 'River Rafting', icon: '🚣', description: 'White water rafting in the Pamba River', category: 'Adventure' },
    ],
  },
  {
    districtId: 'alappuzha',
    name: 'Alappuzha',
    nickname: 'Venice of the East',
    description: 'Famous for its network of backwaters, houseboats, beaches, and the iconic Nehru Trophy Boat Race.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    population: '21.21 lakh',
    area: '1,414 km²',
    famousFor: ['Backwaters', 'Nehru Trophy Boat Race', 'Alappuzha Beach', 'Coir Industry'],
    activities: [
      { name: 'Houseboat Stay', icon: '🛥️', description: 'Stay overnight on a traditional Kerala houseboat', category: 'Leisure' },
      { name: 'Snake Boat Race', icon: '🏁', description: 'Watch the thrilling Nehru Trophy Snake Boat Race (Aug)', category: 'Culture' },
      { name: 'Coir Making', icon: '🧵', description: 'Learn traditional coir rope-making from artisans', category: 'Culture' },
      { name: 'Canoe Ride', icon: '🛶', description: 'Paddle through narrow backwater canals in a canoe', category: 'Nature' },
      { name: 'Sunset Watching', icon: '🌅', description: 'Watch the golden sunset at Alappuzha Beach pier', category: 'Leisure' },
      { name: 'Bird Watching', icon: '🐦', description: 'Spot rare migratory birds at Pathiramanal Island', category: 'Nature' },
    ],
  },
  {
    districtId: 'kottayam',
    name: 'Kottayam',
    nickname: 'Land of Letters, Latex & Lakes',
    description: 'Known for its 100% literacy, rubber plantations, and serene Vembanad Lake — the largest lake in Kerala.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    coordinates: { lat: 9.5916, lng: 76.5222 },
    population: '19.74 lakh',
    area: '2,203 km²',
    famousFor: ['Kumarakom', 'Rubber Plantations', 'Vembanad Lake', 'Thazhathangady Juma Masjid'],
    activities: [
      { name: 'Kumarakom Birding', icon: '🐦', description: 'Visit the famous Kumarakom Bird Sanctuary', category: 'Nature' },
      { name: 'Rubber Plantation Walk', icon: '🌳', description: 'Tour a working rubber plantation and see latex tapping', category: 'Culture' },
      { name: 'Lake Fishing', icon: '🎣', description: 'Fish in the vast Vembanad Lake', category: 'Leisure' },
      { name: 'Church Visits', icon: '⛪', description: 'Explore ancient churches including Ettumanoor Temple', category: 'Culture' },
      { name: 'Luxury Houseboat', icon: '🛥️', description: 'Premium houseboat experience on Vembanad Lake', category: 'Leisure' },
    ],
  },
  {
    districtId: 'idukki',
    name: 'Idukki',
    nickname: 'Spice Garden of Kerala',
    description: 'A mountainous district with the highest arch dam in Asia, vast spice plantations, and hill stations like Munnar.',
    image: 'https://images.unsplash.com/photo-1597735881932-d9664c9bbcea?w=600&h=400&fit=crop',
    coordinates: { lat: 9.8494, lng: 76.9720 },
    population: '11.08 lakh',
    area: '4,358 km²',
    famousFor: ['Munnar', 'Thekkady', 'Idukki Arch Dam', 'Spice Plantations'],
    activities: [
      { name: 'Tea Plantation Tour', icon: '🍵', description: 'Walk through rolling tea gardens in Munnar', category: 'Nature' },
      { name: 'Tiger Reserve Safari', icon: '🐅', description: 'Boat safari in Periyar Tiger Reserve', category: 'Wildlife' },
      { name: 'Spice Garden Walk', icon: '🌶️', description: 'Discover cardamom, pepper, and cinnamon plantations', category: 'Culture' },
      { name: 'Trekking', icon: '🥾', description: 'Trek to Anamudi Peak — South India\'s highest point', category: 'Adventure' },
      { name: 'Dam Visit', icon: '🏗️', description: 'See the impressive Idukki Arch Dam', category: 'Sightseeing' },
      { name: 'Bamboo Rafting', icon: '🎋', description: 'Raft through Periyar Lake on bamboo rafts', category: 'Adventure' },
      { name: 'Camping', icon: '⛺', description: 'Camp in the misty hills of Vagamon and Munnar', category: 'Adventure' },
    ],
  },
  {
    districtId: 'ernakulam',
    name: 'Ernakulam',
    nickname: 'Queen of the Arabian Sea',
    description: 'Kerala\'s commercial capital, home to the historic Fort Kochi, modern Kochi city, and a vibrant art scene.',
    image: 'https://images.unsplash.com/photo-1590123715937-e3e3e3e3e3e3?w=600&h=400&fit=crop',
    coordinates: { lat: 9.9816, lng: 76.2999 },
    population: '32.82 lakh',
    area: '3,068 km²',
    famousFor: ['Fort Kochi', 'Chinese Fishing Nets', 'Kochi Biennale', 'Marine Drive'],
    activities: [
      { name: 'Heritage Walk', icon: '🚶', description: 'Walk through Fort Kochi\'s colonial-era streets', category: 'Culture' },
      { name: 'Chinese Net Fishing', icon: '🎣', description: 'Watch the iconic Chinese fishing nets at sunset', category: 'Culture' },
      { name: 'Art Gallery Tour', icon: '🎨', description: 'Visit galleries and street art in the Kochi art district', category: 'Culture' },
      { name: 'Marine Drive Walk', icon: '🌊', description: 'Stroll along Kochi\'s scenic Marine Drive promenade', category: 'Leisure' },
      { name: 'Cruise to Islands', icon: '⛴️', description: 'Ferry to Vypeen and Bolgatty islands', category: 'Adventure' },
      { name: 'Kathakali Show', icon: '🎭', description: 'Watch a traditional Kathakali dance performance', category: 'Culture' },
    ],
  },
  {
    districtId: 'thrissur',
    name: 'Thrissur',
    nickname: 'Cultural Capital of Kerala',
    description: 'The cultural heart of Kerala, famous for the Thrissur Pooram festival, ancient temples, and Athirappilly Falls.',
    image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop',
    coordinates: { lat: 10.5276, lng: 76.2144 },
    population: '31.10 lakh',
    area: '3,032 km²',
    famousFor: ['Thrissur Pooram', 'Athirappilly Falls', 'Vadakkunnathan Temple', 'Kerala Kalamandalam'],
    activities: [
      { name: 'Thrissur Pooram Festival', icon: '🎉', description: 'Witness Kerala\'s grandest temple festival (Apr/May)', category: 'Culture' },
      { name: 'Waterfall Visit', icon: '💧', description: 'Marvel at the majestic Athirappilly and Vazhachal Falls', category: 'Nature' },
      { name: 'Kalamandalam Visit', icon: '💃', description: 'Watch classical art forms at Kerala Kalamandalam', category: 'Culture' },
      { name: 'Temple Architecture', icon: '🛕', description: 'Explore the ancient Vadakkunnathan Temple', category: 'Culture' },
      { name: 'Shopping', icon: '🛍️', description: 'Buy traditional gold jewelry and silk at Thrissur Swaraj Round', category: 'Leisure' },
    ],
  },
  {
    districtId: 'palakkad',
    name: 'Palakkad',
    nickname: 'Gateway of Kerala',
    description: 'Known for the Palakkad Gap, lush paddy fields, and Tipu Sultan\'s fort. The granary of Kerala.',
    image: 'https://images.unsplash.com/photo-1626013516976-88e8c2aed837?w=600&h=400&fit=crop',
    coordinates: { lat: 10.7867, lng: 76.6548 },
    population: '28.09 lakh',
    area: '4,480 km²',
    famousFor: ['Palakkad Fort', 'Silent Valley', 'Malampuzha Dam', 'Nelliyampathy Hills'],
    activities: [
      { name: 'Silent Valley Trek', icon: '🌳', description: 'Trek through the pristine Silent Valley National Park', category: 'Adventure' },
      { name: 'Fort Exploration', icon: '🏰', description: 'Explore the historic Tipu Sultan\'s Fort', category: 'Culture' },
      { name: 'Dam Picnic', icon: '🏞️', description: 'Visit Malampuzha Dam and enjoy the fantasy park', category: 'Leisure' },
      { name: 'Paddy Field Walks', icon: '🌾', description: 'Walk through the vast green paddy fields', category: 'Nature' },
      { name: 'Rock Garden Visit', icon: '🪨', description: 'Explore the unique Malampuzha Rock Garden', category: 'Sightseeing' },
      { name: 'Hill Station Trip', icon: '⛰️', description: 'Drive up to the scenic Nelliyampathy Hills', category: 'Nature' },
    ],
  },
  {
    districtId: 'malappuram',
    name: 'Malappuram',
    nickname: 'Land of Hills & Devotion',
    description: 'A district rich in Islamic heritage, lush hills, and the famous Nilambur teak forests — world\'s oldest teak plantation.',
    image: 'https://images.unsplash.com/photo-1626013516976-88e8c2aed837?w=600&h=400&fit=crop',
    coordinates: { lat: 11.0510, lng: 76.0711 },
    population: '41.13 lakh',
    area: '3,550 km²',
    famousFor: ['Nilambur Teak Museum', 'Kottakkunnu', 'Thirunavaya Temple', 'Adyanpara Falls'],
    activities: [
      { name: 'Teak Museum Visit', icon: '🌳', description: 'Visit the world\'s first teak museum in Nilambur', category: 'Culture' },
      { name: 'Waterfall Trekking', icon: '💧', description: 'Trek to Adyanpara and Kakkadampoyil waterfalls', category: 'Adventure' },
      { name: 'Nedumkayam Rainforest', icon: '🌿', description: 'Explore the dense Nedumkayam rainforest', category: 'Nature' },
      { name: 'Heritage Walking', icon: '🚶', description: 'Walk through the historic Kottakkunnu hilltop park', category: 'Culture' },
      { name: 'River Bath', icon: '🏊', description: 'Enjoy a refreshing swim in Bharathapuzha river', category: 'Leisure' },
    ],
  },
  {
    districtId: 'kozhikode',
    name: 'Kozhikode',
    nickname: 'City of Spices',
    description: 'Once a major spice trading hub, Kozhikode (Calicut) is known for its cuisine, Kappad Beach, and rich history with Vasco da Gama.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&h=400&fit=crop',
    coordinates: { lat: 11.2588, lng: 75.7804 },
    population: '30.86 lakh',
    area: '2,344 km²',
    famousFor: ['Kappad Beach', 'Kozhikode Beach', 'Beypore', 'Thusharagiri Waterfalls'],
    activities: [
      { name: 'Food Trail', icon: '🍛', description: 'Taste legendary Kozhikode biryani, halwa, and banana chips', category: 'Culture' },
      { name: 'Kappad Beach Visit', icon: '🏖️', description: 'Visit where Vasco da Gama first landed in India', category: 'Sightseeing' },
      { name: 'Uru Making at Beypore', icon: '⚓', description: 'Watch traditional Arab dhow (Uru) boat-building', category: 'Culture' },
      { name: 'Waterfall Rappelling', icon: '🧗', description: 'Rappel down Thusharagiri Waterfalls', category: 'Adventure' },
      { name: 'Mangrove Walk', icon: '🌿', description: 'Explore the mangrove wetlands at Kadalundi', category: 'Nature' },
      { name: 'Street Art Tour', icon: '🎨', description: 'Discover vibrant street art in the city center', category: 'Culture' },
    ],
  },
  {
    districtId: 'wayanad',
    name: 'Wayanad',
    nickname: 'Green Paradise',
    description: 'Misty mountains, ancient caves with petroglyphs, wildlife sanctuaries, and coffee plantations make Wayanad a nature lover\'s paradise.',
    image: 'https://images.unsplash.com/photo-1626013516976-88e8c2aed837?w=600&h=400&fit=crop',
    coordinates: { lat: 11.6854, lng: 76.1320 },
    population: '8.17 lakh',
    area: '2,131 km²',
    famousFor: ['Edakkal Caves', 'Chembra Peak', 'Banasura Sagar Dam', 'Wildlife Sanctuary'],
    activities: [
      { name: 'Cave Exploration', icon: '🕳️', description: 'See 3000-year-old petroglyphs at Edakkal Caves', category: 'Culture' },
      { name: 'Chembra Peak Trek', icon: '🥾', description: 'Trek to the heart-shaped lake atop Chembra Peak', category: 'Adventure' },
      { name: 'Wildlife Safari', icon: '🐘', description: 'Spot elephants and deer at Wayanad Wildlife Sanctuary', category: 'Wildlife' },
      { name: 'Bamboo Rafting', icon: '🎋', description: 'Raft on the Banasura Sagar reservoir', category: 'Adventure' },
      { name: 'Coffee Plantation Tour', icon: '☕', description: 'Walk through aromatic coffee and spice estates', category: 'Nature' },
      { name: 'Zip Lining', icon: '🪂', description: 'Zip line across valleys at adventure parks', category: 'Adventure' },
      { name: 'Tribal Village Visit', icon: '🏘️', description: 'Visit indigenous tribal communities and learn their crafts', category: 'Culture' },
    ],
  },
  {
    districtId: 'kannur',
    name: 'Kannur',
    nickname: 'Land of Looms & Lore',
    description: 'Known for Theyyam folk rituals, pristine beaches, historic forts, and the handloom weaving industry.',
    image: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=600&h=400&fit=crop',
    coordinates: { lat: 11.8745, lng: 75.3704 },
    population: '25.23 lakh',
    area: '2,966 km²',
    famousFor: ['Theyyam', 'St Angelo Fort', 'Muzhappilangad Beach', 'Payyambalam Beach'],
    activities: [
      { name: 'Theyyam Ritual', icon: '🎭', description: 'Witness the ancient Theyyam ritualistic dance (Oct–Apr)', category: 'Culture' },
      { name: 'Drive-in Beach', icon: '🚗', description: 'Drive on Muzhappilangad Beach — India\'s longest drive-in beach', category: 'Adventure' },
      { name: 'Fort Visit', icon: '🏰', description: 'Explore the Portuguese-built St. Angelo Fort', category: 'Culture' },
      { name: 'Handloom Shopping', icon: '🧶', description: 'Buy Kannur\'s famous handloom textiles', category: 'Leisure' },
      { name: 'Island Hopping', icon: '🏝️', description: 'Visit Dharmadam Island and Ezhimala', category: 'Nature' },
      { name: 'Parasailing', icon: '🪂', description: 'Parasail over the beaches of Kannur', category: 'Adventure' },
    ],
  },
  {
    districtId: 'kasaragod',
    name: 'Kasaragod',
    nickname: 'Land of Gods & Forts',
    description: 'Kerala\'s northernmost district, known for Bekal Fort, multilingual culture, and pristine undiscovered beaches.',
    image: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=600&h=400&fit=crop',
    coordinates: { lat: 12.4996, lng: 74.9869 },
    population: '13.07 lakh',
    area: '1,992 km²',
    famousFor: ['Bekal Fort', 'Chandragiri Fort', 'Ananthapura Lake Temple', 'Ranipuram Hills'],
    activities: [
      { name: 'Bekal Fort Tour', icon: '🏰', description: 'Explore Kerala\'s largest and best preserved fort', category: 'Culture' },
      { name: 'Beach Resort Stay', icon: '🏖️', description: 'Relax at luxury beach resorts near Bekal', category: 'Leisure' },
      { name: 'Ranipuram Trekking', icon: '🥾', description: 'Trek through the Shola grasslands of Ranipuram', category: 'Adventure' },
      { name: 'Lake Temple Visit', icon: '🛕', description: 'Visit the unique Ananthapura Lake Temple', category: 'Culture' },
      { name: 'Kayaking', icon: '🚣', description: 'Kayak through the Chandragiri river and backwaters', category: 'Adventure' },
    ],
  },
];

// ─── SAMPLE REVIEWS ─────────────────────────────────────────────
const reviews = [
  { destinationId: 'alleppey', name: 'Arjun M.', rating: 5, text: 'Alleppey is absolutely magical! The houseboat experience is once-in-a-lifetime. Waking up to the sound of water and birds was surreal.', date: '2 weeks ago' },
  { destinationId: 'alleppey', name: 'Sarah K.', rating: 4, text: 'Beautiful backwaters and great food on the houseboat. The sunset from the boat was unforgettable!', date: '1 month ago' },
  { destinationId: 'alleppey', name: 'Priya R.', rating: 5, text: 'One of the most peaceful trips I\'ve ever taken. The canals, the coconut palms, pure bliss.', date: '2 months ago' },
  { destinationId: 'munnar', name: 'Rahul D.', rating: 5, text: 'Munnar is heaven on earth! The tea gardens stretching to the horizon are a photographer\'s dream.', date: '1 week ago' },
  { destinationId: 'munnar', name: 'Lisa T.', rating: 5, text: 'The misty mornings and cool breeze made our stay magical. Don\'t miss the Eravikulam National Park!', date: '3 weeks ago' },
  { destinationId: 'munnar', name: 'Anil K.', rating: 4, text: 'Beautiful hill station with amazing views. The drive up is scenic but can be winding. Worth every turn!', date: '1 month ago' },
  { destinationId: 'varkala', name: 'James P.', rating: 5, text: 'The cliff and the ocean view — nothing beats Varkala! Great cafés along the cliff too.', date: '2 weeks ago' },
  { destinationId: 'varkala', name: 'Meera S.', rating: 4, text: 'Loved the vibe! Very relaxing with great seafood restaurants. The sunset view from the cliff is incredible.', date: '3 weeks ago' },
  { destinationId: 'wayanad', name: 'Dev B.', rating: 5, text: 'Wayanad is raw, untouched nature. The Edakkal Caves blew my mind — 3000 year old art!', date: '1 week ago' },
  { destinationId: 'wayanad', name: 'Sneha R.', rating: 5, text: 'Chembra Peak trek was challenging but the heart-shaped lake at the top made it all worth it.', date: '2 weeks ago' },
  { destinationId: 'kovalam', name: 'Tom W.', rating: 4, text: 'Great beach town with excellent Ayurvedic massage centers. The lighthouse beach is beautiful.', date: '1 month ago' },
  { destinationId: 'thekkady', name: 'Vinod M.', rating: 5, text: 'Saw wild elephants during the boat safari! The spice plantation tour was enlightening and fragrant.', date: '2 weeks ago' },
  { destinationId: 'thekkady', name: 'Anna L.', rating: 4, text: 'Periyar is a must-visit. The bamboo rafting was adventurous and the forest is pristine.', date: '1 month ago' },
  { destinationId: 'fort-kochi', name: 'Maria G.', rating: 5, text: 'Fort Kochi is a beautiful blend of history and art. The Chinese fishing nets at sunset are iconic.', date: '3 weeks ago' },
  { destinationId: 'kumarakom', name: 'Suresh P.', rating: 5, text: 'The bird sanctuary is incredible! Saw so many migratory birds. The luxury houseboat was top-notch.', date: '1 month ago' },
  { destinationId: 'athirappilly', name: 'Deepa N.', rating: 5, text: 'The falls are absolutely majestic! During monsoon, the power of the water is breathtaking. A must-see!', date: '2 weeks ago' },
];

// ─── SEED FUNCTION ──────────────────────────────────────────────
async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Destination.deleteMany({});
    await District.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Cleared!\n');

    // Seed destinations
    console.log('📍 Seeding destinations...');
    const savedDestinations = await Destination.insertMany(destinations);
    console.log(`   ✅ ${savedDestinations.length} destinations seeded\n`);

    // Seed districts
    console.log('🗺️  Seeding districts...');
    const savedDistricts = await District.insertMany(districts);
    console.log(`   ✅ ${savedDistricts.length} districts seeded\n`);

    // Seed reviews
    console.log('⭐ Seeding reviews...');
    const savedReviews = await Review.insertMany(reviews);
    console.log(`   ✅ ${savedReviews.length} reviews seeded\n`);

    // Print summary
    console.log('═══════════════════════════════════════');
    console.log('  🌴 Kerala Tourism DB Seeded!');
    console.log('═══════════════════════════════════════');
    console.log(`  📍 Destinations: ${savedDestinations.length}`);
    console.log(`  🗺️  Districts:    ${savedDistricts.length}`);
    console.log(`  ⭐ Reviews:      ${savedReviews.length}`);
    console.log('═══════════════════════════════════════\n');

    // Print all districts
    console.log('📋 All 14 Kerala Districts:');
    savedDistricts.forEach((d, i) => {
      console.log(`   ${i + 1}. ${d.name} (${d.nickname}) — ${d.activities.length} activities`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done! Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
