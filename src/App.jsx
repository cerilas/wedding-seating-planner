import { useState } from 'react';
import GuestPanel from './components/GuestPanel';
import FloorPlan from './components/FloorPlan';
import TableDetail from './components/TableDetail';
import ConfirmDialog from './components/ConfirmDialog';
import ToastContainer from './components/ToastContainer';
import HowToModal from './components/HowToModal';
import useStore from './store';
import useUiStore from './uiStore';
import { CircleHelp, Download, Trash2 } from 'lucide-react';

function App() {
  const [showHowTo, setShowHowTo] = useState(false);
  const { exportToExcel, clearAll, guests, tables } = useStore();
  const { openConfirm, pushToast } = useUiStore();

  const handleClearAll = () => {
    openConfirm({
      title: 'Tüm veriler silinsin mi?',
      message: 'Bu işlem geri alınamaz. Tüm davetliler, masalar ve sabit şekiller silinecek.',
      confirmText: 'Evet, temizle',
      cancelText: 'Vazgeç',
      variant: 'danger',
      onConfirm: () => {
        clearAll();
        pushToast({ message: 'Tüm veriler temizlendi.', type: 'success' });
      },
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <img src="/logo.png" alt="BilgeArif Organizasyon Logo" className="app-logo" />
          <h1>Kroki ve Oturma Planı Oluşturucu</h1>
        </div>
        <div className="header-right">
          <span className="header-stats">
            {guests.length} davetli • {tables.length} masa
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => setShowHowTo(true)}
          >
            <CircleHelp size={16} /> Nasıl Kullanılır
          </button>
          <button
            className="btn btn-accent"
            onClick={exportToExcel}
            disabled={guests.length === 0}
          >
            <Download size={16} /> Excel&apos;e Aktar
          </button>
          <button
            className="btn btn-danger"
            onClick={handleClearAll}
            disabled={guests.length === 0 && tables.length === 0}
          >
            <Trash2 size={16} /> Temizle
          </button>
        </div>
      </header>

      <main className="app-main">
        <GuestPanel />
        <FloorPlan />
        <TableDetail />
      </main>

      <footer className="app-footer">BilgeArif Organizasyon</footer>

      {showHowTo && <HowToModal onClose={() => setShowHowTo(false)} />}
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
}

export default App;
