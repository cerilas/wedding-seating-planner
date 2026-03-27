import { useCallback, useState, useRef } from 'react';
import useStore from '../store';
import useUiStore from '../uiStore';
import { useLocale } from '../i18n';

const SHAPE_ICONS = {
  'Sahne': '🎭',
  'Duvar': '🧱',
  'Mutfak': '🍳',
  'Bar': '🍸',
  'Giriş': '🚪',
  'DJ': '🎧',
  'Çiçek': '💐',
  'Havuz': '🏊',
  'Pist': '💃',
  'Yazı': '✍️',
  'Diğer': '📦',
};

export default function ShapeNode({ shape, isSelected, onDragStart, zoom }) {
  const { selectShape, removeShape, updateShape } = useStore();
  const { openConfirm, pushToast } = useUiStore();
  const { t } = useLocale();
  const [resizing, setResizing] = useState(null);
  const startRef = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0 || e.altKey) return;
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left) / zoom;
      const offsetY = (e.clientY - rect.top) / zoom;
      onDragStart(shape.id, offsetX, offsetY);
      selectShape(shape.id);
    },
    [shape.id, onDragStart, selectShape, zoom]
  );

  const handleClick = (e) => {
    e.stopPropagation();
    selectShape(shape.id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    openConfirm({
      title: t('confirmDeleteShapeTitle'),
      message: t('confirmDeleteShapeMsg', { shape: shape.label }),
      confirmText: t('confirmYesDelete'),
      cancelText: t('cancel'),
      variant: 'danger',
      onConfirm: () => {
        removeShape(shape.id);
        pushToast({ message: t('shapeDeleted', { shape: shape.label }), type: 'info' });
      },
    });
  };

  // Resize handles
  const handleResizeMouseDown = useCallback(
    (e, direction) => {
      e.stopPropagation();
      e.preventDefault();
      startRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        width: shape.width,
        height: shape.height,
        x: shape.x,
        y: shape.y,
        direction,
      };
      setResizing(direction);

      const handleResizeMove = (moveEvent) => {
        if (!startRef.current) return;
        const dx = (moveEvent.clientX - startRef.current.mouseX) / zoom;
        const dy = (moveEvent.clientY - startRef.current.mouseY) / zoom;
        const dir = startRef.current.direction;

        let newWidth = startRef.current.width;
        let newHeight = startRef.current.height;
        let newX = startRef.current.x;
        let newY = startRef.current.y;

        if (dir.includes('e')) newWidth = Math.max(40, startRef.current.width + dx);
        if (dir.includes('w')) {
          newWidth = Math.max(40, startRef.current.width - dx);
          newX = startRef.current.x + dx;
        }
        if (dir.includes('s')) newHeight = Math.max(20, startRef.current.height + dy);
        if (dir.includes('n')) {
          newHeight = Math.max(20, startRef.current.height - dy);
          newY = startRef.current.y + dy;
        }

        updateShape(shape.id, {
          width: Math.round(newWidth),
          height: Math.round(newHeight),
          x: Math.round(newX),
          y: Math.round(newY),
        });
      };

      const handleResizeUp = () => {
        setResizing(null);
        startRef.current = null;
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeUp);
      };

      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeUp);
    },
    [shape.id, shape.width, shape.height, shape.x, shape.y, zoom, updateShape]
  );

  const icon = SHAPE_ICONS[shape.type] || SHAPE_ICONS[shape.label] || '📦';

  return (
    <div
      className={`shape-node ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${shape.x}px`,
        top: `${shape.y}px`,
        width: `${shape.width}px`,
        height: `${shape.height}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div
        className="shape-body"
        style={{
          backgroundColor: `${shape.color}22`,
          borderColor: shape.color,
        }}
      >
        {isSelected && (
          <button
            className="shape-delete-btn"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              openConfirm({
                title: t('confirmDeleteShapeTitle'),
                message: t('confirmDeleteShapeMsg', { shape: shape.label }),
                confirmText: t('confirmYesDelete'),
                cancelText: t('cancel'),
                variant: 'danger',
                onConfirm: () => {
                  removeShape(shape.id);
                  pushToast({ message: t('shapeDeleted', { shape: shape.label }), type: 'info' });
                },
              });
            }}
            title={t('deleteShape')}
          >
            ✕
          </button>
        )}
        {shape.type === 'Yazı' ? (
          <div className="shape-text-content">{shape.label}</div>
        ) : (
          <>
            <span className="shape-icon">{icon}</span>
            <span className="shape-label-text">{shape.label}</span>
          </>
        )}
      </div>

      {/* Resize handles - only visible when selected */}
      {isSelected && (
        <>
          <div className="resize-handle resize-n" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="resize-handle resize-s" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="resize-handle resize-e" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
          <div className="resize-handle resize-w" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="resize-handle resize-ne" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="resize-handle resize-nw" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="resize-handle resize-se" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
          <div className="resize-handle resize-sw" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
        </>
      )}
    </div>
  );
}
