import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowLeft, Key, Award, Bookmark, Maximize2, Minimize2, Compass } from 'lucide-react';
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

  // Monitora alterações no estado de tela cheia do navegador
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

  // Alterna entre modo janela e tela cheia
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

  // Cálculo da porcentagem de progresso baseada nas pistas coletadas / salas concluídas
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((inventoryClues.length / Math.max(1, totalRooms)) * 100))
  );

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-b from-amber-950 via-amber-950/95 to-amber-950/90 backdrop-blur-md border-b-2 border-amber-800/70 shadow-xl text-amber-100 select-none">
      <div className="max-w-6xl mx-auto px-3 py-2 sm:px-5 sm:py-2.5">
        {/* Linha Superior: Navegação, Identificação da Sala e Controles */}
        <div className="flex items-center justify-between gap-2">
          {/* Esquerda: Botão Voltar + Título do Nível e Sala */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            {onBack && (
              <button
                onClick={() => {
                  sounds.playKeyPress();
                  onBack();
                }}
                className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800/90 text-amber-200 hover:text-white border border-amber-700/60 transition-all duration-200 active:scale-95 shadow-md flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                title="Voltar para a seleção de nível"
                aria-label="Voltar para a seleção de nível"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-typewriter text-amber-400/90 uppercase tracking-wider font-semibold truncate">
                <Compass className="w-3 h-3 text-amber-400 shrink-0 inline-block" />
                <span className="truncate">{levelTitle || 'Investigação'}</span>
              </div>

              <h1 className="text-xs sm:text-base font-heading font-bold text-amber-100 flex items-center gap-1.5 truncate leading-tight">
                {isFinalChallenge ? (
                  <>
                    <Award className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
                    <span className="truncate text-yellow-300 font-extrabold tracking-wide">
                      Desafio Final — A Frase Mestra
                    </span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                    <span className="truncate">
                      Sala {currentRoom} de {totalRooms}: <span className="text-amber-200">{roomName}</span>
                    </span>
                  </>
                )}
              </h1>
            </div>
          </div>

          {/* Direita: Controles de Áudio e Tela Cheia */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botão Tela Cheia */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800/90 text-amber-200 hover:text-amber-100 border border-amber-700/60 transition-all duration-200 text-xs font-mono shadow-sm cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              title={isFullscreen ? "Sair da Tela Cheia" : "Expandir para Tela Cheia"}
              aria-label={isFullscreen ? "Sair do modo tela cheia" : "Entrar no modo tela cheia"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="hidden md:inline text-[11px] font-bold">Janela</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="hidden md:inline text-[11px] font-bold">Tela Cheia</span>
                </>
              )}
            </button>

            {/* Botão de Controle de Som */}
            <button
              onClick={() => {
                const nextMute = onToggleMute();
                if (!nextMute) {
                  sounds.playKeyPress();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 text-xs font-mono shadow-sm cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isMuted
                  ? 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-800/60'
                  : 'bg-amber-900/60 hover:bg-amber-800/90 text-amber-200 border-amber-700/60'
              }`}
              title={isMuted ? "Ativar Sons do Jogo" : "Silenciar Sons do Jogo"}
              aria-label={isMuted ? "Ativar sons do jogo" : "Silenciar sons do jogo"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="hidden sm:inline text-[11px] font-bold text-red-300">Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline text-[11px] font-bold text-emerald-300">Som ON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Progresso do Nível (Estilo Latão/Metal) */}
        {!isFinalChallenge && (
          <div className="mt-2 w-full">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-amber-300/90 mb-1 font-semibold">
              <span className="flex items-center gap-1">
                Progresso da Missão
              </span>
              <span className="text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/50">
                {progressPercent}%
              </span>
            </div>
            
            <div
              className="w-full h-2.5 bg-amber-950/90 rounded-full overflow-hidden border border-amber-700/80 p-0.5 shadow-inner"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progresso da Missão"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.max(4, progressPercent)}%` }}
              />
            </div>
          </div>
        )}

        {/* Painel do Inventário de Pistas */}
        <div className="mt-2 pt-2 border-t border-amber-800/40 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-800 scrollbar-track-transparent pb-0.5">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-typewriter text-amber-300 font-bold shrink-0 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-700/50">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>PISTAS ({inventoryClues.length}/{totalRooms}):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-nowrap sm:flex-wrap">
            {inventoryClues.length === 0 ? (
              <span className="text-[10px] sm:text-xs font-typewriter text-amber-400/60 italic px-1">
                Nenhuma pista desvendada ainda. Encontre a solução da sala!
              </span>
            ) : (
              inventoryClues.map((clue, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-0.5 rounded bg-amber-100 border border-amber-500 text-amber-950 font-typewriter text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0 animate-fade-in hover:scale-105 transition-transform cursor-default"
                  title={`Pista obtida na Sala ${idx + 1}`}
                >
                  <span className="w-4 h-4 rounded-full bg-red-800 text-amber-100 text-[10px] flex items-center justify-center font-sans font-black shadow-inner shrink-0">
                    {idx + 1}
                  </span>
                  <span className="tracking-wide">"{clue}"</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
