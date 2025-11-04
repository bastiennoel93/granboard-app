import { useTranslations } from "next-intl";
import { CricketGameMode } from "@/services/cricket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChartBar, faBullseye, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface LegendDialogProps {
  show: boolean;
  gameMode: CricketGameMode;
  onClose: () => void;
}

export function LegendDialog({ show, gameMode, onClose }: LegendDialogProps) {
  const t = useTranslations();

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div data-testid="legend-dialog" className="bg-theme-card rounded-2xl border-2 border-theme-card max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 md:p-6 pb-3 border-b border-theme-card">
          <h3 className="font-bold text-theme-primary text-xl md:text-2xl">{t('cricket.legend.title')}</h3>
          <button
            data-testid="legend-close-button"
            onClick={onClose}
            className="text-theme-muted hover:text-theme-primary text-2xl font-bold px-3 py-1 hover:bg-theme-secondary rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 md:p-6 pt-4">
          <div className="space-y-3 md:space-y-4">
          <div>
            <h4 className="text-base md:text-lg font-bold text-accent mb-2 md:mb-3">{t('cricket.legend.marksSymbols')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-sm md:text-base text-theme-tertiary">
              <div className="flex items-center gap-2 md:gap-3 bg-theme-elevated-alpha p-2 md:p-3 rounded-lg">
                <span className="text-xl md:text-2xl font-bold text-accent">/</span>
                <span>{t('cricket.legend.oneMark')}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 bg-theme-elevated-alpha p-2 md:p-3 rounded-lg">
                <span className="text-xl md:text-2xl font-bold text-accent">X</span>
                <span>{t('cricket.legend.twoMarks')}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 bg-theme-elevated-alpha p-2 md:p-3 rounded-lg">
                <span className="text-xl md:text-2xl font-bold text-green-400">⊗</span>
                <span>{t('cricket.legend.closed')}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 bg-theme-elevated-alpha p-2 md:p-3 rounded-lg">
                <span className="text-xl md:text-2xl font-bold text-theme-muted">⊗</span>
                <span>{t('cricket.legend.closedByAll')}</span>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-accent/30">
            <p className="text-sm md:text-base text-accent font-bold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartBar} /> {t('cricket.legend.mprTitle')}
            </p>
            <p className="text-xs md:text-sm text-theme-tertiary">
              {t('cricket.legend.mprDesc')}
            </p>
            <ul className="list-disc list-inside mt-2 text-xs md:text-sm text-theme-tertiary space-y-1">
              <li>{t('cricket.legend.single')}</li>
              <li>{t('cricket.legend.double')}</li>
              <li>{t('cricket.legend.triple')}</li>
            </ul>
          </div>

          <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-accent/30">
            <p className="text-sm md:text-base text-accent font-bold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faBullseye} /> {t('cricket.legend.standardTitle')}
            </p>
            <p className="text-xs md:text-sm text-theme-tertiary">
              {t('cricket.legend.standardDesc')}
            </p>
          </div>

          {gameMode === CricketGameMode.CutThroat && (
            <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-red-500/30">
              <p className="text-sm md:text-base text-red-400 font-bold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faTriangleExclamation} /> {t('cricket.legend.cutThroatTitle')}
              </p>
              <p className="text-xs md:text-sm text-theme-tertiary">
                {t('cricket.legend.cutThroatDesc')}
              </p>
            </div>
          )}
          </div>
        </div>

        <div className="p-4 md:p-6 pt-3 border-t border-theme-card">
          <button
            onClick={onClose}
            className="w-full px-4 md:px-6 py-2 md:py-3 bg-accent text-white rounded-xl hover:opacity-90 font-bold text-sm md:text-base transition-all shadow-lg"
          >
            {t('cricket.legend.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
