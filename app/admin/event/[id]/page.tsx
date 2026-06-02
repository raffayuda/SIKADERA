"use client";

import { useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconClock,
  IconMapPin,
  IconUsers,
  IconWorld,
  IconLock,
} from "@tabler/icons-react";

// Dummy participants data
const participants = [
  { id: "M-001", name: "Ahmad Fauzi", village: "Dramaga", level: "Kader Madya", registeredAt: "15 Sep 2026", status: "Hadir" },
  { id: "M-002", name: "Siti Nurhaliza", village: "Babakan", level: "Kader Pemula", registeredAt: "15 Sep 2026", status: "Hadir" },
  { id: "M-003", name: "Dedi Kurniawan", village: "Cikarawang", level: "Kader Penggerak", registeredAt: "16 Sep 2026", status: "Manual Review" },
  { id: "M-004", name: "Nadia Putri", village: "Ciherang", level: "Anggota Terdaftar", registeredAt: "17 Sep 2026", status: "Hadir" },
  { id: "M-005", name: "Rizky Maulana", village: "Petir", level: "Kader Pemula", registeredAt: "18 Sep 2026", status: "Ditolak" },
];

export default function EventDetailPage() {
  const { id } = useParams();

  // Mock fetching event data based on ID
  const event = {
    id: id as string,
    title: "Bakti Sosial Dramaga",
    description: "Kegiatan publik untuk masyarakat sekitar dalam rangka memperingati Milad DPC Dramaga.",
    date: "28 Sep 2026",
    time: "08:00 WIB",
    location: "Desa Dramaga",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15854.801646271!2d106.7212001!3d-6.5594953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c4b786c28f73%3A0x401576d1419cdd0!2sDramaga%2C%20Bogor%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1717140000000!5m2!1sen!2sid",
    type: "Publik",
    status: "Terjadwal",
    targetParticipants: 350,
    registeredParticipants: 284,
  };

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" asChild className="h-8 rounded-xl px-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
          <Link href="/admin/event">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Event Info */}
        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-3 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                {event.type === "Publik" ? <IconWorld className="h-8 w-8" /> : <IconLock className="h-8 w-8" />}
              </div>
              <CardTitle className="text-xl font-bold text-zinc-50">{event.title}</CardTitle>
              <CardDescription className="text-xs">{event.description}</CardDescription>
              <div className="mt-2 flex justify-center gap-2">
                <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-300">
                  {event.status}
                </Badge>
                <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-400">
                  {event.type}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-2">
              <Separator className="bg-white/10" />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconCalendarEvent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Tanggal</p>
                    <p className="truncate text-sm font-medium text-zinc-200">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconClock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Waktu</p>
                    <p className="truncate text-sm font-medium text-zinc-200">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconMapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Lokasi</p>
                    <p className="truncate text-sm font-medium text-zinc-200">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconUsers className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Peserta Terdaftar</p>
                    <p className="truncate text-sm font-medium text-zinc-200">{event.registeredParticipants} / {event.targetParticipants}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950/50 aspect-video">
                <iframe
                  src={event.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Members Table */}
        <div className="space-y-4 xl:col-span-8">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-zinc-50">Peserta Terdaftar</CardTitle>
                  <CardDescription className="text-xs">Daftar anggota yang telah mendaftar di event ini.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5 hover:bg-white/5">
                      <TableHead className="text-xs text-zinc-300">Nama</TableHead>
                      <TableHead className="text-xs text-zinc-300">Wilayah</TableHead>
                      <TableHead className="text-xs text-zinc-300">Jenjang</TableHead>
                      <TableHead className="text-xs text-zinc-300 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p) => (
                      <TableRow key={p.id} className="border-white/10 hover:bg-white/[0.03]">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-7 w-7 text-[10px]">
                              <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium text-zinc-200">{p.name}</p>
                              <p className="text-[10px] text-zinc-500">{p.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-[10px] text-zinc-400">{p.village}</span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-[10px] text-zinc-400">{p.level}</span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Badge variant="outline" className={`text-[10px] ${
                            p.status === "Hadir" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                            p.status === "Manual Review" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                            "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
