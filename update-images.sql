-- Contoh update URL gambar untuk produk tertentu
UPDATE "Obat" 
SET foto1 = 'https://via.placeholder.com/400x600/0a0a0a/ffffff?text=Paracetamol'
WHERE nama_obat = 'Paracetamol';

UPDATE "Obat" 
SET foto1 = 'https://via.placeholder.com/400x600/0a0a0a/ffffff?text=Amoxicillin'
WHERE nama_obat = 'Amoxicillin';

-- Atau update semua produk dengan gambar placeholder
UPDATE "Obat" 
SET foto1 = 'https://via.placeholder.com/400x600/0a0a0a/ffffff?text=' || nama_obat
WHERE foto1 IS NULL;
