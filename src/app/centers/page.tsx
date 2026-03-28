'use client';

import { useState, useMemo } from 'react';
import { MapPin, Phone, Star, Navigation, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

const centers = [
  {
    name: 'Jalandhar Eco Hub',
    address: 'Adarsh Nagar, Jalandhar',
    rating: 4.8,
    reviews: 124,
    distance: '1.2 km',
    type: 'Plastic, Metal, Glass',
    city: 'Jalandhar'
  },
  {
    name: 'Green Earth Solutions',
    address: 'Model Town, Jalandhar',
    rating: 4.5,
    reviews: 89,
    distance: '2.5 km',
    type: 'E-waste, Plastic',
    city: 'Jalandhar'
  },
  {
    name: 'City Recycle Point',
    address: 'Phagwara Gate, Jalandhar',
    rating: 4.2,
    reviews: 56,
    distance: '3.8 km',
    type: 'Paper, Cardboard',
    city: 'Jalandhar'
  },
  {
    name: 'Ludhiana Waste Management',
    address: 'Ferozepur Road, Ludhiana',
    rating: 4.6,
    reviews: 210,
    distance: '5.2 km',
    type: 'Metal, E-waste',
    city: 'Ludhiana'
  },
  {
    name: 'Amritsar Green Center',
    address: 'Ranjit Avenue, Amritsar',
    rating: 4.7,
    reviews: 156,
    distance: '4.5 km',
    type: 'Plastic, Paper',
    city: 'Amritsar'
  }
];

export default function CentersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCenters = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return centers;
    
    return centers.filter(center => 
      center.city.toLowerCase().includes(query) || 
      center.name.toLowerCase().includes(query) ||
      center.address.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 to-rose-800 text-white px-6 py-8 shadow-lg rounded-b-[2.5rem]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-white" />
            </Link>
            <h1 className="text-xl font-black tracking-tight text-white">Recycle Centers</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
          
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-200 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (e.g. Jalandhar, Ludhiana)..." 
              className="w-full bg-white/20 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-rose-100 focus:bg-white focus:text-black focus:outline-none transition-all backdrop-blur-md shadow-inner text-sm font-bold"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8 space-y-6">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((center, index) => (
            <div 
              key={center.name} 
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-100 space-y-5 animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 text-left">
                  <h3 className="font-black text-black text-lg leading-tight">{center.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-black uppercase tracking-wider">
                    <MapPin size={14} className="text-rose-700" />
                    <span>{center.address}</span>
                  </div>
                </div>
                <div className="bg-rose-50 text-rose-800 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 shrink-0">
                  {center.distance}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-amber-600">
                    <Star size={14} fill="currentColor" />
                    <span className="font-black text-black">{center.rating}</span>
                  </div>
                  <span className="text-gray-500 text-[10px] font-black uppercase">({center.reviews} reviews)</span>
                </div>
                <span className="text-[10px] font-black text-sage-900 uppercase tracking-widest bg-sage-100 px-2 py-1 rounded-lg">
                  {center.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href="tel:+911812222222"
                  className="bg-white border-2 border-rose-200 text-rose-800 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-rose-50"
                >
                  <Phone size={16} />
                  Call
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(center.name + ', ' + center.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rose-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-rose-100 active:scale-95 transition-all hover:bg-rose-800"
                >
                  <Navigation size={16} className="text-white" />
                  Map
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-rose-200">
            <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-rose-300" />
            </div>
            <h3 className="text-black font-black text-lg">No centers found</h3>
            <p className="text-gray-500 text-xs font-black uppercase tracking-wider mt-1">Try searching for a different city</p>
          </div>
        )}
      </div>
    </div>
  );
}
