// Comprehensive world locations with coordinates for distance calculation
// Coordinates are approximate center points for distance estimation

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

// Countries array
export const worldCountries: Country[] = [
  // North America
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
  
  // Europe
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
  
  // Asia Pacific
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    lat: -25.274398,
    lng: 133.775136,
    regions: australiaStates,
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    lat: 36.204824,
    lng: 138.252924,
    regions: japanPrefectures,
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
    id: "china",
    name: "China",
    flag: "🇨🇳",
    lat: 35.861660,
    lng: 104.195397,
    regions: chinaProvinces,
  },
  
  // South America
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    lat: -14.235004,
    lng: -51.925280,
    regions: brazilStates,
  },
  
  // Middle East
  {
    id: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    lat: 23.424076,
    lng: 53.847818,
    regions: uaeEmirates,
  },
  
  // Africa
  {
    id: "south_africa",
    name: "South Africa",
    flag: "🇿🇦",
    lat: -30.559482,
    lng: 22.937506,
    regions: southAfricaProvinces,
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
