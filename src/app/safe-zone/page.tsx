import { ShieldAlert, Navigation2, CheckCircle, Lightbulb, Video, Clock, ArrowLeft, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const locations = [
  {
    name: 'PAP Colony Community Hall',
    distance: '0.9 km',
    badges: ['Verified', 'Well Lit', 'CCTV'],
    timings: '6 AM - 8 PM',
  },
  {
    name: 'Model Town Park',
    distance: '1.6 km',
    badges: ['Verified', 'Well Lit'],
    timings: 'Open 24/7',
  },
  {
    name: 'Company Bagh',
    distance: '2.1 km',
    badges: ['Verified', 'CCTV'],
    timings: '5 AM - 10 PM',
  },
];

export default function SafeZonePage() {
  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 to-rose-800 text-white px-6 py-8 shadow-lg rounded-b-[2.5rem]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-white" />
            </Link>
            <h1 className="text-xl font-black tracking-tight text-white">Safe Zones</h1>
            <ShieldCheck size={24} className="text-rose-100" />
          </div>
          <p className="text-rose-50 text-sm text-center max-w-[250px] mx-auto leading-relaxed font-bold">
            Verified safe spaces and emergency contacts for women in Jalandhar.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8 space-y-8">
        {/* Emergency Help Card */}
        <div className="bg-amber-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-amber-100 relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 font-black text-xl italic tracking-tighter text-white">
              <ShieldAlert size={28} className="animate-pulse text-white" />
              <span className="text-white">EMERGENCY SOS</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <a href="tel:1091" className="bg-white/20 backdrop-blur-md p-5 rounded-3xl border border-white/30 flex items-center justify-between hover:bg-white/30 transition-all active:scale-95 group/btn">
                <div className="flex flex-col text-left">
                  <span className="text-white/90 text-[10px] font-black uppercase tracking-widest">Women Helpline</span>
                  <span className="text-2xl font-black text-white">1091</span>
                </div>
                <div className="p-3 bg-white rounded-2xl text-amber-700 group-hover/btn:scale-110 transition-transform shadow-lg shadow-amber-900/10">
                  <Phone size={20} fill="currentColor" />
                </div>
              </a>
              
              <a href="tel:112" className="bg-white/20 backdrop-blur-md p-5 rounded-3xl border border-white/30 flex items-center justify-between hover:bg-white/30 transition-all active:scale-95 group/btn">
                <div className="flex flex-col text-left">
                  <span className="text-white/90 text-[10px] font-black uppercase tracking-widest">Police Emergency</span>
                  <span className="text-2xl font-black text-white">112</span>
                </div>
                <div className="p-3 bg-white rounded-2xl text-amber-700 group-hover/btn:scale-110 transition-transform shadow-lg shadow-amber-900/10">
                  <Phone size={20} fill="currentColor" />
                </div>
              </a>
            </div>
          </div>
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/30 rounded-full blur-2xl" />
        </div>

        {/* Verified Locations */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-black uppercase tracking-widest text-[10px]">Nearby Safe Havens</h3>
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-widest bg-rose-100 px-2 py-1 rounded-lg">Verified</span>
          </div>
          
          <div className="space-y-5">
            {locations.map((loc, index) => (
              <div 
                key={loc.name} 
                className="bg-white rounded-[2.5rem] p-7 space-y-5 shadow-sm border border-rose-100 animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-left">
                    <h4 className="font-black text-black text-lg leading-tight">{loc.name}</h4>
                    <p className="text-[10px] text-rose-800 font-black uppercase tracking-widest">{loc.distance} from you</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-tighter bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <Clock size={12} className="text-rose-700" />
                    <span>{loc.timings}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {loc.badges.map((badge) => (
                    <span
                      key={badge}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100"
                    >
                      {badge === 'Verified' && <CheckCircle size={14} className="text-sage-700" />}
                      {badge === 'Well Lit' && <Lightbulb size={14} className="text-amber-600" />}
                      {badge === 'CCTV' && <Video size={14} className="text-rose-700" />}
                      {badge}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(loc.name + ', Jalandhar')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-sage-800 text-white py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-sage-100 active:scale-95 transition-all hover:bg-sage-900"
                >
                  <Navigation2 size={18} className="fill-current text-white" />
                  <span className="text-white">Navigate Securely</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
