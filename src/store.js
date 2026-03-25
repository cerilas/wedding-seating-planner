import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

// Grid sistem sabitleri
const GRID_SIZE = 50;

// Koordinatları grid'e hizalama fonksiyonu
const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const SHAPE_PRESETS = {
  Sahne: { width: 150, height: 80, color: '#e91e90' },
  Pist: { width: 170, height: 110, color: '#6c757d' },
  Duvar: { width: 200, height: 30, color: '#6c757d' },
  Mutfak: { width: 150, height: 100, color: '#f39c12' },
  Bar: { width: 150, height: 100, color: '#3498db' },
  Giriş: { width: 150, height: 100, color: '#2ecc71' },
  DJ: { width: 150, height: 100, color: '#9b59b6' },
  Çiçek: { width: 150, height: 100, color: '#e74c3c' },
  Havuz: { width: 170, height: 110, color: '#1abc9c' },
  Diğer: { width: 150, height: 100, color: '#6c757d' },
};

const getShapePreset = (shapeType) => SHAPE_PRESETS[shapeType] || SHAPE_PRESETS.Diğer;

const useStore = create(
  persist(
    (set, get) => ({
      guests: [],
      tables: [],
      shapes: [],
      selectedTableId: null,
      selectedShapeId: null,
      searchQuery: '',
      filterTag: '',

      // Guest Actions
      addGuest: (guest) =>
        set((state) => ({
          guests: [
            ...state.guests,
            { id: uuidv4(), tableId: null, ...guest },
          ],
        })),

      updateGuest: (id, updates) =>
        set((state) => ({
          guests: state.guests.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      deleteGuest: (id) =>
        set((state) => ({
          guests: state.guests.filter((g) => g.id !== id),
        })),

      // Table Actions
      addTable: (x, y) =>
        set((state) => {
          const tableNumber = state.tables.length + 1;
          return {
            tables: [
              ...state.tables,
              {
                id: uuidv4(),
                label: `Masa ${tableNumber}`,
                number: tableNumber,
                x: snapToGrid(x),
                y: snapToGrid(y),
                shape: 'circle', // varsayılan şekil
              },
            ],
          };
        }),

      updateTable: (id, updates) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeTable: (id) =>
        set((state) => ({
          tables: state.tables.filter((t) => t.id !== id),
          guests: state.guests.map((g) =>
            g.tableId === id ? { ...g, tableId: null } : g
          ),
        })),

      moveTable: (id, x, y) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id ? { ...t, x: snapToGrid(x), y: snapToGrid(y) } : t
          ),
        })),

      selectTable: (id) => set({ selectedTableId: id, selectedShapeId: null }),

      // Shape Actions
      addShape: (shapeType, x, y) =>
        set((state) => {
          const preset = getShapePreset(shapeType);
          return {
            shapes: [
              ...state.shapes,
              {
                id: uuidv4(),
                type: shapeType,
                label: shapeType,
                x: snapToGrid(x),
                y: snapToGrid(y),
                width: preset.width,
                height: preset.height,
                color: preset.color,
              },
            ],
          };
        }),

      updateShape: (id, updates) =>
        set((state) => ({
          shapes: state.shapes.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      removeShape: (id) =>
        set((state) => ({
          shapes: state.shapes.filter((s) => s.id !== id),
          selectedShapeId: state.selectedShapeId === id ? null : state.selectedShapeId,
        })),

      moveShape: (id, x, y) =>
        set((state) => ({
          shapes: state.shapes.map((s) =>
            s.id === id ? { ...s, x: snapToGrid(x), y: snapToGrid(y) } : s
          ),
        })),

      selectShape: (id) => set({ selectedShapeId: id, selectedTableId: null }),

      // Guest-Table Assignment
      assignGuestToTable: (guestId, tableId) =>
        set((state) => ({
          guests: state.guests.map((g) =>
            g.id === guestId ? { ...g, tableId } : g
          ),
        })),

      unassignGuest: (guestId) =>
        set((state) => ({
          guests: state.guests.map((g) =>
            g.id === guestId ? { ...g, tableId: null } : g
          ),
        })),

      // Search & Filter
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterTag: (tag) => set({ filterTag: tag }),

      // Excel Import
      importGuests: (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const guestSheet = workbook.Sheets[workbook.SheetNames[0]];
              const json = XLSX.utils.sheet_to_json(guestSheet);
              const shapeSheetName =
                workbook.SheetNames.find((name) =>
                  name.toLowerCase().includes('şekil') ||
                  name.toLowerCase().includes('sekil') ||
                  name.toLowerCase().includes('shape')
                ) ||
                workbook.SheetNames[1];
              const shapeSheet = shapeSheetName ? workbook.Sheets[shapeSheetName] : null;
              const shapeRows = shapeSheet ? XLSX.utils.sheet_to_json(shapeSheet) : [];

              const state = get();
              const tablesByNumber = {};
              const newTables = [];

              // Mevcut masaları numaralarına göre maple
              state.tables.forEach((t) => {
                tablesByNumber[t.number] = t;
              });

              // Excel'den gelen masa numaralarını kontrol et ve gerekirse yeni masalar oluştur
              json.forEach((row) => {
                const tableNum = Number(row['Masa No'] || row['masa no'] || row['Table'] || row['table'] || 0);
                if (tableNum > 0 && !tablesByNumber[tableNum]) {
                  // Koordinatları al (varsa)
                  const x = Number(row['Masa X'] || row['masa x'] || row['X'] || row['x'] || 100 + (Object.keys(tablesByNumber).length * 150));
                  const y = Number(row['Masa Y'] || row['masa y'] || row['Y'] || row['y'] || 100 + (Object.keys(tablesByNumber).length * 100));

                  // Şekli al (varsa), hem Türkçe hem İngilizce destekle
                  let shape = String(row['Masa Şekli'] || row['masa şekli'] || row['Shape'] || row['shape'] || 'circle').toLowerCase();
                  // Türkçe -> İngilizce çevirisi
                  const shapeMap = {
                    'daire': 'circle',
                    'kare': 'square',
                    'dikdörtgen': 'rectangle',
                    'dikdortgen': 'rectangle',
                    'oval': 'oval'
                  };
                  shape = shapeMap[shape] || shape;
                  // Geçerli şekiller dışındaysa varsayılan
                  if (!['circle', 'square', 'rectangle', 'oval'].includes(shape)) {
                    shape = 'circle';
                  }

                  const newTable = {
                    id: uuidv4(),
                    label: `Masa ${tableNum}`,
                    number: tableNum,
                    x: snapToGrid(x),
                    y: snapToGrid(y),
                    shape,
                  };
                  tablesByNumber[tableNum] = newTable;
                  newTables.push(newTable);
                }
              });

              // Misafirleri oluştur ve masa atamalarını yap
              const newGuests = json.map((row) => {
                const tableNum = Number(row['Masa No'] || row['masa no'] || row['Table'] || row['table'] || 0);
                const tableId = tableNum > 0 && tablesByNumber[tableNum] ? tablesByNumber[tableNum].id : null;

                return {
                  id: uuidv4(),
                  name: row['İsim'] || row['isim'] || row['Ad'] || row['ad'] || row['Name'] || row['name'] || '',
                  guestCount: Number(row['Davetli Sayısı'] || row['davetli sayısı'] || row['Kişi'] || row['kisi'] || row['Count'] || row['count'] || 1),
                  phone: String(row['Telefon'] || row['telefon'] || row['Phone'] || row['phone'] || ''),
                  tableId,
                  note: row['Not'] || row['not'] || row['Note'] || row['note'] || '',
                  tag: row['Etiket'] || row['etiket'] || row['Tag'] || row['tag'] || '',
                };
              });

              const newShapes = shapeRows.map((row) => {
                const typeOrLabel = String(
                  row['Şekil Tipi'] ||
                  row['Sekil Tipi'] ||
                  row['Type'] ||
                  row['type'] ||
                  row['Şekil Adı'] ||
                  row['Sekil Adi'] ||
                  row['Label'] ||
                  row['label'] ||
                  'Diğer'
                ).trim();
                const preset = getShapePreset(typeOrLabel);

                return {
                  id: uuidv4(),
                  type: typeOrLabel,
                  label: String(row['Şekil Adı'] || row['Sekil Adi'] || row['Label'] || row['label'] || typeOrLabel),
                  x: snapToGrid(Number(row['X'] || row['x'] || 100)),
                  y: snapToGrid(Number(row['Y'] || row['y'] || 100)),
                  width: Math.max(40, Number(row['Genişlik'] || row['Genislik'] || row['Width'] || row['width'] || preset.width)),
                  height: Math.max(20, Number(row['Yükseklik'] || row['Yukseklik'] || row['Height'] || row['height'] || preset.height)),
                  color: String(row['Renk'] || row['Color'] || row['color'] || preset.color),
                };
              });

              set((state) => ({
                guests: [...state.guests, ...newGuests],
                tables: [...state.tables, ...newTables],
                shapes: [...state.shapes, ...newShapes],
              }));
              resolve(newGuests.length);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      },

      // Download Template
      downloadTemplate: () => {
        const sampleData = [
          { 'İsim': 'Ahmet Yılmaz', 'Davetli Sayısı': 3, 'Telefon': '0555 123 4567', 'Masa No': 1, 'Masa X': 100, 'Masa Y': 100, 'Masa Şekli': 'circle', 'Not': 'Vejetaryen', 'Etiket': 'Damat Tarafı' },
          { 'İsim': 'Ayşe Kaya', 'Davetli Sayısı': 2, 'Telefon': '0532 987 6543', 'Masa No': 2, 'Masa X': 250, 'Masa Y': 100, 'Masa Şekli': 'square', 'Not': '', 'Etiket': 'Gelin Tarafı' },
          { 'İsim': 'Mehmet Demir', 'Davetli Sayısı': 4, 'Telefon': '0544 555 1234', 'Masa No': 1, 'Masa X': '', 'Masa Y': '', 'Masa Şekli': '', 'Not': 'Çocuklu', 'Etiket': 'İş Arkadaşları' },
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Davetliler');
        const colWidths = Object.keys(sampleData[0]).map((key) => ({
          wch: Math.max(key.length, ...sampleData.map((row) => String(row[key] || '').length)) + 2,
        }));
        ws['!cols'] = colWidths;
        XLSX.writeFile(wb, 'davetli-sablonu.xlsx');
      },

      // Excel Export
      exportToExcel: () => {
        const { guests, tables, shapes } = get();
        const tableMap = {};
        tables.forEach((t) => {
          tableMap[t.id] = t;
        });

        const data = guests.map((g) => ({
          'İsim': g.name,
          'Davetli Sayısı': g.guestCount,
          'Telefon': g.phone,
          'Masa No': g.tableId ? (tableMap[g.tableId]?.number || '') : '',
          'Masa Adı': g.tableId ? (tableMap[g.tableId]?.label || '') : '',
          'Masa X': g.tableId ? (tableMap[g.tableId]?.x || '') : '',
          'Masa Y': g.tableId ? (tableMap[g.tableId]?.y || '') : '',
          'Masa Şekli': g.tableId ? (tableMap[g.tableId]?.shape || 'circle') : '',
          'Not': g.note,
          'Etiket': g.tag,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const shapeData = shapes.map((shape) => ({
          'Şekil Adı': shape.label,
          'Şekil Tipi': shape.type,
          X: shape.x,
          Y: shape.y,
          'Genişlik': shape.width,
          'Yükseklik': shape.height,
          'Renk': shape.color,
        }));
        const shapeWs = XLSX.utils.json_to_sheet(shapeData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Davetliler');
        XLSX.utils.book_append_sheet(wb, shapeWs, 'Sabit Şekiller');

        // Auto-fit columns
        const colWidths = Object.keys(data[0] || {}).map((key) => ({
          wch: Math.max(
            key.length,
            ...data.map((row) => String(row[key] || '').length)
          ) + 2,
        }));
        ws['!cols'] = colWidths;

        const shapeColWidths = Object.keys(shapeData[0] || {
          'Şekil Adı': '',
          'Şekil Tipi': '',
          X: '',
          Y: '',
          'Genişlik': '',
          'Yükseklik': '',
          'Renk': '',
        }).map((key) => ({
          wch: Math.max(
            key.length,
            ...shapeData.map((row) => String(row[key] || '').length)
          ) + 2,
        }));
        shapeWs['!cols'] = shapeColWidths;

        XLSX.writeFile(wb, 'dugun-oturma-duzeni.xlsx');
      },

      // Clear All
      clearAll: () => set({ guests: [], tables: [], shapes: [], selectedTableId: null, selectedShapeId: null }),
    }),
    {
      name: 'dugun-oturma-duzeni-storage',
    }
  )
);

export default useStore;
