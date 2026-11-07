import { Link } from 'react-router-dom';
import { Search, MapPin as MapPinIcon, Shield, Truck, ArrowRight, Stethoscope, Database, Globe, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const features = [
  {
    icon: Search,
    title: 'Smart Medicine Search',
    description: 'Search by medicine name, brand, strength, or dosage form. Our intelligent matching finds what you need.',
  },
  {
    icon: MapPinIcon,
    title: 'Location-Aware Results',
    description: 'Find pharmacies near you with accurate distance calculations and interactive maps.',
  },
  {
    icon: Database,
    title: 'Verified Inventory Data',
    description: 'Browse pharmacy inventories with clear availability status and last-updated timestamps.',
  },
  {
    icon: Shield,
    title: 'Privacy-First',
    description: 'Your location data is processed locally and never stored. Search with confidence.',
  },
  {
    icon: Truck,
    title: 'Get Directions',
    description: 'One-click navigation to any pharmacy with integrated mapping and routing.',
  },
  {
    icon: Globe,
    title: 'Open Data',
    description: 'Built on public pharmacy datasets with transparent data sources.',
  },
];

const stats = [
  { value: '39', label: 'Pharmacies' },
  { value: '78', label: 'Unique Medicines' },
  { value: '622', label: 'Inventory Records' },
  { value: '4', label: 'Cities Covered' },
];

const trustIndicators = [
  { icon: Stethoscope, label: 'Healthcare Focused' },
  { icon: Heart, label: 'Patient First' },
  { icon: Globe, label: 'Open Data' },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-secondary-900 dark:to-secondary-950 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Now covering Kandukur, Ongole, Nellore & Vijayawada
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-white tracking-tight mb-6 text-balance">
              Find Your Medicine
              <br />
              <span className="text-primary-600 dark:text-primary-400">At Nearby Pharmacies</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-2xl mx-auto">
              Search for medicines and instantly see which local pharmacies have them in stock. 
              Save time, reduce stress, and get the care you need.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/search">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Search className="h-5 w-5" />
                  Search Medicines
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pharmacies">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Pharmacies
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-secondary-500 dark:text-secondary-400">
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-secondary-900 border-y border-secondary-200 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.value}</div>
                <div className="text-secondary-600 dark:text-secondary-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50 dark:bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Everything You Need to Find Medicines
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Powerful features designed to make medicine discovery simple and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} padding="lg" hover className="h-full bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700">
                <CardContent className="p-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Three simple steps to find your medicine nearby.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">Enter Your Medicine</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Type the medicine name, brand, strength (e.g., 500mg), or dosage form (tablet, syrup).
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">Set Your Location</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Use your current location or enter an address. Choose your search radius.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">Find & Connect</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  View nearby pharmacies with availability, distances, and get directions instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Your Medicine?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust MedConnect for their pharmacy searches.
          </p>
          <Link to="/search">
            <Button size="lg" variant="secondary" className="gap-2">
              <Search className="h-5 w-5" />
              Start Searching
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}