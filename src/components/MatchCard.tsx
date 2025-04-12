
import React from 'react';

interface TeamProps {
  name: string;
  logo: string;
  type: string;
}

interface MatchCardProps {
  homeTeam: TeamProps;
  awayTeam: TeamProps;
  time: string;
  isLive?: boolean;
  matchType?: string;
  homeOdds?: number;
  drawOdds?: number;
  awayOdds?: number;
}

const MatchCard: React.FC<MatchCardProps> = ({
  homeTeam,
  awayTeam,
  time,
  isLive = false,
  matchType = 'Élő mérkőzés',
  homeOdds = 42,
  drawOdds = 28,
  awayOdds = 30
}) => {
  return (
    <div className="w-[380px] max-w-full h-[420px] rounded-[2rem] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-900/80 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transform hover:scale-105 hover:shadow-[0_30px_80px_rgba(59,130,246,0.2)] transition-all duration-500">
      <div className="h-full w-full p-8 flex flex-col">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-blue-500/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-blue-400/20">
            <span className="text-xs font-medium text-blue-300">{matchType}</span>
          </div>
          <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-blue-400/10">{time}</div>
        </div>
        
        {/* Teams Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/5 mb-3 p-4 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <img src={homeTeam.logo} alt={`${homeTeam.name} logo`} className="w-12 h-12 object-contain" />
            </div>
            <span className="text-sm font-medium text-white">{homeTeam.name}</span>
            <span className="text-xs text-blue-400 mt-1">{homeTeam.type}</span>
          </div>
          <div className="flex flex-col items-center mx-4">
            <div className="text-lg font-bold mb-1 text-gray-400">VS</div>
            {isLive && (
              <div className="text-xs text-blue-400 py-1 px-3 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-400/10 animate-pulse-subtle">Élő</div>
            )}
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/5 mb-3 p-4 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <img src={awayTeam.logo} alt={`${awayTeam.name} logo`} className="w-12 h-12 object-contain" />
            </div>
            <span className="text-sm font-medium text-white">{awayTeam.name}</span>
            <span className="text-xs text-blue-400 mt-1">{awayTeam.type}</span>
          </div>
        </div>
        
        {/* Odds & Buttons Section */}
        <div className="mt-auto">
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Tipp esélyek</div>
            <div className="flex gap-1 items-center">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${homeOdds}%` }}></div>
              </div>
              <span className="text-xs text-blue-400 min-w-[30px] text-right">{homeOdds}%</span>
            </div>
            <div className="flex gap-1 items-center mt-1.5">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full" style={{ width: `${drawOdds}%` }}></div>
              </div>
              <span className="text-xs text-gray-400 min-w-[30px] text-right">{drawOdds}%</span>
            </div>
            <div className="flex gap-1 items-center mt-1.5">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${awayOdds}%` }}></div>
              </div>
              <span className="text-xs text-blue-400 min-w-[30px] text-right">{awayOdds}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-gradient-to-br from-white/10 to-white/5 text-xs text-white rounded-lg py-2.5 backdrop-blur-sm border border-white/10 hover:border-blue-400/20 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] focus:scale-105 active:scale-95 transform focus:outline-none">
              Hazai
            </button>
            <button className="bg-gradient-to-br from-white/10 to-white/5 text-xs text-white rounded-lg py-2.5 backdrop-blur-sm border border-white/10 hover:border-blue-400/20 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] focus:scale-105 active:scale-95 transform focus:outline-none">
              Döntetlen
            </button>
            <button className="bg-gradient-to-br from-white/10 to-white/5 text-xs text-white rounded-lg py-2.5 backdrop-blur-sm border border-white/10 hover:border-blue-400/20 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] focus:scale-105 active:scale-95 transform focus:outline-none">
              Vendég
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
