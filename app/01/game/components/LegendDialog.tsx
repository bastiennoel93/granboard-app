import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChartBar, faBullseye, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface LegendDialogProps {
  show: boolean;
  doubleOut: boolean;
  onClose: () => void;
}

export function LegendDialog({ show, doubleOut, onClose }: LegendDialogProps) {
  const t = useTranslations();

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div data-testid="legend-dialog" className="bg-theme-card rounded-2xl border-2 border-theme-card max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 md:p-6 pb-3 border-b border-theme-card">
          <h3 className="font-bold text-theme-primary text-xl md:text-2xl">{t('zeroOne.legend.title')}</h3>
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
            <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-accent/30">
              <p className="text-sm md:text-base text-accent font-bold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faBullseye} /> {t('zeroOne.legend.objectiveTitle')}
              </p>
              <p className="text-xs md:text-sm text-theme-tertiary">
                {t('zeroOne.legend.objectiveDesc')}
              </p>
            </div>

            <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-accent/30">
              <p className="text-sm md:text-base text-accent font-bold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} /> {t('zeroOne.legend.ppdTitle')}
              </p>
              <p className="text-xs md:text-sm text-theme-tertiary">
                {t('zeroOne.legend.ppdDesc')}
              </p>
            </div>

            <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-accent/30">
              <p className="text-sm md:text-base text-accent font-bold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} /> {t('zeroOne.legend.averageTitle')}
              </p>
              <p className="text-xs md:text-sm text-theme-tertiary">
                {t('zeroOne.legend.averageDesc')}
              </p>
            </div>

            <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-red-500/30">
              <p className="text-sm md:text-base text-red-400 font-bold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faTriangleExclamation} /> {t('zeroOne.legend.bustTitle')}
              </p>
              <p className="text-xs md:text-sm text-theme-tertiary">
                {t('zeroOne.legend.bustDesc')}
              </p>
            </div>

            {doubleOut && (
              <div className="p-3 md:p-4 bg-theme-elevated-alpha rounded-xl border border-accent/30">
                <p className="text-sm md:text-base text-accent font-bold mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBullseye} /> {t('zeroOne.legend.doubleOutTitle')}
                </p>
                <p className="text-xs md:text-sm text-theme-tertiary">
                  {t('zeroOne.legend.doubleOutDesc')}
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
            {t('zeroOne.legend.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
