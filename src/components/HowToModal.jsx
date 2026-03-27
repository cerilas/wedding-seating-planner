import { X, MousePointer2, Table2, Users, Move, Upload, Download, Shapes } from 'lucide-react';
import { useLocale } from '../i18n';

export default function HowToModal({ onClose }) {
  const { t } = useLocale();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal howto-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('howtoTitle')}</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="howto-content">
          <p className="howto-intro">{t('howtoDescription')}</p>

          <div className="howto-grid">
            <div className="howto-card">
              <h4><Users size={16} /> {t('howtoStep1')}</h4>
              <ul>
                <li>{t('howtoStep1Point1')}</li>
                <li>{t('howtoStep1Point2')}</li>
                <li>{t('howtoStep1Point3')}</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Table2 size={16} /> {t('howtoStep2')}</h4>
              <ul>
                <li>{t('howtoStep2Point1')}</li>
                <li>{t('howtoStep2Point2')}</li>
                <li>{t('howtoStep2Point3')}</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Shapes size={16} /> {t('howtoStep3')}</h4>
              <ul>
                <li>{t('howtoStep3Point1')}</li>
                <li>{t('howtoStep3Point2')}</li>
                <li>{t('howtoStep3Point3')}</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><MousePointer2 size={16} /> {t('howtoStep4')}</h4>
              <ul>
                <li>{t('howtoStep4Point1')}</li>
                <li>{t('howtoStep4Point2')}</li>
                <li>{t('howtoStep4Point3')}</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Move size={16} /> {t('howtoStep5')}</h4>
              <ul>
                <li>{t('howtoStep5Point1')}</li>
                <li>{t('howtoStep5Point2')}</li>
                <li>{t('howtoStep5Point3')}</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Upload size={16} /> <Download size={16} /> {t('howtoStep6')}</h4>
              <ul>
                <li>{t('howtoStep6Point1')}</li>
                <li>{t('howtoStep6Point2')}</li>
                <li>{t('howtoStep6Point3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
