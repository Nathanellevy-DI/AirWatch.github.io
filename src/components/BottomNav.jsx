import { Map, List, RefreshCw, Radar } from 'lucide-react';

function BottomNav({ activeView, onViewChange, onRefresh, isLoading }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-t from-aviation-dark via-aviation-dark/95 to-transparent 
                      pointer-events-none" style={{ height: '120%', top: '-20%' }} />

            <div className="relative bg-aviation-slate/80 backdrop-blur-xl border-t border-white/10 
                      rounded-t-2xl px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-around">
                    {/* Map Button */}
                    <button
                        onClick={() => onViewChange('map')}
                        className={`flex flex-col items-center justify-center gap-1 min-w-[72px] py-2 
                       transition-all duration-200 rounded-xl
                       ${activeView === 'map'
                                ? 'text-aviation-accent'
                                : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                           ${activeView === 'map'
                                ? 'bg-aviation-accent/20'
                                : 'hover:bg-white/5'}`}>
                            <Map className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium">Map</span>
                    </button>

                    {/* Refresh Button - Center */}
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="relative -mt-8"
                    >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-aviation-accent to-aviation-glow 
                          flex items-center justify-center shadow-glow-lg
                          hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] 
                          transition-all duration-300 active:scale-95 
                          disabled:opacity-60 disabled:shadow-none
                          ${isLoading ? '' : 'hover:scale-105'}`}>
                            {isLoading ? (
                                <Radar className="w-7 h-7 text-aviation-dark animate-pulse" />
                            ) : (
                                <RefreshCw className="w-7 h-7 text-aviation-dark" />
                            )}
                        </div>
                        {isLoading && (
                            <div className="absolute inset-0 rounded-2xl border-2 border-aviation-dark/50 
                            animate-ping opacity-50" />
                        )}
                    </button>

                    {/* List Button */}
                    <button
                        onClick={() => onViewChange('list')}
                        className={`flex flex-col items-center justify-center gap-1 min-w-[72px] py-2 
                       transition-all duration-200 rounded-xl
                       ${activeView === 'list'
                                ? 'text-aviation-accent'
                                : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                           ${activeView === 'list'
                                ? 'bg-aviation-accent/20'
                                : 'hover:bg-white/5'}`}>
                            <List className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium">Flights</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default BottomNav;
