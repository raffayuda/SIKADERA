import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

async function main() {
  const adminEmail = "admin@sikadera.id";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("Admin user created: admin@sikadera.id / admin123");
  } else {
    console.log("Admin user already exists");
  }

  const kelompokData = [
    { namaKelompok: "UPA Babakan", wilayah: "Babakan", jadwalRutin: "Jumat 19:30", deskripsi: "Kelompok pembinaan UPA wilayah Babakan" },
    { namaKelompok: "UPA Dramaga", wilayah: "Dramaga", jadwalRutin: "Kamis 20:00", deskripsi: "Kelompok pembinaan UPA wilayah Dramaga" },
    { namaKelompok: "UPA Cikarawang", wilayah: "Cikarawang", jadwalRutin: "Rabu 19:45", deskripsi: "Kelompok pembinaan UPA wilayah Cikarawang" },
    { namaKelompok: "UPA Ciherang", wilayah: "Ciherang", jadwalRutin: "Selasa 19:30", deskripsi: "Kelompok pembinaan UPA wilayah Ciherang" },
  ];

  for (const k of kelompokData) {
    const existing = await prisma.kelompokUpa.findFirst({ where: { namaKelompok: k.namaKelompok } });
    if (!existing) {
      await prisma.kelompokUpa.create({ data: k });
      console.log(`Kelompok created: ${k.namaKelompok}`);
    }
  }

  const logistikData = [
    { namaBarang: "Tenda Lipat 3x3", jumlah: 12, kondisi: "Baik" },
    { namaBarang: "Sound System Portable", jumlah: 4, kondisi: "Baik" },
    { namaBarang: "Spanduk Kegiatan", jumlah: 18, kondisi: "Cukup" },
    { namaBarang: "Kursi Lipat", jumlah: 80, kondisi: "Baik" },
    { namaBarang: "Microphone Wireless", jumlah: 6, kondisi: "Rusak" },
    { namaBarang: "Proyektor", jumlah: 3, kondisi: "Cukup" },
  ];

  for (const l of logistikData) {
    const existing = await prisma.logistik.findFirst({ where: { namaBarang: l.namaBarang } });
    if (!existing) {
      await prisma.logistik.create({ data: l });
      console.log(`Logistik created: ${l.namaBarang}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
