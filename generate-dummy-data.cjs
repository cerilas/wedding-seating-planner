const XLSX = require('xlsx');

// 32 masa için koordinatlar (8x4 grid düzeni)
const tables = [];
const tableShapes = ['circle', 'square', 'rectangle', 'oval'];
const tags = ['Damat Tarafı', 'Gelin Tarafı', 'VIP', 'İş Arkadaşları', 'Genç', 'Ailesi'];

for (let i = 1; i <= 32; i++) {
    const row = Math.floor((i - 1) / 8);
    const col = (i - 1) % 8;
    tables.push({
        number: i,
        x: 100 + col * 250,
        y: 100 + row * 150,
        shape: tableShapes[i % 4]
    });
}

// Misafir isimleri
const firstNames = ['Ahmet', 'Mehmet', 'Ali', 'Ayşe', 'Fatma', 'Zeynep', 'Mustafa', 'Hasan', 'Hüseyin', 'İbrahim', 'Elif', 'Merve', 'Betül', 'Yusuf', 'Ömer', 'Can', 'Deniz', 'Ece', 'Selin', 'Burak', 'Emre', 'Cem', 'Gökhan', 'Serkan', 'Aslı', 'Burcu', 'Cansu', 'Damla', 'Ebru', 'Funda'];
const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Özdemir', 'Aydın', 'Arslan', 'Polat', 'Kurt', 'Yıldız', 'Özkan', 'Koç', 'Erdoğan', 'Çetin', 'Acar', 'Özcan', 'Aktaş', 'Karataş', 'Özmen'];

const guests = [];

// Her masa için 2-4 misafir grubu
for (let tableNum = 1; tableNum <= 32; tableNum++) {
    const guestsPerTable = 2 + Math.floor(Math.random() * 3); // 2-4 grup

    for (let g = 0; g < guestsPerTable; g++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const guestCount = 1 + Math.floor(Math.random() * 4); // 1-4 kişi
        const phone = '05' + (20 + Math.floor(Math.random() * 80)) + ' ' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(10 + Math.random() * 90) + ' ' + Math.floor(10 + Math.random() * 90);
        const tag = tags[Math.floor(Math.random() * tags.length)];
        const table = tables.find(t => t.number === tableNum);

        guests.push({
            'İsim': firstName + ' ' + lastName,
            'Davetli Sayısı': guestCount,
            'Telefon': phone,
            'Masa No': tableNum,
            'Masa X': table.x,
            'Masa Y': table.y,
            'Masa Şekli': table.shape,
            'Not': Math.random() > 0.7 ? (Math.random() > 0.5 ? 'Vejetaryen' : 'Çocuklu') : '',
            'Etiket': tag
        });
    }
}

const ws = XLSX.utils.json_to_sheet(guests);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Davetliler');

// Kolon genişliklerini ayarla
ws['!cols'] = [
    { wch: 20 }, // İsim
    { wch: 15 }, // Davetli Sayısı
    { wch: 15 }, // Telefon
    { wch: 10 }, // Masa No
    { wch: 10 }, // Masa X
    { wch: 10 }, // Masa Y
    { wch: 12 }, // Masa Şekli
    { wch: 15 }, // Not
    { wch: 18 }  // Etiket
];

const outputPath = process.env.HOME + '/Downloads/dugun-32-masa-dummy-data.xlsx';
XLSX.writeFile(wb, outputPath);
console.log('✅ Excel dosyası oluşturuldu: ' + outputPath);
console.log('📊 Toplam ' + guests.length + ' misafir, 32 masa');
console.log('🎯 Masalar 8x4 grid düzeninde (circle, square, rectangle, oval şekilleriyle)');
