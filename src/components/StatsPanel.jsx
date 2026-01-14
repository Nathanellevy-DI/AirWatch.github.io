import { Plane, MapPin, Globe, TrendingUp, Users, BarChart3, Activity, Zap } from 'lucide-react';
import { metersToFeet, msToKnots } from '../utils/geo';

function StatsPanel({ flights, globalStats }) {
    // Calculate statistics
    const avgAltitude = flights.length > 0
        ? Math.round(flights.reduce((sum, f) => sum + (f.baroAltitude || 0), 0) / flights.filter(f => f.baroAltitude).length)
        : 0;

    const avgSpeed = flights.length > 0
        ? Math.round(flights.reduce((sum, f) => sum + (f.velocity || 0), 0) / flights.filter(f => f.velocity).length)
        : 0;

    // Count by category
    const categoryStats = flights.reduce((acc, f) => {
        const cat = f.categoryLabel || 'Unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    // Count by country
    const countryStats = flights.reduce((acc, f) => {
        acc[f.originCountry] = (acc[f.originCountry] || 0) + 1;
        return acc;
    }, {});

    const topCountries = Object.entries(countryStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const topCategories = Object.entries(categoryStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    return (
        <div className="pt-16 lg:pl-72 pb-20 lg:pb-4 min-h-screen">
            <div className="p-4 lg:p-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">Flight Statistics</h2>
                    <p className="text-gray-500">Real-time aviation analytics for current view</p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Flights', value: globalStats.totalFlights, icon: Plane, color: 'violet', gradient: 'from-violet-500 to-purple-600' },
                        { label: 'Airborne', value: globalStats.airborne, icon: TrendingUp, color: 'green', gradient: 'from-green-500 to-emerald-600' },
                        { label: 'On Ground', value: globalStats.onGround, icon: MapPin, color: 'amber', gradient: 'from-amber-500 to-orange-600' },
                        { label: 'Countries', value: globalStats.countries.size, icon: Globe, color: 'blue', gradient: 'from-blue-500 to-cyan-600' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 relative overflow-hidden`}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <stat.icon className="w-5 h-5 text-white/80" />
                                    <span className="text-sm text-white/80 font-medium">{stat.label}</span>
                                </div>
                                <div className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</div>
                            </div>
                            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Average Stats */}
                    <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-violet-400" />
                            <h3 className="font-semibold text-white">Average Performance</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0d1117] rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-violet-400">
                                    {metersToFeet(avgAltitude).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Avg Altitude (ft)</div>
                            </div>
                            <div className="bg-[#0d1117] rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-blue-400">
                                    {msToKnots(avgSpeed)}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Avg Speed (kts)</div>
                            </div>
                        </div>
                    </div>

                    {/* Flight Status Distribution */}
                    <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-violet-400" />
                            <h3 className="font-semibold text-white">Flight Status</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Pie Chart Visual */}
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" fill="none" stroke="#0d1117" strokeWidth="16" />
                                    <circle
                                        cx="64" cy="64" r="56" fill="none"
                                        stroke="url(#airborneGradient)" strokeWidth="16"
                                        strokeDasharray={`${(globalStats.airborne / globalStats.totalFlights) * 351.86} 351.86`}
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="airborneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white">
                                            {globalStats.totalFlights > 0
                                                ? Math.round((globalStats.airborne / globalStats.totalFlights) * 100)
                                                : 0}%
                                        </div>
                                        <div className="text-xs text-gray-500">Airborne</div>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                                        <span className="text-gray-400">Airborne</span>
                                    </div>
                                    <span className="font-semibold text-white">{globalStats.airborne}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#0d1117]" />
                                        <span className="text-gray-400">On Ground</span>
                                    </div>
                                    <span className="font-semibold text-white">{globalStats.onGround}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Top Countries */}
                    <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-violet-400" />
                            <h3 className="font-semibold text-white">Top Countries</h3>
                        </div>
                        <div className="space-y-3">
                            {topCountries.map(([country, count], i) => (
                                <div key={country} className="flex items-center gap-3">
                                    <div className="w-6 text-center text-gray-500 text-sm font-medium">{i + 1}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-white text-sm">{country}</span>
                                            <span className="text-gray-400 text-sm">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                                style={{ width: `${(count / topCountries[0][1]) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aircraft Categories */}
                    <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-violet-400" />
                            <h3 className="font-semibold text-white">Aircraft Categories</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {topCategories.map(([category, count]) => (
                                <div key={category} className="bg-[#0d1117] rounded-xl p-3">
                                    <div className="text-xl font-bold text-violet-400">{count}</div>
                                    <div className="text-xs text-gray-500 truncate">{category}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsPanel;
