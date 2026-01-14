/*
  Warnings:

  - You are about to drop the column `logo_ekspedisi` on the `JenisPengiriman` table. All the data in the column will be lost.
  - You are about to alter the column `nama_ekspedisi` on the `JenisPengiriman` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to drop the column `harga` on the `Keranjang` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_order` on the `Keranjang` table. All the data in the column will be lost.
  - You are about to drop the column `url_logo` on the `MetodeBayar` table. All the data in the column will be lost.
  - You are about to drop the column `foto2` on the `Obat` table. All the data in the column will be lost.
  - You are about to drop the column `foto3` on the `Obat` table. All the data in the column will be lost.
  - You are about to drop the column `alamat2` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `foto` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `kodepos2` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `kota2` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `propinsi2` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `url_ktp` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to alter the column `kota1` on the `Pelanggan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `propinsi1` on the `Pelanggan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `kodepos1` on the `Pelanggan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(10)`.
  - You are about to alter the column `nonota` on the `Pembelian` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(25)`.
  - You are about to drop the column `bukti_foto` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `id_kurir` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `nama_kurir` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `no_invoice` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `status_kirim` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `telpon_kurir` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `tgl_kirim` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `tgl_tiba` on the `Pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan_status` on the `Penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `url_resep` on the `Penjualan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nama_distributor]` on the table `Distributor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jenis]` on the table `JenisObat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jenis_kirim]` on the table `JenisPengiriman` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[metode_pembayaran]` on the table `MetodeBayar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama_obat]` on the table `Obat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `harga_beli` to the `Keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah_beli` to the `Keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tgl_pengiriman` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pengiriman" DROP CONSTRAINT "Pengiriman_id_kurir_fkey";

-- AlterTable
ALTER TABLE "Distributor" ALTER COLUMN "nama_distributor" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "telepon" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "alamat" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "JenisObat" ALTER COLUMN "jenis" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "deskripsi_jenis" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "JenisPengiriman" DROP COLUMN "logo_ekspedisi",
ALTER COLUMN "jenis_kirim" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "nama_ekspedisi" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Keranjang" DROP COLUMN "harga",
DROP COLUMN "jumlah_order",
ADD COLUMN     "harga_beli" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "jumlah_beli" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MetodeBayar" DROP COLUMN "url_logo",
ALTER COLUMN "metode_pembayaran" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "tempat_bayar" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Obat" DROP COLUMN "foto2",
DROP COLUMN "foto3",
ALTER COLUMN "nama_obat" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Pelanggan" DROP COLUMN "alamat2",
DROP COLUMN "foto",
DROP COLUMN "kodepos2",
DROP COLUMN "kota2",
DROP COLUMN "propinsi2",
DROP COLUMN "url_ktp",
ALTER COLUMN "katakunci" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "no_telp" DROP NOT NULL,
ALTER COLUMN "no_telp" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "alamat1" DROP NOT NULL,
ALTER COLUMN "kota1" DROP NOT NULL,
ALTER COLUMN "kota1" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "propinsi1" DROP NOT NULL,
ALTER COLUMN "propinsi1" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "kodepos1" DROP NOT NULL,
ALTER COLUMN "kodepos1" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Pembelian" ALTER COLUMN "nonota" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "Pengiriman" DROP COLUMN "bukti_foto",
DROP COLUMN "id_kurir",
DROP COLUMN "nama_kurir",
DROP COLUMN "no_invoice",
DROP COLUMN "status_kirim",
DROP COLUMN "telpon_kurir",
DROP COLUMN "tgl_kirim",
DROP COLUMN "tgl_tiba",
ADD COLUMN     "id_user" BIGINT NOT NULL,
ADD COLUMN     "tgl_pengiriman" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Penjualan" DROP COLUMN "keterangan_status",
DROP COLUMN "url_resep",
ALTER COLUMN "tgl_penjualan" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Distributor_nama_distributor_key" ON "Distributor"("nama_distributor");

-- CreateIndex
CREATE UNIQUE INDEX "JenisObat_jenis_key" ON "JenisObat"("jenis");

-- CreateIndex
CREATE UNIQUE INDEX "JenisPengiriman_jenis_kirim_key" ON "JenisPengiriman"("jenis_kirim");

-- CreateIndex
CREATE UNIQUE INDEX "MetodeBayar_metode_pembayaran_key" ON "MetodeBayar"("metode_pembayaran");

-- CreateIndex
CREATE UNIQUE INDEX "Obat_nama_obat_key" ON "Obat"("nama_obat");

-- AddForeignKey
ALTER TABLE "Pengiriman" ADD CONSTRAINT "Pengiriman_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
