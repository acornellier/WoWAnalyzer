/* eslint-disable react/prop-types */
import getBossName from 'common/getBossName';
import { getLabel as getDifficultyLabel } from 'game/DIFFICULTIES';
import { Boss, Phase } from 'game/raids';
import { TooltipElement } from 'interface/Tooltip';
import Config, { Build } from 'parser/Config';
import { ParseResultsTab } from 'parser/core/Analyzer';
import CharacterProfile from 'parser/core/CharacterProfile';
import Fight from 'parser/core/Fight';
import DEFAULT_BUILD from 'parser/DEFAULT_BUILD';
import React from 'react';
import { Link } from 'react-router-dom';

import HeaderBackground from './HeaderBackground';
import NavigationBar from './NavigationBar';
import PhaseSelector from './PhaseSelector';
import TimeFilter from './TimeFilter';

import './Header.scss';

interface Props {
  config: Config;
  name: string;
  characterProfile: CharacterProfile;
  boss: Boss | null;
  handlePhaseSelection: (phase: string, instance: number) => void;
  applyFilter: (start: number, end: number) => void;
  phases: { [key: string]: Phase } | null;
  makeBuildUrl: (selectedTab: string, buildName: string) => string;
  build?: string;
  selectedPhase: string;
  selectedInstance: number;
  isLoading: boolean;
  fight: Fight;
  makeTabUrl: (url: string) => string;
  selectedTab: string;
  tabs: ParseResultsTab[];
}

const Header = ({
  config: { spec, builds },
  build,
  name,
  fight,
  boss,
  handlePhaseSelection,
  selectedPhase,
  selectedInstance,
  phases,
  isLoading,
  applyFilter,
  characterProfile,
  makeTabUrl,
  tabs,
  selectedTab,
  makeBuildUrl,
}: Props) => {
  let playerThumbnail;
  if (characterProfile?.thumbnail) {
    playerThumbnail = `https://render-${characterProfile.region}.worldofwarcraft.com/character/${characterProfile.thumbnail}`;
  } else {
    playerThumbnail = `/specs/${spec.className}-${spec.specName}.jpg`.replace(/ /, '');
  }

  const renderBuild = (build: Build, active: boolean) => (
    <Link to={makeBuildUrl(selectedTab, build.url)}>
      <span className={'build ' + (active ? 'active' : '')}>
        <TooltipElement content={build.name}>{build.icon}</TooltipElement>
      </span>
    </Link>
  );

  return (
    <header>
      <HeaderBackground boss={boss} />

      <div className="subnavigation container">
        {phases && Object.keys(phases).length > 0 && (
          <div className="phaseselector">
            <PhaseSelector
              fight={fight}
              phases={phases}
              handlePhaseSelection={handlePhaseSelection}
              selectedPhase={selectedPhase}
              selectedInstance={selectedInstance}
              isLoading={isLoading}
            />
          </div>
        )}
        <div className="timefilter">
          <TimeFilter fight={fight} isLoading={isLoading} applyFilter={applyFilter} />
        </div>
      </div>

      <div className="info container">
        <div className="boss">
          <h2>{getDifficultyLabel(fight.difficulty)}</h2>
          <h1>{boss ? boss.name : getBossName(fight, false)}</h1>
        </div>
        <div className="player">
          <div className="avatar">
            <img src={playerThumbnail} alt="" />
          </div>
          <div className="details">
            <h2 className="builds">
              {builds && (
                <>
                  Build:
                  {Object.keys(builds).map((b) => renderBuild(builds[b], build === builds[b].url))}
                  {renderBuild(DEFAULT_BUILD, !build)}
                </>
              )}
            </h2>
            <h2>
              {spec.specName} {spec.className}
            </h2>
            <h1 className="name">{name}</h1>
          </div>
        </div>
      </div>

      <NavigationBar makeTabUrl={makeTabUrl} tabs={tabs} selectedTab={selectedTab} />
    </header>
  );
};

export default Header;
