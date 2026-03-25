import useStore from '../store';
import useUiStore from '../uiStore';
import { X, Edit3, Trash2, UserMinus } from 'lucide-react';
import { useState } from 'react';

export default function TableDetail() {
    const { selectedTableId, tables, guests, updateTable, removeTable, unassignGuest, selectTable } = useStore();
    const { openConfirm, pushToast } = useUiStore();
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [labelValue, setLabelValue] = useState('');

    if (!selectedTableId) {
        return (
            <div className="table-detail-panel empty-detail">
                <div className="empty-detail-content">
                    <p>🪑</p>
                    <p>Detayları görmek için bir masa seçin</p>
                </div>
            </div>
        );
    }

    const table = tables.find((t) => t.id === selectedTableId);
    if (!table) return null;

    const tableGuests = guests.filter((g) => g.tableId === selectedTableId);
    const totalPeople = tableGuests.reduce((sum, g) => sum + (g.guestCount || 1), 0);

    const handleStartEdit = () => {
        setLabelValue(table.label);
        setIsEditingLabel(true);
    };

    const handleSaveLabel = () => {
        if (labelValue.trim()) {
            updateTable(table.id, { label: labelValue.trim() });
        }
        setIsEditingLabel(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSaveLabel();
        if (e.key === 'Escape') setIsEditingLabel(false);
    };

    const handleDeleteTable = () => {
        openConfirm({
            title: 'Masa silinsin mi?',
            message: `${table.label} ve bu masadaki tüm atamalar kaldırılacak.`,
            confirmText: 'Evet, sil',
            cancelText: 'Vazgeç',
            variant: 'danger',
            onConfirm: () => {
                removeTable(table.id);
                selectTable(null);
                pushToast({ message: `${table.label} silindi.`, type: 'info' });
            },
        });
    };

    // Accept drop to unassign (drop outside table)
    const handleDrop = (e) => {
        e.preventDefault();
        const guestId = e.dataTransfer.getData('guestId');
        if (guestId) {
            unassignGuest(guestId);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="table-detail-panel" onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className="detail-header">
                {isEditingLabel ? (
                    <input
                        className="label-edit-input"
                        value={labelValue}
                        onChange={(e) => setLabelValue(e.target.value)}
                        onBlur={handleSaveLabel}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                ) : (
                    <h2 onClick={handleStartEdit}>{table.label} <Edit3 size={14} className="edit-hint" /></h2>
                )}
                <div className="detail-actions">
                    <button className="btn-icon danger" onClick={handleDeleteTable} title="Masayı Sil">
                        <Trash2 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => selectTable(null)} title="Kapat">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="detail-stats">
                <div className="stat">
                    <span className="stat-label">Masa No</span>
                    <span className="stat-value">{table.number}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Davetli Grup</span>
                    <span className="stat-value">{tableGuests.length}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Toplam Kişi</span>
                    <span className="stat-value">{totalPeople}</span>
                </div>
            </div>

            <div className="shape-selector-section">
                <h3 className="detail-section-title">Masa Şekli</h3>
                <div className="shape-selector">
                    <button
                        className={`shape-btn ${table.shape === 'circle' || !table.shape ? 'active' : ''}`}
                        onClick={() => updateTable(table.id, { shape: 'circle' })}
                        title="Daire"
                    >
                        <div className="shape-preview shape-preview-circle"></div>
                        <span>Daire</span>
                    </button>
                    <button
                        className={`shape-btn ${table.shape === 'square' ? 'active' : ''}`}
                        onClick={() => updateTable(table.id, { shape: 'square' })}
                        title="Kare"
                    >
                        <div className="shape-preview shape-preview-square"></div>
                        <span>Kare</span>
                    </button>
                    <button
                        className={`shape-btn ${table.shape === 'rectangle' ? 'active' : ''}`}
                        onClick={() => updateTable(table.id, { shape: 'rectangle' })}
                        title="Dikdörtgen"
                    >
                        <div className="shape-preview shape-preview-rectangle"></div>
                        <span>Dikdörtgen</span>
                    </button>
                    <button
                        className={`shape-btn ${table.shape === 'oval' ? 'active' : ''}`}
                        onClick={() => updateTable(table.id, { shape: 'oval' })}
                        title="Oval"
                    >
                        <div className="shape-preview shape-preview-oval"></div>
                        <span>Oval</span>
                    </button>
                </div>
            </div>

            <h3 className="detail-section-title">Oturanlar</h3>

            {tableGuests.length === 0 ? (
                <div className="empty-guests-hint">
                    <p>Bu masada henüz kimse yok.</p>
                    <p>Sol panelden bir davetliyi sürükleyip bırakın.</p>
                </div>
            ) : (
                <div className="detail-guest-list">
                    {tableGuests.map((guest) => (
                        <div key={guest.id} className="detail-guest-card">
                            <div className="detail-guest-info">
                                <span className="detail-guest-name">{guest.name}</span>
                                <span className="detail-guest-count">{guest.guestCount} kişi</span>
                                {guest.tag && <span className="detail-guest-tag">{guest.tag}</span>}
                                {guest.phone && <span className="detail-guest-phone">{guest.phone}</span>}
                                {guest.note && <span className="detail-guest-note">{guest.note}</span>}
                            </div>
                            <button
                                className="btn-icon danger"
                                onClick={() => unassignGuest(guest.id)}
                                title="Masadan Çıkar"
                            >
                                <UserMinus size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
