import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...')

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Jenis Obat (Categories)
    const categories = [
        { jenis: 'Analgesik', deskripsi_jenis: 'Obat pereda nyeri dan penurun panas' },
        { jenis: 'Antibiotik', deskripsi_jenis: 'Obat untuk melawan infeksi bakteri' },
        { jenis: 'Vitamin & Suplemen', deskripsi_jenis: 'Menjaga daya tahan dan kesehatan tubuh' },
        { jenis: 'Obat Batuk & Flu', deskripsi_jenis: 'Meredakan gejala batuk, pilek, dan flu' },
        { jenis: 'Antihistamin', deskripsi_jenis: 'Obat alergi dan gatal-gatal' },
        { jenis: 'Obat Maag & Pencernaan', deskripsi_jenis: 'Meredakan asam lambung dan masalah perut' },
        { jenis: 'Obat Luar & Salep', deskripsi_jenis: 'Obat untuk luka, jamur, atau infeksi kulit' },
    ];

    const seededCategories = await Promise.all(
        categories.map(cat =>
            prisma.jenisObat.upsert({
                where: { jenis: cat.jenis },
                update: cat,
                create: cat,
            })
        )
    );

    const catMap = Object.fromEntries(seededCategories.map(c => [c.jenis, c.id]));

    // 2. Obat (Products)
    const products = [
        // Analgesik
        {
            nama_obat: 'Paracetamol 500mg',
            id_jenis_obat: catMap['Analgesik'],
            harga_jual: 2500,
            stok: 200,
            deskripsi_obat: 'Meredakan demam dan sakit kepala ringan.'
        },
        {
            nama_obat: 'Panadol Extra',
            id_jenis_obat: catMap['Analgesik'],
            harga_jual: 12500,
            stok: 50,
            deskripsi_obat: 'Meredakan sakit kepala membandel dan nyeri gigi.'
        },
        {
            nama_obat: 'Asam Mefenamat 500mg',
            id_jenis_obat: catMap['Analgesik'],
            harga_jual: 8000,
            stok: 100,
            deskripsi_obat: 'Meredakan nyeri sedang hingga berat seperti sakit gigi atau nyeri haid.'
        },

        // Antibiotik
        {
            nama_obat: 'Amoxicillin 500mg',
            id_jenis_obat: catMap['Antibiotik'],
            harga_jual: 5000,
            stok: 150,
            deskripsi_obat: 'Antibiotik spektrum luas. Harus habis diminum sesuai resep.'
        },
        {
            nama_obat: 'Cefadroxil 500mg',
            id_jenis_obat: catMap['Antibiotik'],
            harga_jual: 15000,
            stok: 40,
            deskripsi_obat: 'Digunakan untuk mengobati berbagai infeksi bakteri.'
        },

        // Vitamin & Suplemen
        {
            nama_obat: 'Vitamin C 1000mg',
            id_jenis_obat: catMap['Vitamin & Suplemen'],
            harga_jual: 15000,
            stok: 80,
            deskripsi_obat: 'Suplemen untuk menjaga daya tahan tubuh.'
        },
        {
            nama_obat: 'Enervon-C',
            id_jenis_obat: catMap['Vitamin & Suplemen'],
            harga_jual: 6000,
            stok: 120,
            deskripsi_obat: 'Multivitamin untuk memulihkan kondisi tubuh setelah sakit.'
        },
        {
            nama_obat: 'Sangobion',
            id_jenis_obat: catMap['Vitamin & Suplemen'],
            harga_jual: 25000,
            stok: 60,
            deskripsi_obat: 'Suplemen penambah darah untuk mengatasi anemia.'
        },

        // Obat Batuk & Flu
        {
            nama_obat: 'Sanadryl Sirup',
            id_jenis_obat: catMap['Obat Batuk & Flu'],
            harga_jual: 22000,
            stok: 30,
            deskripsi_obat: 'Meredakan batuk berdahak dan alergi.'
        },
        {
            nama_obat: 'Vicks Formula 44',
            id_jenis_obat: catMap['Obat Batuk & Flu'],
            harga_jual: 18500,
            stok: 45,
            deskripsi_obat: 'Meredakan batuk tidak berdahak.'
        },
        {
            nama_obat: 'Procold Flu',
            id_jenis_obat: catMap['Obat Batuk & Flu'],
            harga_jual: 5000,
            stok: 200,
            deskripsi_obat: 'Meredakan gejala flu seperti bersin dan hidung tersumbat.'
        },

        // Antihistamin
        {
            nama_obat: 'CTM 4mg',
            id_jenis_obat: catMap['Antihistamin'],
            harga_jual: 1000,
            stok: 500,
            deskripsi_obat: 'Mengatasi alergi dan gatal-gatal. Menyebabkan kantuk.'
        },
        {
            nama_obat: 'Incidal (Cetirizine)',
            id_jenis_obat: catMap['Antihistamin'],
            harga_jual: 15000,
            stok: 75,
            deskripsi_obat: 'Obat alergi modern. Tidak menyebabkan kantuk bagi kebanyakan orang.'
        },

        // Obat Maag
        {
            nama_obat: 'Promag Tablet',
            id_jenis_obat: catMap['Obat Maag & Pencernaan'],
            harga_jual: 9000,
            stok: 100,
            deskripsi_obat: 'Meredakan sakit maag, kembung, dan perih di ulu hati.'
        },
        {
            nama_obat: 'Mylanta Cair',
            id_jenis_obat: catMap['Obat Maag & Pencernaan'],
            harga_jual: 45000,
            stok: 20,
            deskripsi_obat: 'Bekerja cepat meredakan asam lambung berlebih.'
        },

        // Obat Luar
        {
            nama_obat: 'Betadine 15ml',
            id_jenis_obat: catMap['Obat Luar & Salep'],
            harga_jual: 25000,
            stok: 50,
            deskripsi_obat: 'Antiseptik untuk mencegah infeksi pada luka bakar atau luka gores.'
        },
        {
            nama_obat: 'Canesten Salep',
            id_jenis_obat: catMap['Obat Luar & Salep'],
            harga_jual: 38000,
            stok: 35,
            deskripsi_obat: 'Obat jamur kulit seperti panu, kadas, dan kurap.'
        },
    ];

    await Promise.all(
        products.map(prod =>
            prisma.obat.upsert({
                where: { nama_obat: prod.nama_obat },
                update: prod,
                create: prod,
            })
        )
    );

    // 3. Pelanggan
    const pelanggans = [
        {
            nama_pelanggan: 'Budi Santoso',
            email: 'budi@example.com',
            katakunci: 'budi123',
            no_telp: '08123456789',
            alamat1: 'Jl. Merdeka No. 12',
            kota1: 'Jakarta',
            propinsi1: 'DKI Jakarta',
            kodepos1: '12345'
        },
        {
            nama_pelanggan: 'Siti Aminah',
            email: 'siti@example.com',
            katakunci: 'siti456',
            no_telp: '08987654321',
            alamat1: 'Jl. Mawar No. 5',
            kota1: 'Bandung',
            propinsi1: 'Jawa Barat',
            kodepos1: '54321'
        },
    ];

    await Promise.all(
        pelanggans.map(pel =>
            prisma.pelanggan.upsert({
                where: { email: pel.email },
                update: pel,
                create: pel,
            })
        )
    );

    // 4. Metode Bayar
    const metodeBayars = [
        { metode_pembayaran: 'Transfer Bank', tempat_bayar: 'Bank Mandiri', no_rekening: '1234567890' },
        { metode_pembayaran: 'E-Wallet', tempat_bayar: 'Gopay', no_rekening: '08123456789' },
        { metode_pembayaran: 'Tunai', tempat_bayar: 'Kasir Apotek', no_rekening: '-' },
    ];

    await Promise.all(
        metodeBayars.map(met =>
            prisma.metodeBayar.upsert({
                where: { metode_pembayaran: met.metode_pembayaran },
                update: met,
                create: met,
            })
        )
    );

    // 5. Jenis Pengiriman
    const jenisPengirimans = [
        { jenis_kirim: 'Reguler', nama_ekspedisi: 'JNE' },
        { jenis_kirim: 'Express', nama_ekspedisi: 'GrabExpress' },
        { jenis_kirim: 'Ambil Sendiri', nama_ekspedisi: 'Self Pickup' },
    ];

    await Promise.all(
        jenisPengirimans.map(jp =>
            prisma.jenisPengiriman.upsert({
                where: { jenis_kirim: jp.jenis_kirim },
                update: jp,
                create: jp,
            })
        )
    );

    // 6. User (Staff)
    const users = [
        { name: 'Admin Utama', email: 'admin@xinna.com', password: hashedPassword, jabatan: 'admin' as const },
        { name: 'Apoteker Rudi', email: 'rudi@xinna.com', password: hashedPassword, jabatan: 'apoteker' as const },
        { name: 'Kurir Andi', email: 'andi@xinna.com', password: hashedPassword, jabatan: 'karyawan' as const },
    ];

    await Promise.all(
        users.map(u =>
            prisma.user.upsert({
                where: { email: u.email },
                update: u,
                create: u,
            })
        )
    );

    // 7. Distributor
    const distributors = [
        { nama_distributor: 'Kimia Farma Trading', telepon: '021-123456', alamat: 'Kawasan Industri Pulogadung' },
        { nama_distributor: 'Enseval Putera', telepon: '021-654321', alamat: 'Sunter, Jakarta Utara' },
    ];

    await Promise.all(
        distributors.map(d =>
            prisma.distributor.upsert({
                where: { nama_distributor: d.nama_distributor },
                update: d,
                create: d,
            })
        )
    );

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
