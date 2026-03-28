'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Weight, Leaf, Clock, BarChart3, PieChart as PieChartIcon, Recycle, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from 'recharts';

interface ScanItem {
  id: number;
  material: string;
  weight: number;
  total_value: number;
  created_at: string;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalWeight: 0,
    totalCO2: 0,
  });
  const [rewardPoints, setRewardPoints] = useState(922);
  const [activities, setActivities] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    async function fetchScans() {
      try {
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('scans')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.warn('Supabase fetch issue:', supabaseError.message);
        }

        const offlineScans = JSON.parse(localStorage.getItem('offline_scans') || '[]');

        const combinedScans = [...(supabaseData || []), ...offlineScans].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setActivities(combinedScans);

        const totals = combinedScans.reduce(
          (acc: any, curr: ScanItem) => ({
            totalEarned: acc.totalEarned + curr.total_value,
            totalWeight: acc.totalWeight + curr.weight,
            totalCO2: acc.totalCO2 + (curr.weight * 2.1), // Using the 2.1 factor from old App.tsx
          }),
          { totalEarned: 0, totalWeight: 0, totalCO2: 0 }
        );
        setStats(totals);
        setRewardPoints(922 + Math.floor(totals.totalWeight * 10));

        const materialCounts = combinedScans.reduce((acc: any, curr: ScanItem) => {
          const mat = curr.material.split(' ')[0];
          acc[mat] = (acc[mat] || 0) + Number(curr.weight);
          return acc;
        }, {});

        const barData = Object.keys(materialCounts).map(key => ({
          name: key,
          value: Number(materialCounts[key].toFixed(2))
        }));
        setChartData(barData);

        const timeline = combinedScans.slice(0, 7).reverse().map(scan => ({
          date: new Date(scan.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
          earnings: Number(scan.total_value.toFixed(2))
        }));
        setTimelineData(timeline);

      } catch (error) {
        console.error('Unexpected error during hybrid fetch:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScans();
  }, []);

  if (!mounted) return null;

  const COLORS = ['#fb7185', '#4a614a', '#f59e0b', '#be123c', '#334133'];

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header from old App.tsx */}
      <div className="bg-gradient-to-r from-rose-700 to-rose-800 text-white px-6 py-6 shadow-lg rounded-b-[2.5rem]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-white">SheCycle</h1>
              <p className="text-rose-100 text-sm font-bold">Jalandhar • Punjab</p>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm border border-white/10">
              <Trophy className="text-amber-300" size={20} />
              <div>
                <p className="text-[10px] text-white uppercase font-black tracking-wider">Points</p>
                <p className="font-black leading-tight text-white">{rewardPoints}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-transform active:scale-95 text-white">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-white" />
                <p className="text-[10px] text-white uppercase font-black tracking-tighter">Earned</p>
              </div>
              <p className="font-black text-lg text-white">₹{stats.totalEarned.toFixed(0)}</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-transform active:scale-95 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Weight size={14} className="text-white" />
                <p className="text-[10px] text-white uppercase font-black tracking-tighter">Waste</p>
              </div>
              <p className="font-black text-lg text-white">{stats.totalWeight.toFixed(1)} kg</p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-transform active:scale-95 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Leaf size={14} className="text-white" />
                <p className="text-[10px] text-white uppercase font-black tracking-tighter">CO₂</p>
              </div>
              <p className="font-black text-lg text-white">{stats.totalCO2.toFixed(1)} kg</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Charts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-lg text-black flex items-center gap-2 uppercase tracking-tight">
              <BarChart3 size={20} className="text-rose-700" />
              Impact Analytics
            </h3>
          </div>

          {/* Bar Chart: Materials */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-100 min-h-[250px]">
            <p className="text-xs font-black text-gray-500 uppercase mb-6 tracking-wider text-center">Material Distribution (kg)</p>
            {loading ? (
              <div className="h-40 flex items-center justify-center text-gray-400 font-bold">Loading charts...</div>
            ) : chartData.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#000', fontWeight: 'bold' }}
                      formatter={(value: any) => [`₹${Number(value || 0).toFixed(2)}`, 'Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {chartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-[10px] font-black text-black uppercase">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <PieChartIcon size={32} strokeWidth={1.5} className="text-rose-200" />
                <p className="font-bold">No data to visualize yet</p>
              </div>
            )}
          </div>

          {/* Bar Chart: Weight Analytics */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-100 min-h-[250px]">
            <p className="text-xs font-black text-gray-500 uppercase mb-6 tracking-wider">Weight Comparison (kg)</p>
            {loading ? (
              <div className="h-40 flex items-center justify-center text-gray-400 font-bold">Loading charts...</div>
            ) : chartData.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#000', fontSize: 12, fontWeight: 900 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#fff1f2' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#000', fontWeight: 'bold' }}
                      formatter={(value: any) => [`${Number(value || 0).toFixed(2)} kg`, 'Weight']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={35}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <BarChart3 size={32} strokeWidth={1.5} className="text-rose-200" />
                <p className="font-bold">No data to visualize yet</p>
              </div>
            )}
          </div>

          {/* Area Chart: Timeline */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-rose-100 min-h-[250px]">
            <p className="text-xs font-black text-gray-500 uppercase mb-6 tracking-wider">Earnings Trend (₹)</p>
            {loading ? (
              <div className="h-40 flex items-center justify-center text-gray-400 font-bold">Loading charts...</div>
            ) : timelineData.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#be123c" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#be123c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#000', fontWeight: 'bold' }}
                      formatter={(value: any) => [`₹${Number(value || 0).toFixed(2)}`, 'Earnings']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#be123c" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorEarnings)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <TrendingUp size={32} strokeWidth={1.5} className="text-rose-200" />
                <p className="font-bold">Scan items to see your progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-black text-lg text-black flex items-center gap-2 uppercase tracking-tight">
              <Clock size={20} className="text-gray-500" />
              Recent Activity
            </h3>
            <button className="text-rose-700 text-sm font-black hover:underline uppercase tracking-tighter">View All</button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-sm font-bold animate-pulse">
                Syncing your impact...
              </div>
            ) : activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <div key={`${activity.id}-${activity.created_at}`} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-rose-50 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700">
                      <Recycle size={20} />
                    </div>
                    <div>
                      <p className="font-black text-sm text-black">{activity.material}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-tight">
                        {new Date(activity.created_at).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-700">
                      +₹{activity.total_value.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-gray-500 font-black">{activity.weight}kg</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-rose-200 text-gray-400 text-sm font-bold">
                No scans yet. Start your journey today!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
