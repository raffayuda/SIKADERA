"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

// Dummy data for members
const members = [
  { id: "1", name: "Ahmad Fauzi", role: "Ketua", status: "Aktif", level: "Madya", attendance: 92 },
  { id: "2", name: "Siti Nurhaliza", role: "Sekretaris", status: "Aktif", level: "Dasar", attendance: 88 },
  { id: "3", name: "Dedi Kurniawan", role: "Anggota", status: "Aktif", level: "Muda", attendance: 75 },
  { id: "4", name: "Nadia Putri", role: "Anggota", status: "Aktif", level: "Dasar", attendance: 82 },
  { id: "5", name: "Rizky Pratama", role: "Anggota", status: "Aktif", level: "Madya", attendance: 95 },
];

const attendanceHistory = [
  { date: "16 Sep 2026", topic: "Adab Menuntut Ilmu", rate: 85.4, present: 10, total: 12 },
  { date: "09 Sep 2026", topic: "Keutamaan Silaturahmi", rate: 91.6, present: 11, total: 12 },
  { date: "02 Sep 2026", topic: "Manajemen Waktu", rate: 75.0, present: 9, total: 12 },
  { date: "26 Agu 2026", topic: "Tafsir Al-Fatihah", rate: 100, present: 12, total: 12 },
];

export default function UpaDetailPage() {
  const { id } = useParams();
  
  // In a real app, we'd fetch the group data by ID
  const groupName = (id as string)?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "UPA Detail";

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" asChild className="h-8 rounded-xl px-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
          <Link href="/admin/kelompok-upa">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left Column: Group Info */}
        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-3 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <IconUsers className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-zinc-50">{groupName}</CardTitle>
              <CardDescription className="text-xs">Terdaftar sejak Jan 2024</CardDescription>
              <div className="mt-2 flex justify-center">
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  Status: Aktif
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-2">
              <Separator className="bg-white/10" />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconUser className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Murabbi</p>
                    <p className="truncate text-sm font-medium text-zinc-200">Ust. Hamdan</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconPhone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Telepon</p>
                    <p className="truncate text-sm font-medium text-zinc-200">0812-1100-2201</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconCalendarEvent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Jadwal</p>
                    <p className="truncate text-sm font-medium text-zinc-200">Jumat, 19:30 WIB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconMapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Lokasi</p>
                    <p className="truncate text-sm font-medium text-zinc-200">Masjid Al-Ikhlas Babakan</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Persentase Kehadiran</span>
                  <span className="font-semibold text-emerald-300">85.4%</span>
                </div>
                <Progress value={85.4} className="h-1.5 bg-white/5" />
                <p className="text-[10px] text-center text-zinc-500">Berdasarkan 12 pertemuan terakhir</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Statistik Kelompok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total Anggota</p>
                  <p className="text-xl font-bold text-zinc-100">12</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Kader Aktif</p>
                  <p className="text-xl font-bold text-emerald-400">10</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Tingkat Keaktifan</p>
                  <Badge className="text-[9px] h-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Tinggi</Badge>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="flex-1 bg-emerald-500 rounded-full" />
                  <div className="flex-1 bg-emerald-500 rounded-full" />
                  <div className="flex-1 bg-emerald-500 rounded-full" />
                  <div className="flex-1 bg-zinc-800 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Members and History */}
        <div className="space-y-4 xl:col-span-8">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-zinc-50">Daftar Anggota</CardTitle>
                  <CardDescription className="text-xs">Kelola and lihat data anggota kelompok ini.</CardDescription>
                </div>
                <Button size="sm" className="h-8 rounded-xl bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/25">
                  <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                  Tambah
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5 hover:bg-white/5">
                      <TableHead className="text-xs text-zinc-300">Nama</TableHead>
                      <TableHead className="text-xs text-zinc-300">Peran</TableHead>
                      <TableHead className="text-xs text-zinc-300">Jenjang</TableHead>
                      <TableHead className="text-xs text-zinc-300 text-right">Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id} className="border-white/10 hover:bg-white/[0.03]">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-7 w-7 text-[10px]">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-zinc-200">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            member.role === "Ketua" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                          }`}>
                            {member.role}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-[10px] text-zinc-400">{member.level}</span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className={`text-xs font-semibold ${member.attendance >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {member.attendance}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-zinc-50">Riwayat Pertemuan</CardTitle>
              <CardDescription className="text-xs">Catatan 4 pertemuan terakhir.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/[0.08]">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-zinc-950/50">
                      <IconCalendarEvent className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs font-semibold text-zinc-100">{item.topic}</p>
                        <span className="text-[10px] text-zinc-500">{item.date}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className={`h-1.5 w-1.5 rounded-full ${item.rate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-[10px] text-zinc-400">{item.present}/{item.total} Hadir ({item.rate}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
