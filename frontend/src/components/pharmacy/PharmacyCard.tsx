import { MapPin, Phone, Mail, Globe, Navigation, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { formatDistance, formatPrice, formatRelativeTime } from '../../utils/helpers';
import { Badge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import type { Pharmacy, MedicineInventory } from '../../types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onClick?: () => void;
  onDirections?: (pharmacy: Pharmacy) => void;
  onReport?: (pharmacy: Pharmacy) => void;
  isSelected?: boolean;
}

export function PharmacyCard({
  pharmacy,
  onClick,
  onDirections,
  onReport,
  isSelected = false,
}: PharmacyCardProps) {
  const handleClick = () => onClick?.();
  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirections?.(pharmacy);
  };
  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReport?.(pharmacy);
  };

  const matchingMedicines = pharmacy.matchingMedicines || [];
  const primaryMedicine = matchingMedicines[0];

  return (
    <Card
      variant={isSelected ? 'elevated' : 'default'}
      className={cn('cursor-pointer transition-all duration-200', isSelected && 'ring-2 ring-primary-500')}
      onClick={handleClick}
      padding="md"
    >
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            isSelected ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-400'
          )}>
            <MapPin className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-secondary-900 dark:text-white truncate">{pharmacy.name}</h3>
                {pharmacy.ownerName && (
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">{pharmacy.ownerName}</p>
                )}
              </div>
              {pharmacy.distance !== undefined && pharmacy.distance !== null && (
                <span className="flex-shrink-0 flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatDistance(pharmacy.distance)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1 line-clamp-2">{pharmacy.address}</p>
            
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-secondary-500 dark:text-secondary-400">
              {pharmacy.phoneNumber && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {pharmacy.phoneNumber}
                </span>
              )}
              {pharmacy.pinCode && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {pharmacy.pinCode}
                </span>
              )}
            </div>

            {primaryMedicine && matchingMedicines.length > 0 && (
              <div className="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-secondary-900 dark:text-white">{primaryMedicine.medicineName}</span>
                  {primaryMedicine.brandName && (
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">({primaryMedicine.brandName})</span>
                  )}
                  {primaryMedicine.strength && (
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">{primaryMedicine.strength}</span>
                  )}
                  {primaryMedicine.dosageForm && (
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">{primaryMedicine.dosageForm}</span>
                  )}
                  <StatusBadge status={primaryMedicine.availabilityStatus} showIcon />
                </div>
                {matchingMedicines.length > 1 && (
                  <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                    +{matchingMedicines.length - 1} more medicines available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700">
          {onDirections && (
            <Button variant="outline" size="sm" onClick={handleDirections}>
              <Navigation className="h-3.5 w-3.5" />
              Directions
            </Button>
          )}
          {onReport && (
            <Button variant="ghost" size="sm" onClick={handleReport}>
              <AlertTriangle className="h-3.5 w-3.5" />
              Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PharmacyDetailProps {
  pharmacy: Pharmacy;
  onClose?: () => void;
  onDirections?: (pharmacy: Pharmacy) => void;
  onReport?: (pharmacy: Pharmacy) => void;
}

export function PharmacyDetail({
  pharmacy,
  onClose,
  onDirections,
  onReport,
}: PharmacyDetailProps) {
  const matchingMedicines = pharmacy.matchingMedicines || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">{pharmacy.name}</h2>
          {pharmacy.ownerName && (
            <p className="text-secondary-500 dark:text-secondary-400 mt-0.5">Owner: {pharmacy.ownerName}</p>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md" className="bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700">
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Contact & Location</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
              <address className="text-secondary-600 dark:text-secondary-400 not-italic">{pharmacy.address}</address>
            </div>
            {pharmacy.phoneNumber && (
              <a href={`tel:${pharmacy.phoneNumber}`} className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Phone className="h-5 w-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                <span>{pharmacy.phoneNumber}</span>
              </a>
            )}
            {pharmacy.email && (
              <a href={`mailto:${pharmacy.email}`} className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Mail className="h-5 w-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                <span>{pharmacy.email}</span>
              </a>
            )}
            {pharmacy.website && (
              <a href={pharmacy.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Globe className="h-5 w-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                <span>Website</span>
              </a>
            )}
            {pharmacy.pinCode && (
              <div className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400">
                <MapPin className="h-5 w-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                <span>PIN: {pharmacy.pinCode}</span>
              </div>
            )}
            {pharmacy.plusCode && (
              <div className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400">
                <MapPin className="h-5 w-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0" />
                <span>{pharmacy.plusCode}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            {onDirections && (
              <Button onClick={() => onDirections(pharmacy)} className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            )}
            {onReport && (
              <Button variant="outline" onClick={() => onReport(pharmacy)} className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            )}
          </div>
        </Card>

        <Card padding="md" className="bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700">
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Information</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-secondary-500 dark:text-secondary-400">Status</dt>
              <dd className="font-medium text-secondary-900 dark:text-white">{pharmacy.isActive ? 'Active' : 'Inactive'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-500 dark:text-secondary-400">Coordinates</dt>
              <dd className="font-medium font-mono text-secondary-900 dark:text-white">
                {pharmacy.latitude.toFixed(6)}, {pharmacy.longitude.toFixed(6)}
              </dd>
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
        </Card>
      </div>

      {matchingMedicines.length > 0 && (
        <Card padding="md" className="bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary-900 dark:text-white">
              Available Medicines ({matchingMedicines.length})
            </h3>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              Showing matching medicines for your search
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="text-left py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Medicine</th>
                  <th className="text-left py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Strength</th>
                  <th className="text-left py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Form</th>
                  <th className="text-center py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Status</th>
                  <th className="text-right py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Price</th>
                  <th className="text-right py-2 px-3 font-medium text-secondary-500 dark:text-secondary-400">Updated</th>
                </tr>
              </thead>
              <tbody>
                {matchingMedicines.map((med) => (
                  <tr key={med.inventoryId} className="border-b border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                    <td className="py-3 px-3 font-medium text-secondary-900 dark:text-white">{med.medicineName}</td>
                    <td className="py-3 px-3 text-secondary-600 dark:text-secondary-400">{med.strength || '-'}</td>
                    <td className="py-3 px-3 text-secondary-600 dark:text-secondary-400">{med.dosageForm || '-'}</td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={med.availabilityStatus} />
                    </td>
                    <td className="py-3 px-3 text-right text-secondary-600 dark:text-secondary-400">
                      {formatPrice(med.price, med.currency)}
                    </td>
                    <td className="py-3 px-3 text-right text-secondary-500 dark:text-secondary-400">
                      {formatRelativeTime(med.lastUpdatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

interface MedicineListProps {
  medicines: MedicineInventory[];
  onMedicineClick?: (medicine: MedicineInventory) => void;
}

export function MedicineList({ medicines, onMedicineClick }: MedicineListProps) {
  if (medicines.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        <svg className="h-12 w-12 mx-auto mb-2 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-secondary-500 dark:text-secondary-400">No medicines found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {medicines.map((medicine) => (
        <div
          key={medicine.inventoryId}
          className={cn(
            'flex items-center justify-between p-3 rounded-lg border border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors',
            onMedicineClick && 'cursor-pointer'
          )}
          onClick={() => onMedicineClick?.(medicine)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-secondary-900 dark:text-white truncate">{medicine.medicineName}</span>
              {medicine.brandName && (
                <span className="text-sm text-secondary-500 dark:text-secondary-400">({medicine.brandName})</span>
              )}
              {medicine.strength && (
                <Badge variant="gray" size="sm">{medicine.strength}</Badge>
              )}
              {medicine.dosageForm && (
                <Badge variant="info" size="sm">{medicine.dosageForm}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              {medicine.price !== undefined && (
                <span>{formatPrice(medicine.price, medicine.currency)}</span>
              )}
              {medicine.quantity !== undefined && (
                <span>Qty: {medicine.quantity}</span>
              )}
              <span>{formatRelativeTime(medicine.lastUpdatedAt)}</span>
            </div>
          </div>
          <StatusBadge status={medicine.availabilityStatus} showIcon />
        </div>
      ))}
    </div>
  );
}