import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Header from './components/Header';
import WelcomeScreen from './screens/WelcomeScreen';
import LevelSelectScreen from './screens/LevelSelectScreen';
import RoomGameplayScreen from './screens/RoomGameplayScreen';
import FinalChallengeScreen from './screens/FinalChallengeScreen';
import CertificateModal from './components/CertificateModal';
import enigmasData from './data/enigmas.json';
import { sounds } from './audio/soundEffects';

export default function App() {
  // Screen flow: 'welcome' (Tela 1) -> 'levelSelect' (Tela 2) -> 'gameplay' (Tela 3: Salas) -> 'finalChallenge' (Tela 4)
  const [screen, setScreen] = useState('welcome');
  const [investigatorName, setInvestigatorName] = useState('');
  const [selectedLevelKey, setSelectedLevelKey] = useState('terceiroAno'); // 'terceiroAno' | 'quartoAno' | 'quintoAno'
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [inventoryClues, setInventoryClues] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    sounds.playKeyPress();
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  };

  // Selected level data
  const currentLevelData = enigmasData.niveis[selectedLevelKey] || enigmasData.niveis['terceiroAno'];
  const totalRooms = currentLevelData?.salas?.length || 0;
  const currentRoom = currentLevelData?.salas?.[currentRoomIndex];

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    return nextMuted;
  };

  // 1º Momento (Tela 1): Confirmação de Identidade
  const handleConfirmName = (name) => {
    setInvestigatorName(name);
    setScreen('levelSelect');
  };

  // 2º Momento (Tela 2): Seleção da Turma/Nível
  const handleSelectLevel = (levelKey) => {
    setSelectedLevelKey(levelKey);
    setCurrentRoomIndex(0);
    setInventoryClues([]);
    setScreen('gameplay'); // Entrada imediata dos textos da Sala 1 na Tela 3!
  };

  // Tela 3: Quando a sala é completada
  const handleSolveRoom = (clue) => {
    setInventoryClues(prev => {
      if (!prev.includes(clue)) {
        return [...prev, clue];
      }
      return prev;
    });
  };

  // Tela 3: Avançar para a próxima sala ou para o Desafio Final
  const handleNextRoom = () => {
    if (currentRoomIndex + 1 < totalRooms) {
      sounds.playUnlockRoom();
      setCurrentRoomIndex(prev => prev + 1);
    } else {
      sounds.playVictoryFanfare();
      setScreen('finalChallenge');
    }
  };

  // Tela 4: Vitória no Desafio Final da Frase Mestra
  const handleVictory = () => {
    setShowCertificate(true);
  };

  // Voltar de nível com confirmação
  const handleBack = () => {
    if (screen === 'gameplay' || screen === 'finalChallenge') {
      if (window.confirm('Deseja voltar para a seleção de missões? O progresso desta missão será reiniciado.')) {
        setScreen('levelSelect');
        setCurrentRoomIndex(0);
        setInventoryClues([]);
      }
    } else if (screen === 'levelSelect') {
      setScreen('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-[#1c140e] flex flex-col text-stone-100 selection:bg-amber-600 selection:text-white font-sans">
      {/* Top Header Bar with Room indicator, Progress Bar & Fixed Inventory Panel */}
      {(screen === 'gameplay' || screen === 'finalChallenge') && (
        <Header
          levelTitle={currentLevelData?.titulo}
          currentRoom={currentRoomIndex + 1}
          totalRooms={totalRooms}
          roomName={currentRoom?.nomeSala || ''}
          inventoryClues={inventoryClues}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onBack={handleBack}
          isFinalChallenge={screen === 'finalChallenge'}
        />
      )}

      {/* Floating Top Bar for Welcome / LevelSelect screens */}
      {(screen === 'welcome' || screen === 'levelSelect') && (
        <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
          <a
            href="/atividades/carta-enigmatica"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/90 hover:bg-amber-900 text-amber-200 hover:text-white border border-amber-700/60 shadow-md text-xs font-mono font-bold transition-all hover:scale-105"
            title="Voltar ao Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Portal</span>
          </a>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/90 hover:bg-amber-900 text-amber-200 hover:text-white border border-amber-700/60 shadow-md text-xs font-mono font-bold transition-all hover:scale-105 cursor-pointer"
              title={isFullscreen ? "Sair da Tela Cheia" : "Expandir para Tela Cheia"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Janela</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>⛶ Tela Cheia</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col justify-center py-3 sm:py-6">
        {/* ========================================================================= */}
        {/* TELA 1: Boas-vindas & Identificação com História Envolvente               */}
        {/* ========================================================================= */}
        {screen === 'welcome' && (
          <WelcomeScreen
            initialName={investigatorName}
            onConfirmName={handleConfirmName}
          />
        )}

        {/* ========================================================================= */}
        {/* TELA 2: Seleção da Turma / Nível (3º, 4º ou 5º ano)                       */}
        {/* ========================================================================= */}
        {screen === 'levelSelect' && (
          <LevelSelectScreen
            investigatorName={investigatorName}
            onSelectLevel={handleSelectLevel}
            onChangeName={() => setScreen('welcome')}
          />
        )}

        {/* ========================================================================= */}
        {/* TELA 3: Gameplay da Sala com Textos Sequenciais e Popup Grande            */}
        {/* ========================================================================= */}
        {screen === 'gameplay' && (
          <RoomGameplayScreen
            levelData={currentLevelData}
            roomIndex={currentRoomIndex}
            investigatorName={investigatorName}
            onSolveRoom={handleSolveRoom}
            onNextRoom={handleNextRoom}
            isLastRoom={currentRoomIndex + 1 === totalRooms}
          />
        )}

        {/* ========================================================================= */}
        {/* TELA 4: Desafio Final da Frase Mestra & Vitória                           */}
        {/* ========================================================================= */}
        {screen === 'finalChallenge' && (
          <FinalChallengeScreen
            levelData={currentLevelData}
            investigatorName={investigatorName}
            inventoryClues={inventoryClues}
            onVictory={handleVictory}
            onRestart={() => {
              setShowCertificate(false);
              setScreen('levelSelect');
            }}
          />
        )}
      </main>

      {/* Certificado Oficial de Mérito do Investigador */}
      {showCertificate && (
        <CertificateModal
          investigatorName={investigatorName}
          levelTitle={currentLevelData?.titulo}
          onClose={() => setShowCertificate(false)}
          onRestart={() => {
            setShowCertificate(false);
            setScreen('levelSelect');
          }}
        />
      )}
    </div>
  );
}
