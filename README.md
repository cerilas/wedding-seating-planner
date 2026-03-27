# Düğün Oturma Düzeni ve Salon Kroki Uygulaması | Wedding Seating Chart & Floor Plan Builder

Modern, hızlı ve kullanımı kolay bir düğün oturma düzeni oluşturma uygulaması. Bu proje; **düğün masa planı hazırlama**, **salon krokisi oluşturma**, **misafir yerleşimi yönetimi**, **Excel ile davetli içe/dışa aktarma** ve **drag & drop masa yerleşimi** süreçlerini tek ekranda yönetmek için geliştirildi.

> Anahtar kelimeler: düğün oturma düzeni, wedding seating chart, masa planı, salon kroki uygulaması, organizasyon planlama, düğün masa yerleşimi, wedding floor plan, guest seating planner

## Öne Çıkan Özellikler

- **Düğün oturma düzeni oluşturma** için masa bazlı yerleşim yönetimi
- **Salon krokisi hazırlama** için sürükle-bırak destekli interaktif alan
- **Misafir ekleme, düzenleme ve silme** işlemleri
- **Excel içe aktarma ve dışa aktarma** desteği
- **Örnek Excel şablonu indirme** özelliği
- **Masa oluşturma, taşıma ve silme** desteği
- **Yuvarlak, kare, oval ve dikdörtgen masa tipleri**
- **Oval ve dikdörtgen masaları döndürme** desteği
- **Sahne, pist, duvar, mutfak, bar, giriş, DJ, çiçek, havuz ve yazı alanları** ekleme
- **Misafirleri sürükleyip masalara bırakma**
- **Masadan misafir çıkarma / boşa alma**
- **Arama ve etiket filtreleme**
- **TR/EN dil desteği**
- **Tema değiştirme** desteği
- **PNG olarak kroki dışa aktarma**
- **Onay pencereleri ve toast bildirimleri**
- **Tarayıcıda otomatik veri kalıcılığı**

## Bu Proje Ne İşe Yarar?

Bu uygulama özellikle şu kullanım senaryoları için uygundur:

- Düğün organizasyonu yapan ajanslar
- Davet ve etkinlik planlayıcıları
- Nişan, kına, sünnet, gala ve özel davet salonları
- Misafir masa yerleşimini dijitalleştirmek isteyen işletmeler
- Salon krokisini görsel olarak hazırlamak isteyen ekipler

Kağıt üzerinde masa planı hazırlamak yerine, bu uygulama ile misafirleri hızla yerleştirip salon akışını daha profesyonel şekilde yönetebilirsiniz.

## Powered by Cerilas

[![Cerilas](src/assets/cerilas-logo.png)](https://www.cerilas.com)

Bu proje, Cerilas tarafından geliştirildi. Detaylar için: [https://www.cerilas.com](https://www.cerilas.com)

## Ekranda Neler Yapabilirsiniz?

### Misafir Yönetimi

- Tek tek misafir ekleme
- Excel dosyasından toplu misafir yükleme
- Telefon, not ve etiket bilgisi tutma
- Arama ile hızlı bulma
- Etikete göre filtreleme

### Masa ve Oturma Planı

- Boş alana çift tıklayarak masa ekleme
- Merkezden hızlı masa ekleme butonu
- Masa adını düzenleme
- Masa şekli değiştirme
- Oval ve dikdörtgen masaları sola/sağa döndürme
- Masaya bırakılan misafirleri otomatik ilişkilendirme

### Salon Kroki Düzenleme

- Sahne, pist, mutfak, bar, duvar gibi sabit alanlar ekleme
- Şekilleri taşıma
- Şekilleri yeniden boyutlandırma
- Yazı kutusu ekleme
- Krokide zoom ve pan desteği
- PNG olarak dışa aktarma

## Teknoloji Yığını

- **React 19**
- **Vite 7**
- **Zustand**
- **Lucide React**
- **XLSX**
- **UUID**
- **ESLint**

## Proje Yapısı

```text
src/
  components/
    FloorPlan.jsx
    GuestForm.jsx
    GuestPanel.jsx
    ShapeNode.jsx
    TableDetail.jsx
    TableNode.jsx
  App.jsx
  index.css
  main.jsx
  store.js
```

## Kurulum

### Gereksinimler

- Node.js 18+
- npm

### Başlatma

```bash
npm install
npm run dev
```

Tarayıcıda açmak için:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

Önizleme için:

```bash
npm run preview
```

## Kullanım Akışı

1. Sol panelden misafir ekleyin veya Excel ile içe aktarın.
2. Kroki alanında masalar oluşturun.
3. Masaların şeklini ve yönünü düzenleyin.
4. Sabit salon öğelerini ekleyin.
5. Misafirleri sürükleyip uygun masalara bırakın.
6. Son düzeni Excel veya PNG olarak dışa aktarın.

## Excel Desteği

Uygulama, düğün davetli listesi ve masa planı yönetimini kolaylaştırmak için Excel ile çalışır.

### Desteklenen İşlemler

- Misafirleri Excel'den içe aktarma
- Misafir + masa + şekil verilerini Excel'e dışa aktarma
- Doğru kolon yapısı için şablon indirme
- Türkçe ve İngilizce kolon başlığı desteği

## Çoklu Dil Desteği

Uygulama iki dilde çalışır:

- Türkçe
- English

Arayüzde dil değiştirme ile masa etiketleri ve temel metinler dinamik olarak güncellenir.

## Kalıcılık

Veriler Zustand `persist` yapısı ile tarayıcıda saklanır. Sayfa yenilendiğinde misafirler, masalar ve şekiller korunur.

## Kullanıcı Deneyimi Özellikleri

- Karanlık ve modern arayüz
- Organizasyon işi için uygun profesyonel görünüm
- Hızlı öğrenilebilir kullanım akışı
- Toast bildirimleri ile net geri bildirim
- Tehlikeli işlemler için onay penceresi

## Kimler İçin Uygun?

Bu repo özellikle şu aramalar için güçlü bir çözümdür:

- düğün oturma düzeni uygulaması
- wedding seating chart app
- masa planı oluşturma
- salon yerleşim planı yazılımı
- event seating planner
- wedding floor plan tool
- davetli yerleştirme uygulaması

## Geliştirme Notları

- Masa konumları grid yapısına hizalanır.
- Masalar sürükle-bırak ile taşınır.
- Şekiller bağımsız seçilip düzenlenebilir.
- Misafirler masa ile ilişkilendirilir veya boşa alınabilir.
- Oval ve dikdörtgen masa yönleri döndürülebilir.

## Komutlar

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Gelecekte Eklenebilecek Özellikler

- Masa kapasite limiti
- Kat planı / çok salon desteği
- PDF çıktı alma
- Kullanıcı hesabı ve bulut senkronizasyonu
- Otomatik masa önerisi
- QR veya davetiye entegrasyonu

## Katkı

Projeyi geliştirmek isterseniz:

1. Fork alın
2. Yeni bir branch oluşturun
3. Değişikliklerinizi yapın
4. Commit atın
5. Pull request gönderin

## Lisans

Bu proje için henüz özel bir lisans tanımlanmadı. Gerekirse uygun bir lisans dosyası eklenebilir.

## İletişim ve Proje Sunumu

Bu proje, düğün ve etkinlik organizasyonu süreçlerinde masa yerleşimi ile salon planlamasını dijitalleştirmek için hazırlanmıştır. GitHub üzerinde ürün vitrini olarak kullanılabilecek, SEO uyumlu ve açıklayıcı bir README ile desteklenmiştir.
