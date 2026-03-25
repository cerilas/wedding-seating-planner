import { useRef, useState, useCallback, useEffect } from 'react';
import useStore from '../store';
import useUiStore from '../uiStore';
import TableNode from './TableNode';
import ShapeNode from './ShapeNode';
import { ZoomIn, ZoomOut, Maximize2, Plus, Shapes, Camera } from 'lucide-react';

const SHAPE_OPTIONS = [
    { type: 'Sahne', icon: '🎭', desc: 'Sahne / Kürsü' },
    { type: 'Pist', icon: '💃', desc: 'Dans Pisti' },
    { type: 'Duvar', icon: '🧱', desc: 'Duvar / Bölme' },
    { type: 'Mutfak', icon: '🍳', desc: 'Mutfak Alanı' },
    { type: 'Bar', icon: '🍸', desc: 'Bar' },
    { type: 'Giriş', icon: '🚪', desc: 'Giriş / Çıkış' },
    { type: 'DJ', icon: '🎧', desc: 'DJ Standı' },
    { type: 'Çiçek', icon: '💐', desc: 'Çiçek / Dekorasyon' },
    { type: 'Havuz', icon: '🏊', desc: 'Havuz' },
    { type: 'Yazı', icon: '✍️', desc: 'Yazı Kutusu' },
    { type: 'Diğer', icon: '📦', desc: 'Diğer' },
];

export default function FloorPlan() {
    const { tables, shapes, addTable, addShape, moveTable, moveShape, selectTable, selectShape, selectedTableId, selectedShapeId } = useStore();
    const { pushToast } = useUiStore();
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setZoom((z) => Math.min(Math.max(0.3, z + 0.2), 3));
    };

    const handleZoomOut = () => {
        setZoom((z) => Math.max(0.3, z - 0.2));
    };

    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState(null);
    const [draggingTableId, setDraggingTableId] = useState(null);
    const [draggingShapeId, setDraggingShapeId] = useState(null);
    const [showShapeMenu, setShowShapeMenu] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);
    const [textInput, setTextInput] = useState('');
    const shapeMenuRef = useRef(null);

    // Close shape menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (shapeMenuRef.current && !shapeMenuRef.current.contains(e.target)) {
                setShowShapeMenu(false);
            }
        };
        if (showShapeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showShapeMenu]);

    // Double-click to add table
    const handleDoubleClick = useCallback(
        (e) => {
            if (e.target !== containerRef.current && e.target !== containerRef.current?.querySelector('.floor-canvas')) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - pan.x) / zoom;
            const y = (e.clientY - rect.top - pan.y) / zoom;
            addTable(x, y);
        },
        [addTable, pan, zoom]
    );

    // Pan with middle mouse or when holding alt
    const handleMouseDown = useCallback(
        (e) => {
            if (e.button === 1 || (e.button === 0 && e.altKey)) {
                e.preventDefault();
                setIsPanning(true);
                setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
            }
        },
        [pan]
    );

    const handleMouseMove = useCallback(
        (e) => {
            if (isPanning) {
                setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
            }
            if (draggingTableId && dragOffset) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
                const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
                moveTable(draggingTableId, x, y);
            }
            if (draggingShapeId && dragOffset) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
                const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
                moveShape(draggingShapeId, x, y);
            }
        },
        [isPanning, panStart, draggingTableId, draggingShapeId, dragOffset, pan, zoom, moveTable, moveShape]
    );

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        setDraggingTableId(null);
        setDraggingShapeId(null);
        setDragOffset(null);
    }, []);

    // Zoom
    const handleWheel = useCallback(
        (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom((z) => Math.min(Math.max(0.3, z + delta), 3));
        },
        []
    );

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.addEventListener('wheel', handleWheel, { passive: false });
            return () => el.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);

    const handleTableDragStart = (tableId, offsetX, offsetY) => {
        setDraggingTableId(tableId);
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleShapeDragStart = (shapeId, offsetX, offsetY) => {
        setDraggingShapeId(shapeId);
        setDragOffset({ x: offsetX, y: offsetY });
    };

    // Drop guest onto floor
    const handleDrop = (e) => {
        e.preventDefault();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleClickFloor = (e) => {
        if (e.target === containerRef.current || e.target.classList.contains('floor-canvas')) {
            selectTable(null);
            selectShape(null);
        }
    };

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleAddTableButton = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = (rect.width / 2 - pan.x) / zoom;
        const centerY = (rect.height / 2 - pan.y) / zoom;
        const offset = tables.length * 30;
        addTable(centerX + offset, centerY + offset);
    };

    const handleAddShape = (shapeType) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = (rect.width / 2 - pan.x) / zoom;
        const centerY = (rect.height / 2 - pan.y) / zoom;
        const offset = shapes.length * 20;

        if (shapeType === 'Yazı') {
            setTextInput('');
            setShowTextModal(true);
            setShowShapeMenu(false);
            return;
        }

        addShape(shapeType, centerX + offset, centerY + offset);
        setShowShapeMenu(false);
    };

    const handleAddTextConfirm = () => {
        const text = textInput.trim();
        if (!text) {
            pushToast({ message: 'Lütfen metin girin.', type: 'error' });
            return;
        }

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = (rect.width / 2 - pan.x) / zoom;
        const centerY = (rect.height / 2 - pan.y) / zoom;
        const offset = shapes.length * 20;

        addShape('Yazı', centerX + offset, centerY + offset, { label: text });
        pushToast({ message: 'Yazı kutusu eklendi.', type: 'success' });
        setShowTextModal(false);
        setTextInput('');
    };


    const handleExportAsPng = async () => {
        if (!containerRef.current) {
            pushToast({ message: 'Kayıt yapılacak alan bulunamadı.', type: 'error' });
            return;
        }

        if (!window.html2canvas) {
            pushToast({ message: 'html2canvas yüklenmedi. Lütfen sayfayı yenileyin.', type: 'error' });
            return;
        }

        try {
            const canvas = await window.html2canvas(containerRef.current, { backgroundColor: '#0f0f1a', scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `dugun-kroki-${Date.now()}.png`;
            link.click();
            pushToast({ message: 'PNG olarak indirildi.', type: 'success' });
        } catch (error) {
            console.error(error);
            pushToast({ message: 'Görüntü oluşturulamadı.', type: 'error' });
        }
    };

    return (
        <div className="floor-plan-container">
            <div className="floor-toolbar">
                <span className="floor-title">🏛️ Salon Krokisi</span>
                <div className="toolbar-buttons">
                    <button className="btn btn-primary btn-add-table" onClick={handleAddTableButton}>
                        <Plus size={16} /> Masa Ekle
                    </button>
                    <button className="btn btn-secondary btn-add-table" onClick={handleExportAsPng}>
                        <Camera size={16} /> Görüntü indir
                    </button>
                    <div className="shape-menu-wrapper" ref={shapeMenuRef}>
                        <button
                            className={`btn btn-secondary btn-add-shape ${showShapeMenu ? 'active' : ''}`}
                            onClick={() => setShowShapeMenu(!showShapeMenu)}
                        >
                            <Shapes size={16} /> Şekil Ekle
                        </button>
                        {showShapeMenu && (
                            <div className="shape-dropdown">
                                <div className="shape-dropdown-title">Eklenecek öğe seçin</div>
                                <div className="shape-dropdown-grid">
                                    {SHAPE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.type}
                                            className="shape-dropdown-item"
                                            onClick={() => handleAddShape(opt.type)}
                                        >
                                            <span className="shape-dropdown-icon">{opt.icon}</span>
                                            <span className="shape-dropdown-label">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="floor-hint">çift tıkla → masa • Alt+Sürükle → kaydır • Scroll → zoom</div>
                <div className="zoom-controls">
                    <button className="btn-icon" onClick={handleZoomIn} title="Yakınlaştır ve merkezle">
                        <ZoomIn size={18} />
                    </button>
                    <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                    <button className="btn-icon" onClick={handleZoomOut} title="Uzaklaştır">
                        <ZoomOut size={18} />
                    </button>
                    <button className="btn-icon" onClick={resetView} title="Sıfırla">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="floor-area"
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClickFloor}
            >
                <div
                    className="floor-canvas"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: '0 0',
                    }}
                >
                    {/* Grid pattern */}
                    <div className="floor-grid" />

                    {/* Shapes (behind tables) */}
                    {shapes.map((shape) => (
                        <ShapeNode
                            key={shape.id}
                            shape={shape}
                            isSelected={selectedShapeId === shape.id}
                            onDragStart={handleShapeDragStart}
                            zoom={zoom}
                        />
                    ))}

                    {/* Tables */}
                    {tables.map((table) => (
                        <TableNode
                            key={table.id}
                            table={table}
                            isSelected={selectedTableId === table.id}
                            onDragStart={handleTableDragStart}
                            zoom={zoom}
                        />
                    ))}

                    {tables.length === 0 && shapes.length === 0 && (
                        <div className="floor-empty-hint">
                            <p>🪑</p>
                            <p>Boş alana çift tıklayarak masa ekleyin</p>
                        </div>
                    )}
                </div>
            </div>

            {showTextModal && (
                <div className="modal-overlay">
                    <div className="text-input-modal">
                        <h3>Yazı Ekle</h3>
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Buraya yazınızı girin..."
                            rows={4}
                        />
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowTextModal(false)}>
                                İptal
                            </button>
                            <button className="btn btn-primary" onClick={handleAddTextConfirm}>
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
