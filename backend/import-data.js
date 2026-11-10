const fs = require('fs');
const path = require('path');

// Read the original data
const originalData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'backend-old', 'med_data.json'), 'utf-8'));

// Medicine name normalization - map common brand names to generic names
const medicineNormalizationMap = {
  // Paracetamol variants
  'dolo': 'paracetamol',
  'calpol': 'paracetamol',
  'crocin': 'paracetamol',
  'combiflam': 'ibuprofen + paracetamol',
  'meftal': 'mefenamic acid',
  'allegra': 'fexofenadine',
  'alerid': 'cetirizine',
  'cetrine': 'cetirizine',
  'omet': 'omeprazole',
  'o mez': 'omeprazole',
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

// Helper to normalize medicine names
function normalizeMedicineName(name) {
  const lower = name.toLowerCase().trim();
  return medicineNormalizationMap[lower] || lower;
}

// Extract strength and dosage form from medicine name
function parseMedicineDetails(name) {
  const original = name.trim();
  let normalized = original;
  let strength = null;
  let dosageForm = null;

  // Match strength patterns like "500 mg", "250 mg", "10 mg/5ml", "200 mg/5ml"
  const strengthMatch = original.match(/(\d+(?:\.\d+)?\s*(?:mg|ml|g|mcg|IU)(?:\/\d+(?:\.\d+)?\s*(?:mg|ml|g|mcg|IU))?)/i);
  if (strengthMatch) {
    strength = strengthMatch[1].trim();
    normalized = original.replace(strengthMatch[0], '').trim();
  }

  // Match dosage forms
  const dosageForms = [
    'tablet', 'tablets', 'tab', 'tabs',
    'capsule', 'capsules', 'cap', 'caps',
    'syrup', 'suspension', 'susp',
    'injection', 'inj', 'iv', 'im', 'sc',
    'cream', 'ointment', 'gel', 'lotion',
    'drops', 'drop', 'eye drops', 'ear drops',
    'inhaler', 'rotacap', 'respule', 'nebulizer',
    'patch', 'spray', 'powder', 'granules',
    'sachet', 'lozenge', 'suppository', 'pessary', 'film'
  ];

  for (const form of dosageForms) {
    const regex = new RegExp(`\\b${form}\\b`, 'i');
    if (regex.test(normalized)) {
      dosageForm = form.charAt(0).toUpperCase() + form.slice(1);
      normalized = normalized.replace(regex, '').trim();
      break;
    }
  }

  // Clean up normalized name
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Get generic name
  const generic = normalizeMedicineName(normalized);

  return {
    originalName: original,
    name: normalized,
    genericName: generic,
    strength,
    dosageForm,
    brandName: normalized !== generic ? normalized : null
  };
}

// Haversine formula for distance
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

// Generate unique ID
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Process pharmacies
const pharmacies = [];
const medicinesMap = new Map(); // key: genericName|strength|dosageForm -> medicine object
const inventory = [];

originalData.forEach((store, index) => {
  const pharmacyId = `pharmacy_${index + 1}`;
  
  // Clean up coordinates
  let latitude = store.latitude;
  let longitude = store.longitude;
  
  if (typeof latitude === 'string') {
    latitude = parseFloat(latitude.replace(/,/g, '').trim());
  }
  if (typeof longitude === 'string') {
    longitude = parseFloat(longitude.replace(/,/g, '').trim());
  }

  const pharmacy = {
    id: pharmacyId,
    name: store.store_name,
    address: store.address,
    latitude,
    longitude,
    phone: store.contact_number ? String(store.contact_number) : null,
    email: store.email || null,
    website: store.website || null,
    pinCode: store.pin_code ? String(store.pin_code) : null,
    plusCode: store.plus_code || null,
    ownerName: store.owner_name || null
  };
  pharmacies.push(pharmacy);

  // Process medicines
  const medicineNames = store.medicines.split(',').map(m => m.trim()).filter(m => m);
  
  medicineNames.forEach(medName => {
    const parsed = parseMedicineDetails(medName);
    
    // Create unique key for medicine
    const medicineKey = `${parsed.genericName}|${parsed.strength || ''}|${parsed.dosageForm || ''}`;
    
    let medicine = medicinesMap.get(medicineKey);
    
    if (!medicine) {
      const medicineId = `medicine_${medicinesMap.size + 1}`;
      medicine = {
        id: medicineId,
        name: parsed.name,
        genericName: parsed.genericName,
        brandName: parsed.brandName,
        strength: parsed.strength,
        dosageForm: parsed.dosageForm,
        displayName: parsed.name
      };
      medicinesMap.set(medicineKey, medicine);
    }

    // Create inventory entry
    const inventoryId = `inventory_${inventory.length + 1}`;
    inventory.push({
      id: inventoryId,
      pharmacyId,
      medicineId: medicine.id,
      availability: 'unverified',
      quantity: null,
      price: null,
      lastUpdated: null,
      source: 'original_dataset'
    });
  });
});

const medicines = Array.from(medicinesMap.values());

// Write JSON files
const dataDir = path.join(__dirname, 'data');

fs.writeFileSync(path.join(dataDir, 'pharmacies.json'), JSON.stringify(pharmacies, null, 2));
fs.writeFileSync(path.join(dataDir, 'medicines.json'), JSON.stringify(medicines, null, 2));
fs.writeFileSync(path.join(dataDir, 'inventory.json'), JSON.stringify(inventory, null, 2));

console.log(`Created ${pharmacies.length} pharmacies`);
console.log(`Created ${medicines.length} unique medicines`);
console.log(`Created ${inventory.length} inventory entries`);
console.log('Files written to backend/data/');