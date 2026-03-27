import { useEffect, useState } from 'react';
import GuestPanel from './components/GuestPanel';
import FloorPlan from './components/FloorPlan';
import TableDetail from './components/TableDetail';
import ConfirmDialog from './components/ConfirmDialog';
import ToastContainer from './components/ToastContainer';
import HowToModal from './components/HowToModal';
import useStore from './store';
import useUiStore from './uiStore';
import { LocaleProvider, useLocale } from './i18n';
import { CircleHelp, Download, Trash2 } from 'lucide-react';

function AppContent({ onToggleLocale }) {
  const { t } = useLocale();
  const themeOptions = [
    {
      name: 'Kırmızı',
      accent: '#e74c3c',
      accentLight: '#ff7f7f',
      accentGlow: 'rgba(231, 76, 60, 0.35)',
      accentGradient: 'linear-gradient(135deg, #e74c3c, #ff4c4c)',
    },
    {
      name: 'Turuncu',
      accent: '#e67e22',
      accentLight: '#ffb86f',
      accentGlow: 'rgba(230, 126, 34, 0.35)',
      accentGradient: 'linear-gradient(135deg, #e67e22, #ff8c00)',
    },
    {
      name: 'Yeşil',
      accent: '#27ae60',
      accentLight: '#7be28f',
      accentGlow: 'rgba(39, 174, 96, 0.35)',
      accentGradient: 'linear-gradient(135deg, #27ae60, #2ecc71)',
    },
    {
      name: 'Mavi',
      accent: '#2980b9',
      accentLight: '#6fb7ea',
      accentGlow: 'rgba(41, 128, 185, 0.35)',
      accentGradient: 'linear-gradient(135deg, #2980b9, #3498db)',
    },
    {
      name: 'Mor',
      accent: '#8e44ad',
      accentLight: '#b87ce5',
      accentGlow: 'rgba(142, 68, 173, 0.35)',
      accentGradient: 'linear-gradient(135deg, #8e44ad, #a64bcf)',
    },
  ];

  const [showHowTo, setShowHowTo] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem('appTheme') || 'Kırmızı'
  );

  const { exportToExcel, clearAll, guests, tables } = useStore();
  const { openConfirm, pushToast } = useUiStore();

  const applyTheme = (themeName) => {
    const theme = themeOptions.find((t) => t.name === themeName);
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-light', theme.accentLight);
    root.style.setProperty('--accent-glow', theme.accentGlow);
    root.style.setProperty('--accent-gradient', theme.accentGradient);
    localStorage.setItem('appTheme', themeName);
  };

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    pushToast({ message: t('themeSelected', { theme: themeName }), type: 'info' });
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleClearAll = () => {
    openConfirm({
      title: t('clearConfirmTitle'),
      message: t('clearConfirmMessage'),
      confirmText: t('confirmYesDelete'),
      cancelText: t('cancel'),
      variant: 'danger',
      onConfirm: () => {
        clearAll();
        pushToast({ message: t('clearedAll'), type: 'success' });
      },
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <img src="/logo.png" alt="BilgeArif Organizasyon Logo" className="app-logo" />
          <h1>{t('appTitle')}</h1>
        </div>
        <div className="header-right">
          <span className="header-stats">
            {t('stats', { guests: guests.length, tables: tables.length })}
          </span>

          <div className="theme-picker" title="Tema seç">
            {themeOptions.map((theme) => (
              <button
                key={theme.name}
                className={`theme-dot ${currentTheme === theme.name ? 'active' : ''}`}
                style={{
                  background: theme.accentGradient,
                  boxShadow: currentTheme === theme.name ? `0 0 0 2px ${theme.accent}` : 'none',
                }}
                onClick={() => handleThemeChange(theme.name)}
                aria-label={`${theme.name} tema`}
              />
            ))}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setShowHowTo(true)}
          >
            <CircleHelp size={16} /> {t('howTo')}
          </button>
          <button
            className="btn btn-accent"
            onClick={exportToExcel}
            disabled={guests.length === 0}
          >
            <Download size={16} /> {t('exportExcel')}
          </button>
          <button
            className="btn btn-danger"
            onClick={handleClearAll}
            disabled={guests.length === 0 && tables.length === 0}
          >
            <Trash2 size={16} /> {t('clear')}
          </button>
          <button className="btn btn-secondary" onClick={onToggleLocale}>
            {t('localeSwitch')}
          </button>
        </div>
      </header>

      <main className="app-main">
        <GuestPanel />
        <FloorPlan />
        <TableDetail />
      </main>

      <footer className="app-footer">BilgeArif Organizasyon</footer>
      <a
        className="cerilas-credit"
        href="https://www.cerilas.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Cerilas Yüksek Teknoloji
      </a>

      {showHowTo && <HowToModal onClose={() => setShowHowTo(false)} />}
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const [locale, setLocale] = useState('tr');

  return (
    <LocaleProvider locale={locale}>
      <AppContent onToggleLocale={() => setLocale((prev) => (prev === 'tr' ? 'en' : 'tr'))} />
    </LocaleProvider>
  );
}
