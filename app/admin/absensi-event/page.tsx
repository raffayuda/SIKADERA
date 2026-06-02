"use client";

import { useMemo, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  IconCamera,
  IconCheck,
  IconClock,
  IconDownload,
  IconFilter,
  IconId,
  IconQrcode,
  IconRefresh,
  IconSearch,
  IconUserCheck,
  IconUsers,
  IconWifi,
  IconX,
} from "@tabler/icons-react";

type AttendanceStatus = "Hadir" | "Manual Review" | "Ditolak" | "Izin" | "Sakit" | "Alpa";

type AttendanceItem = {
  name: string;
  memberId: string;
  village: string;
  level: string;
  scannedAt: string;
  status: AttendanceStatus;
};

const initialAttendanceData: AttendanceItem[] = [
  {
    name: "Ahmad Fauzi",
    memberId: "SKD-2026-0001",
    village: "Dramaga",
    level: "Kader Madya",
    scannedAt: "08:12 WIB",
    status: "Hadir",
  },
  {
    name: "Siti Nurhaliza",
    memberId: "SKD-2026-0002",
    village: "Babakan",
    level: "Kader Pemula",
    scannedAt: "08:14 WIB",
    status: "Hadir",
  },
  {
    name: "Dedi Kurniawan",
    memberId: "SKD-2026-0003",
    village: "Cikarawang",
    level: "Kader Penggerak",
    scannedAt: "08:18 WIB",
    status: "Manual Review",
  },
  {
    name: "Nadia Putri",
    memberId: "SKD-2026-0004",
    village: "Ciherang",
    level: "Anggota Terdaftar",
    scannedAt: "08:21 WIB",
    status: "Hadir",
  },
  {
    name: "Rizky Maulana",
    memberId: "SKD-2026-0005",
    village: "Petir",
    level: "Kader Pemula",
    scannedAt: "08:24 WIB",
    status: "Ditolak",
  },
];

const potentialMembers = [
  { id: "M-001", name: "Ahmad Fauzi", village: "Dramaga", level: "Kader Madya" },
  { id: "M-002", name: "Siti Nurhaliza", village: "Babakan", level: "Kader Pemula" },
  { id: "M-003", name: "Dedi Kurniawan", village: "Cikarawang", level: "Kader Penggerak" },
  { id: "M-004", name: "Nadia Putri", village: "Ciherang", level: "Anggota Terdaftar" },
  { id: "M-005", name: "Rizky Maulana", village: "Petir", level: "Kader Pemula" },
  { id: "M-006", name: "Maya Sari", village: "Cihideung Udik", level: "Kader Madya" },
  { id: "M-007", name: "Fajar Ramadhan", village: "Dramaga", level: "Kader Pemula" },
  { id: "M-008", name: "Putri Amelia", village: "Babakan", level: "Anggota Terdaftar" },
];

const eventOptions = [
  {
    title: "Bakti Sosial Dramaga",
    date: "28 Sep 2026",
    location: "Desa Dramaga",
    status: "Aktif",
    target: 350,
    present: 284,
  },
  {
    title: "Rapat Pleno DPC",
    date: "24 Sep 2026",
    location: "Kantor DPC Dramaga",
    status: "Selesai",
    target: 90,
    present: 76,
  },
  {
    title: "Kajian Terbuka",
    date: "20 Sep 2026",
    location: "Masjid Al-Ikhlas",
    status: "Selesai",
    target: 500,
    present: 462,
  },
];

const summaryCards = [
  {
    title: "Total Peserta",
    value: "350",
    note: "target event",
    icon: IconUsers,
    tone: "sky",
  },
  {
    title: "Sudah Hadir",
    value: "284",
    note: "scan valid",
    icon: IconUserCheck,
    tone: "emerald",
  },
  {
    title: "Manual Review",
    value: "12",
    note: "perlu validasi",
    icon: IconClock,
    tone: "amber",
  },
  {
    title: "Ditolak",
    value: "4",
    note: "QR tidak valid",
    icon: IconX,
    tone: "rose",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getToneClass(tone: string) {
  switch (tone) {
    case "emerald":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "sky":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "amber":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "rose":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStatusBadgeClass(status: AttendanceStatus) {
  switch (status) {
    case "Hadir":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Manual Review":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Ditolak":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "Izin":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "Sakit":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    case "Alpa":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function AbsensiEventPage() {
  const [search, setSearch] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(eventOptions[0]);
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>(initialAttendanceData);
  
  // Manual Input State
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualAttendance, setManualAttendance] = useState<Record<string, AttendanceStatus>>({});

  const attendanceRate = Math.round(
    (selectedEvent.present / selectedEvent.target) * 100
  );

  const filteredAttendance = useMemo(() => {
    return attendanceList.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.memberId.toLowerCase().includes(keyword) ||
        item.village.toLowerCase().includes(keyword) ||
        item.level.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [search, attendanceList]);

  const handleManualStatusChange = (memberId: string, status: AttendanceStatus) => {
    setManualAttendance(prev => ({
      ...prev,
      [memberId]: status
    }));
  };

  const handleManualSave = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;
    
    const newItems: AttendanceItem[] = Object.entries(manualAttendance).map(([memberId, status]) => {
      const member = potentialMembers.find(m => m.id === memberId);
      return {
        name: member?.name || "Unknown",
        memberId: memberId,
        village: member?.village || "-",
        level: member?.level || "-",
        scannedAt: timeStr,
        status: status,
      };
    });
    
    // Add only those that were updated and not already labled as "Hadir" in attendanceList
    // (Simplification: just prepend all selected manual entries)
    setAttendanceList(prev => [...newItems, ...prev]);
    setIsManualOpen(false);
    setManualAttendance({});
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${getToneClass(
                    card.tone
                  )}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">
                    {card.title}
                  </p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">
                    {card.value}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {card.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-8">
          <CardHeader className="flex flex-col gap-3 p-4 pb-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Scanner QR KTA Digital
              </CardTitle>
              <CardDescription className="text-xs">
                Arahkan kamera ke QR Code pada KTA digital anggota.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={
                  scannerActive
                    ? "rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300"
                    : "rounded-xl border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] text-rose-300"
                }
              >
                <IconWifi className="mr-1 h-3.5 w-3.5" />
                {scannerActive ? "Scanner Aktif" : "Scanner Nonaktif"}
              </Badge>

              <Badge
                variant="outline"
                className="rounded-xl border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-300"
              >
                Kamera Laptop / HP
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="relative min-h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.13),transparent_45%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center rounded-[32px] border border-emerald-400/40 bg-zinc-950/70 shadow-[0_0_80px_rgba(16,185,129,0.16)]">
                    <div className="absolute left-5 top-5 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-emerald-300" />
                    <div className="absolute right-5 top-5 h-12 w-12 rounded-tr-2xl border-r-2 border-t-2 border-emerald-300" />
                    <div className="absolute bottom-5 left-5 h-12 w-12 rounded-bl-2xl border-b-2 border-l-2 border-emerald-300" />
                    <div className="absolute bottom-5 right-5 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-emerald-300" />

                    {scannerActive ? (
                      <>
                        <div className="absolute left-8 right-8 top-1/2 h-px bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.9)]" />
                        <div className="absolute inset-x-10 top-1/2 h-24 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-2xl" />
                      </>
                    ) : null}

                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        {scannerActive ? (
                          <IconCamera className="h-8 w-8 text-emerald-300" />
                        ) : (
                          <IconQrcode className="h-8 w-8 text-zinc-500" />
                        )}
                      </div>

                      <p className="mt-4 text-sm font-semibold text-zinc-100">
                        {scannerActive
                          ? "Menunggu QR Code..."
                          : "Scanner belum aktif"}
                      </p>

                      <p className="mt-1 max-w-[240px] text-xs leading-5 text-zinc-500">
                        {scannerActive
                          ? "Pastikan QR Code KTA berada di dalam area kotak scanner."
                          : "Klik tombol Buka Scanner untuk mulai mencatat presensi."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-3 backdrop-blur-xl">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">
                        {selectedEvent.title}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        {selectedEvent.date} • {selectedEvent.location}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setScannerActive((prev) => !prev)}
                      className={
                        scannerActive
                          ? "h-8 rounded-xl border border-rose-400/40 bg-rose-400/15 px-3 text-xs text-rose-100 hover:bg-rose-400/25"
                          : "h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-3 text-xs text-emerald-100 hover:bg-emerald-400/25"
                      }
                    >
                      {scannerActive ? "Matikan" : "Mulai Scan"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="rounded-2xl border-white/10 bg-zinc-950/50">
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Event Aktif
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Pilih event untuk presensi.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 p-4 pt-0">
                    {eventOptions.map((event) => {
                      const isActive =
                        selectedEvent.title === event.title;

                      return (
                        <button
                          key={event.title}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className={[
                            "w-full rounded-2xl border p-3 text-left transition",
                            isActive
                              ? "border-emerald-500/40 bg-emerald-500/10"
                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-zinc-100">
                                {event.title}
                              </p>
                              <p className="mt-1 text-[11px] text-zinc-500">
                                {event.date}
                              </p>
                            </div>

                            <Badge
                              variant="outline"
                              className={
                                event.status === "Aktif"
                                  ? "rounded-lg border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-[10px] text-emerald-300"
                                  : "rounded-lg border-white/10 bg-white/5 px-2 py-0 text-[10px] text-zinc-300"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>

                          <div className="mt-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-500">
                                Kehadiran
                              </span>
                              <span className="font-medium text-zinc-200">
                                {event.present}/{event.target}
                              </span>
                            </div>
                            <Progress
                              value={(event.present / event.target) * 100}
                              className="h-1.5 bg-white/5"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-white/10 bg-zinc-950/50">
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Progress Kehadiran
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 p-4 pt-0">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-semibold tracking-tight text-zinc-50">
                          {attendanceRate}%
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {selectedEvent.present} dari{" "}
                          {selectedEvent.target} target peserta
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                        <IconCheck className="h-6 w-6 text-emerald-300" />
                      </div>
                    </div>

                    <Progress
                      value={attendanceRate}
                      className="h-2 bg-white/5"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                        <p className="text-[10px] text-zinc-500">
                          Hadir
                        </p>
                        <p className="text-sm font-semibold text-emerald-300">
                          284
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                        <p className="text-[10px] text-zinc-500">
                          Review
                        </p>
                        <p className="text-sm font-semibold text-amber-300">
                          12
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                        <p className="text-[10px] text-zinc-500">
                          Ditolak
                        </p>
                        <p className="text-sm font-semibold text-rose-300">
                          4
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Presensi Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              Data hasil scan QR Code secara realtime.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-4 pt-0">
            <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
              <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                placeholder="Cari nama, ID, desa..."
              />
            </div>

            <div className="sidebar-scroll max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {filteredAttendance.map((item) => (
                <div
                  key={`${item.memberId}-${item.scannedAt}`}
                  className="rounded-2xl border border-white/10 bg-zinc-950/40 p-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://picsum.photos/seed/${item.name}/64/64`}
                        alt={item.name}
                      />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-zinc-100">
                            {item.name}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                            {item.memberId}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={`shrink-0 rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Desa
                          </p>
                          <p className="truncate text-[11px] font-medium text-zinc-200">
                            {item.village}
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Jenjang
                          </p>
                          <p className="truncate text-[11px] font-medium text-zinc-200">
                            {item.level}
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Scan
                          </p>
                          <p className="truncate text-[11px] font-medium text-zinc-200">
                            {item.scannedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setIsManualOpen(true)}
              className="h-9 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
            >
              <IconId className="mr-1.5 h-3.5 w-3.5" />
              Input Manual
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-8">
          <CardHeader className="p-4 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Validasi Presensi
                </CardTitle>
                <CardDescription className="text-xs">
                  Data scan yang perlu diperiksa ulang oleh admin.
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
              >
                <IconFilter className="mr-1.5 h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-4 pt-0">
            {attendanceList
              .filter((item) => item.status === "Manual Review" || item.status === "Ditolak")
              .map((item) => (
                <div
                  key={`${item.memberId}-${item.scannedAt}`}
                  className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://picsum.photos/seed/${item.name}/64/64`}
                          alt={item.name}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(item.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-sm font-semibold text-zinc-100">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {item.memberId} • {item.village} •{" "}
                          {item.scannedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </Badge>

                      <Button
                        size="sm"
                        className="h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-3 text-xs text-emerald-100 hover:bg-emerald-400/25"
                      >
                        Terima
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-xl border-rose-400/40 bg-rose-400/10 px-3 text-xs text-rose-200 hover:bg-rose-400/20"
                      >
                        Tolak
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Catatan Sistem
            </CardTitle>
            <CardDescription className="text-xs">
              Rekomendasi operasional presensi.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-4 pt-0">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xs font-medium text-emerald-200">
                Scanner berjalan normal
              </p>
              <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                Presensi QR dapat digunakan untuk mencatat kehadiran event
                secara cepat.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-xs font-medium text-amber-200">
                12 scan perlu review
              </p>
              <p className="mt-1 text-[11px] leading-5 text-amber-100/70">
                Data ini bisa terjadi karena QR buram, anggota belum
                aktif, atau koneksi sempat terputus.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3">
              <p className="text-xs font-medium text-sky-200">
                Hindari absensi ganda
              </p>
              <p className="mt-1 text-[11px] leading-5 text-sky-100/70">
                Pastikan satu QR hanya dapat digunakan sekali pada event
                yang sama.
              </p>
            </div>

            <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
              Simpan Rekap Presensi
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Manual Input Modal (Jadwal UPA Style) */}
      <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Input Presensi Manual</DialogTitle>
            <DialogDescription>
              Pilih status kehadiran untuk anggota pada event <strong>{selectedEvent.title}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 max-h-[400px] overflow-y-auto pr-2 sidebar-scroll border border-white/10 rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent bg-white/5">
                  <TableHead className="text-zinc-300">Nama Anggota</TableHead>
                  <TableHead className="text-zinc-300">Desa/Jenjang</TableHead>
                  <TableHead className="text-right text-zinc-300">Status Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {potentialMembers.map((member) => (
                  <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="py-3">
                      <p className="text-xs font-medium text-zinc-200">{member.name}</p>
                      <p className="text-[10px] text-zinc-500">{member.id}</p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-[11px] text-zinc-400">{member.village}</p>
                      <p className="text-[10px] text-zinc-500">{member.level}</p>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {(["Hadir", "Izin", "Sakit", "Alpa"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleManualStatusChange(member.id, status)}
                            className={`px-2 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                              manualAttendance[member.id] === status
                                ? status === "Hadir" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                : status === "Izin" ? "bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                                : status === "Sakit" ? "bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                                : "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                                : "bg-zinc-900/50 border-white/5 text-zinc-600 hover:border-white/20"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsManualOpen(false);
              setManualAttendance({});
            }}>
              Batal
            </Button>
            <Button onClick={handleManualSave} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Simpan Presensi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
