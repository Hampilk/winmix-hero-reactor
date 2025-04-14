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
}

const MatchCard: React.FC<MatchCardProps> = ({
  homeTeam,
  awayTeam,
  time,
  isLive = false,
  matchType = 'Live Match',
}) => {
  return (
    <div className="match-card">
      {/* Header */}
      <div className="match-header">
        <span>{matchType}</span>
        <span>{time}</span>
      </div>

      {/* Teams */}
      <div className="teams">
        <div className="team">
          <img src={homeTeam.logo} alt={`${homeTeam.name} logo`} />
          <span>{homeTeam.name}</span>
        </div>
        <div className="vs">VS</div>
        <div className="team">
          <img src={awayTeam.logo} alt={`${awayTeam.name} logo`} />
          <span>{awayTeam.name}</span>
        </div>
      </div>

      {/* Status */}
      {isLive && <div className="live-label">Live</div>}
    </div>
  );
};

export default MatchCard;
