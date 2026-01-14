-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('Menunggu_Konfirmasi', 'Diproses', 'Menunggu_Kurir', 'Dibatalkan_Pembeli', 'Dibatalkan_Penjual', 'Bermasalah', 'Selesai');

-- CreateEnum
CREATE TYPE "Jabatan" AS ENUM ('admin', 'apoteker', 'karyawan', 'kasir', 'pemilik');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "password" VARCHAR(255) NOT NULL,
    "remember_token" VARCHAR(100),
    "jabatan" "Jabatan" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelanggan" (
    "id" BIGSERIAL NOT NULL,
    "nama_pelanggan" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "katakunci" VARCHAR(15) NOT NULL,
    "no_telp" VARCHAR(15) NOT NULL,
    "alamat1" VARCHAR(255) NOT NULL,
    "kota1" VARCHAR(255) NOT NULL,
    "propinsi1" VARCHAR(255) NOT NULL,
    "kodepos1" VARCHAR(255) NOT NULL,
    "alamat2" VARCHAR(255),
    "kota2" VARCHAR(255),
    "propinsi2" VARCHAR(255),
    "kodepos2" VARCHAR(255),
    "foto" VARCHAR(255),
    "url_ktp" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obat" (
    "id" BIGSERIAL NOT NULL,
    "nama_obat" VARCHAR(100) NOT NULL,
    "id_jenis_obat" BIGINT NOT NULL,
    "harga_jual" DOUBLE PRECISION NOT NULL,
    "deskripsi_obat" TEXT,
    "foto1" VARCHAR(255),
    "foto2" VARCHAR(255),
    "foto3" VARCHAR(255),
    "stok" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisObat" (
    "id" BIGSERIAL NOT NULL,
    "jenis" VARCHAR(50) NOT NULL,
    "deskripsi_jenis" VARCHAR(255),
    "image_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisObat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penjualan" (
    "id" BIGSERIAL NOT NULL,
    "id_metode_bayar" BIGINT NOT NULL,
    "tgl_penjualan" DATE NOT NULL,
    "url_resep" VARCHAR(255),
    "ongkos_kirim" DOUBLE PRECISION NOT NULL,
    "biaya_app" DOUBLE PRECISION NOT NULL,
    "total_bayar" DOUBLE PRECISION NOT NULL,
    "status_order" "StatusOrder" NOT NULL,
    "keterangan_status" VARCHAR(255),
    "id_jenis_kirim" BIGINT NOT NULL,
    "id_pelanggan" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPenjualan" (
    "id" BIGSERIAL NOT NULL,
    "id_penjualan" BIGINT NOT NULL,
    "id_obat" BIGINT NOT NULL,
    "jumlah_beli" INTEGER NOT NULL,
    "harga_beli" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailPenjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetodeBayar" (
    "id" BIGSERIAL NOT NULL,
    "metode_pembayaran" VARCHAR(30) NOT NULL,
    "tempat_bayar" VARCHAR(50) NOT NULL,
    "no_rekening" VARCHAR(25) NOT NULL,
    "url_logo" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetodeBayar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisPengiriman" (
    "id" BIGSERIAL NOT NULL,
    "jenis_kirim" VARCHAR(50) NOT NULL,
    "nama_ekspedisi" VARCHAR(255) NOT NULL,
    "logo_ekspedisi" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisPengiriman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengiriman" (
    "id" BIGSERIAL NOT NULL,
    "id_penjualan" BIGINT NOT NULL,
    "no_invoice" VARCHAR(255) NOT NULL,
    "tgl_kirim" TIMESTAMP(3),
    "tgl_tiba" TIMESTAMP(3),
    "status_kirim" VARCHAR(255),
    "nama_kurir" VARCHAR(30),
    "telpon_kurir" VARCHAR(15),
    "bukti_foto" VARCHAR(255),
    "keterangan" TEXT,
    "id_kurir" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengiriman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keranjang" (
    "id" BIGSERIAL NOT NULL,
    "id_pelanggan" BIGINT NOT NULL,
    "id_obat" BIGINT NOT NULL,
    "jumlah_order" DOUBLE PRECISION NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keranjang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembelian" (
    "id" BIGSERIAL NOT NULL,
    "nonota" VARCHAR(100) NOT NULL,
    "tgl_pembelian" DATE NOT NULL,
    "total_bayar" DOUBLE PRECISION NOT NULL,
    "id_distributor" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPembelian" (
    "id" BIGSERIAL NOT NULL,
    "id_obat" BIGINT NOT NULL,
    "jumlah_beli" INTEGER NOT NULL,
    "harga_beli" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "id_pembelian" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distributor" (
    "id" BIGSERIAL NOT NULL,
    "nama_distributor" VARCHAR(50) NOT NULL,
    "telepon" VARCHAR(15) NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_email_key" ON "Pelanggan"("email");

-- AddForeignKey
ALTER TABLE "Obat" ADD CONSTRAINT "Obat_id_jenis_obat_fkey" FOREIGN KEY ("id_jenis_obat") REFERENCES "JenisObat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_id_metode_bayar_fkey" FOREIGN KEY ("id_metode_bayar") REFERENCES "MetodeBayar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_id_jenis_kirim_fkey" FOREIGN KEY ("id_jenis_kirim") REFERENCES "JenisPengiriman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_id_penjualan_fkey" FOREIGN KEY ("id_penjualan") REFERENCES "Penjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_id_obat_fkey" FOREIGN KEY ("id_obat") REFERENCES "Obat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengiriman" ADD CONSTRAINT "Pengiriman_id_penjualan_fkey" FOREIGN KEY ("id_penjualan") REFERENCES "Penjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengiriman" ADD CONSTRAINT "Pengiriman_id_kurir_fkey" FOREIGN KEY ("id_kurir") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_id_obat_fkey" FOREIGN KEY ("id_obat") REFERENCES "Obat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembelian" ADD CONSTRAINT "Pembelian_id_distributor_fkey" FOREIGN KEY ("id_distributor") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_id_pembelian_fkey" FOREIGN KEY ("id_pembelian") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_id_obat_fkey" FOREIGN KEY ("id_obat") REFERENCES "Obat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
