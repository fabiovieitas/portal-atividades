import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowLeft, Key, Award, Bookmark, Maximize2, Minimize2 } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function Header({
  levelTitle = '',
  currentRoom = 1,
  totalRooms = 3,
  roomName = '',
  inventoryClues = [],
  isMuted = false,
  onToggleMute = () => {},
  onBack = null,
  isFinalChallenge = false
}) {
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

  const progressPercent = Math.min(100, Math.round(((currentRoom - 1) / totalRooms) * 100));


  return (
    <header className="sticky top-0 z-30 w-full bg-amber-950/95 backdrop-blur-sm border-b-2 border-amber-800/60 shadow-lg text-amber-100">
      <div className="max-w-5xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
        {/* Top Row: Navigation, Room Indicator & Sound Toggle */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Back / Level Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onBack && (
              <button
                onClick={() => {
                  sounds.playKeyPress();
                  onBack();
                }}
                className="p-1.5 sm:p-2 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border border-amber-700/50 transition-colors"
                title="Voltar"
                aria-label="Voltar para a seleção de nível"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            <div>
              <span className="text-[11px] sm:text-xs font-typewriter text-amber-300/80 block leading-tight">
                {levelTitle}
              </span>
              <h1 className="text-sm sm:text-base font-heading font-bold text-amber-100 flex items-center gap-1.5">
                {isFinalChallenge ? (
                  <>
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>Desafio Final — A Frase Mestra</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sala {currentRoom} de {totalRooms}: {roomName}</span>
                  </>
                )}
              </h1>
            </div>
          </div>

          {/* Right: Fullscreen & Sound Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-900/80 hover:bg-amber-800 text-amber-200 hover:text-white border border-amber-700/60 transition-all text-xs font-mono shadow-sm cursor-pointer"
              title={isFullscreen ? "Sair da Tela Cheia" : "Expandir para Tela Cheia"}
              aria-label={isFullscreen ? "Sair da Tela Cheia" : "Expandir para Tela Cheia"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline text-[11px] font-bold">Janela</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline text-[11px] font-bold">Tela Cheia</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const nextMute = onToggleMute();
                if (!nextMute) {
                  sounds.playKeyPress();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-900/70 hover:bg-amber-800 text-amber-200 border border-amber-700/60 transition-colors text-xs font-mono"
              title={isMuted ? "Ativar Sons" : "Silenciar"}
              aria-label={isMuted ? "Ativar Sons" : "Silenciar"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-400" />
                  <span className="hidden sm:inline text-[11px]">Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-green-400" />
                  <span className="hidden sm:inline text-[11px]">Som ON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Level Progress Bar (Brass themed) */}
        {!isFinalChallenge && (
          <div className="mt-2 w-full">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-amber-400/80 mb-1">
              <span>Progresso da Missão</span>
              <span>{Math.round(((currentRoom - (inventoryClues.length < currentRoom ? 0 : 0)) / totalRooms) * 100)}%</span>
            </div>
            <div className="w-full h-2 sm:h-2.5 bg-amber-900/80 rounded-full overflow-hidden border border-amber-700/60 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(5, (inventoryClues.length / totalRooms) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Fixed Inventory Panel of Clues */}
        <div className="mt-2.5 pt-2 border-t border-amber-800/50 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-typewriter text-amber-300 font-bold shrink-0">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>INVENTÁRIO DE PISTAS ({inventoryClues.length}/{totalRooms}):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {inventoryClues.length === 0 ? (
              <span className="text-[11px] font-typewriter text-amber-400/60 italic">
                Nenhuma pista ainda. Decifre a primeira sala!
              </span>
            ) : (
              inventoryClues.map((clue, idx) => (
                <div
                  key={idx}
                  className="px-2 py-0.5 rounded bg-amber-100/90 border border-amber-600 text-amber-950 font-typewriter text-xs font-bold shadow-sm flex items-center gap-1 animate-pulse-once"
                  title={`Pista da Sala ${idx + 1}`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-stamp-red text-white text-[9px] flex items-center justify-center font-sans font-black">
                    {idx + 1}
                  </span>
                  <span>"{clue}"</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
