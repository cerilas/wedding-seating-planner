import { X, MousePointer2, Table2, Users, Move, Upload, Download, Shapes } from 'lucide-react';

export default function HowToModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal howto-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Platform Nasıl Kullanılır?</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="howto-content">
          <p className="howto-intro">
            Bu platform ile davetlileri ekleyip salon krokisine masalar ve sabit alanlar yerleştirerek hızlıca oturma planı oluşturabilirsiniz.
          </p>

          <div className="howto-grid">
            <div className="howto-card">
              <h4><Users size={16} /> 1) Davetlileri Ekleyin</h4>
              <ul>
                <li>Sol panelde <strong>Ekle</strong> ile davetli girin.</li>
                <li><strong>İçe Aktar</strong> ile Excel dosyasından toplu ekleme yapın.</li>
                <li>Arama ve etiket filtreleriyle listeleri hızlıca yönetin.</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Table2 size={16} /> 2) Masa Yerleşimi Oluşturun</h4>
              <ul>
                <li>Krokide çift tıklayarak veya <strong>Masa Ekle</strong> ile masa oluşturun.</li>
                <li>Masayı sürükleyerek konumlandırın.</li>
                <li>Masaya tıklayıp sağ panelden adı/şekli düzenleyin.</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Shapes size={16} /> 3) Sabit Alanları Ekleyin</h4>
              <ul>
                <li><strong>Şekil Ekle</strong> ile Sahne, Pist, Mutfak, Duvar gibi alanlar ekleyin.</li>
                <li>Şekilleri sürükleyin, köşelerden boyutlandırın.</li>
                <li>Bu alanlar oturma için değildir; kişiye atanamaz.</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><MousePointer2 size={16} /> 4) Davetlileri Masalara Yerleştirin</h4>
              <ul>
                <li>Soldaki davetli kartını sürükleyip masaya bırakın.</li>
                <li>Masadan çıkarmak için sağ panelde kişi yanındaki çıkar butonunu kullanın.</li>
                <li>Boş alana bırakınca atama kaldırılır.</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Move size={16} /> 5) Kroki Kontrolleri</h4>
              <ul>
                <li><strong>Scroll</strong>: yakınlaştır/uzaklaştır</li>
                <li><strong>Alt + Sürükle</strong>: krokide gezinme</li>
                <li><strong>Sıfırla</strong>: görünümü başlangıca döndürme</li>
              </ul>
            </div>

            <div className="howto-card">
              <h4><Upload size={16} /> <Download size={16} /> 6) Veri Aktarımı</h4>
              <ul>
                <li>Önce <strong>Örnek Şablon İndir</strong> ile formatı alın.</li>
                <li><strong>Dışa Aktar</strong> ile davetliler, masa bilgileri ve sabit şekiller Excel’e yazılır.</li>
                <li>Sonraki kullanımda aynı dosyayı içe aktarıp devam edebilirsiniz.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
