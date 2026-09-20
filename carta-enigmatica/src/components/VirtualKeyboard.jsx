import React, { useEffect, useState } from 'react';
import { Delete, CornerDownLeft, CheckCircle2 } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function VirtualKeyboard({
  onChar = () => {},
  onDelete = () => {},
  onSpace = () => {},
  onSubmit = () => {},
  submitLabel = "Confirmar Identidade",
  showSubmit = true,
  disabled = false,
  className = ""
}) {
  const [activeKey, setActiveKey] = useState(null);

  // Sync with physical hardware keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;

      const key = e.key;

      if (key === 'Backspace') {
        e.preventDefault();
        sounds.playKeyPress();
        setActiveKey('BACKSPACE');
        onDelete();
      } else if (key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        sounds.playKeyPress();
        setActiveKey('SPACE');
        onSpace();
      } else if (key === 'Enter') {
        e.preventDefault();
        sounds.playStamp();
        setActiveKey('ENTER');
        onSubmit();
      } else if (/^[a-zA-ZÀ-ÿ]$/.test(key)) {
        e.preventDefault();
        sounds.playKeyPress();
        const upper = key.toUpperCase();
        setActiveKey(upper);
        onChar(upper);
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, onChar, onDelete, onSpace, onSubmit]);

  const handleKeyClick = (char) => {
    if (disabled) return;
    sounds.playKeyPress();
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 120);
    onChar(char);
  };

  const handleDeleteClick = () => {
    if (disabled) return;
    sounds.playKeyPress();
    setActiveKey('BACKSPACE');
    setTimeout(() => setActiveKey(null), 120);
    onDelete();
  };

  const handleSpaceClick = () => {
    if (disabled) return;
    sounds.playKeyPress();
    setActiveKey('SPACE');
    setTimeout(() => setActiveKey(null), 120);
    onSpace();
  };

  const handleSubmitClick = () => {
    if (disabled) return;
    sounds.playStamp();
    setActiveKey('ENTER');
    setTimeout(() => setActiveKey(null), 120);
    onSubmit();
  };

  return (
    <div className={`w-full max-w-2xl mx-auto select-none ${className}`}>
      {/* Keyboard Bed / Frame */}
      <div className="bg-gradient-to-b from-[#2a1d17] to-[#1a110d] p-2.5 sm:p-4 rounded-2xl border-4 border-amber-900/60 shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] flex flex-col gap-1.5 sm:gap-2">
        {/* Rows 1, 2, 3 */}
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((letter) => {
              const isActive = activeKey === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleKeyClick(letter)}
                  className={`
                    w-7 h-9 sm:w-10 sm:h-12 md:w-11 md:h-12
                    rounded-md sm:rounded-lg font-typewriter font-bold text-sm sm:text-base md:text-lg
                    flex items-center justify-center
                    transition-all duration-75
                    ${
                      isActive
                        ? 'bg-amber-100 text-ink translate-y-1 shadow-[0_1px_0_#451a03]'
                        : 'bg-[#f4efe6] text-amber-950 hover:bg-[#fff9ef] shadow-[0_4px_0_#5c3d2e,0_5px_5px_rgba(0,0,0,0.4)] border border-amber-800/30'
                    }
                  `}
                  aria-label={`Tecla ${letter}`}
                >
                  <span className="relative top-[-1px]">{letter}</span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Row 4: Spacebar & Backspace (Borracha) */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-0.5">
          {/* Borracha / Backspace */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className={`
              h-9 sm:h-11 px-3 sm:px-4 rounded-md sm:rounded-lg
              font-typewriter text-xs sm:text-sm font-bold
              flex items-center justify-center gap-1.5
              transition-all duration-75
              ${
                activeKey === 'BACKSPACE'
                  ? 'bg-rose-700 text-white translate-y-1 shadow-[0_1px_0_#4c0519]'
                  : 'bg-rose-800 hover:bg-rose-700 text-rose-100 shadow-[0_4px_0_#4c0519,0_5px_5px_rgba(0,0,0,0.4)] border border-rose-900'
              }
            `}
            title="Apagar letra (Borracha)"
            aria-label="Apagar letra (Borracha)"
          >
            <Delete className="w-4 h-4" />
            <span className="hidden sm:inline">Borracha</span>
          </button>

          {/* Barra de Espaço */}
          <button
            type="button"
            onClick={handleSpaceClick}
            className={`
              flex-1 max-w-[260px] h-9 sm:h-11 rounded-md sm:rounded-lg
              font-typewriter text-xs font-bold text-amber-900/60
              flex items-center justify-center tracking-widest
              transition-all duration-75
              ${
                activeKey === 'SPACE'
                  ? 'bg-amber-200 translate-y-1 shadow-[0_1px_0_#451a03]'
                  : 'bg-[#e8decb] hover:bg-[#f2e7d5] shadow-[0_4px_0_#5c3d2e,0_5px_5px_rgba(0,0,0,0.4)] border border-amber-800/40'
              }
            `}
            aria-label="Barra de Espaço"
          >
            ESPAÇO
          </button>
        </div>

        {/* Highlighted Submit Button (Carimbo Verde: "Confirmar Identidade") */}
        {showSubmit && (
          <div className="mt-1 flex justify-center">
            <button
              type="button"
              onClick={handleSubmitClick}
              className={`
                w-full max-w-sm py-2 sm:py-3 px-4 rounded-xl
                font-heading font-black text-sm sm:text-base text-white tracking-wider uppercase
                flex items-center justify-center gap-2
                transition-all duration-100
                ${
                  activeKey === 'ENTER'
                    ? 'bg-green-700 translate-y-1 shadow-[0_2px_0_#064e3b]'
                    : 'bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 shadow-[0_5px_0_#064e3b,0_8px_15px_rgba(0,0,0,0.45)] border border-green-500/40'
                }
              `}
              aria-label={submitLabel}
            >
              <CheckCircle2 className="w-5 h-5 text-green-200" />
              <span>{submitLabel}</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-2 text-[11px] sm:text-xs font-mono text-amber-400/70">
        💡 Dica: Você também pode usar o <span className="text-amber-200 font-bold">teclado físico</span> do computador!
      </div>
    </div>
  );
}
