import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Navigation, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  pinCode?: string;
  plusCode?: string;
  ownerName?: string;
  distance?: number;
  matchingMedicines?: MedicineMatch[];
}

interface MedicineMatch {
  medicineId: string;
  name: string;
  genericName: string;
  brandName?: string;
  strength?: string;
  dosageForm?: string;
  availability: string;
  quantity?: number;
  price?: number;
  lastUpdated?: string;
}

export default function PharmacyDetail() {
  const { id } = useParams<{ id: string }>();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPharmacy = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/pharmacies/${id}`);
        if (!response.ok) {
          throw new Error('Pharmacy not found');
        }
        const data = await response.json();
        setPharmacy(data);
      } catch (err) {
        setError('Failed to load pharmacy details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPharmacy();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-secondary-200 dark:bg-secondary-700 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
            <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
          </div>
          <div className="h-96 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="h-16 w-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Pharmacy Not Found</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">The pharmacy you're looking for doesn't exist or has been removed.</p>
          <Link to="/pharmacies" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Back to Pharmacies
          </Link>
        </div>
      </div>
    );
  }

  const matchingMedicines = pharmacy.matchingMedicines || [];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/pharmacies" className="inline-flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          Back to Pharmacies
        </Link>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">{pharmacy.name}</h1>
              {pharmacy.ownerName && <p className="text-secondary-500 dark:text-secondary-400 mt-1">Owner: {pharmacy.ownerName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Contact & Location</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <address className="text-secondary-600 dark:text-secondary-400 not-italic">{pharmacy.address}</address>
                  </div>
                  {pharmacy.phone && (
                    <a href={`tel:${pharmacy.phone}`} className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Phone className="h-6 w-6 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                      <span>{pharmacy.phone}</span>
                    </a>
                  )}
                  {pharmacy.email && (
                    <a href={`mailto:${pharmacy.email}`} className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Mail className="h-6 w-6 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                      <span>{pharmacy.email}</span>
                    </a>
                  )}
                  {pharmacy.website && (
                    <a href={pharmacy.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Globe className="h-6 w-6 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                      <span>Website</span>
                    </a>
                  )}
                  {pharmacy.pinCode && (
                    <div className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400">
                      <MapPin className="h-6 w-6 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                      <span>PIN: {pharmacy.pinCode}</span>
                    </div>
                  )}
                  {pharmacy.plusCode && (
                    <div className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400">
                      <MapPin className="h-6 w-6 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                      <span>{pharmacy.plusCode}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <button onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }} className="btn-primary flex-1 sm:flex-none">
                    <Navigation className="h-4 w-4 mr-2 inline" />
                    Get Directions
                  </button>
                  <button onClick={() => {
                    const subject = encodeURIComponent(`Report Issue: ${pharmacy.name}`);
                    const body = encodeURIComponent(`Pharmacy: ${pharmacy.name}\nAddress: ${pharmacy.address}\n\nPlease describe the issue:\n`);
                    window.open(`mailto:support@medconnect.example.com?subject=${subject}&body=${body}`);
                  }} className="w-full btn-outline text-center sm:flex-none">
                    <AlertTriangle className="h-4 w-4 mr-2 inline" />
                    Report Issue
                  </button>
                </div>
              </div>

              {matchingMedicines.length > 0 && (
                <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Available Medicines ({matchingMedicines.length})</h2>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">Showing matching medicines for your search</span>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-secondary-200 dark:border-secondary-700">
                          <th className="text-left py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Medicine</th>
                          <th className="text-left py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Strength</th>
                          <th className="text-left py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Form</th>
                          <th className="text-center py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Status</th>
                          <th className="text-right py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchingMedicines.map((med) => (
                          <tr key={med.medicineId} className="border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                            <td className="py-3 px-3 font-medium text-secondary-900 dark:text-white">{med.name}</td>
                            <td className="py-3 px-3 text-secondary-600 dark:text-secondary-400">{med.strength || '-'}</td>
                            <td className="py-3 px-3 text-secondary-600 dark:text-secondary-400">{med.dosageForm || '-'}</td>
                            <td className="py-3 px-3 text-center">
                              <AvailabilityBadge status={med.availability} />
                            </td>
                            <td className="py-3 px-3 text-right text-secondary-600 dark:text-secondary-400">
                              {med.price ? `₹${med.price.toFixed(2)}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-secondary-900 dark:text-white mb-4">Information</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary-500 dark:text-secondary-400">Status</dt>
                  <dd className="font-medium text-secondary-900 dark:text-white">Active</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500 dark:text-secondary-400">Coordinates</dt>
                  <dd className="font-medium font-mono text-secondary-900 dark:text-white">{pharmacy.latitude.toFixed(6)}, {pharmacy.longitude.toFixed(6)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500 dark:text-secondary-400">Data Source</dt>
                  <dd className="font-medium text-secondary-900 dark:text-white">Imported Dataset</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500 dark:text-secondary-400">Distance</dt>
                  <dd className="font-medium text-secondary-900 dark:text-white">{pharmacy.distance !== undefined && pharmacy.distance !== null ? pharmacy.distance.toFixed(1) + ' km' : 'N/A'}</dd>
                </div>
              </dl>

              <div className="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <h3 className="font-medium text-secondary-900 dark:text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }} className="w-full btn-primary text-center">
                    <Navigation className="h-4 w-4 mr-2 inline" />
                    Get Directions
                  </button>
                  <button onClick={() => {
                    const subject = encodeURIComponent(`Report Issue: ${pharmacy.name}`);
                    const body = encodeURIComponent(`Pharmacy: ${pharmacy.name}\nAddress: ${pharmacy.address}\n\nPlease describe the issue:\n`);
                    window.open(`mailto:support@medconnect.example.com?subject=${subject}&body=${body}`);
                  }} className="w-full btn-outline text-center sm:flex-none">
                    <AlertTriangle className="h-4 w-4 mr-2 inline" />
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailabilityBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    in_stock: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    out_of_stock: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    limited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    unverified: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    discontinued: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-500',
  };

  const labels: Record<string, string> = {
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    limited: 'Limited',
    unverified: 'Unverified',
    discontinued: 'Discontinued',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[status] || variants.unverified}`}>
      {labels[status] || status}
    </span>
  );
}