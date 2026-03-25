import { useState, useEffect } from 'react';
import useStore from '../store';
import { X, Save } from 'lucide-react';

export default function GuestForm({ guest, onClose }) {
    const { addGuest, updateGuest } = useStore();
    const isEditing = !!guest;

    const [form, setForm] = useState({
        name: '',
        guestCount: 1,
        phone: '',
        note: '',
        tag: '',
    });

    useEffect(() => {
        if (guest) {
            setForm({
                name: guest.name || '',
                guestCount: guest.guestCount || 1,
                phone: guest.phone || '',
                note: guest.note || '',
                tag: guest.tag || '',
            });
        }
    }, [guest]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        if (isEditing) {
            updateGuest(guest.id, form);
        } else {
            addGuest(form);
        }
        onClose();
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEditing ? 'Davetli Düzenle' : 'Yeni Davetli Ekle'}</h3>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>İsim *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Davetli adı"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Davetli Sayısı</label>
                            <input
                                type="number"
                                min="1"
                                value={form.guestCount}
                                onChange={(e) => handleChange('guestCount', parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefon</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="05XX XXX XX XX"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Etiket</label>
                        <input
                            type="text"
                            value={form.tag}
                            onChange={(e) => handleChange('tag', e.target.value)}
                            placeholder="Örn: Gelin Tarafı, Damat Tarafı"
                        />
                    </div>
                    <div className="form-group">
                        <label>Not</label>
                        <textarea
                            value={form.note}
                            onChange={(e) => handleChange('note', e.target.value)}
                            placeholder="Ek notlar..."
                            rows={2}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            İptal
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={16} /> {isEditing ? 'Güncelle' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
