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

    // 1. Jenis Obat
    const jenisObats = await Promise.all([
        prisma.jenisObat.create({ data: { jenis: 'Antibiotik', deskripsi_jenis: 'Obat untuk infeksi bakteri' } }),
        prisma.jenisObat.create({ data: { jenis: 'Analgesik', deskripsi_jenis: 'Obat pereda nyeri' } }),
        prisma.jenisObat.create({ data: { jenis: 'Vitamin', deskripsi_jenis: 'Suplemen kesehatan' } }),
    ])

    // 2. Obat
    const obats = await Promise.all([
        prisma.obat.create({
            data: {
                nama_obat: 'Amoxicillin 500mg',
                id_jenis_obat: jenisObats[0].id,
                harga_jual: 5000,
                stok: 100,
                deskripsi_obat: 'Minum sesudah makan, harus habis',
            }
        }),
        prisma.obat.create({
            data: {
                nama_obat: 'Paracetamol 500mg',
                id_jenis_obat: jenisObats[1].id,
                harga_jual: 2500,
                stok: 200,
                deskripsi_obat: 'Obat penurun panas dan pereda nyeri',
            }
        }),
        prisma.obat.create({
            data: {
                nama_obat: 'Vitamin C 1000mg',
                id_jenis_obat: jenisObats[2].id,
                harga_jual: 15000,
                stok: 50,
                deskripsi_obat: 'Menjaga daya tahan tubuh',
            }
        }),
    ])

    // 3. Pelanggan
    const pelanggans = await Promise.all([
        prisma.pelanggan.create({
            data: {
                nama_pelanggan: 'Budi Santoso',
                email: 'budi@example.com',
                katakunci: 'budi123',
                no_telp: '08123456789',
                alamat1: 'Jl. Merdeka No. 12',
                kota1: 'Jakarta',
                propinsi1: 'DKI Jakarta',
                kodepos1: '12345',
            }
        }),
        prisma.pelanggan.create({
            data: {
                nama_pelanggan: 'Siti Aminah',
                email: 'siti@example.com',
                katakunci: 'siti456',
                no_telp: '08987654321',
                alamat1: 'Jl. Mawar No. 5',
                kota1: 'Bandung',
                propinsi1: 'Jawa Barat',
                kodepos1: '54321',
            }
        }),
    ])

    // 4. Metode Bayar
    const metodeBayars = await Promise.all([
        prisma.metodeBayar.create({ data: { metode_pembayaran: 'Transfer Bank', tempat_bayar: 'Bank Mandiri', no_rekening: '1234567890' } }),
        prisma.metodeBayar.create({ data: { metode_pembayaran: 'E-Wallet', tempat_bayar: 'Gopay', no_rekening: '08123456789' } }),
        prisma.metodeBayar.create({ data: { metode_pembayaran: 'Tunai', tempat_bayar: 'Kasir Apotek', no_rekening: '-' } }),
    ])

    // 5. Jenis Pengiriman
    const pengirimans = await Promise.all([
        prisma.jenisPengiriman.create({ data: { jenis_kirim: 'Reguler', nama_ekspedisi: 'JNE' } }),
        prisma.jenisPengiriman.create({ data: { jenis_kirim: 'Express', nama_ekspedisi: 'GrabExpress' } }),
        prisma.jenisPengiriman.create({ data: { jenis_kirim: 'Ambil Sendiri', nama_ekspedisi: 'Self Pickup' } }),
    ])

    // 6. User (Staff)
    const users = await Promise.all([
        prisma.user.create({ data: { name: 'Admin Utama', email: 'admin@xinna.com', password: hashedPassword, jabatan: 'admin' } }),
        prisma.user.create({ data: { name: 'Apoteker Rudi', email: 'rudi@xinna.com', password: hashedPassword, jabatan: 'apoteker' } }),
        prisma.user.create({ data: { name: 'Kurir Andi', email: 'andi@xinna.com', password: hashedPassword, jabatan: 'karyawan' } }),
    ])

    // 7. Distributor
    const distributors = await Promise.all([
        prisma.distributor.create({ data: { nama_distributor: 'Kimia Farma Trading', telepon: '021-123456', alamat: 'Kawasan Industri Pulogadung' } }),
        prisma.distributor.create({ data: { nama_distributor: 'Enseval Putera', telepon: '021-654321', alamat: 'Sunter, Jakarta Utara' } }),
    ])

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
