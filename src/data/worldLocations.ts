// Comprehensive world locations with coordinates for distance calculation
// Coordinates are approximate center points for distance estimation
// 93 Countries with their States/Regions

export interface Region {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  regions: Region[];
}

// ==================== NORTH AMERICA ====================

// USA States with coordinates
const usaStates: Region[] = [
  { id: "us-al", name: "Alabama", lat: 32.806671, lng: -86.791130 },
  { id: "us-ak", name: "Alaska", lat: 61.370716, lng: -152.404419 },
  { id: "us-az", name: "Arizona", lat: 33.729759, lng: -111.431221 },
  { id: "us-ar", name: "Arkansas", lat: 34.969704, lng: -92.373123 },
  { id: "us-ca", name: "California", lat: 36.116203, lng: -119.681564 },
  { id: "us-co", name: "Colorado", lat: 39.059811, lng: -105.311104 },
  { id: "us-ct", name: "Connecticut", lat: 41.597782, lng: -72.755371 },
  { id: "us-de", name: "Delaware", lat: 39.318523, lng: -75.507141 },
  { id: "us-fl", name: "Florida", lat: 27.766279, lng: -81.686783 },
  { id: "us-ga", name: "Georgia", lat: 33.040619, lng: -83.643074 },
  { id: "us-hi", name: "Hawaii", lat: 21.094318, lng: -157.498337 },
  { id: "us-id", name: "Idaho", lat: 44.240459, lng: -114.478828 },
  { id: "us-il", name: "Illinois", lat: 40.349457, lng: -88.986137 },
  { id: "us-in", name: "Indiana", lat: 39.849426, lng: -86.258278 },
  { id: "us-ia", name: "Iowa", lat: 42.011539, lng: -93.210526 },
  { id: "us-ks", name: "Kansas", lat: 38.526600, lng: -96.726486 },
  { id: "us-ky", name: "Kentucky", lat: 37.668140, lng: -84.670067 },
  { id: "us-la", name: "Louisiana", lat: 31.169546, lng: -91.867805 },
  { id: "us-me", name: "Maine", lat: 44.693947, lng: -69.381927 },
  { id: "us-md", name: "Maryland", lat: 39.063946, lng: -76.802101 },
  { id: "us-ma", name: "Massachusetts", lat: 42.230171, lng: -71.530106 },
  { id: "us-mi", name: "Michigan", lat: 43.326618, lng: -84.536095 },
  { id: "us-mn", name: "Minnesota", lat: 45.694454, lng: -93.900192 },
  { id: "us-ms", name: "Mississippi", lat: 32.741646, lng: -89.678696 },
  { id: "us-mo", name: "Missouri", lat: 38.456085, lng: -92.288368 },
  { id: "us-mt", name: "Montana", lat: 46.921925, lng: -110.454353 },
  { id: "us-ne", name: "Nebraska", lat: 41.125370, lng: -98.268082 },
  { id: "us-nv", name: "Nevada", lat: 38.313515, lng: -117.055374 },
  { id: "us-nh", name: "New Hampshire", lat: 43.452492, lng: -71.563896 },
  { id: "us-nj", name: "New Jersey", lat: 40.298904, lng: -74.521011 },
  { id: "us-nm", name: "New Mexico", lat: 34.840515, lng: -106.248482 },
  { id: "us-ny", name: "New York", lat: 42.165726, lng: -74.948051 },
  { id: "us-nc", name: "North Carolina", lat: 35.630066, lng: -79.806419 },
  { id: "us-nd", name: "North Dakota", lat: 47.528912, lng: -99.784012 },
  { id: "us-oh", name: "Ohio", lat: 40.388783, lng: -82.764915 },
  { id: "us-ok", name: "Oklahoma", lat: 35.565342, lng: -96.928917 },
  { id: "us-or", name: "Oregon", lat: 44.572021, lng: -122.070938 },
  { id: "us-pa", name: "Pennsylvania", lat: 40.590752, lng: -77.209755 },
  { id: "us-ri", name: "Rhode Island", lat: 41.680893, lng: -71.511780 },
  { id: "us-sc", name: "South Carolina", lat: 33.856892, lng: -80.945007 },
  { id: "us-sd", name: "South Dakota", lat: 44.299782, lng: -99.438828 },
  { id: "us-tn", name: "Tennessee", lat: 35.747845, lng: -86.692345 },
  { id: "us-tx", name: "Texas", lat: 31.054487, lng: -97.563461 },
  { id: "us-ut", name: "Utah", lat: 40.150032, lng: -111.862434 },
  { id: "us-vt", name: "Vermont", lat: 44.045876, lng: -72.710686 },
  { id: "us-va", name: "Virginia", lat: 37.769337, lng: -78.169968 },
  { id: "us-wa", name: "Washington", lat: 47.400902, lng: -121.490494 },
  { id: "us-wv", name: "West Virginia", lat: 38.491226, lng: -80.954453 },
  { id: "us-wi", name: "Wisconsin", lat: 44.268543, lng: -89.616508 },
  { id: "us-wy", name: "Wyoming", lat: 42.755966, lng: -107.302490 },
  { id: "us-dc", name: "Washington D.C.", lat: 38.897438, lng: -77.026817 },
];

// Canadian Provinces
const canadaProvinces: Region[] = [
  { id: "ca-ab", name: "Alberta", lat: 53.933271, lng: -116.576503 },
  { id: "ca-bc", name: "British Columbia", lat: 53.726669, lng: -127.647621 },
  { id: "ca-mb", name: "Manitoba", lat: 53.760861, lng: -98.813873 },
  { id: "ca-nb", name: "New Brunswick", lat: 46.565349, lng: -66.461914 },
  { id: "ca-nl", name: "Newfoundland and Labrador", lat: 53.135509, lng: -57.660435 },
  { id: "ca-ns", name: "Nova Scotia", lat: 44.681987, lng: -63.744311 },
  { id: "ca-nt", name: "Northwest Territories", lat: 64.825529, lng: -124.845741 },
  { id: "ca-nu", name: "Nunavut", lat: 70.299768, lng: -83.107467 },
  { id: "ca-on", name: "Ontario", lat: 51.253775, lng: -85.323214 },
  { id: "ca-pe", name: "Prince Edward Island", lat: 46.510712, lng: -63.416813 },
  { id: "ca-qc", name: "Quebec", lat: 52.939916, lng: -73.549136 },
  { id: "ca-sk", name: "Saskatchewan", lat: 52.939916, lng: -106.450864 },
  { id: "ca-yt", name: "Yukon", lat: 64.282329, lng: -135.000000 },
];

// Mexican States
const mexicoStates: Region[] = [
  { id: "mx-agu", name: "Aguascalientes", lat: 21.879523, lng: -102.294008 },
  { id: "mx-bcn", name: "Baja California", lat: 30.840623, lng: -115.283661 },
  { id: "mx-bcs", name: "Baja California Sur", lat: 26.044444, lng: -111.666111 },
  { id: "mx-cam", name: "Campeche", lat: 19.830055, lng: -90.534203 },
  { id: "mx-chp", name: "Chiapas", lat: 16.756944, lng: -93.129167 },
  { id: "mx-chh", name: "Chihuahua", lat: 28.633333, lng: -106.088889 },
  { id: "mx-coa", name: "Coahuila", lat: 27.058676, lng: -101.706823 },
  { id: "mx-col", name: "Colima", lat: 19.245556, lng: -103.725 },
  { id: "mx-dur", name: "Durango", lat: 24.018333, lng: -104.666667 },
  { id: "mx-gua", name: "Guanajuato", lat: 21.018333, lng: -101.259722 },
  { id: "mx-gro", name: "Guerrero", lat: 17.439167, lng: -99.545 },
  { id: "mx-hid", name: "Hidalgo", lat: 20.091111, lng: -98.762778 },
  { id: "mx-jal", name: "Jalisco", lat: 20.676667, lng: -103.347778 },
  { id: "mx-mex", name: "México", lat: 19.285833, lng: -99.534444 },
  { id: "mx-mic", name: "Michoacán", lat: 19.701111, lng: -101.184167 },
  { id: "mx-mor", name: "Morelos", lat: 18.681389, lng: -99.101389 },
  { id: "mx-nay", name: "Nayarit", lat: 21.751389, lng: -104.845556 },
  { id: "mx-nle", name: "Nuevo León", lat: 25.669722, lng: -100.309444 },
  { id: "mx-oax", name: "Oaxaca", lat: 17.073056, lng: -96.726667 },
  { id: "mx-pue", name: "Puebla", lat: 19.043333, lng: -98.198611 },
  { id: "mx-que", name: "Querétaro", lat: 20.588056, lng: -100.388889 },
  { id: "mx-roo", name: "Quintana Roo", lat: 19.181389, lng: -88.478889 },
  { id: "mx-slp", name: "San Luis Potosí", lat: 22.156667, lng: -100.985556 },
  { id: "mx-sin", name: "Sinaloa", lat: 24.809167, lng: -107.394167 },
  { id: "mx-son", name: "Sonora", lat: 29.072778, lng: -110.955833 },
  { id: "mx-tab", name: "Tabasco", lat: 17.989167, lng: -92.929444 },
  { id: "mx-tam", name: "Tamaulipas", lat: 24.266667, lng: -98.836111 },
  { id: "mx-tla", name: "Tlaxcala", lat: 19.318056, lng: -98.237778 },
  { id: "mx-ver", name: "Veracruz", lat: 19.173611, lng: -96.134167 },
  { id: "mx-yuc", name: "Yucatán", lat: 20.966667, lng: -89.623611 },
  { id: "mx-zac", name: "Zacatecas", lat: 22.770833, lng: -102.583333 },
  { id: "mx-cmx", name: "Ciudad de México", lat: 19.432778, lng: -99.133333 },
];

// ==================== EUROPE ====================

// UK Regions
const ukRegions: Region[] = [
  { id: "gb-eng-lon", name: "London", lat: 51.509865, lng: -0.118092 },
  { id: "gb-eng-se", name: "South East England", lat: 51.271547, lng: -0.467166 },
  { id: "gb-eng-sw", name: "South West England", lat: 50.718412, lng: -3.533899 },
  { id: "gb-eng-wm", name: "West Midlands", lat: 52.489471, lng: -1.898575 },
  { id: "gb-eng-em", name: "East Midlands", lat: 52.829756, lng: -1.332489 },
  { id: "gb-eng-nw", name: "North West England", lat: 53.729428, lng: -2.509587 },
  { id: "gb-eng-ne", name: "North East England", lat: 55.297009, lng: -1.729157 },
  { id: "gb-eng-yk", name: "Yorkshire", lat: 53.958332, lng: -1.080278 },
  { id: "gb-eng-ea", name: "East of England", lat: 52.240477, lng: 0.902656 },
  { id: "gb-sct", name: "Scotland", lat: 56.490671, lng: -4.202646 },
  { id: "gb-wls", name: "Wales", lat: 52.130664, lng: -3.783712 },
  { id: "gb-nir", name: "Northern Ireland", lat: 54.607868, lng: -5.926437 },
];

// German States
const germanyStates: Region[] = [
  { id: "de-bw", name: "Baden-Württemberg", lat: 48.661606, lng: 9.350134 },
  { id: "de-by", name: "Bavaria", lat: 48.790447, lng: 11.497889 },
  { id: "de-be", name: "Berlin", lat: 52.520008, lng: 13.404954 },
  { id: "de-bb", name: "Brandenburg", lat: 52.412811, lng: 12.531696 },
  { id: "de-hb", name: "Bremen", lat: 53.073635, lng: 8.806422 },
  { id: "de-hh", name: "Hamburg", lat: 53.551086, lng: 9.993682 },
  { id: "de-he", name: "Hesse", lat: 50.652052, lng: 9.162437 },
  { id: "de-mv", name: "Mecklenburg-Vorpommern", lat: 53.612688, lng: 12.429595 },
  { id: "de-ni", name: "Lower Saxony", lat: 52.636704, lng: 9.845076 },
  { id: "de-nw", name: "North Rhine-Westphalia", lat: 51.433235, lng: 7.661594 },
  { id: "de-rp", name: "Rhineland-Palatinate", lat: 50.118347, lng: 7.308953 },
  { id: "de-sl", name: "Saarland", lat: 49.396741, lng: 7.022996 },
  { id: "de-sn", name: "Saxony", lat: 51.104541, lng: 13.201736 },
  { id: "de-st", name: "Saxony-Anhalt", lat: 51.950648, lng: 11.692351 },
  { id: "de-sh", name: "Schleswig-Holstein", lat: 54.219367, lng: 9.696117 },
  { id: "de-th", name: "Thuringia", lat: 50.861444, lng: 11.052246 },
];

// French Regions
const franceRegions: Region[] = [
  { id: "fr-idf", name: "Île-de-France (Paris)", lat: 48.856613, lng: 2.352222 },
  { id: "fr-occ", name: "Occitanie", lat: 43.604652, lng: 1.444209 },
  { id: "fr-naq", name: "Nouvelle-Aquitaine", lat: 44.837789, lng: -0.579180 },
  { id: "fr-ara", name: "Auvergne-Rhône-Alpes", lat: 45.764042, lng: 4.835659 },
  { id: "fr-paca", name: "Provence-Alpes-Côte d'Azur", lat: 43.296482, lng: 5.369780 },
  { id: "fr-bre", name: "Brittany", lat: 48.117266, lng: -1.677793 },
  { id: "fr-nor", name: "Normandy", lat: 49.443232, lng: 1.099971 },
  { id: "fr-hdf", name: "Hauts-de-France", lat: 50.629250, lng: 3.057256 },
  { id: "fr-ges", name: "Grand Est", lat: 48.573406, lng: 7.752111 },
  { id: "fr-bfc", name: "Bourgogne-Franche-Comté", lat: 47.322047, lng: 5.041480 },
  { id: "fr-pdl", name: "Pays de la Loire", lat: 47.218371, lng: -1.553621 },
  { id: "fr-cvl", name: "Centre-Val de Loire", lat: 47.902964, lng: 1.909251 },
  { id: "fr-cor", name: "Corsica", lat: 42.039604, lng: 9.012893 },
];

// Spanish Regions
const spainRegions: Region[] = [
  { id: "es-md", name: "Madrid", lat: 40.416775, lng: -3.703790 },
  { id: "es-ct", name: "Catalonia", lat: 41.385063, lng: 2.173404 },
  { id: "es-an", name: "Andalusia", lat: 37.389092, lng: -5.984459 },
  { id: "es-vc", name: "Valencia", lat: 39.469907, lng: -0.376288 },
  { id: "es-ga", name: "Galicia", lat: 42.880587, lng: -8.544844 },
  { id: "es-pv", name: "Basque Country", lat: 43.262985, lng: -2.934893 },
  { id: "es-cn", name: "Canary Islands", lat: 28.291565, lng: -16.629129 },
  { id: "es-ib", name: "Balearic Islands", lat: 39.569600, lng: 2.650160 },
  { id: "es-ar", name: "Aragon", lat: 41.649693, lng: -0.887712 },
  { id: "es-cl", name: "Castile and León", lat: 41.650873, lng: -4.724646 },
  { id: "es-cm", name: "Castilla-La Mancha", lat: 39.862831, lng: -4.027323 },
  { id: "es-mu", name: "Murcia", lat: 37.992242, lng: -1.130654 },
  { id: "es-na", name: "Navarre", lat: 42.812526, lng: -1.645774 },
  { id: "es-as", name: "Asturias", lat: 43.361914, lng: -5.849389 },
  { id: "es-cb", name: "Cantabria", lat: 43.182068, lng: -3.987654 },
  { id: "es-ri", name: "La Rioja", lat: 42.287169, lng: -2.539603 },
  { id: "es-ex", name: "Extremadura", lat: 39.476086, lng: -6.372284 },
];

// Italian Regions
const italyRegions: Region[] = [
  { id: "it-laz", name: "Lazio (Rome)", lat: 41.892916, lng: 12.482520 },
  { id: "it-lom", name: "Lombardy", lat: 45.464664, lng: 9.188540 },
  { id: "it-ven", name: "Veneto", lat: 45.438384, lng: 12.326748 },
  { id: "it-tos", name: "Tuscany", lat: 43.769562, lng: 11.255814 },
  { id: "it-pie", name: "Piedmont", lat: 45.070312, lng: 7.686856 },
  { id: "it-emi", name: "Emilia-Romagna", lat: 44.494887, lng: 11.342616 },
  { id: "it-cam", name: "Campania", lat: 40.851799, lng: 14.268120 },
  { id: "it-sic", name: "Sicily", lat: 37.599994, lng: 14.015356 },
  { id: "it-sar", name: "Sardinia", lat: 40.120586, lng: 9.012893 },
  { id: "it-pug", name: "Apulia", lat: 41.125595, lng: 16.866667 },
  { id: "it-lig", name: "Liguria", lat: 44.411560, lng: 8.932661 },
  { id: "it-fvg", name: "Friuli-Venezia Giulia", lat: 45.649526, lng: 13.776818 },
  { id: "it-tre", name: "Trentino-Alto Adige", lat: 46.499333, lng: 11.356667 },
  { id: "it-mar", name: "Marche", lat: 43.616759, lng: 13.518916 },
  { id: "it-abr", name: "Abruzzo", lat: 42.351222, lng: 13.398438 },
  { id: "it-umb", name: "Umbria", lat: 42.938004, lng: 12.621621 },
  { id: "it-cal", name: "Calabria", lat: 38.905972, lng: 16.594401 },
  { id: "it-bas", name: "Basilicata", lat: 40.639471, lng: 15.805146 },
  { id: "it-mol", name: "Molise", lat: 41.673835, lng: 14.752440 },
  { id: "it-vda", name: "Aosta Valley", lat: 45.737500, lng: 7.320556 },
];

// Netherlands Provinces
const netherlandsProvinces: Region[] = [
  { id: "nl-nh", name: "North Holland", lat: 52.520007, lng: 4.788474 },
  { id: "nl-zh", name: "South Holland", lat: 52.021110, lng: 4.357039 },
  { id: "nl-nb", name: "North Brabant", lat: 51.441642, lng: 5.469722 },
  { id: "nl-ge", name: "Gelderland", lat: 52.045155, lng: 5.871823 },
  { id: "nl-ut", name: "Utrecht", lat: 52.090736, lng: 5.121420 },
  { id: "nl-ov", name: "Overijssel", lat: 52.439117, lng: 6.501643 },
  { id: "nl-li", name: "Limburg", lat: 51.441643, lng: 6.022053 },
  { id: "nl-fr", name: "Friesland", lat: 53.164037, lng: 5.781065 },
  { id: "nl-gr", name: "Groningen", lat: 53.219383, lng: 6.566502 },
  { id: "nl-dr", name: "Drenthe", lat: 52.947605, lng: 6.623058 },
  { id: "nl-fl", name: "Flevoland", lat: 52.527780, lng: 5.595417 },
  { id: "nl-ze", name: "Zeeland", lat: 51.498796, lng: 3.610998 },
];

// Polish Voivodeships
const polandVoivodeships: Region[] = [
  { id: "pl-maz", name: "Masovian (Warsaw)", lat: 52.229676, lng: 21.012229 },
  { id: "pl-mal", name: "Lesser Poland", lat: 50.064651, lng: 19.944981 },
  { id: "pl-sla", name: "Silesian", lat: 50.259106, lng: 19.021778 },
  { id: "pl-wlk", name: "Greater Poland", lat: 52.406374, lng: 16.925167 },
  { id: "pl-dol", name: "Lower Silesian", lat: 51.107885, lng: 17.038538 },
  { id: "pl-lod", name: "Łódź", lat: 51.759249, lng: 19.455983 },
  { id: "pl-pom", name: "Pomeranian", lat: 54.352025, lng: 18.646638 },
  { id: "pl-lub", name: "Lublin", lat: 51.246452, lng: 22.568446 },
  { id: "pl-wam", name: "Warmian-Masurian", lat: 53.778422, lng: 20.480119 },
  { id: "pl-zpm", name: "West Pomeranian", lat: 53.428543, lng: 14.552812 },
  { id: "pl-kpm", name: "Kuyavian-Pomeranian", lat: 53.123482, lng: 18.008438 },
  { id: "pl-pod", name: "Podlaskie", lat: 53.132488, lng: 23.168840 },
  { id: "pl-swi", name: "Świętokrzyskie", lat: 50.866077, lng: 20.628568 },
  { id: "pl-lus", name: "Lubusz", lat: 52.130961, lng: 15.008043 },
  { id: "pl-opo", name: "Opole", lat: 50.671062, lng: 17.926126 },
  { id: "pl-pdk", name: "Subcarpathian", lat: 50.041187, lng: 21.999121 },
];

// Belgian Regions
const belgiumRegions: Region[] = [
  { id: "be-bru", name: "Brussels", lat: 50.850346, lng: 4.351721 },
  { id: "be-vla", name: "Flanders", lat: 51.054340, lng: 3.717424 },
  { id: "be-wal", name: "Wallonia", lat: 50.411904, lng: 4.445439 },
  { id: "be-ant", name: "Antwerp", lat: 51.219448, lng: 4.402464 },
  { id: "be-lie", name: "Liège", lat: 50.632577, lng: 5.579662 },
];

// Austrian States
const austriaStates: Region[] = [
  { id: "at-vie", name: "Vienna", lat: 48.208176, lng: 16.373819 },
  { id: "at-sal", name: "Salzburg", lat: 47.809490, lng: 13.055010 },
  { id: "at-tyr", name: "Tyrol", lat: 47.253741, lng: 11.601487 },
  { id: "at-uoa", name: "Upper Austria", lat: 48.306940, lng: 14.285830 },
  { id: "at-loa", name: "Lower Austria", lat: 48.208354, lng: 15.623041 },
  { id: "at-sty", name: "Styria", lat: 47.070714, lng: 15.439504 },
  { id: "at-car", name: "Carinthia", lat: 46.624710, lng: 14.307860 },
  { id: "at-vor", name: "Vorarlberg", lat: 47.249580, lng: 9.979777 },
  { id: "at-bur", name: "Burgenland", lat: 47.156570, lng: 16.268621 },
];

// Swiss Cantons
const switzerlandCantons: Region[] = [
  { id: "ch-zh", name: "Zürich", lat: 47.376888, lng: 8.541694 },
  { id: "ch-be", name: "Bern", lat: 46.947974, lng: 7.447447 },
  { id: "ch-ge", name: "Geneva", lat: 46.204391, lng: 6.143158 },
  { id: "ch-bs", name: "Basel", lat: 47.559599, lng: 7.588576 },
  { id: "ch-vd", name: "Vaud", lat: 46.519654, lng: 6.632273 },
  { id: "ch-lu", name: "Lucerne", lat: 47.050168, lng: 8.309307 },
  { id: "ch-ti", name: "Ticino", lat: 46.331734, lng: 8.800455 },
  { id: "ch-sg", name: "St. Gallen", lat: 47.424482, lng: 9.376717 },
];

// Portuguese Districts
const portugalDistricts: Region[] = [
  { id: "pt-lis", name: "Lisbon", lat: 38.722252, lng: -9.139337 },
  { id: "pt-por", name: "Porto", lat: 41.157944, lng: -8.629105 },
  { id: "pt-far", name: "Faro (Algarve)", lat: 37.019356, lng: -7.930440 },
  { id: "pt-bra", name: "Braga", lat: 41.545448, lng: -8.426507 },
  { id: "pt-coi", name: "Coimbra", lat: 40.203316, lng: -8.410257 },
  { id: "pt-set", name: "Setúbal", lat: 38.524660, lng: -8.893692 },
  { id: "pt-ave", name: "Aveiro", lat: 40.640496, lng: -8.653784 },
  { id: "pt-mad", name: "Madeira", lat: 32.650780, lng: -16.909387 },
  { id: "pt-azo", name: "Azores", lat: 37.741016, lng: -25.675710 },
];

// Greek Regions
const greeceRegions: Region[] = [
  { id: "gr-att", name: "Attica (Athens)", lat: 37.983810, lng: 23.727539 },
  { id: "gr-mac", name: "Central Macedonia", lat: 40.640063, lng: 22.944419 },
  { id: "gr-cre", name: "Crete", lat: 35.240117, lng: 24.809269 },
  { id: "gr-the", name: "Thessaly", lat: 39.639274, lng: 22.419124 },
  { id: "gr-wgr", name: "Western Greece", lat: 38.246639, lng: 21.734573 },
  { id: "gr-emac", name: "Eastern Macedonia", lat: 41.134358, lng: 24.888093 },
  { id: "gr-plo", name: "Peloponnese", lat: 37.507879, lng: 22.373428 },
  { id: "gr-ion", name: "Ionian Islands", lat: 39.604198, lng: 19.921865 },
  { id: "gr-aeg", name: "South Aegean", lat: 37.044467, lng: 25.467800 },
];

// Swedish Counties
const swedenCounties: Region[] = [
  { id: "se-stk", name: "Stockholm", lat: 59.329323, lng: 18.068581 },
  { id: "se-got", name: "Gothenburg", lat: 57.708870, lng: 11.974560 },
  { id: "se-mal", name: "Malmö", lat: 55.604981, lng: 13.003822 },
  { id: "se-upp", name: "Uppsala", lat: 59.858562, lng: 17.638927 },
  { id: "se-vas", name: "Västra Götaland", lat: 58.252780, lng: 12.867340 },
  { id: "se-ska", name: "Skåne", lat: 55.928820, lng: 13.534729 },
  { id: "se-nor", name: "Norrland", lat: 64.750244, lng: 20.950917 },
];

// Norwegian Counties
const norwayCounties: Region[] = [
  { id: "no-osl", name: "Oslo", lat: 59.913869, lng: 10.752245 },
  { id: "no-ber", name: "Bergen", lat: 60.391262, lng: 5.322054 },
  { id: "no-tro", name: "Trondheim", lat: 63.430515, lng: 10.395053 },
  { id: "no-sta", name: "Stavanger", lat: 58.969975, lng: 5.733107 },
  { id: "no-vik", name: "Viken", lat: 59.745000, lng: 10.204444 },
  { id: "no-rog", name: "Rogaland", lat: 58.916667, lng: 5.750000 },
  { id: "no-trf", name: "Troms og Finnmark", lat: 69.649208, lng: 18.955324 },
];

// Danish Regions
const denmarkRegions: Region[] = [
  { id: "dk-cph", name: "Copenhagen", lat: 55.676097, lng: 12.568337 },
  { id: "dk-aar", name: "Aarhus", lat: 56.162939, lng: 10.203921 },
  { id: "dk-ode", name: "Odense", lat: 55.396229, lng: 10.388528 },
  { id: "dk-aal", name: "Aalborg", lat: 57.046707, lng: 9.935932 },
  { id: "dk-sja", name: "Zealand", lat: 55.450560, lng: 11.797852 },
  { id: "dk-jut", name: "Jutland", lat: 56.263920, lng: 9.501785 },
];

// Finnish Regions
const finlandRegions: Region[] = [
  { id: "fi-hel", name: "Helsinki", lat: 60.169856, lng: 24.938379 },
  { id: "fi-tam", name: "Tampere", lat: 61.497752, lng: 23.760954 },
  { id: "fi-tur", name: "Turku", lat: 60.451813, lng: 22.266630 },
  { id: "fi-oul", name: "Oulu", lat: 65.012093, lng: 25.465077 },
  { id: "fi-esp", name: "Espoo", lat: 60.205490, lng: 24.655899 },
  { id: "fi-lap", name: "Lapland", lat: 68.416770, lng: 25.524319 },
];

// Irish Provinces
const irelandProvinces: Region[] = [
  { id: "ie-dub", name: "Dublin", lat: 53.349805, lng: -6.260310 },
  { id: "ie-cor", name: "Cork", lat: 51.896893, lng: -8.486316 },
  { id: "ie-gal", name: "Galway", lat: 53.270668, lng: -9.056791 },
  { id: "ie-lim", name: "Limerick", lat: 52.668018, lng: -8.630498 },
  { id: "ie-wat", name: "Waterford", lat: 52.259319, lng: -7.110070 },
  { id: "ie-lei", name: "Leinster", lat: 53.325400, lng: -7.345267 },
  { id: "ie-mun", name: "Munster", lat: 52.236530, lng: -8.896340 },
  { id: "ie-con", name: "Connacht", lat: 53.768350, lng: -8.826390 },
  { id: "ie-uls", name: "Ulster (ROI)", lat: 54.597285, lng: -7.309261 },
];

// Czech Regions
const czechRegions: Region[] = [
  { id: "cz-pra", name: "Prague", lat: 50.075538, lng: 14.437800 },
  { id: "cz-brn", name: "Brno", lat: 49.195061, lng: 16.606836 },
  { id: "cz-ost", name: "Ostrava", lat: 49.820923, lng: 18.262524 },
  { id: "cz-pls", name: "Plzeň", lat: 49.738430, lng: 13.373637 },
  { id: "cz-lib", name: "Liberec", lat: 50.767702, lng: 15.056935 },
  { id: "cz-olo", name: "Olomouc", lat: 49.593778, lng: 17.250879 },
];

// Hungarian Counties
const hungaryCounties: Region[] = [
  { id: "hu-bud", name: "Budapest", lat: 47.497912, lng: 19.040235 },
  { id: "hu-deb", name: "Debrecen", lat: 47.531671, lng: 21.627410 },
  { id: "hu-sze", name: "Szeged", lat: 46.253000, lng: 20.141540 },
  { id: "hu-mis", name: "Miskolc", lat: 48.103500, lng: 20.778330 },
  { id: "hu-pec", name: "Pécs", lat: 46.072730, lng: 18.232260 },
  { id: "hu-gyo", name: "Győr", lat: 47.687530, lng: 17.634930 },
];

// Romanian Regions
const romaniaRegions: Region[] = [
  { id: "ro-buc", name: "Bucharest", lat: 44.426767, lng: 26.102538 },
  { id: "ro-clu", name: "Cluj-Napoca", lat: 46.770439, lng: 23.591423 },
  { id: "ro-tim", name: "Timișoara", lat: 45.760696, lng: 21.226788 },
  { id: "ro-ias", name: "Iași", lat: 47.158455, lng: 27.601442 },
  { id: "ro-con", name: "Constanța", lat: 44.173331, lng: 28.638264 },
  { id: "ro-bra", name: "Brașov", lat: 45.657970, lng: 25.601200 },
  { id: "ro-cra", name: "Craiova", lat: 44.330179, lng: 23.794981 },
];

// Bulgarian Regions
const bulgariaRegions: Region[] = [
  { id: "bg-sof", name: "Sofia", lat: 42.697708, lng: 23.321867 },
  { id: "bg-plo", name: "Plovdiv", lat: 42.145970, lng: 24.751950 },
  { id: "bg-var", name: "Varna", lat: 43.214050, lng: 27.914730 },
  { id: "bg-bur", name: "Burgas", lat: 42.504794, lng: 27.462636 },
  { id: "bg-rus", name: "Ruse", lat: 43.856620, lng: 25.970900 },
];

// Croatian Regions
const croatiaRegions: Region[] = [
  { id: "hr-zag", name: "Zagreb", lat: 45.815010, lng: 15.981919 },
  { id: "hr-spl", name: "Split", lat: 43.508133, lng: 16.440193 },
  { id: "hr-rij", name: "Rijeka", lat: 45.327063, lng: 14.442176 },
  { id: "hr-osi", name: "Osijek", lat: 45.554962, lng: 18.695514 },
  { id: "hr-dub", name: "Dubrovnik", lat: 42.650661, lng: 18.094423 },
  { id: "hr-ist", name: "Istria", lat: 45.231860, lng: 13.941650 },
];

// Slovenian Regions
const sloveniaRegions: Region[] = [
  { id: "si-lju", name: "Ljubljana", lat: 46.056946, lng: 14.505751 },
  { id: "si-mar", name: "Maribor", lat: 46.554649, lng: 15.645881 },
  { id: "si-cop", name: "Koper", lat: 45.547544, lng: 13.729650 },
  { id: "si-cel", name: "Celje", lat: 46.236320, lng: 15.267980 },
  { id: "si-krn", name: "Kranj", lat: 46.238850, lng: 14.355550 },
];

// Serbian Regions
const serbiaRegions: Region[] = [
  { id: "rs-bel", name: "Belgrade", lat: 44.786568, lng: 20.448921 },
  { id: "rs-nos", name: "Novi Sad", lat: 45.251667, lng: 19.836944 },
  { id: "rs-nis", name: "Niš", lat: 43.320900, lng: 21.895740 },
  { id: "rs-kra", name: "Kragujevac", lat: 44.012230, lng: 20.926190 },
  { id: "rs-sub", name: "Subotica", lat: 46.100376, lng: 19.665650 },
];

// Slovak Regions
const slovakiaRegions: Region[] = [
  { id: "sk-bra", name: "Bratislava", lat: 48.148596, lng: 17.107748 },
  { id: "sk-kos", name: "Košice", lat: 48.716385, lng: 21.261074 },
  { id: "sk-pre", name: "Prešov", lat: 48.997520, lng: 21.238950 },
  { id: "sk-zil", name: "Žilina", lat: 49.223491, lng: 18.739436 },
  { id: "sk-nit", name: "Nitra", lat: 48.306850, lng: 18.086240 },
];

// Ukrainian Regions
const ukraineRegions: Region[] = [
  { id: "ua-kyi", name: "Kyiv", lat: 50.450100, lng: 30.523400 },
  { id: "ua-kha", name: "Kharkiv", lat: 49.988358, lng: 36.232845 },
  { id: "ua-ode", name: "Odesa", lat: 46.482526, lng: 30.723310 },
  { id: "ua-dnp", name: "Dnipro", lat: 48.464717, lng: 35.046183 },
  { id: "ua-lvi", name: "Lviv", lat: 49.839683, lng: 24.029717 },
  { id: "ua-zap", name: "Zaporizhzhia", lat: 47.838800, lng: 35.139567 },
];

// ==================== ASIA ====================

// Japanese Prefectures
const japanPrefectures: Region[] = [
  { id: "jp-tky", name: "Tokyo", lat: 35.682839, lng: 139.759455 },
  { id: "jp-osk", name: "Osaka", lat: 34.693737, lng: 135.502167 },
  { id: "jp-kyp", name: "Kyoto", lat: 35.011636, lng: 135.768029 },
  { id: "jp-fko", name: "Fukuoka", lat: 33.590355, lng: 130.401716 },
  { id: "jp-hok", name: "Hokkaido", lat: 43.064301, lng: 141.346874 },
  { id: "jp-kng", name: "Kanagawa", lat: 35.447507, lng: 139.642345 },
  { id: "jp-aic", name: "Aichi", lat: 35.180188, lng: 136.906565 },
  { id: "jp-hyg", name: "Hyogo", lat: 34.691269, lng: 135.183068 },
  { id: "jp-okn", name: "Okinawa", lat: 26.212401, lng: 127.680932 },
  { id: "jp-hir", name: "Hiroshima", lat: 34.396560, lng: 132.459621 },
  { id: "jp-stm", name: "Saitama", lat: 35.857431, lng: 139.648933 },
  { id: "jp-chb", name: "Chiba", lat: 35.605058, lng: 140.123307 },
  { id: "jp-ngt", name: "Niigata", lat: 37.902418, lng: 139.023221 },
  { id: "jp-szk", name: "Shizuoka", lat: 34.976978, lng: 138.383054 },
  { id: "jp-mie", name: "Mie", lat: 34.730283, lng: 136.508591 },
];

// Chinese Provinces
const chinaProvinces: Region[] = [
  { id: "cn-bj", name: "Beijing", lat: 39.904202, lng: 116.407394 },
  { id: "cn-sh", name: "Shanghai", lat: 31.230391, lng: 121.473701 },
  { id: "cn-gd", name: "Guangdong", lat: 23.129110, lng: 113.264385 },
  { id: "cn-js", name: "Jiangsu", lat: 32.061707, lng: 118.763232 },
  { id: "cn-zj", name: "Zhejiang", lat: 30.267447, lng: 120.152792 },
  { id: "cn-sd", name: "Shandong", lat: 36.668530, lng: 117.020359 },
  { id: "cn-hb", name: "Hubei", lat: 30.592849, lng: 114.305539 },
  { id: "cn-sc", name: "Sichuan", lat: 30.572815, lng: 104.066803 },
  { id: "cn-hn", name: "Hunan", lat: 28.228209, lng: 112.938814 },
  { id: "cn-fj", name: "Fujian", lat: 26.074508, lng: 119.296494 },
  { id: "cn-ha", name: "Henan", lat: 34.765515, lng: 113.753094 },
  { id: "cn-tj", name: "Tianjin", lat: 39.125595, lng: 117.190186 },
  { id: "cn-cq", name: "Chongqing", lat: 29.431585, lng: 106.912254 },
  { id: "cn-hk", name: "Hong Kong", lat: 22.319303, lng: 114.169361 },
  { id: "cn-xn", name: "Xi'an (Shaanxi)", lat: 34.341574, lng: 108.939770 },
];

// Indian States
const indiaStates: Region[] = [
  { id: "in-mh", name: "Maharashtra", lat: 19.076090, lng: 72.877426 },
  { id: "in-dl", name: "Delhi", lat: 28.704059, lng: 77.102490 },
  { id: "in-ka", name: "Karnataka", lat: 12.971599, lng: 77.594566 },
  { id: "in-tn", name: "Tamil Nadu", lat: 13.082680, lng: 80.270721 },
  { id: "in-tg", name: "Telangana", lat: 17.385044, lng: 78.486671 },
  { id: "in-wb", name: "West Bengal", lat: 22.572645, lng: 88.363892 },
  { id: "in-gj", name: "Gujarat", lat: 23.022505, lng: 72.571365 },
  { id: "in-rj", name: "Rajasthan", lat: 26.912434, lng: 75.787270 },
  { id: "in-up", name: "Uttar Pradesh", lat: 26.846693, lng: 80.946166 },
  { id: "in-kl", name: "Kerala", lat: 8.524139, lng: 76.936638 },
  { id: "in-pb", name: "Punjab", lat: 31.634308, lng: 74.872261 },
  { id: "in-hr", name: "Haryana", lat: 28.459497, lng: 77.026638 },
  { id: "in-mp", name: "Madhya Pradesh", lat: 23.259933, lng: 77.412615 },
  { id: "in-br", name: "Bihar", lat: 25.594095, lng: 85.137566 },
  { id: "in-od", name: "Odisha", lat: 20.296059, lng: 85.824539 },
];

// South Korean Regions
const southKoreaRegions: Region[] = [
  { id: "kr-sel", name: "Seoul", lat: 37.566535, lng: 126.977969 },
  { id: "kr-bus", name: "Busan", lat: 35.179554, lng: 129.075642 },
  { id: "kr-inc", name: "Incheon", lat: 37.456257, lng: 126.705206 },
  { id: "kr-dae", name: "Daegu", lat: 35.871433, lng: 128.601445 },
  { id: "kr-gwa", name: "Gwangju", lat: 35.159545, lng: 126.852601 },
  { id: "kr-daj", name: "Daejeon", lat: 36.350412, lng: 127.384548 },
  { id: "kr-uls", name: "Ulsan", lat: 35.538377, lng: 129.311360 },
  { id: "kr-gyg", name: "Gyeonggi", lat: 37.413294, lng: 127.518311 },
  { id: "kr-jej", name: "Jeju Island", lat: 33.489011, lng: 126.498302 },
];

// Thai Regions
const thailandRegions: Region[] = [
  { id: "th-bkk", name: "Bangkok", lat: 13.756331, lng: 100.501765 },
  { id: "th-cmx", name: "Chiang Mai", lat: 18.796143, lng: 98.979263 },
  { id: "th-phu", name: "Phuket", lat: 7.878978, lng: 98.398392 },
  { id: "th-pat", name: "Pattaya", lat: 12.927635, lng: 100.877197 },
  { id: "th-hkt", name: "Hat Yai", lat: 7.008800, lng: 100.474542 },
  { id: "th-kra", name: "Krabi", lat: 8.086136, lng: 98.906360 },
  { id: "th-isa", name: "Isan", lat: 15.229398, lng: 104.857156 },
];

// Vietnamese Regions
const vietnamRegions: Region[] = [
  { id: "vn-hcm", name: "Ho Chi Minh City", lat: 10.823099, lng: 106.629664 },
  { id: "vn-han", name: "Hanoi", lat: 21.028511, lng: 105.804817 },
  { id: "vn-dan", name: "Da Nang", lat: 16.047079, lng: 108.206230 },
  { id: "vn-hai", name: "Hai Phong", lat: 20.844912, lng: 106.688084 },
  { id: "vn-can", name: "Can Tho", lat: 10.045162, lng: 105.746857 },
  { id: "vn-ntr", name: "Nha Trang", lat: 12.238791, lng: 109.196749 },
];

// Malaysian States
const malaysiaStates: Region[] = [
  { id: "my-kul", name: "Kuala Lumpur", lat: 3.139003, lng: 101.686855 },
  { id: "my-sel", name: "Selangor", lat: 3.073900, lng: 101.518300 },
  { id: "my-pen", name: "Penang", lat: 5.416390, lng: 100.332680 },
  { id: "my-joh", name: "Johor", lat: 1.485150, lng: 103.761300 },
  { id: "my-sab", name: "Sabah", lat: 5.978200, lng: 116.075300 },
  { id: "my-sar", name: "Sarawak", lat: 1.553300, lng: 110.358900 },
  { id: "my-per", name: "Perak", lat: 4.597500, lng: 101.090100 },
];

// Singaporean Regions
const singaporeRegions: Region[] = [
  { id: "sg-cen", name: "Central", lat: 1.352083, lng: 103.819836 },
  { id: "sg-nor", name: "North", lat: 1.418378, lng: 103.839016 },
  { id: "sg-sou", name: "South", lat: 1.270610, lng: 103.821640 },
  { id: "sg-eas", name: "East", lat: 1.352890, lng: 103.940430 },
  { id: "sg-wes", name: "West", lat: 1.352890, lng: 103.703390 },
];

// Indonesian Provinces
const indonesiaProvinces: Region[] = [
  { id: "id-jkt", name: "Jakarta", lat: -6.208763, lng: 106.845599 },
  { id: "id-bali", name: "Bali", lat: -8.340539, lng: 115.091949 },
  { id: "id-jat", name: "Java (East)", lat: -7.250445, lng: 112.768845 },
  { id: "id-jaw", name: "Java (West)", lat: -6.914744, lng: 107.609810 },
  { id: "id-sum", name: "Sumatra", lat: 0.589724, lng: 101.345112 },
  { id: "id-kal", name: "Kalimantan", lat: -0.026330, lng: 109.342504 },
  { id: "id-sul", name: "Sulawesi", lat: -0.789275, lng: 119.879695 },
];

// Philippine Regions
const philippinesRegions: Region[] = [
  { id: "ph-mnl", name: "Metro Manila", lat: 14.599512, lng: 120.984219 },
  { id: "ph-ceb", name: "Cebu", lat: 10.315699, lng: 123.885437 },
  { id: "ph-dav", name: "Davao", lat: 7.190708, lng: 125.455341 },
  { id: "ph-ilo", name: "Iloilo", lat: 10.696943, lng: 122.564530 },
  { id: "ph-zam", name: "Zamboanga", lat: 6.910537, lng: 122.073953 },
  { id: "ph-bag", name: "Baguio", lat: 16.411818, lng: 120.593186 },
  { id: "ph-pal", name: "Palawan", lat: 9.839160, lng: 118.739990 },
];

// Taiwanese Regions
const taiwanRegions: Region[] = [
  { id: "tw-tpe", name: "Taipei", lat: 25.032969, lng: 121.565418 },
  { id: "tw-khh", name: "Kaohsiung", lat: 22.627278, lng: 120.301435 },
  { id: "tw-txg", name: "Taichung", lat: 24.147736, lng: 120.673648 },
  { id: "tw-tnn", name: "Tainan", lat: 22.999727, lng: 120.227028 },
  { id: "tw-hsc", name: "Hsinchu", lat: 24.801859, lng: 120.971694 },
  { id: "tw-tyq", name: "Taoyuan", lat: 24.993629, lng: 121.300976 },
];

// Pakistani Provinces
const pakistanProvinces: Region[] = [
  { id: "pk-kar", name: "Karachi", lat: 24.860966, lng: 66.990501 },
  { id: "pk-lah", name: "Lahore", lat: 31.549722, lng: 74.343611 },
  { id: "pk-isl", name: "Islamabad", lat: 33.684422, lng: 73.047882 },
  { id: "pk-fai", name: "Faisalabad", lat: 31.454950, lng: 73.135002 },
  { id: "pk-raw", name: "Rawalpindi", lat: 33.597103, lng: 73.047882 },
  { id: "pk-mul", name: "Multan", lat: 30.157458, lng: 71.524918 },
];

// Bangladesh Divisions
const bangladeshDivisions: Region[] = [
  { id: "bd-dha", name: "Dhaka", lat: 23.810332, lng: 90.412518 },
  { id: "bd-cht", name: "Chittagong", lat: 22.335109, lng: 91.834073 },
  { id: "bd-khu", name: "Khulna", lat: 22.820000, lng: 89.550000 },
  { id: "bd-raj", name: "Rajshahi", lat: 24.363589, lng: 88.624135 },
  { id: "bd-syl", name: "Sylhet", lat: 24.894929, lng: 91.868706 },
];

// ==================== MIDDLE EAST ====================

// UAE Emirates
const uaeEmirates: Region[] = [
  { id: "ae-du", name: "Dubai", lat: 25.204849, lng: 55.270783 },
  { id: "ae-az", name: "Abu Dhabi", lat: 24.453884, lng: 54.377342 },
  { id: "ae-sh", name: "Sharjah", lat: 25.346255, lng: 55.420931 },
  { id: "ae-aj", name: "Ajman", lat: 25.411556, lng: 55.435409 },
  { id: "ae-uq", name: "Umm Al Quwain", lat: 25.564730, lng: 55.553506 },
  { id: "ae-rk", name: "Ras Al Khaimah", lat: 25.789534, lng: 55.976158 },
  { id: "ae-fu", name: "Fujairah", lat: 25.128630, lng: 56.346375 },
];

// Saudi Arabian Regions
const saudiArabiaRegions: Region[] = [
  { id: "sa-riy", name: "Riyadh", lat: 24.713552, lng: 46.675296 },
  { id: "sa-jed", name: "Jeddah", lat: 21.485811, lng: 39.192505 },
  { id: "sa-mec", name: "Mecca", lat: 21.422510, lng: 39.826168 },
  { id: "sa-med", name: "Medina", lat: 24.524654, lng: 39.569184 },
  { id: "sa-dam", name: "Dammam", lat: 26.434408, lng: 50.103206 },
  { id: "sa-kho", name: "Al Khobar", lat: 26.283730, lng: 50.208710 },
];

// Israeli Districts
const israelDistricts: Region[] = [
  { id: "il-tlv", name: "Tel Aviv", lat: 32.085300, lng: 34.781768 },
  { id: "il-jer", name: "Jerusalem", lat: 31.768319, lng: 35.213710 },
  { id: "il-hai", name: "Haifa", lat: 32.794044, lng: 34.989571 },
  { id: "il-bee", name: "Be'er Sheva", lat: 31.252973, lng: 34.791462 },
  { id: "il-net", name: "Netanya", lat: 32.332340, lng: 34.856784 },
  { id: "il-ash", name: "Ashdod", lat: 31.804380, lng: 34.655314 },
];

// Qatari Municipalities
const qatarMunicipalities: Region[] = [
  { id: "qa-doh", name: "Doha", lat: 25.285447, lng: 51.531040 },
  { id: "qa-ray", name: "Al Rayyan", lat: 25.292320, lng: 51.424820 },
  { id: "qa-wak", name: "Al Wakrah", lat: 25.166470, lng: 51.594580 },
  { id: "qa-kho", name: "Al Khor", lat: 25.680560, lng: 51.496670 },
  { id: "qa-uma", name: "Umm Salal", lat: 25.412220, lng: 51.412230 },
];

// Kuwaiti Governorates
const kuwaitGovernorates: Region[] = [
  { id: "kw-kwc", name: "Kuwait City", lat: 29.375859, lng: 47.977405 },
  { id: "kw-haw", name: "Hawalli", lat: 29.332050, lng: 48.029130 },
  { id: "kw-ahm", name: "Ahmadi", lat: 29.076831, lng: 48.083946 },
  { id: "kw-far", name: "Farwaniya", lat: 29.277740, lng: 47.959340 },
  { id: "kw-jah", name: "Jahra", lat: 29.337520, lng: 47.658100 },
];

// Bahraini Governorates
const bahrainGovernorates: Region[] = [
  { id: "bh-man", name: "Manama", lat: 26.228516, lng: 50.586050 },
  { id: "bh-muh", name: "Muharraq", lat: 26.257260, lng: 50.611580 },
  { id: "bh-nor", name: "Northern", lat: 26.217940, lng: 50.538960 },
  { id: "bh-sou", name: "Southern", lat: 26.030360, lng: 50.541840 },
];

// Omani Governorates
const omanGovernorates: Region[] = [
  { id: "om-mus", name: "Muscat", lat: 23.585890, lng: 58.405923 },
  { id: "om-sal", name: "Salalah", lat: 17.015543, lng: 54.091930 },
  { id: "om-soh", name: "Sohar", lat: 24.346690, lng: 56.747990 },
  { id: "om-niz", name: "Nizwa", lat: 22.933710, lng: 57.530090 },
  { id: "om-sur", name: "Sur", lat: 22.567430, lng: 59.528870 },
];

// Jordanian Governorates
const jordanGovernorates: Region[] = [
  { id: "jo-amm", name: "Amman", lat: 31.956578, lng: 35.945695 },
  { id: "jo-irb", name: "Irbid", lat: 32.555560, lng: 35.850140 },
  { id: "jo-zar", name: "Zarqa", lat: 32.072330, lng: 36.088100 },
  { id: "jo-aqa", name: "Aqaba", lat: 29.526940, lng: 35.005110 },
  { id: "jo-ker", name: "Karak", lat: 31.185170, lng: 35.704780 },
];

// Lebanese Governorates
const lebanonGovernorates: Region[] = [
  { id: "lb-bei", name: "Beirut", lat: 33.888629, lng: 35.495479 },
  { id: "lb-mtl", name: "Mount Lebanon", lat: 33.833330, lng: 35.583330 },
  { id: "lb-nor", name: "North Lebanon", lat: 34.436690, lng: 35.831030 },
  { id: "lb-sou", name: "South Lebanon", lat: 33.275170, lng: 35.398630 },
  { id: "lb-bek", name: "Bekaa", lat: 33.846260, lng: 35.902070 },
];

// Turkish Regions
const turkeyRegions: Region[] = [
  { id: "tr-ist", name: "Istanbul", lat: 41.008238, lng: 28.978359 },
  { id: "tr-ank", name: "Ankara", lat: 39.933365, lng: 32.859741 },
  { id: "tr-izm", name: "Izmir", lat: 38.423734, lng: 27.142826 },
  { id: "tr-ant", name: "Antalya", lat: 36.896892, lng: 30.713323 },
  { id: "tr-bur", name: "Bursa", lat: 40.182667, lng: 29.066940 },
  { id: "tr-ada", name: "Adana", lat: 36.991419, lng: 35.330359 },
  { id: "tr-gaz", name: "Gaziantep", lat: 37.066174, lng: 37.378524 },
  { id: "tr-kon", name: "Konya", lat: 37.871594, lng: 32.484943 },
];

// ==================== AFRICA ====================

// South African Provinces
const southAfricaProvinces: Region[] = [
  { id: "za-gt", name: "Gauteng", lat: -26.270760, lng: 28.112268 },
  { id: "za-wc", name: "Western Cape", lat: -33.924869, lng: 18.424055 },
  { id: "za-kz", name: "KwaZulu-Natal", lat: -29.858681, lng: 31.021839 },
  { id: "za-ec", name: "Eastern Cape", lat: -33.962738, lng: 25.601887 },
  { id: "za-mp", name: "Mpumalanga", lat: -25.565336, lng: 30.527890 },
  { id: "za-lp", name: "Limpopo", lat: -23.401247, lng: 29.417530 },
  { id: "za-fs", name: "Free State", lat: -29.119460, lng: 26.214199 },
  { id: "za-nw", name: "North West", lat: -25.852197, lng: 25.643534 },
  { id: "za-nc", name: "Northern Cape", lat: -30.559482, lng: 22.937506 },
];

// Egyptian Governorates
const egyptGovernorates: Region[] = [
  { id: "eg-cai", name: "Cairo", lat: 30.044420, lng: 31.235712 },
  { id: "eg-ale", name: "Alexandria", lat: 31.205753, lng: 29.924526 },
  { id: "eg-giz", name: "Giza", lat: 30.013056, lng: 31.208853 },
  { id: "eg-lux", name: "Luxor", lat: 25.687243, lng: 32.639637 },
  { id: "eg-asw", name: "Aswan", lat: 24.088938, lng: 32.899829 },
  { id: "eg-sha", name: "Sharm El Sheikh", lat: 27.915817, lng: 34.329950 },
];

// Moroccan Regions
const moroccoRegions: Region[] = [
  { id: "ma-cas", name: "Casablanca", lat: 33.573110, lng: -7.589843 },
  { id: "ma-rab", name: "Rabat", lat: 34.020882, lng: -6.841650 },
  { id: "ma-mar", name: "Marrakech", lat: 31.631840, lng: -7.992470 },
  { id: "ma-fes", name: "Fes", lat: 34.032680, lng: -5.004600 },
  { id: "ma-tan", name: "Tangier", lat: 35.759465, lng: -5.833954 },
  { id: "ma-aga", name: "Agadir", lat: 30.427755, lng: -9.598107 },
];

// Nigerian States
const nigeriaStates: Region[] = [
  { id: "ng-lag", name: "Lagos", lat: 6.524379, lng: 3.379206 },
  { id: "ng-abu", name: "Abuja", lat: 9.057920, lng: 7.495603 },
  { id: "ng-kan", name: "Kano", lat: 12.002180, lng: 8.591956 },
  { id: "ng-iba", name: "Ibadan", lat: 7.377560, lng: 3.947010 },
  { id: "ng-por", name: "Port Harcourt", lat: 4.815040, lng: 7.049620 },
  { id: "ng-ben", name: "Benin City", lat: 6.339189, lng: 5.617447 },
];

// Kenyan Counties
const kenyaCounties: Region[] = [
  { id: "ke-nai", name: "Nairobi", lat: -1.286389, lng: 36.817223 },
  { id: "ke-mom", name: "Mombasa", lat: -4.043477, lng: 39.668206 },
  { id: "ke-kis", name: "Kisumu", lat: -0.102210, lng: 34.761710 },
  { id: "ke-nak", name: "Nakuru", lat: -0.303099, lng: 36.080026 },
  { id: "ke-eld", name: "Eldoret", lat: 0.520720, lng: 35.269780 },
];

// Ghanaian Regions
const ghanaRegions: Region[] = [
  { id: "gh-acc", name: "Accra", lat: 5.603717, lng: -0.186964 },
  { id: "gh-kum", name: "Kumasi", lat: 6.687830, lng: -1.624050 },
  { id: "gh-tam", name: "Tamale", lat: 9.403680, lng: -0.839780 },
  { id: "gh-sek", name: "Sekondi-Takoradi", lat: 4.934400, lng: -1.713620 },
  { id: "gh-cap", name: "Cape Coast", lat: 5.131770, lng: -1.281560 },
];

// Tunisian Governorates
const tunisiaGovernorates: Region[] = [
  { id: "tn-tun", name: "Tunis", lat: 36.806389, lng: 10.181667 },
  { id: "tn-sfa", name: "Sfax", lat: 34.739780, lng: 10.760040 },
  { id: "tn-sou", name: "Sousse", lat: 35.828281, lng: 10.640390 },
  { id: "tn-djer", name: "Djerba", lat: 33.808170, lng: 10.849650 },
  { id: "tn-kair", name: "Kairouan", lat: 35.678150, lng: 10.096920 },
];

// Ethiopian Regions
const ethiopiaRegions: Region[] = [
  { id: "et-add", name: "Addis Ababa", lat: 8.980603, lng: 38.757759 },
  { id: "et-amh", name: "Amhara", lat: 11.594990, lng: 37.390600 },
  { id: "et-oro", name: "Oromia", lat: 7.546030, lng: 40.635250 },
  { id: "et-tig", name: "Tigray", lat: 13.496667, lng: 39.476667 },
  { id: "et-som", name: "Somali", lat: 6.663580, lng: 43.790550 },
];

// Tanzanian Regions
const tanzaniaRegions: Region[] = [
  { id: "tz-dar", name: "Dar es Salaam", lat: -6.792354, lng: 39.208328 },
  { id: "tz-zan", name: "Zanzibar", lat: -6.165917, lng: 39.202641 },
  { id: "tz-aru", name: "Arusha", lat: -3.386925, lng: 36.682995 },
  { id: "tz-mwa", name: "Mwanza", lat: -2.516667, lng: 32.900000 },
  { id: "tz-dod", name: "Dodoma", lat: -6.173055, lng: 35.741944 },
];

// Ugandan Regions
const ugandaRegions: Region[] = [
  { id: "ug-kam", name: "Kampala", lat: 0.347596, lng: 32.582520 },
  { id: "ug-ent", name: "Entebbe", lat: 0.064160, lng: 32.443350 },
  { id: "ug-jin", name: "Jinja", lat: 0.424580, lng: 33.206850 },
  { id: "ug-mba", name: "Mbarara", lat: -0.607160, lng: 30.654420 },
  { id: "ug-gul", name: "Gulu", lat: 2.774810, lng: 32.299290 },
];

// Rwandan Provinces
const rwandaProvinces: Region[] = [
  { id: "rw-kig", name: "Kigali", lat: -1.957875, lng: 30.112735 },
  { id: "rw-eas", name: "Eastern Province", lat: -1.781480, lng: 30.462170 },
  { id: "rw-wes", name: "Western Province", lat: -2.074200, lng: 29.243620 },
  { id: "rw-nor", name: "Northern Province", lat: -1.586560, lng: 29.827200 },
  { id: "rw-sou", name: "Southern Province", lat: -2.463620, lng: 29.593590 },
];

// ==================== SOUTH AMERICA ====================

// Brazilian States
const brazilStates: Region[] = [
  { id: "br-sp", name: "São Paulo", lat: -23.550520, lng: -46.633308 },
  { id: "br-rj", name: "Rio de Janeiro", lat: -22.906847, lng: -43.172897 },
  { id: "br-mg", name: "Minas Gerais", lat: -19.916681, lng: -43.934493 },
  { id: "br-ba", name: "Bahia", lat: -12.977749, lng: -38.501629 },
  { id: "br-rs", name: "Rio Grande do Sul", lat: -30.034647, lng: -51.217658 },
  { id: "br-pr", name: "Paraná", lat: -25.428356, lng: -49.273252 },
  { id: "br-pe", name: "Pernambuco", lat: -8.047562, lng: -34.877003 },
  { id: "br-ce", name: "Ceará", lat: -3.731861, lng: -38.526670 },
  { id: "br-pa", name: "Pará", lat: -1.455754, lng: -48.490179 },
  { id: "br-sc", name: "Santa Catarina", lat: -27.594870, lng: -48.548219 },
  { id: "br-go", name: "Goiás", lat: -16.680882, lng: -49.253975 },
  { id: "br-am", name: "Amazonas", lat: -3.119027, lng: -60.021731 },
  { id: "br-df", name: "Distrito Federal", lat: -15.826691, lng: -47.921822 },
];

// Argentine Provinces
const argentinaProvinces: Region[] = [
  { id: "ar-bue", name: "Buenos Aires", lat: -34.603684, lng: -58.381559 },
  { id: "ar-cor", name: "Córdoba", lat: -31.420083, lng: -64.188776 },
  { id: "ar-ros", name: "Rosario", lat: -32.944243, lng: -60.650539 },
  { id: "ar-men", name: "Mendoza", lat: -32.889458, lng: -68.845839 },
  { id: "ar-san", name: "San Juan", lat: -31.537500, lng: -68.536389 },
  { id: "ar-mar", name: "Mar del Plata", lat: -38.002350, lng: -57.557540 },
  { id: "ar-sal", name: "Salta", lat: -24.782127, lng: -65.423198 },
];

// Colombian Departments
const colombiaDepartments: Region[] = [
  { id: "co-bog", name: "Bogotá", lat: 4.710989, lng: -74.072092 },
  { id: "co-med", name: "Medellín", lat: 6.244203, lng: -75.581212 },
  { id: "co-cal", name: "Cali", lat: 3.451647, lng: -76.531985 },
  { id: "co-bar", name: "Barranquilla", lat: 10.963889, lng: -74.796389 },
  { id: "co-car", name: "Cartagena", lat: 10.399720, lng: -75.514440 },
  { id: "co-buc", name: "Bucaramanga", lat: 7.119349, lng: -73.122742 },
];

// Chilean Regions
const chileRegions: Region[] = [
  { id: "cl-san", name: "Santiago", lat: -33.448890, lng: -70.669265 },
  { id: "cl-val", name: "Valparaíso", lat: -33.047238, lng: -71.612686 },
  { id: "cl-con", name: "Concepción", lat: -36.820135, lng: -73.044392 },
  { id: "cl-ant", name: "Antofagasta", lat: -23.650000, lng: -70.400000 },
  { id: "cl-vdi", name: "Viña del Mar", lat: -33.024520, lng: -71.551597 },
  { id: "cl-pue", name: "Puerto Montt", lat: -41.468920, lng: -72.941210 },
];

// Peruvian Departments
const peruDepartments: Region[] = [
  { id: "pe-lim", name: "Lima", lat: -12.046374, lng: -77.042793 },
  { id: "pe-are", name: "Arequipa", lat: -16.409047, lng: -71.537451 },
  { id: "pe-cus", name: "Cusco", lat: -13.531950, lng: -71.967460 },
  { id: "pe-tru", name: "Trujillo", lat: -8.109052, lng: -79.021698 },
  { id: "pe-chi", name: "Chiclayo", lat: -6.771455, lng: -79.840895 },
  { id: "pe-iqu", name: "Iquitos", lat: -3.748958, lng: -73.253830 },
];

// Ecuadorian Provinces
const ecuadorProvinces: Region[] = [
  { id: "ec-qui", name: "Quito", lat: -0.180653, lng: -78.467838 },
  { id: "ec-gua", name: "Guayaquil", lat: -2.170998, lng: -79.922359 },
  { id: "ec-cue", name: "Cuenca", lat: -2.900128, lng: -79.005896 },
  { id: "ec-mac", name: "Machala", lat: -3.258611, lng: -79.960556 },
  { id: "ec-gal", name: "Galápagos", lat: -0.953382, lng: -90.965690 },
];

// Venezuelan States
const venezuelaStates: Region[] = [
  { id: "ve-car", name: "Caracas", lat: 10.480594, lng: -66.903606 },
  { id: "ve-mar", name: "Maracaibo", lat: 10.654166, lng: -71.640175 },
  { id: "ve-val", name: "Valencia", lat: 10.178930, lng: -67.996933 },
  { id: "ve-bar", name: "Barquisimeto", lat: 10.063988, lng: -69.322741 },
  { id: "ve-pue", name: "Puerto La Cruz", lat: 10.219280, lng: -64.635440 },
];

// Uruguayan Departments
const uruguayDepartments: Region[] = [
  { id: "uy-mon", name: "Montevideo", lat: -34.901112, lng: -56.164532 },
  { id: "uy-sal", name: "Salto", lat: -31.383330, lng: -57.966670 },
  { id: "uy-pun", name: "Punta del Este", lat: -34.966670, lng: -54.950000 },
  { id: "uy-col", name: "Colonia del Sacramento", lat: -34.466670, lng: -57.833330 },
];

// Paraguayan Departments
const paraguayDepartments: Region[] = [
  { id: "py-asu", name: "Asunción", lat: -25.263714, lng: -57.575926 },
  { id: "py-ciu", name: "Ciudad del Este", lat: -25.509400, lng: -54.611250 },
  { id: "py-enc", name: "Encarnación", lat: -27.330830, lng: -55.865830 },
  { id: "py-san", name: "San Lorenzo", lat: -25.340000, lng: -57.527000 },
];

// Bolivian Departments
const boliviaDepartments: Region[] = [
  { id: "bo-lap", name: "La Paz", lat: -16.500000, lng: -68.150000 },
  { id: "bo-scr", name: "Santa Cruz", lat: -17.783327, lng: -63.182140 },
  { id: "bo-coc", name: "Cochabamba", lat: -17.393530, lng: -66.156980 },
  { id: "bo-suc", name: "Sucre", lat: -19.035667, lng: -65.259417 },
  { id: "bo-oru", name: "Oruro", lat: -17.962500, lng: -67.114170 },
];

// ==================== OCEANIA ====================

// Australian States
const australiaStates: Region[] = [
  { id: "au-nsw", name: "New South Wales", lat: -31.840233, lng: 145.612793 },
  { id: "au-vic", name: "Victoria", lat: -37.020100, lng: 144.964600 },
  { id: "au-qld", name: "Queensland", lat: -22.575197, lng: 144.084961 },
  { id: "au-wa", name: "Western Australia", lat: -25.042261, lng: 117.793701 },
  { id: "au-sa", name: "South Australia", lat: -30.000233, lng: 136.209152 },
  { id: "au-tas", name: "Tasmania", lat: -42.035067, lng: 146.636230 },
  { id: "au-nt", name: "Northern Territory", lat: -19.491411, lng: 132.550964 },
  { id: "au-act", name: "Australian Capital Territory", lat: -35.473469, lng: 149.012375 },
];

// New Zealand Regions
const newZealandRegions: Region[] = [
  { id: "nz-auk", name: "Auckland", lat: -36.848461, lng: 174.763336 },
  { id: "nz-wel", name: "Wellington", lat: -41.286460, lng: 174.776236 },
  { id: "nz-chr", name: "Christchurch", lat: -43.532054, lng: 172.636225 },
  { id: "nz-ham", name: "Hamilton", lat: -37.787006, lng: 175.282025 },
  { id: "nz-dun", name: "Dunedin", lat: -45.878760, lng: 170.502798 },
  { id: "nz-que", name: "Queenstown", lat: -45.031162, lng: 168.662643 },
  { id: "nz-rot", name: "Rotorua", lat: -38.136877, lng: 176.249756 },
];

// ==================== CENTRAL AMERICA & CARIBBEAN ====================

// Costa Rican Provinces
const costaRicaProvinces: Region[] = [
  { id: "cr-sjo", name: "San José", lat: 9.928069, lng: -84.090725 },
  { id: "cr-lim", name: "Limón", lat: 10.002700, lng: -83.033630 },
  { id: "cr-gua", name: "Guanacaste", lat: 10.627730, lng: -85.443650 },
  { id: "cr-pun", name: "Puntarenas", lat: 9.976410, lng: -84.838050 },
  { id: "cr-her", name: "Heredia", lat: 10.002940, lng: -84.116670 },
];

// Panamanian Provinces
const panamaProvinces: Region[] = [
  { id: "pa-pan", name: "Panama City", lat: 8.983333, lng: -79.516670 },
  { id: "pa-col", name: "Colón", lat: 9.359490, lng: -79.899220 },
  { id: "pa-chi", name: "Chiriquí", lat: 8.427000, lng: -82.431110 },
  { id: "pa-ver", name: "Veraguas", lat: 8.103340, lng: -81.063330 },
];

// Jamaican Parishes
const jamaicaParishes: Region[] = [
  { id: "jm-kin", name: "Kingston", lat: 17.997021, lng: -76.792800 },
  { id: "jm-mon", name: "Montego Bay", lat: 18.471020, lng: -77.921850 },
  { id: "jm-och", name: "Ocho Rios", lat: 18.403860, lng: -77.103190 },
  { id: "jm-neg", name: "Negril", lat: 18.268140, lng: -78.349260 },
];

// Dominican Republic Provinces
const dominicanRepublicProvinces: Region[] = [
  { id: "do-sdo", name: "Santo Domingo", lat: 18.486058, lng: -69.931212 },
  { id: "do-pue", name: "Punta Cana", lat: 18.582020, lng: -68.405410 },
  { id: "do-san", name: "Santiago", lat: 19.450430, lng: -70.698770 },
  { id: "do-ppl", name: "Puerto Plata", lat: 19.793710, lng: -70.689670 },
];

// Cuban Provinces
const cubaProvinces: Region[] = [
  { id: "cu-hav", name: "Havana", lat: 23.113592, lng: -82.366592 },
  { id: "cu-san", name: "Santiago de Cuba", lat: 20.016040, lng: -75.827560 },
  { id: "cu-var", name: "Varadero", lat: 23.153630, lng: -81.252700 },
  { id: "cu-tri", name: "Trinidad", lat: 21.802520, lng: -79.984370 },
];

// Puerto Rican Regions
const puertoRicoRegions: Region[] = [
  { id: "pr-sju", name: "San Juan", lat: 18.465539, lng: -66.105735 },
  { id: "pr-pon", name: "Ponce", lat: 18.011020, lng: -66.614070 },
  { id: "pr-bay", name: "Bayamón", lat: 18.399390, lng: -66.155570 },
  { id: "pr-may", name: "Mayagüez", lat: 18.201130, lng: -67.145740 },
];

// Countries array - 93 countries total
export const worldCountries: Country[] = [
  // ==================== NORTH AMERICA (3) ====================
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    lat: 37.090240,
    lng: -95.712891,
    regions: usaStates,
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    lat: 56.130366,
    lng: -106.346771,
    regions: canadaProvinces,
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    lat: 23.634501,
    lng: -102.552784,
    regions: mexicoStates,
  },
  
  // ==================== EUROPE (27) ====================
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    lat: 55.378051,
    lng: -3.435973,
    regions: ukRegions,
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    lat: 51.165691,
    lng: 10.451526,
    regions: germanyStates,
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    lat: 46.227638,
    lng: 2.213749,
    regions: franceRegions,
  },
  {
    id: "spain",
    name: "Spain",
    flag: "🇪🇸",
    lat: 40.463667,
    lng: -3.749220,
    regions: spainRegions,
  },
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    lat: 41.871940,
    lng: 12.567380,
    regions: italyRegions,
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    lat: 52.132633,
    lng: 5.291266,
    regions: netherlandsProvinces,
  },
  {
    id: "poland",
    name: "Poland",
    flag: "🇵🇱",
    lat: 51.919438,
    lng: 19.145136,
    regions: polandVoivodeships,
  },
  {
    id: "belgium",
    name: "Belgium",
    flag: "🇧🇪",
    lat: 50.503887,
    lng: 4.469936,
    regions: belgiumRegions,
  },
  {
    id: "austria",
    name: "Austria",
    flag: "🇦🇹",
    lat: 47.516231,
    lng: 14.550072,
    regions: austriaStates,
  },
  {
    id: "switzerland",
    name: "Switzerland",
    flag: "🇨🇭",
    lat: 46.818188,
    lng: 8.227512,
    regions: switzerlandCantons,
  },
  {
    id: "portugal",
    name: "Portugal",
    flag: "🇵🇹",
    lat: 39.399872,
    lng: -8.224454,
    regions: portugalDistricts,
  },
  {
    id: "greece",
    name: "Greece",
    flag: "🇬🇷",
    lat: 39.074208,
    lng: 21.824312,
    regions: greeceRegions,
  },
  {
    id: "sweden",
    name: "Sweden",
    flag: "🇸🇪",
    lat: 60.128161,
    lng: 18.643501,
    regions: swedenCounties,
  },
  {
    id: "norway",
    name: "Norway",
    flag: "🇳🇴",
    lat: 60.472024,
    lng: 8.468946,
    regions: norwayCounties,
  },
  {
    id: "denmark",
    name: "Denmark",
    flag: "🇩🇰",
    lat: 56.263920,
    lng: 9.501785,
    regions: denmarkRegions,
  },
  {
    id: "finland",
    name: "Finland",
    flag: "🇫🇮",
    lat: 61.924110,
    lng: 25.748152,
    regions: finlandRegions,
  },
  {
    id: "ireland",
    name: "Ireland",
    flag: "🇮🇪",
    lat: 53.142367,
    lng: -7.692054,
    regions: irelandProvinces,
  },
  {
    id: "czech_republic",
    name: "Czech Republic",
    flag: "🇨🇿",
    lat: 49.817492,
    lng: 15.472962,
    regions: czechRegions,
  },
  {
    id: "hungary",
    name: "Hungary",
    flag: "🇭🇺",
    lat: 47.162494,
    lng: 19.503304,
    regions: hungaryCounties,
  },
  {
    id: "romania",
    name: "Romania",
    flag: "🇷🇴",
    lat: 45.943161,
    lng: 24.966760,
    regions: romaniaRegions,
  },
  {
    id: "bulgaria",
    name: "Bulgaria",
    flag: "🇧🇬",
    lat: 42.733883,
    lng: 25.485830,
    regions: bulgariaRegions,
  },
  {
    id: "croatia",
    name: "Croatia",
    flag: "🇭🇷",
    lat: 45.100000,
    lng: 15.200000,
    regions: croatiaRegions,
  },
  {
    id: "slovenia",
    name: "Slovenia",
    flag: "🇸🇮",
    lat: 46.151241,
    lng: 14.995463,
    regions: sloveniaRegions,
  },
  {
    id: "serbia",
    name: "Serbia",
    flag: "🇷🇸",
    lat: 44.016521,
    lng: 21.005859,
    regions: serbiaRegions,
  },
  {
    id: "slovakia",
    name: "Slovakia",
    flag: "🇸🇰",
    lat: 48.669026,
    lng: 19.699024,
    regions: slovakiaRegions,
  },
  {
    id: "ukraine",
    name: "Ukraine",
    flag: "🇺🇦",
    lat: 48.379433,
    lng: 31.165580,
    regions: ukraineRegions,
  },
  
  // ==================== ASIA (19) ====================
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    lat: 36.204824,
    lng: 138.252924,
    regions: japanPrefectures,
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    lat: 35.861660,
    lng: 104.195397,
    regions: chinaProvinces,
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    lat: 20.593684,
    lng: 78.962880,
    regions: indiaStates,
  },
  {
    id: "south_korea",
    name: "South Korea",
    flag: "🇰🇷",
    lat: 35.907757,
    lng: 127.766922,
    regions: southKoreaRegions,
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    lat: 15.870032,
    lng: 100.992541,
    regions: thailandRegions,
  },
  {
    id: "vietnam",
    name: "Vietnam",
    flag: "🇻🇳",
    lat: 14.058324,
    lng: 108.277199,
    regions: vietnamRegions,
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    lat: 4.210484,
    lng: 101.975766,
    regions: malaysiaStates,
  },
  {
    id: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    lat: 1.352083,
    lng: 103.819836,
    regions: singaporeRegions,
  },
  {
    id: "indonesia",
    name: "Indonesia",
    flag: "🇮🇩",
    lat: -0.789275,
    lng: 113.921327,
    regions: indonesiaProvinces,
  },
  {
    id: "philippines",
    name: "Philippines",
    flag: "🇵🇭",
    lat: 12.879721,
    lng: 121.774017,
    regions: philippinesRegions,
  },
  {
    id: "taiwan",
    name: "Taiwan",
    flag: "🇹🇼",
    lat: 23.697809,
    lng: 120.960515,
    regions: taiwanRegions,
  },
  {
    id: "pakistan",
    name: "Pakistan",
    flag: "🇵🇰",
    lat: 30.375321,
    lng: 69.345116,
    regions: pakistanProvinces,
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    flag: "🇧🇩",
    lat: 23.684994,
    lng: 90.356331,
    regions: bangladeshDivisions,
  },
  {
    id: "turkey",
    name: "Turkey",
    flag: "🇹🇷",
    lat: 38.963745,
    lng: 35.243322,
    regions: turkeyRegions,
  },
  
  // ==================== MIDDLE EAST (12) ====================
  {
    id: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    lat: 23.424076,
    lng: 53.847818,
    regions: uaeEmirates,
  },
  {
    id: "saudi_arabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    lat: 23.885942,
    lng: 45.079162,
    regions: saudiArabiaRegions,
  },
  {
    id: "israel",
    name: "Israel",
    flag: "🇮🇱",
    lat: 31.046051,
    lng: 34.851612,
    regions: israelDistricts,
  },
  {
    id: "qatar",
    name: "Qatar",
    flag: "🇶🇦",
    lat: 25.354826,
    lng: 51.183884,
    regions: qatarMunicipalities,
  },
  {
    id: "kuwait",
    name: "Kuwait",
    flag: "🇰🇼",
    lat: 29.311660,
    lng: 47.481766,
    regions: kuwaitGovernorates,
  },
  {
    id: "bahrain",
    name: "Bahrain",
    flag: "🇧🇭",
    lat: 26.066700,
    lng: 50.557700,
    regions: bahrainGovernorates,
  },
  {
    id: "oman",
    name: "Oman",
    flag: "🇴🇲",
    lat: 21.473533,
    lng: 55.975413,
    regions: omanGovernorates,
  },
  {
    id: "jordan",
    name: "Jordan",
    flag: "🇯🇴",
    lat: 30.585164,
    lng: 36.238414,
    regions: jordanGovernorates,
  },
  {
    id: "lebanon",
    name: "Lebanon",
    flag: "🇱🇧",
    lat: 33.854721,
    lng: 35.862285,
    regions: lebanonGovernorates,
  },
  
  // ==================== AFRICA (12) ====================
  {
    id: "south_africa",
    name: "South Africa",
    flag: "🇿🇦",
    lat: -30.559482,
    lng: 22.937506,
    regions: southAfricaProvinces,
  },
  {
    id: "egypt",
    name: "Egypt",
    flag: "🇪🇬",
    lat: 26.820553,
    lng: 30.802498,
    regions: egyptGovernorates,
  },
  {
    id: "morocco",
    name: "Morocco",
    flag: "🇲🇦",
    lat: 31.791702,
    lng: -7.092620,
    regions: moroccoRegions,
  },
  {
    id: "nigeria",
    name: "Nigeria",
    flag: "🇳🇬",
    lat: 9.081999,
    lng: 8.675277,
    regions: nigeriaStates,
  },
  {
    id: "kenya",
    name: "Kenya",
    flag: "🇰🇪",
    lat: -0.023559,
    lng: 37.906193,
    regions: kenyaCounties,
  },
  {
    id: "ghana",
    name: "Ghana",
    flag: "🇬🇭",
    lat: 7.946527,
    lng: -1.023194,
    regions: ghanaRegions,
  },
  {
    id: "tunisia",
    name: "Tunisia",
    flag: "🇹🇳",
    lat: 33.886917,
    lng: 9.537499,
    regions: tunisiaGovernorates,
  },
  {
    id: "ethiopia",
    name: "Ethiopia",
    flag: "🇪🇹",
    lat: 9.145000,
    lng: 40.489673,
    regions: ethiopiaRegions,
  },
  {
    id: "tanzania",
    name: "Tanzania",
    flag: "🇹🇿",
    lat: -6.369028,
    lng: 34.888822,
    regions: tanzaniaRegions,
  },
  {
    id: "uganda",
    name: "Uganda",
    flag: "🇺🇬",
    lat: 1.373333,
    lng: 32.290275,
    regions: ugandaRegions,
  },
  {
    id: "rwanda",
    name: "Rwanda",
    flag: "🇷🇼",
    lat: -1.940278,
    lng: 29.873888,
    regions: rwandaProvinces,
  },
  
  // ==================== SOUTH AMERICA (11) ====================
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    lat: -14.235004,
    lng: -51.925280,
    regions: brazilStates,
  },
  {
    id: "argentina",
    name: "Argentina",
    flag: "🇦🇷",
    lat: -38.416097,
    lng: -63.616672,
    regions: argentinaProvinces,
  },
  {
    id: "colombia",
    name: "Colombia",
    flag: "🇨🇴",
    lat: 4.570868,
    lng: -74.297333,
    regions: colombiaDepartments,
  },
  {
    id: "chile",
    name: "Chile",
    flag: "🇨🇱",
    lat: -35.675147,
    lng: -71.542969,
    regions: chileRegions,
  },
  {
    id: "peru",
    name: "Peru",
    flag: "🇵🇪",
    lat: -9.189967,
    lng: -75.015152,
    regions: peruDepartments,
  },
  {
    id: "ecuador",
    name: "Ecuador",
    flag: "🇪🇨",
    lat: -1.831239,
    lng: -78.183406,
    regions: ecuadorProvinces,
  },
  {
    id: "venezuela",
    name: "Venezuela",
    flag: "🇻🇪",
    lat: 6.423750,
    lng: -66.589730,
    regions: venezuelaStates,
  },
  {
    id: "uruguay",
    name: "Uruguay",
    flag: "🇺🇾",
    lat: -32.522779,
    lng: -55.765835,
    regions: uruguayDepartments,
  },
  {
    id: "paraguay",
    name: "Paraguay",
    flag: "🇵🇾",
    lat: -23.442503,
    lng: -58.443832,
    regions: paraguayDepartments,
  },
  {
    id: "bolivia",
    name: "Bolivia",
    flag: "🇧🇴",
    lat: -16.290154,
    lng: -63.588653,
    regions: boliviaDepartments,
  },
  
  // ==================== OCEANIA (2) ====================
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    lat: -25.274398,
    lng: 133.775136,
    regions: australiaStates,
  },
  {
    id: "new_zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    lat: -40.900557,
    lng: 174.885971,
    regions: newZealandRegions,
  },
  
  // ==================== CENTRAL AMERICA & CARIBBEAN (7) ====================
  {
    id: "costa_rica",
    name: "Costa Rica",
    flag: "🇨🇷",
    lat: 9.748917,
    lng: -83.753428,
    regions: costaRicaProvinces,
  },
  {
    id: "panama",
    name: "Panama",
    flag: "🇵🇦",
    lat: 8.537981,
    lng: -80.782127,
    regions: panamaProvinces,
  },
  {
    id: "jamaica",
    name: "Jamaica",
    flag: "🇯🇲",
    lat: 18.109581,
    lng: -77.297508,
    regions: jamaicaParishes,
  },
  {
    id: "dominican_republic",
    name: "Dominican Republic",
    flag: "🇩🇴",
    lat: 18.735693,
    lng: -70.162651,
    regions: dominicanRepublicProvinces,
  },
  {
    id: "cuba",
    name: "Cuba",
    flag: "🇨🇺",
    lat: 21.521757,
    lng: -77.781167,
    regions: cubaProvinces,
  },
  {
    id: "puerto_rico",
    name: "Puerto Rico",
    flag: "🇵🇷",
    lat: 18.220833,
    lng: -66.590149,
    regions: puertoRicoRegions,
  },
];

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Convert km to miles
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

// Estimate travel time based on distance and speed
export function estimateTravelTime(distanceKm: number, speedKmh: number): string {
  const hours = distanceKm / speedKmh;
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  
  if (days === 0) {
    return `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  } else if (days === 1) {
    return remainingHours > 0 
      ? `1 day, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
      : '1 day';
  } else {
    return remainingHours > 0 
      ? `${days} days, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
      : `${days} days`;
  }
}

// Get country by ID
export function getCountryById(countryId: string): Country | undefined {
  return worldCountries.find(c => c.id === countryId);
}

// Get region by ID from a country
export function getRegionById(countryId: string, regionId: string): Region | undefined {
  const country = getCountryById(countryId);
  return country?.regions.find(r => r.id === regionId);
}

// Get country by name (case-insensitive)
export function getCountryByName(countryName: string): Country | undefined {
  return worldCountries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
}

// Get region by name from a country (case-insensitive)
export function getRegionByName(countryId: string, regionName: string): Region | undefined {
  const country = getCountryById(countryId);
  return country?.regions.find(r => r.name.toLowerCase() === regionName.toLowerCase());
}

// ==================== AIR CARGO UTILITIES ====================

const AVERAGE_FLIGHT_SPEED_KMH = 800;

// Estimate flight time in hours
export function estimateFlightTime(distanceKm: number): { hours: number; minutes: number; display: string } {
  const totalHours = distanceKm / AVERAGE_FLIGHT_SPEED_KMH;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  let display: string;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    display = remHours > 0
      ? `${days}d ${remHours}h ${minutes}m`
      : `${days}d ${minutes}m`;
  } else {
    display = `${hours}h ${minutes}m`;
  }

  return { hours, minutes, display };
}

// Calculate air cargo price based on distance
export function calculateAirCargoPrice(distanceKm: number): number {
  if (distanceKm <= 1000) {
    // $400–$800: linear interpolation
    return 400 + (distanceKm / 1000) * 400;
  } else if (distanceKm <= 3000) {
    // $800–$1800
    const ratio = (distanceKm - 1000) / 2000;
    return 800 + ratio * 1000;
  } else if (distanceKm <= 6000) {
    // $1500–$3000
    const ratio = (distanceKm - 3000) / 3000;
    return 1500 + ratio * 1500;
  } else {
    // $3000–$6000+ (caps at ~$6000 around 18000 km)
    const ratio = Math.min((distanceKm - 6000) / 12000, 1);
    return 3000 + ratio * 3000;
  }
}

// Calculate companion fee based on distance
export function calculateCompanionFee(distanceKm: number): number {
  return distanceKm < 3000 ? 300 : 700;
}
