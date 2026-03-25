import { useCallback } from 'react';
import useStore from '../store';
import useUiStore from '../uiStore';

export default function TableNode({ table, isSelected, onDragStart, zoom }) {
    const { guests, assignGuestToTable, selectTable, removeTable } = useStore();
    const { openConfirm, pushToast } = useUiStore();

    const tableGuests = guests.filter((g) => g.tableId === table.id);
    const totalPeople = tableGuests.reduce((sum, g) => sum + (g.guestCount || 1), 0);

    const handleMouseDown = useCallback(
        (e) => {
            if (e.button !== 0 || e.altKey) return;
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = (e.clientX - rect.left) / zoom;
            const offsetY = (e.clientY - rect.top) / zoom;
            onDragStart(table.id, offsetX, offsetY);
            selectTable(table.id);
        },
        [table.id, onDragStart, selectTable, zoom]
    );

    const handleClick = (e) => {
        e.stopPropagation();
        selectTable(table.id);
    };

    // Drop guest onto table
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const guestId = e.dataTransfer.getData('guestId');
        if (guestId) {
            assignGuestToTable(guestId, table.id);
        }
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        openConfirm({
            title: 'Masa silinsin mi?',
            message: `${table.label} ve bu masadaki atamalar kaldırılacak.`,
            confirmText: 'Evet, sil',
            cancelText: 'Vazgeç',
            variant: 'danger',
            onConfirm: () => {
                removeTable(table.id);
                pushToast({ message: `${table.label} silindi.`, type: 'info' });
            },
        });
    };

    return (
        <div
            className={`table-node ${isSelected ? 'selected' : ''} ${tableGuests.length > 0 ? 'has-guests' : ''}`}
            style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onContextMenu={handleContextMenu}
        >
            <div className="table-visual">
                <div className={`table-circle table-shape-${table.shape || 'circle'}`}>
                    <span className="table-number">{table.number}</span>
                </div>
                <div className="table-seats">
                    {tableGuests.slice(0, 8).map((g, i) => {
                        const angle = (i * 360) / Math.max(tableGuests.length, 6);
                        const radius = 52;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                        return (
                            <div
                                key={g.id}
                                className="seat-indicator"
                                style={{
                                    transform: `translate(${x}px, ${y}px)`,
                                }}
                                title={`${g.name} (${g.guestCount} kişi)`}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="table-label">{table.label}</div>
            {totalPeople > 0 && (
                <div className="table-people-count">{totalPeople} kişi</div>
            )}
        </div>
    );
}
