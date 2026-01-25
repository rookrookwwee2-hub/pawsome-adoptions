// Shipping countries organized by region with prices from USA (base $1000)
// Prices increase based on distance from USA

export interface ShippingCountry {
  id: string;
  label: string;
  price: number;
  region: string;
}

// Ground transport (North America only)
export const GROUND_TRANSPORT_COUNTRIES: ShippingCountry[] = [
  { id: "usa", label: "USA (Domestic)", price: 350, region: "North America" },
  { id: "canada", label: "Canada", price: 500, region: "North America" },
  { id: "mexico", label: "Mexico", price: 650, region: "North America" },
];

// Air cargo countries organized by region with distance-based pricing
export const AIR_CARGO_COUNTRIES: ShippingCountry[] = [
  // North America (closest - $1000-$1050)
  { id: "usa_air", label: "USA (Air Cargo)", price: 1000, region: "North America" },
  { id: "canada_air", label: "Canada", price: 1000, region: "North America" },
  { id: "mexico_air", label: "Mexico", price: 1050, region: "North America" },
  
  // Caribbean & Central America ($1050-$1100)
  { id: "jamaica", label: "Jamaica", price: 1050, region: "Caribbean" },
  { id: "bahamas", label: "Bahamas", price: 1050, region: "Caribbean" },
  { id: "dominican_republic", label: "Dominican Republic", price: 1050, region: "Caribbean" },
  { id: "puerto_rico", label: "Puerto Rico", price: 1000, region: "Caribbean" },
  { id: "costa_rica", label: "Costa Rica", price: 1100, region: "Central America" },
  { id: "panama", label: "Panama", price: 1100, region: "Central America" },
  
  // South America ($1100-$1200)
  { id: "brazil", label: "Brazil", price: 1150, region: "South America" },
  { id: "argentina", label: "Argentina", price: 1200, region: "South America" },
  { id: "chile", label: "Chile", price: 1200, region: "South America" },
  { id: "colombia", label: "Colombia", price: 1100, region: "South America" },
  { id: "peru", label: "Peru", price: 1150, region: "South America" },
  { id: "venezuela", label: "Venezuela", price: 1100, region: "South America" },
  { id: "ecuador", label: "Ecuador", price: 1150, region: "South America" },
  { id: "uruguay", label: "Uruguay", price: 1200, region: "South America" },
  
  // Europe ($1100-$1300)
  { id: "uk", label: "United Kingdom", price: 1150, region: "Europe" },
  { id: "ireland", label: "Ireland", price: 1150, region: "Europe" },
  { id: "germany", label: "Germany", price: 1200, region: "Europe" },
  { id: "france", label: "France", price: 1200, region: "Europe" },
  { id: "italy", label: "Italy", price: 1200, region: "Europe" },
  { id: "spain", label: "Spain", price: 1200, region: "Europe" },
  { id: "portugal", label: "Portugal", price: 1200, region: "Europe" },
  { id: "netherlands", label: "Netherlands", price: 1200, region: "Europe" },
  { id: "belgium", label: "Belgium", price: 1200, region: "Europe" },
  { id: "switzerland", label: "Switzerland", price: 1250, region: "Europe" },
  { id: "austria", label: "Austria", price: 1250, region: "Europe" },
  { id: "sweden", label: "Sweden", price: 1250, region: "Europe" },
  { id: "norway", label: "Norway", price: 1300, region: "Europe" },
  { id: "finland", label: "Finland", price: 1300, region: "Europe" },
  { id: "denmark", label: "Denmark", price: 1250, region: "Europe" },
  { id: "poland", label: "Poland", price: 1250, region: "Europe" },
  { id: "czech_republic", label: "Czech Republic", price: 1250, region: "Europe" },
  { id: "hungary", label: "Hungary", price: 1250, region: "Europe" },
  { id: "romania", label: "Romania", price: 1300, region: "Europe" },
  { id: "greece", label: "Greece", price: 1300, region: "Europe" },
  { id: "croatia", label: "Croatia", price: 1300, region: "Europe" },
  { id: "slovenia", label: "Slovenia", price: 1300, region: "Europe" },
  { id: "slovakia", label: "Slovakia", price: 1300, region: "Europe" },
  { id: "bulgaria", label: "Bulgaria", price: 1300, region: "Europe" },
  { id: "serbia", label: "Serbia", price: 1300, region: "Europe" },
  { id: "ukraine", label: "Ukraine", price: 1300, region: "Europe" },
  { id: "iceland", label: "Iceland", price: 1300, region: "Europe" },
  { id: "luxembourg", label: "Luxembourg", price: 1200, region: "Europe" },
  { id: "malta", label: "Malta", price: 1300, region: "Europe" },
  { id: "cyprus", label: "Cyprus", price: 1350, region: "Europe" },
  
  // Middle East ($1300-$1400)
  { id: "uae", label: "United Arab Emirates", price: 1300, region: "Middle East" },
  { id: "saudi_arabia", label: "Saudi Arabia", price: 1350, region: "Middle East" },
  { id: "qatar", label: "Qatar", price: 1300, region: "Middle East" },
  { id: "kuwait", label: "Kuwait", price: 1350, region: "Middle East" },
  { id: "bahrain", label: "Bahrain", price: 1350, region: "Middle East" },
  { id: "oman", label: "Oman", price: 1350, region: "Middle East" },
  { id: "israel", label: "Israel", price: 1350, region: "Middle East" },
  { id: "jordan", label: "Jordan", price: 1350, region: "Middle East" },
  { id: "lebanon", label: "Lebanon", price: 1350, region: "Middle East" },
  { id: "turkey", label: "Turkey", price: 1300, region: "Middle East" },
  { id: "egypt", label: "Egypt", price: 1350, region: "Middle East" },
  
  // Africa ($1350-$1450)
  { id: "south_africa", label: "South Africa", price: 1400, region: "Africa" },
  { id: "morocco", label: "Morocco", price: 1350, region: "Africa" },
  { id: "kenya", label: "Kenya", price: 1400, region: "Africa" },
  { id: "nigeria", label: "Nigeria", price: 1400, region: "Africa" },
  { id: "ghana", label: "Ghana", price: 1400, region: "Africa" },
  { id: "tanzania", label: "Tanzania", price: 1450, region: "Africa" },
  { id: "ethiopia", label: "Ethiopia", price: 1450, region: "Africa" },
  { id: "tunisia", label: "Tunisia", price: 1400, region: "Africa" },
  { id: "algeria", label: "Algeria", price: 1400, region: "Africa" },
  { id: "senegal", label: "Senegal", price: 1400, region: "Africa" },
  { id: "mauritius", label: "Mauritius", price: 1450, region: "Africa" },
  
  // Asia ($1300-$1500)
  { id: "japan", label: "Japan", price: 1350, region: "Asia" },
  { id: "south_korea", label: "South Korea", price: 1350, region: "Asia" },
  { id: "china", label: "China", price: 1400, region: "Asia" },
  { id: "hong_kong", label: "Hong Kong", price: 1350, region: "Asia" },
  { id: "taiwan", label: "Taiwan", price: 1350, region: "Asia" },
  { id: "singapore", label: "Singapore", price: 1400, region: "Asia" },
  { id: "malaysia", label: "Malaysia", price: 1400, region: "Asia" },
  { id: "thailand", label: "Thailand", price: 1400, region: "Asia" },
  { id: "vietnam", label: "Vietnam", price: 1400, region: "Asia" },
  { id: "philippines", label: "Philippines", price: 1400, region: "Asia" },
  { id: "indonesia", label: "Indonesia", price: 1450, region: "Asia" },
  { id: "india", label: "India", price: 1400, region: "Asia" },
  { id: "pakistan", label: "Pakistan", price: 1450, region: "Asia" },
  { id: "bangladesh", label: "Bangladesh", price: 1450, region: "Asia" },
  { id: "sri_lanka", label: "Sri Lanka", price: 1450, region: "Asia" },
  { id: "nepal", label: "Nepal", price: 1500, region: "Asia" },
  { id: "cambodia", label: "Cambodia", price: 1450, region: "Asia" },
  { id: "myanmar", label: "Myanmar", price: 1500, region: "Asia" },
  
  // Oceania ($1400-$1500)
  { id: "australia", label: "Australia", price: 1450, region: "Oceania" },
  { id: "new_zealand", label: "New Zealand", price: 1500, region: "Oceania" },
  { id: "fiji", label: "Fiji", price: 1500, region: "Oceania" },
  
  // Russia & Central Asia ($1350-$1450)
  { id: "russia", label: "Russia", price: 1400, region: "Russia & Central Asia" },
  { id: "kazakhstan", label: "Kazakhstan", price: 1450, region: "Russia & Central Asia" },
  { id: "uzbekistan", label: "Uzbekistan", price: 1450, region: "Russia & Central Asia" },
];

// Get all unique regions
export const getRegions = (): string[] => {
  const regions = new Set(AIR_CARGO_COUNTRIES.map(c => c.region));
  return Array.from(regions);
};

// Get countries by region
export const getCountriesByRegion = (region: string): ShippingCountry[] => {
  return AIR_CARGO_COUNTRIES.filter(c => c.region === region);
};
