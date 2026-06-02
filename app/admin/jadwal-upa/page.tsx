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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconCalendar,
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDots,
  IconDownload,
  IconEdit,
  IconFilter,
  IconMapPin,
  IconPlus,
  IconSearch,
  IconUsers,
  IconCheck,
  IconClipboardCheck,
} from "@tabler/icons-react";

type ScheduleStatus = "Terjadwal" | "Selesai" | "Dibatalkan";
type AttendanceStatus = "Baik" | "Cukup" | "Rendah";

interface UpaSchedule {
  id: string;
  group: string;
  mentor: string;
  village: string;
  location: string;
  date: string;
  day: string;
  time: string;
  topic: string;
  material: string;
  totalMembers: number;
  expectedAttendance: number;
  attendanceRate: number;
  status: ScheduleStatus;
  attendanceStatus: AttendanceStatus;
}

interface UpaMember {
  id: string;
  name: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
}

const initialSchedules: UpaSchedule[] = [
  {
    id: "UPA-001",
    group: "UPA Babakan",
    mentor: "Ust. Hamdan",
    village: "Babakan",
    location: "Masjid Al-Ikhlas Babakan",
    date: "22 Sep 2026",
    day: "Selasa",
    time: "19:30 WIB",
    topic: "Adab Menuntut Ilmu",
    material: "Kitab Ta'lim Muta'allim",
    totalMembers: 12,
    expectedAttendance: 10,
    attendanceRate: 85.4,
    status: "Terjadwal",
    attendanceStatus: "Baik",
  },
  {
    id: "UPA-002",
    group: "UPA Dramaga",
    mentor: "Ust. Farid",
    village: "Dramaga",
    location: "Kantor DPC Dramaga",
    date: "23 Sep 2026",
    day: "Rabu",
    time: "20:00 WIB",
    topic: "Tafsir Surat Al-Hujurat",
    material: "Tafsir Ringkas",
    totalMembers: 15,
    expectedAttendance: 12,
    attendanceRate: 80.7,
    status: "Terjadwal",
    attendanceStatus: "Baik",
  },
  {
    id: "UPA-003",
    group: "UPA Cikarawang",
    mentor: "Ust. Anwar",
    village: "Cikarawang",
    location: "Mushola Al-Falah",
    date: "24 Sep 2026",
    day: "Kamis",
    time: "19:45 WIB",
    topic: "Sirah Nabawiyah",
    material: "Sirah Rasulullah",
    totalMembers: 10,
    expectedAttendance: 8,
    attendanceRate: 75.6,
    status: "Terjadwal",
    attendanceStatus: "Baik",
  },
];

const dummyMembers: UpaMember[] = [
  { id: "1", name: "Ahmad Fauzi", status: "Hadir" },
  { id: "2", name: "Siti Nurhaliza", status: "Hadir" },
  { id: "3", name: "Dedi Kurniawan", status: "Hadir" },
  { id: "4", name: "Nadia Putri", status: "Izin" },
  { id: "5", name: "Rizky Pratama", status: "Hadir" },
  { id: "6", name: "Maya Sari", status: "Sakit" },
  { id: "7", name: "Fajar Ramadhan", status: "Hadir" },
  { id: "8", name: "Putri Amelia", status: "Alpa" },
];

const summaryCards = [
  {
    title: "Jadwal Bulan Ini",
    value: "42",
    note: "pertemuan UPA",
    icon: IconCalendarEvent,
    tone: "emerald",
  },
  {
    title: "Terjadwal Pekan Ini",
    value: "12",
    note: "belum berlangsung",
    icon: IconCalendar,
    tone: "sky",
  },
  {
    title: "Rata-rata Kehadiran",
    value: "76.4%",
    note: "estimasi bulan ini",
    icon: IconUsers,
    tone: "emerald",
  },
  {
    title: "Perlu Reschedule",
    value: "4",
    note: "jadwal konflik",
    icon: IconClock,
    tone: "amber",
  },
];

const calendarDays = [
  { day: "Sen", date: "21", items: ["UPA Petir"] },
  { day: "Sel", date: "22", items: ["UPA Babakan"] },
  { day: "Rab", date: "23", items: ["UPA Dramaga"] },
  { day: "Kam", date: "24", items: ["UPA Cikarawang", "UPA Ciherang"] },
  { day: "Jum", date: "25", items: ["UPA Cihideung Udik"] },
  { day: "Sab", date: "26", items: [] },
  { day: "Ahad", date: "27", items: ["UPA Margajaya"] },
];

const tabs = [
  { label: "Semua", value: "all", count: "42" },
  { label: "Terjadwal", value: "Terjadwal", count: "31" },
  { label: "Selesai", value: "Selesai", count: "9" },
  { label: "Dibatalkan", value: "Dibatalkan", count: "2" },
];

function getInitials(name: string) {
  return name
    .replace("Ust.", "")
    .trim()
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

function getStatusBadgeClass(status: ScheduleStatus) {
  switch (status) {
    case "Terjadwal":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "Selesai":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Dibatalkan":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getAttendanceBadgeClass(status: AttendanceStatus) {
  switch (status) {
    case "Baik":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Cukup":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Rendah":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getAttendanceColor(value: number) {
  if (value >= 75) return "text-emerald-300";
  if (value >= 60) return "text-amber-300";
  return "text-rose-300";
}

export default function JadwalUpaPage() {
  const [schedulesList, setSchedulesList] = useState<UpaSchedule[]>(initialSchedules);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Attendance Dialog states
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<UpaSchedule | null>(null);
  const [attendanceData, setAttendanceData] = useState<UpaMember[]>(dummyMembers);

  const filteredSchedules = useMemo(() => {
    return schedulesList.filter((schedule) => {
      const matchTab = activeTab === "all" || schedule.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        schedule.group.toLowerCase().includes(keyword) ||
        schedule.mentor.toLowerCase().includes(keyword) ||
        schedule.village.toLowerCase().includes(keyword) ||
        schedule.location.toLowerCase().includes(keyword) ||
        schedule.topic.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, search, schedulesList]);

  const handleAttendanceStatusChange = (id: string, status: UpaMember["status"]) => {
    setAttendanceData(attendanceData.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleSaveAttendance = () => {
    if (!selectedSchedule) return;

    // Update schedule status to Selesai and update attendance rate
    const presentCount = attendanceData.filter(m => m.status === "Hadir").length;
    const rate = Math.round((presentCount / selectedSchedule.totalMembers) * 100);

    setSchedulesList(schedulesList.map(s => s.id === selectedSchedule.id ? {
      ...s,
      status: "Selesai" as ScheduleStatus,
      expectedAttendance: presentCount,
      attendanceRate: rate,
      attendanceStatus: rate >= 75 ? "Baik" : rate >= 60 ? "Cukup" : "Rendah"
    } : s));

    setIsAttendanceOpen(false);
    setSelectedSchedule(null);
  };

  const openAttendance = (schedule: UpaSchedule) => {
    setSelectedSchedule(schedule);
    // Reset attendance data for this session or load existing
    setAttendanceData(dummyMembers.slice(0, schedule.totalMembers));
    setIsAttendanceOpen(true);
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
          <CardHeader className="p-4 pb-3">
            <div className="grid gap-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari jadwal, UPA, murabbi, materi..."
                />
              </div>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Desa</option>
                <option>Babakan</option>
                <option>Dramaga</option>
                <option>Cikarawang</option>
                <option>Ciherang</option>
                <option>Petir</option>
              </select>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>September 2026</option>
                <option>Oktober 2026</option>
                <option>November 2026</option>
              </select>

              <Button
                variant="outline"
                className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
              >
                <IconFilter className="mr-1.5 h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
              <div className="flex flex-wrap gap-2 p-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;

                  return (
                    <Button
                      key={tab.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab(tab.value)}
                      className={[
                        "h-8 rounded-xl px-3 text-xs font-medium",
                        isActive
                          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      {tab.label}
                      <span className="ml-1 text-[11px] opacity-70">
                        ({tab.count})
                      </span>
                    </Button>
                  );
                })}
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3 p-3">
                {filteredSchedules.map((schedule) => (
                  <Card
                    key={schedule.id}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-zinc-100">
                              {schedule.group}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                schedule.status
                              )}`}
                            >
                              {schedule.status}
                            </Badge>

                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getAttendanceBadgeClass(
                                schedule.attendanceStatus
                              )}`}
                            >
                              Kehadiran {schedule.attendanceStatus}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {schedule.topic} • {schedule.material}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          {schedule.status !== "Selesai" && (
                            <Button
                              onClick={() => openAttendance(schedule)}
                              className="h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-3 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
                            >
                              <IconCheck className="mr-1.5 h-3.5 w-3.5" />
                              Input Absensi
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                              >
                                <IconDots className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right">
                              <DropdownMenuItem>
                                <IconEdit className="mr-2 h-3.5 w-3.5" />
                                Edit Jadwal
                              </DropdownMenuItem>
                              {schedule.status === "Selesai" && (
                                <DropdownMenuItem onClick={() => openAttendance(schedule)}>
                                  <IconClipboardCheck className="mr-2 h-3.5 w-3.5" />
                                  Edit Absensi
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem variant="destructive">
                                <IconDownload className="mr-2 h-3.5 w-3.5" />
                                Batalkan Jadwal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconCalendarEvent className="h-3.5 w-3.5" />
                            Tanggal
                          </div>
                          <p className="mt-1 text-xs font-medium text-zinc-200">
                            {schedule.day}, {schedule.date}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconClock className="h-3.5 w-3.5" />
                            Waktu
                          </div>
                          <p className="mt-1 text-xs font-medium text-zinc-200">
                            {schedule.time}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconMapPin className="h-3.5 w-3.5" />
                            Lokasi
                          </div>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {schedule.location}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconUsers className="h-3.5 w-3.5" />
                            {schedule.status === "Selesai" ? "Hadir" : "Estimasi Hadir"}
                          </div>
                          <p className="mt-1 text-xs font-medium text-zinc-200">
                            {schedule.expectedAttendance}/
                            {schedule.totalMembers} anggota
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`https://picsum.photos/seed/${schedule.mentor}/64/64`}
                            alt={schedule.mentor}
                          />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(schedule.mentor)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-zinc-100">
                            {schedule.mentor}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500">
                            Murabbi • {schedule.village}
                          </p>
                        </div>

                        <div className="w-40 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">
                              Kehadiran
                            </span>
                            <span
                              className={`font-semibold ${getAttendanceColor(
                                schedule.attendanceRate
                              )}`}
                            >
                              {schedule.attendanceRate}%
                            </span>
                          </div>

                          <Progress
                            value={schedule.attendanceRate}
                            className="h-1.5 bg-white/5"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-3">
                <p className="text-xs text-zinc-500">
                  Menampilkan{" "}
                  <span className="text-zinc-300">
                    {filteredSchedules.length}
                  </span>{" "}
                  dari <span className="text-zinc-300">42</span> jadwal
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Kalender Pekan Ini
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Ringkasan jadwal 21 - 27 Sep 2026.
                  </CardDescription>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5"
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5"
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-2 p-4 pt-0">
              {calendarDays.map((item) => (
                <div
                  key={item.date}
                  className="rounded-2xl border border-white/10 bg-zinc-950/40 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <span className="text-[10px] text-zinc-500">
                        {item.day}
                      </span>
                      <span className="text-sm font-semibold text-zinc-100">
                        {item.date}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      {item.items.length > 0 ? (
                        <div className="space-y-1.5">
                          {item.items.map((agenda) => (
                            <div
                              key={agenda}
                              className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2"
                            >
                              <p className="truncate text-xs font-medium text-emerald-200">
                                {agenda}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="pt-2 text-xs text-zinc-500">
                          Tidak ada jadwal
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Evaluasi Jadwal
              </CardTitle>
              <CardDescription className="text-xs">
                Catatan otomatis dari jadwal UPA.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-xs font-medium text-emerald-200">
                  31 jadwal sudah tersusun
                </p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Mayoritas kelompok sudah memiliki jadwal pembinaan untuk
                  bulan berjalan.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-xs font-medium text-amber-200">
                  4 jadwal perlu ditinjau ulang
                </p>
                <p className="mt-1 text-[11px] leading-5 text-amber-100/70">
                  Terdapat potensi bentrok jadwal dan kelompok dengan
                  estimasi kehadiran rendah.
                </p>
              </div>

              <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                Buat Rekap Jadwal
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Input Absensi UPA</DialogTitle>
            <DialogDescription>
              Catat kehadiran anggota untuk <strong>{selectedSchedule?.group}</strong> pada {selectedSchedule?.date}.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 max-h-[400px] overflow-y-auto pr-2 sidebar-scroll">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-zinc-300">Nama Anggota</TableHead>
                  <TableHead className="text-right text-zinc-300">Status Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((member) => (
                  <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="py-3 text-xs font-medium text-zinc-200">
                      {member.name}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {(["Hadir", "Izin", "Sakit", "Alpa"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleAttendanceStatusChange(member.id, status)}
                            className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                              member.status === status
                                ? status === "Hadir" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                                : status === "Izin" ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                                : status === "Sakit" ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                : "bg-rose-500/20 border-rose-500/50 text-rose-300"
                                : "bg-zinc-900/50 border-white/10 text-zinc-500 hover:border-white/20"
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
            <Button variant="outline" onClick={() => setIsAttendanceOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveAttendance} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Simpan Absensi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}