"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  IconCalendarEvent,
  IconChevronRight,
  IconClock,
  IconDots,
  IconDownload,
  IconEdit,
  IconFilter,
  IconMapPin,
  IconPlus,
  IconSearch,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";

type UpaStatus = "Aktif" | "Perlu Perhatian" | "Tidak Aktif";

interface UpaGroup {
  id: string;
  name: string;
  mentor: string;
  mentorPhone: string;
  village: string;
  location: string;
  day: string;
  time: string;
  totalMembers: number;
  activeMembers: number;
  attendance: number;
  lastMeeting: string;
  material: string;
  status: UpaStatus;
}

const initialUpaGroups: UpaGroup[] = [
  {
    id: "upa-babakan",
    name: "UPA Babakan",
    mentor: "Ust. Hamdan",
    mentorPhone: "0812-1100-2201",
    village: "Babakan",
    location: "Masjid Al-Ikhlas Babakan",
    day: "Jumat",
    time: "19:30 WIB",
    totalMembers: 96,
    activeMembers: 82,
    attendance: 85.4,
    lastMeeting: "16 Sep 2026",
    material: "Adab Menuntut Ilmu",
    status: "Aktif",
  },
  {
    id: "upa-dramaga",
    name: "UPA Dramaga",
    mentor: "Ust. Farid",
    mentorPhone: "0813-8871-4412",
    village: "Dramaga",
    location: "Kantor DPC Dramaga",
    day: "Kamis",
    time: "20:00 WIB",
    totalMembers: 88,
    activeMembers: 71,
    attendance: 80.7,
    lastMeeting: "16 Sep 2026",
    material: "Tafsir Surat Al-Hujurat",
    status: "Aktif",
  },
  {
    id: "upa-cikarawang",
    name: "UPA Cikarawang",
    mentor: "Ust. Anwar",
    mentorPhone: "0857-3312-9941",
    village: "Cikarawang",
    location: "Mushola Al-Falah",
    day: "Rabu",
    time: "19:45 WIB",
    totalMembers: 74,
    activeMembers: 56,
    attendance: 75.6,
    lastMeeting: "15 Sep 2026",
    material: "Sirah Nabawiyah",
    status: "Aktif",
  },
  {
    id: "upa-ciherang",
    name: "UPA Ciherang",
    mentor: "Ust. Ibrahim",
    mentorPhone: "0821-7765-0091",
    village: "Ciherang",
    location: "Rumah Kader Ciherang",
    day: "Selasa",
    time: "19:30 WIB",
    totalMembers: 69,
    activeMembers: 47,
    attendance: 68.1,
    lastMeeting: "15 Sep 2026",
    material: "Fiqih Ibadah",
    status: "Perlu Perhatian",
  },
];

const upcomingMeetings = [
  {
    group: "UPA Babakan",
    mentor: "Ust. Hamdan",
    date: "22 Sep 2026",
    time: "19:30 WIB",
  },
  {
    group: "UPA Dramaga",
    mentor: "Ust. Farid",
    date: "23 Sep 2026",
    time: "20:00 WIB",
  },
  {
    group: "UPA Cikarawang",
    mentor: "Ust. Anwar",
    date: "24 Sep 2026",
    time: "19:45 WIB",
  },
];

const summaryCards = [
  {
    title: "Total Kelompok UPA",
    value: "24",
    note: "kelompok aktif",
    icon: IconUsersGroup,
    tone: "emerald",
  },
  {
    title: "Total Anggota Terbina",
    value: "2,137",
    note: "anggota dalam UPA",
    icon: IconUsers,
    tone: "sky",
  },
  {
    title: "Rata-rata Kehadiran",
    value: "76.4%",
    note: "bulan berjalan",
    icon: IconUserCheck,
    tone: "emerald",
  },
  {
    title: "Butuh Perhatian",
    value: "5",
    note: "kelompok rendah hadir",
    icon: IconClock,
    tone: "amber",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "24" },
  { label: "Aktif", value: "Aktif", count: "19" },
  { label: "Perlu Perhatian", value: "Perlu Perhatian", count: "5" },
  { label: "Tidak Aktif", value: "Tidak Aktif", count: "1" },
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

function getStatusBadgeClass(status: UpaStatus) {
  switch (status) {
    case "Aktif":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Perlu Perhatian":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Tidak Aktif":
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

export default function KelompokUpaPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [upaGroups, setUpaGroups] = useState<UpaGroup[]>(initialUpaGroups);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UpaGroup | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<UpaGroup>>({
    name: "",
    mentor: "",
    mentorPhone: "",
    village: "Dramaga",
    location: "",
    day: "Senin",
    time: "20:00 WIB",
    status: "Aktif",
  });

  const filteredGroups = useMemo(() => {
    return upaGroups.filter((group) => {
      const matchTab = activeTab === "all" || group.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        group.name.toLowerCase().includes(keyword) ||
        group.mentor.toLowerCase().includes(keyword) ||
        group.village.toLowerCase().includes(keyword) ||
        group.location.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, search, upaGroups]);

  const handleAdd = () => {
    const newGroup: UpaGroup = {
      ...formData as UpaGroup,
      id: `upa-${Date.now()}`,
      totalMembers: 0,
      activeMembers: 0,
      attendance: 0,
      lastMeeting: "-",
      material: "-",
    };
    setUpaGroups([newGroup, ...upaGroups]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedGroup) return;
    setUpaGroups(upaGroups.map(g => g.id === selectedGroup.id ? { ...g, ...formData } as UpaGroup : g));
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedGroup) return;
    setUpaGroups(upaGroups.filter(g => g.id !== selectedGroup.id));
    setIsDeleteOpen(false);
    setSelectedGroup(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mentor: "",
      mentorPhone: "",
      village: "Dramaga",
      location: "",
      day: "Senin",
      time: "20:00 WIB",
      status: "Aktif",
    });
  };

  const openEdit = (group: UpaGroup) => {
    setSelectedGroup(group);
    setFormData(group);
    setIsEditOpen(true);
  };

  const openDelete = (group: UpaGroup) => {
    setSelectedGroup(group);
    setIsDeleteOpen(true);
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="grid flex-1 gap-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
                <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                  <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                    placeholder="Cari kelompok, murabbi, desa, lokasi..."
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
                  <option>Semua Hari</option>
                  <option>Senin</option>
                  <option>Selasa</option>
                  <option>Rabu</option>
                  <option>Kamis</option>
                  <option>Jumat</option>
                  <option>Sabtu</option>
                  <option>Ahad</option>
                </select>

                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                >
                  <IconFilter className="mr-1.5 h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>

              <Button
                onClick={() => setIsAddOpen(true)}
                className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
              >
                <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                Buat Kelompok
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

              <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-zinc-100">
                              {group.name}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                group.status
                              )}`}
                            >
                              {group.status}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {group.village} • {group.totalMembers} anggota
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 shrink-0 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                            >
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="right">
                            <DropdownMenuItem onClick={() => openEdit(group)}>
                              <IconEdit className="mr-2 h-3.5 w-3.5" />
                              Edit Kelompok
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => openDelete(group)}>
                              <IconTrash className="mr-2 h-3.5 w-3.5" />
                              Hapus Kelompok
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`https://picsum.photos/seed/${group.mentor}/64/64`}
                            alt={group.mentor}
                          />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(group.mentor)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-zinc-100">
                            {group.mentor}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500">
                            {group.mentorPhone}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconCalendarEvent className="h-3.5 w-3.5" />
                            Jadwal
                          </div>
                          <p className="mt-1 text-xs font-medium text-zinc-200">
                            {group.day}, {group.time}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconMapPin className="h-3.5 w-3.5" />
                            Lokasi
                          </div>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {group.location}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            Kehadiran rata-rata
                          </span>
                          <span
                            className={`font-semibold ${getAttendanceColor(
                              group.attendance
                            )}`}
                          >
                            {group.attendance}%
                          </span>
                        </div>
                        <Progress
                          value={group.attendance}
                          className="h-1.5 bg-white/5"
                        />
                      </div>

                      <Separator className="my-4 bg-white/10" />

                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-zinc-500">
                            Materi terakhir
                          </p>
                          <p className="truncate text-xs font-medium text-zinc-200">
                            {group.material}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 shrink-0 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                        >
                          <Link href={`/admin/kelompok-upa/${group.id}`}>
                            Detail
                            <IconChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
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
                    {filteredGroups.length}
                  </span>{" "}
                  dari <span className="text-zinc-300">24</span> kelompok
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-300 hover:bg-white/10"
                >
                  Lihat semua
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Jadwal UPA Terdekat
              </CardTitle>
              <CardDescription className="text-xs">
                Pertemuan yang akan berlangsung pekan ini.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {upcomingMeetings.map((meeting, index) => (
                <div key={meeting.group}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-100">
                        {meeting.group}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        {meeting.mentor}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <IconClock className="h-3.5 w-3.5 text-zinc-500" />
                        {meeting.date} • {meeting.time}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 shrink-0 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                    >
                      Absen
                    </Button>
                  </div>

                  {index < upcomingMeetings.length - 1 ? (
                    <Separator className="mt-3 bg-white/10" />
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Evaluasi Pembinaan
              </CardTitle>
              <CardDescription className="text-xs">
                Ringkasan kondisi UPA bulan ini.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-xs font-medium text-emerald-200">
                  19 kelompok aktif stabil
                </p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Kelompok dengan kehadiran di atas 75% sudah berjalan
                  cukup baik.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-xs font-medium text-amber-200">
                  5 kelompok perlu perhatian
                </p>
                <p className="mt-1 text-[11px] leading-5 text-amber-100/70">
                  Prioritaskan monitoring murabbi and penjadwalan ulang
                  untuk kelompok dengan kehadiran rendah.
                </p>
              </div>

              <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                Buat Laporan Evaluasi
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Add/Edit Modal */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setIsEditOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isAddOpen ? "Buat Kelompok UPA" : "Edit Kelompok UPA"}</DialogTitle>
            <DialogDescription>
              {isAddOpen ? "Buat kelompok pembinaan baru." : `Perbarui data kelompok ${selectedGroup?.name}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">Nama UPA</Label>
              <Input
                id="name"
                className="col-span-3 h-9"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mentor" className="text-right text-xs">Murabbi</Label>
              <Input
                id="mentor"
                className="col-span-3 h-9"
                value={formData.mentor}
                onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-xs">Telepon</Label>
              <Input
                id="phone"
                className="col-span-3 h-9"
                value={formData.mentorPhone}
                onChange={(e) => setFormData({ ...formData, mentorPhone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="village" className="text-right text-xs">Desa</Label>
              <select
                id="village"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              >
                <option>Babakan</option>
                <option>Dramaga</option>
                <option>Cikarawang</option>
                <option>Ciherang</option>
                <option>Petir</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right text-xs">Lokasi</Label>
              <Input
                id="location"
                className="col-span-3 h-9"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right text-xs">Hari</Label>
              <select
                id="day"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              >
                <option>Senin</option>
                <option>Selasa</option>
                <option>Rabu</option>
                <option>Kamis</option>
                <option>Jumat</option>
                <option>Sabtu</option>
                <option>Ahad</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddOpen(false);
              setIsEditOpen(false);
              resetForm();
            }}>Batal</Button>
            <Button onClick={isAddOpen ? handleAdd : handleEdit} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {isAddOpen ? "Simpan Kelompok" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Kelompok</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedGroup?.name}</strong>? Data anggota dan riwayat absensi akan terhapus secara permanen.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600">Hapus Permanen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}