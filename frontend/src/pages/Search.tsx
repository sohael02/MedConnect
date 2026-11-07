import { useState, useCallback } from 'react';
import { SearchForm } from '../components/search/SearchForm';
import { SearchResults } from '../components/search/SearchResults';
import { PharmacyDetail } from '../components/pharmacy/PharmacyCard';
import type { Pharmacy, MedicineInventory, LocationCoords, SearchResponse } from '../types';

interface PharmacyWithMatches extends Pharmacy {
  matchingMedicines?: MedicineInventory[];
}

function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PharmacyWithMatches[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyWithMatches | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const handleSearch = useCallback(async (request: { medicine: string; location: LocationCoords; radiusKm: number }) => {
    setIsLoading(true);
    setLastSearchQuery(request.medicine);
    try {
      // Backend expects latitude and longitude at top level, not nested in location
      const searchRequest = {
        medicine: request.medicine,
        latitude: request.location.latitude,
        longitude: request.location.longitude,
        radiusKm: request.radiusKm,
      };
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchRequest),
      });
      const data = await response.json();
      setResults(data.pharmacies || []);
    } catch {
      // Error handling is done in SearchForm
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePharmacySelect = (pharmacy: PharmacyWithMatches) => { setSelectedPharmacy(pharmacy); };
  const handleDirections = (pharmacy: PharmacyWithMatches): void => { window.open(`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`, '_blank', 'noopener,noreferrer'); };
  const handleReport = (pharmacy: PharmacyWithMatches): void => { 
    const s = encodeURIComponent(`Report Issue: ${pharmacy.name}`); 
    const b = encodeURIComponent(`Pharmacy: ${pharmacy.name}\nAddress: ${pharmacy.address}\n\nPlease describe the issue:\n`); 
    window.open(`mailto:support@medconnect.example.com?subject=${s}&body=${b}`); 
  };

  // Get the first result's location for map center, or default
  const searchLatitude = results[0]?.latitude ?? 20.5937;
  const searchLongitude = results[0]?.longitude ?? 78.9629;

  // Build the search response object matching backend format
  const searchResponse: SearchResponse = {
    pharmacies: results,
    total: results.length,
    query: lastSearchQuery,
    searchLatitude,
    searchLongitude,
    radiusKm: 10,
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Search Medicines</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">Find nearby pharmacies that have the medicine you need</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <SearchForm
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
          </aside>
          <div className="lg:col-span-3">
            {selectedPharmacy && (
              <div className="mb-6">
                <PharmacyDetail
                  pharmacy={selectedPharmacy}
                  onClose={() => setSelectedPharmacy(null)}
                  onDirections={handleDirections}
                  onReport={handleReport}
                />
              </div>
            )}
            <SearchResults
              response={searchResponse}
              isLoading={isLoading}
              onPharmacySelect={handlePharmacySelect}
              onDirections={handleDirections}
              onReport={handleReport}
              selectedPharmacyId={selectedPharmacy?.id}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;