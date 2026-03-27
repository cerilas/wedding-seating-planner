import { useState, useRef } from 'react';
import useStore from '../store';
import useUiStore from '../uiStore';
import { useLocale } from '../i18n';
import { Upload, Download, Plus, Search, X, Tag, Users, FileSpreadsheet } from 'lucide-react';
import GuestForm from './GuestForm';

export default function GuestPanel() {
    const {
        guests,
        tables,
        searchQuery,
        filterTag,
        setSearchQuery,
        setFilterTag,
        deleteGuest,
        importGuests,
        exportToExcel,
        downloadTemplate,
    } = useStore();
    const { openConfirm, pushToast } = useUiStore();
    const { t } = useLocale();

    const [showForm, setShowForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const fileInputRef = useRef(null);

    const allTags = [...new Set(guests.map((g) => g.tag).filter(Boolean))];

    const filteredGuests = guests.filter((g) => {
        const matchesSearch =
            !searchQuery ||
            g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.phone.includes(searchQuery);
        const matchesTag = !filterTag || g.tag === filterTag;
        return matchesSearch && matchesTag;
    });

    const unassignedGuests = filteredGuests.filter((g) => !g.tableId);
    const assignedGuests = filteredGuests.filter((g) => g.tableId);

    const totalGuestCount = guests.reduce((sum, g) => sum + (g.guestCount || 1), 0);
    const assignedCount = guests
        .filter((g) => g.tableId)
        .reduce((sum, g) => sum + (g.guestCount || 1), 0);

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const count = await importGuests(file);
            pushToast({ message: `${count} davetli başarıyla eklendi!`, type: 'success' });
        } catch {
            pushToast({ message: 'Dosya okunamadı!', type: 'error' });
        }
        e.target.value = '';
    };

    const handleDeleteGuest = (guest) => {
        openConfirm({
            title: t('deleteGuestConfirmTitle'),
            message: t('deleteGuestConfirmMessage', { name: guest.name }),
            confirmText: t('confirmYesDelete'),
            cancelText: t('cancel'),
            variant: 'danger',
            onConfirm: () => {
                deleteGuest(guest.id);
                pushToast({ message: t('guestDeleted', { name: guest.name }), type: 'info' });
            },
        });
    };

    const handleDragStart = (e, guest) => {
        e.dataTransfer.setData('guestId', guest.id);
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
    };

    const getTableLabel = (tableId) => {
        const table = tables.find((t) => t.id === tableId);
        return table ? table.label : '';
    };

    return (
        <div className="guest-panel">
            <div className="panel-header">
                <h2><Users size={20} /> {t('guestPanelTitle')}</h2>
                <span className="guest-count-badge">
                    {t('seatedInfo', { assigned: assignedCount, total: totalGuestCount })}
                </span>
            </div>

            <div className="panel-actions">
                <button className="btn btn-primary" onClick={() => { setEditingGuest(null); setShowForm(true); }}>
                    <Plus size={16} /> {t('addGuest')}
                </button>
                <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={16} /> {t('importGuest')}
                </button>
                <button className="btn btn-secondary" onClick={exportToExcel} disabled={guests.length === 0}>
                    <Download size={16} /> {t('exportGuest')}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                />
            </div>

            <div className="template-hint">
                <p>{t('excelHint')}</p>
                <button
                    className="btn btn-template"
                    onClick={() =>
                        downloadTemplate({
                            name: t('nameLabel'),
                            guestCount: t('guestCount'),
                            phone: t('phone'),
                            tableNo: t('tableNo'),
                            tableX: t('tableX'),
                            tableY: t('tableY'),
                            tableShape: t('tableShape'),
                            note: t('note'),
                            tag: t('tag'),
                        })
                    }
                >
                    <FileSpreadsheet size={14} /> {t('templateDownload')}
                </button>
                <p className="template-columns">{t('templateColumns')}</p>
            </div>

            <div className="search-bar">
                <Search size={16} />
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button className="btn-icon" onClick={() => setSearchQuery('')}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {allTags.length > 0 && (
                <div className="tag-filters">
                    <Tag size={14} />
                    <button
                        className={`tag-chip ${!filterTag ? 'active' : ''}`}
                        onClick={() => setFilterTag('')}
                    >
                        {t('all')}
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            className={`tag-chip ${filterTag === tag ? 'active' : ''}`}
                            onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="guest-list-container">
                {unassignedGuests.length > 0 && (
                    <>
                        <h3 className="list-section-title">{t('unassignedGuests', { count: unassignedGuests.length })}</h3>
                        <div className="guest-list">
                            {unassignedGuests.map((guest) => (
                                <div
                                    key={guest.id}
                                    className="guest-card unassigned"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, guest)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="guest-card-main">
                                        <span className="guest-name">{guest.name}</span>
                                        <span className="guest-count">{t('guestCountLabel', { count: guest.guestCount })}</span>
                                    </div>
                                    {guest.tag && <span className="guest-tag">{guest.tag}</span>}
                                    {guest.phone && <span className="guest-phone">{guest.phone}</span>}
                                    <div className="guest-card-actions">
                                        <button onClick={() => { setEditingGuest(guest); setShowForm(true); }}>{t('editProfile')}</button>
                                        <button className="danger" onClick={() => handleDeleteGuest(guest)}>{t('deleteGuest')}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {assignedGuests.length > 0 && (
                    <>
                        <h3 className="list-section-title">{t('assignedGuests', { count: assignedGuests.length })}</h3>
                        <div className="guest-list">
                            {assignedGuests.map((guest) => (
                                <div
                                    key={guest.id}
                                    className="guest-card assigned"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, guest)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="guest-card-main">
                                        <span className="guest-name">{guest.name}</span>
                                        <span className="guest-count">{t('guestCountLabel', { count: guest.guestCount })}</span>
                                    </div>
                                    <span className="guest-table-badge">{getTableLabel(guest.tableId)}</span>
                                    {guest.tag && <span className="guest-tag">{guest.tag}</span>}
                                    <div className="guest-card-actions">
                                        <button onClick={() => { setEditingGuest(guest); setShowForm(true); }}>{t('editProfile')}</button>
                                        <button className="danger" onClick={() => handleDeleteGuest(guest)}>{t('deleteGuest')}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {filteredGuests.length === 0 && (
                    <div className="empty-state">
                        <p>{t('noGuest')}</p>
                        <p>{t('noGuestHint')}</p>
                    </div>
                )}
            </div>

            {showForm && (
                <GuestForm
                    guest={editingGuest}
                    onClose={() => { setShowForm(false); setEditingGuest(null); }}
                />
            )}
        </div>
    );
}
