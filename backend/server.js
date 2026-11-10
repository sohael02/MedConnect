const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PHARMACIES_FILE = path.join(DATA_DIR, 'pharmacies.json');
const MEDICINES_FILE = path.join(DATA_DIR, 'medicines.json');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');

// Load data
function loadData(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return [];
  }
}

function saveData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error);
    return false;
  }
}

// Haversine formula for distance calculation
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  return dp[m][n];
}

// Find similar medicine names for fuzzy search
function findSimilarMedicines(query, medicines, threshold = 3) {
  const lowerQuery = query.toLowerCase();
  const suggestions = [];
  
  for (const med of medicines) {
    const names = [
      med.name.toLowerCase(),
      med.genericName.toLowerCase(),
      med.brandName?.toLowerCase() || ''
    ].filter(Boolean);
    
    for (const name of names) {
      // Check for substring match first (exact partial match)
      if (name.includes(lowerQuery) || lowerQuery.includes(name)) {
        suggestions.push({ medicine: med, score: 0, matchType: 'substring' });
        break;
      }
      
      // Check Levenshtein distance for fuzzy match
      const distance = levenshteinDistance(lowerQuery, name);
      if (distance <= threshold && distance > 0) {
        suggestions.push({ medicine: med, score: distance, matchType: 'fuzzy' });
        break;
      }
    }
  }
  
  // Sort by score (exact matches first, then by distance)
  return suggestions
    .sort((a, b) => a.score - b.score)
    .slice(0, 10)
    .map(s => s.medicine);
}

// Medicine name normalization for search
function normalizeMedicineName(name) {
  const map = {
    'dolo': 'paracetamol',
    'calpol': 'paracetamol',
    'crocin': 'paracetamol',
    'combiflam': 'ibuprofen + paracetamol',
    'meftal': 'mefenamic acid',
    'allegra': 'fexofenadine',
    'alerid': 'cetirizine',
    'cetrine': 'cetirizine',
    'omeprazole': 'omeprazole',
    'pan 40': 'pantoprazole',
    'nexpro': 'esomeprazole',
    'rantac': 'ranitidine',
    'zantac': 'ranitidine',
    'azithral': 'azithromycin',
    'azax': 'azithromycin',
    'taxim-o': 'cefixime',
    'zifi': 'cefixime',
    'moxikind-cv': 'amoxicillin + clavulanic acid',
    'augmentin': 'amoxicillin + clavulanic acid',
    'clavim': 'amoxicillin + clavulanic acid',
    'ciplox': 'ciprofloxacin',
    'levoflox': 'levofloxacin',
    'norflox': 'norfloxacin',
    'ofloxacin': 'ofloxacin',
    'metrogyl': 'metronidazole',
    'flagyl': 'metronidazole',
    'tinidazole': 'tinidazole',
    'glycomet': 'metformin',
    'gluconorm': 'metformin',
    'glucophage': 'metformin',
    'janumet': 'sitagliptin + metformin',
    'jalra': 'vildagliptin',
    'diamicron': 'gliclazide',
    'amaryl': 'glimepiride',
    'zoryl': 'glimepiride',
    'teneligliptin': 'teneligliptin',
    'sitagliptin': 'sitagliptin',
    'voglibose': 'voglibose',
    'pioglitazone': 'pioglitazone',
    'ecosprin': 'aspirin',
    'clopidogrel': 'clopidogrel',
    'shelcal': 'calcium + vitamin d3',
    'zincovit': 'multivitamin + zinc',
    'dexorange': 'iron + folic acid + vitamin b12',
    'becosules': 'vitamin b complex',
    'neurobion forte': 'vitamin b1 + b6 + b12',
    'revital': 'multivitamin + minerals + ginseng',
    'liv52': 'herbal liver tonic',
    'himalaya cystone': 'herbal urinary tonic',
    'limcee': 'vitamin c',
    'sinerga': 'multivitamin',
    'ferritas': 'iron',
    'astymin': 'amino acids',
    'a to z gold': 'multivitamin + minerals',
    'supradyn': 'multivitamin + minerals',
    'folvite': 'folic acid',
    'cobadex czs': 'vitamin b complex + zinc',
    'optineuron': 'mecobalamin + vitamins',
    'maxirich': 'multivitamin + minerals',
    'becosule z': 'vitamin b complex + zinc',
    'bplex': 'vitamin b complex',
    'volini': 'diclofenac',
    'moov': 'diclofenac',
    'ibugesic': 'ibuprofen',
    'spasmonil': 'dicyclomine + paracetamol',
    'cyclopam': 'dicyclomine + paracetamol',
    'normaxin': 'dicyclomine + chlordiazepoxide',
    'digene': 'antacid',
    'gelusil': 'antacid',
    'mucaine': 'antacid + oxetacaine',
    'ulgel': 'antacid',
    'lomotil': 'diphenoxylate + atropine',
    'otrivin': 'xylometazoline',
    'sinarest': 'paracetamol + chlorpheniramine + phenylephrine',
    'benadryl': 'diphenhydramine',
    'cetirizine': 'cetirizine',
    'amoxicillin': 'amoxicillin',
    'azithromycin': 'azithromycin',
    'doxycycline': 'doxycycline',
    'erythromycin': 'erythromycin',
    'cefixime': 'cefixime',
    'amikacin': 'amikacin',
    'linezolid': 'linezolid',
    'targocid': 'teicoplanin',
    'clavim': 'amoxicillin + clavulanic acid',
    'rabeprazole': 'rabeprazole',
    'lanzol': 'lansoprazole',
    'esomac': 'esomeprazole',
    'aciloc': 'ranitidine',
    'itopride': 'itopride',
    'domperidone': 'domperidone',
    'ondansetron': 'ondansetron',
    'tazloc': 'telmisartan',
    'aztreonam': 'aztreonam',
    'losartan': 'losartan',
    'amlodipine': 'amlodipine',
    'telmisartan': 'telmisartan',
    'rosuvastatin': 'rosuvastatin',
    'atorvastatin': 'atorvastatin',
    'metformin': 'metformin',
    'human mixtard': 'human insulin mix',
    'insuman': 'human insulin',
    'ciprofloxacin': 'ciprofloxacin',
    'metronidazole': 'metronidazole',
    'ranitidine': 'ranitidine',
    'pantoprazole': 'pantoprazole',
    'omeprazole': 'omeprazole',
    'esomeprazole': 'esomeprazole',
    'fexofenadine': 'fexofenadine',
    'cetirizine': 'cetirizine',
    'mefenamic acid': 'mefenamic acid',
    'ibuprofen': 'ibuprofen',
    'diclofenac': 'diclofenac',
    'dicyclomine': 'dicyclomine',
    'chlordiazepoxide': 'chlordiazepoxide',
    'diphenoxylate': 'diphenoxylate',
    'atropine': 'atropine',
    'xylometazoline': 'xylometazoline',
    'chlorpheniramine': 'chlorpheniramine',
    'phenylephrine': 'phenylephrine',
    'diphenhydramine': 'diphenhydramine',
    'gliclazide': 'gliclazide',
    'glimepiride': 'glimepiride',
    'vildagliptin': 'vildagliptin',
    'teneligliptin': 'teneligliptin',
    'insulin': 'human insulin',
    'clavam': 'amoxicillin + clavulanic acid',
    'amoxicillin': 'amoxicillin',
    'clavulanic acid': 'clavulanic acid',
    'levocetirizine': 'levocetirizine',
    'montelukast': 'montelukast',
    'aceclofenac': 'aceclofenac',
    'serratiopeptidase': 'serratiopeptidase',
    'rabeprazole': 'rabeprazole',
    'levosulpiride': 'levosulpiride',
    'drotaverine': 'drotaverine',
    'paracetamol': 'paracetamol',
  };

  const lower = name.toLowerCase().trim();
  return map[lower] || lower;
}

// Load data on startup
let pharmacies = loadData(PHARMACIES_FILE);
let medicines = loadData(MEDICINES_FILE);
let inventory = loadData(INVENTORY_FILE);

console.log(`Loaded ${pharmacies.length} pharmacies, ${medicines.length} medicines, ${inventory.length} inventory entries`);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Search medicines
app.get('/api/medicines/search', (req, res) => {
  const query = req.query.q?.toLowerCase().trim();
  if (!query) {
    return res.json([]);
  }

  const searchTerm = normalizeMedicineName(query);
  
  // First try exact match
  let results = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm) ||
    med.genericName.toLowerCase().includes(searchTerm) ||
    (med.brandName && med.brandName.toLowerCase().includes(searchTerm))
  );
  
  // If no exact matches, try fuzzy matching
  if (results.length === 0) {
    results = findSimilarMedicines(searchTerm, medicines);
  }

  res.json(results.slice(0, 20));
});

// Get all medicines (paginated)
app.get('/api/medicines', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  res.json({
    data: medicines.slice(start, end),
    total: medicines.length,
    page,
    limit,
    totalPages: Math.ceil(medicines.length / limit)
  });
});

// Get pharmacy by ID
app.get('/api/pharmacies/:id', (req, res) => {
  const pharmacy = pharmacies.find(p => p.id === req.params.id);
  if (!pharmacy) {
    return res.status(404).json({ error: 'Pharmacy not found' });
  }
  res.json(pharmacy);
});

// Get all pharmacies (paginated)
app.get('/api/pharmacies', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  res.json({
    data: pharmacies.slice(start, end),
    total: pharmacies.length,
    page,
    limit,
    totalPages: Math.ceil(pharmacies.length / limit)
  });
});

// Search pharmacies by medicine and location
app.post('/api/search', (req, res) => {
  const { medicine, latitude, longitude, radiusKm = 10 } = req.body;
  
  if (!medicine || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Missing required fields: medicine, latitude, longitude' });
  }

  const searchTerm = normalizeMedicineName(medicine);
  
  // Find matching medicine IDs - first try exact match, then fuzzy match
  let matchingMedicines = medicines
    .filter(m => 
      m.name.toLowerCase().includes(searchTerm) ||
      m.genericName.toLowerCase().includes(searchTerm) ||
      (m.brandName && m.brandName.toLowerCase().includes(searchTerm))
    );
  
  // If no exact matches, try fuzzy matching
  if (matchingMedicines.length === 0) {
    matchingMedicines = findSimilarMedicines(searchTerm, medicines);
  }
  
  const matchingMedicineIds = matchingMedicines.map(m => m.id);

  if (matchingMedicineIds.length === 0) {
    return res.json({
      pharmacies: [],
      total: 0,
      query: medicine,
      searchLatitude: latitude,
      searchLongitude: longitude,
      radiusKm
    });
  }

  // Find inventory entries for matching medicines
  const matchingInventory = inventory.filter(inv => 
    matchingMedicineIds.includes(inv.medicineId)
  );

  // Group by pharmacy and calculate distances
  const pharmacyMap = new Map();
  
  matchingInventory.forEach(inv => {
    const pharmacy = pharmacies.find(p => p.id === inv.pharmacyId);
    if (!pharmacy) return;

    const distance = haversineDistance(latitude, longitude, pharmacy.latitude, pharmacy.longitude);
    
    if (distance <= radiusKm) {
      if (!pharmacyMap.has(pharmacy.id)) {
        pharmacyMap.set(pharmacy.id, {
          ...pharmacy,
          distance: Math.round(distance * 100) / 100,
          matchingMedicines: []
        });
      }
      const med = medicines.find(m => m.id === inv.medicineId);
      if (med) {
        pharmacyMap.get(pharmacy.id).matchingMedicines.push({
          medicineId: med.id,
          name: med.name,
          genericName: med.genericName,
          brandName: med.brandName,
          strength: med.strength,
          dosageForm: med.dosageForm,
          availability: inv.availability,
          quantity: inv.quantity,
          price: inv.price,
          lastUpdated: inv.lastUpdated
        });
      }
    }
  });

  // Convert to array and sort by distance
  const results = Array.from(pharmacyMap.values())
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 50);

  res.json({
    pharmacies: results,
    total: results.length,
    query: medicine,
    searchLatitude: latitude,
    searchLongitude: longitude,
    radiusKm
  });
});

// Get pharmacy inventory
app.get('/api/pharmacies/:id/inventory', (req, res) => {
  const pharmacyInventory = inventory
    .filter(inv => inv.pharmacyId === req.params.id)
    .map(inv => {
      const med = medicines.find(m => m.id === inv.medicineId);
      return {
        ...inv,
        medicine: med
      };
    });
  res.json(pharmacyInventory);
});

// Geocode endpoint (proxy to Nominatim)
app.get('/api/geocode', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`, {
      headers: { 'User-Agent': 'MedConnect/1.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Geocode error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Reverse geocode
app.get('/api/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon parameters required' });
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'MedConnect/1.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ error: 'Reverse geocoding failed' });
  }
});

// Admin: Update inventory
app.patch('/api/admin/inventory/:id', (req, res) => {
  const { availability, quantity, price } = req.body;
  const index = inventory.findIndex(inv => inv.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Inventory entry not found' });
  }

  if (availability) inventory[index].availability = availability;
  if (quantity !== undefined) inventory[index].quantity = quantity;
  if (price !== undefined) inventory[index].price = price;
  inventory[index].lastUpdated = new Date().toISOString();

  if (saveData(INVENTORY_FILE, inventory)) {
    res.json(inventory[index]);
  } else {
    res.status(500).json({ error: 'Failed to save inventory' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MedConnect Backend running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});