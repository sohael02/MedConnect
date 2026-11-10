# MedConnect

**Pharmacy Discovery and Medicine Availability Platform**

MedConnect helps users find nearby pharmacies that have the medicines they need. Search by medicine name, brand, strength, or dosage form, and see pharmacies sorted by distance with interactive maps.

## Features

- 🔍 **Smart Medicine Search** - Search by medicine name, brand, strength (e.g., "500mg"), or dosage form (tablet, syrup)
- 📍 **Location-Aware Results** - Use current location or enter an address manually
- 🗺️ **Interactive Maps** - View pharmacies on OpenStreetMap with distance calculations
- 📊 **Verified Inventory Data** - Browse 39 pharmacies with 78 unique medicines (622 inventory records)
- 🛡️ **Privacy-First** - Location data processed locally, never stored
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- ⚡ **Fast Search** - Debounced search with autocomplete suggestions

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS v3 |
| **Routing** | React Router v6 |
| **Maps** | Leaflet + React Leaflet + OpenStreetMap |
| **Icons** | Lucide React |
| **Backend** | Node.js + Express.js |
| **Data** | JSON files (pharmacies, medicines, inventory) |
| **Geocoding** | OpenStreetMap Nominatim |
| **Monorepo** | npm workspaces + concurrently |

## Project Structure

```
Medconnect/
├── package.json              # Root package.json with concurrently
├── .gitignore
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js             # Express server
│   ├── import-data.js        # Data import script
│   ├── data/
│   │   ├── pharmacies.json   # 39 pharmacies
│   │   ├── medicines.json    # 78 unique medicines
│   │   └── inventory.json    # 622 inventory entries
│   └── routes/               # API routes
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Pharmacies.tsx
│   │   │   ├── PharmacyDetail.tsx
│   │   │   └── Medicines.tsx
│   │   └── main.tsx
│   └── public/
└── docs/
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git (optional)

### One-Command Setup

```bash
# Clone and enter directory
cd C:\Users\dell\Desktop\Medconnect

# Install all dependencies (run once)
npm run install:all

# Start development servers (frontend + backend)
npm run dev
```

That's it! The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

### Manual Setup (if needed)

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Start both (from root)
cd .. && npm run dev
```

## API Endpoints

### Health & Info
- `GET /api/health` - Health check

### Pharmacies
- `GET /api/pharmacies` - List pharmacies (paginated)
- `GET /api/pharmacies/:id` - Get pharmacy details
- `GET /api/pharmacies/:id/inventory` - Get pharmacy inventory

### Medicines
- `GET /api/medicines` - List medicines (paginated)
- `GET /api/medicines/search?q=` - Search medicines

### Search
- `POST /api/search` - Search pharmacies by medicine + location
  ```json
  {
    "medicine": "paracetamol",
    "latitude": 15.2156,
    "longitude": 79.9034,
    "radiusKm": 10
  }
  ```

### Geocoding
- `GET /api/geocode?q=` - Forward geocode (address → coordinates)
- `GET /api/reverse-geocode?lat=&lon=` - Reverse geocode (coordinates → address)

### Admin
- `PATCH /api/admin/inventory/:id` - Update inventory (availability, quantity, price)

## Data

The application uses JSON files for data storage:

- **pharmacies.json** - 39 pharmacies across Kandukur, Ongole, Nellore, Vijayawada (Andhra Pradesh)
- **medicines.json** - 78 unique medicines with normalized names, strengths, dosage forms
- **inventory.json** - 622 inventory entries linking pharmacies to medicines

Data source: Original dataset from `med_data.json` with 40 pharmacy records, processed to normalize medicine names, extract strengths/dosage forms, and create proper relational structure.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features, stats, how-it-works |
| `/search` | Main search page with medicine + location search |
| `/pharmacies` | Browse all pharmacies with search |
| `/pharmacies/:id` | Pharmacy detail with map and medicines |
| `/medicines` | Browse medicine catalog |

## Development

### Running Tests
```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && npm test
```

### Building for Production
```bash
npm run build
```

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:5000
```

## Data Import

To re-import data from the original `med_data.json`:

```bash
cd backend && node import-data.js
```

This reads from `../backend-old/med_data.json` and creates:
- `data/pharmacies.json`
- `data/medicines.json`
- `data/inventory.json`

## License

MIT License - see LICENSE file for details.

## Disclaimer

MedConnect is an information service only. Medicine availability data is sourced from public datasets and may not reflect real-time stock levels. Always contact the pharmacy directly to confirm availability before visiting. MedConnect does not sell medicines or provide medical advice.

## Credits

- **Map tiles**: OpenStreetMap contributors
- **Geocoding**: OpenStreetMap Nominatim
- **Icons**: Lucide React
- **Map library**: Leaflet + React Leaflet
- **Original data**: Public pharmacy dataset from Andhra Pradesh, India