"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  IconUsers,
  IconWorld,
  IconLock,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconSearch,
  IconFilter,
  IconPlus,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";

type EventType = "Publik" | "Internal";
type EventStatus = "Terjadwal" | "Selesai" | "Dibatalkan";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mapUrl: string;
  type: EventType;
  status: EventStatus;
  progressValue: number;
  progressLabel: string;
  targetParticipants: number;
  registeredParticipants: number;
}

const initialEvents: EventItem[] = [
  {
    id: "EVT-001",
    title: "Bakti Sosial Dramaga",
    description: "Kegiatan publik untuk masyarakat sekitar",
    date: "28 Sep 2026",
    time: "08:00 WIB",
    location: "Desa Dramaga",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15854.801646271!2d106.7212001!3d-6.5594953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c4b786c28f73%3A0x401576d1419cdd0!2sDramaga%2C%20Bogor%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1717140000000!5m2!1sen!2sid",
    type: "Publik",
    status: "Terjadwal",
    progressValue: 74,
    progressLabel: "Persiapan",
    targetParticipants: 350,
    registeredParticipants: 284,
  },
  {
    id: "EVT-002",
    title: "Rapat Pleno DPC",
    description: "Evaluasi program bulanan pengurus",
    date: "24 Sep 2026",
    time: "20:00 WIB",
    location: "Kantor DPC Dramaga",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.45678!2d106.72345!3d-6.55678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzMnMjQuNCJTIDEwNsKwNDMnMjQuNCJF!5e0!3m2!1sen!2sid!4v1717140000000!5m2!1sen!2sid",
    type: "Internal",
    status: "Terjadwal",
    progressValue: 88,
    progressLabel: "Persiapan",
    targetParticipants: 90,
    registeredParticipants: 76,
  },
  {
    id: "EVT-003",
    title: "Kajian Terbuka",
    description: "Agenda dakwah publik",
    date: "20 Sep 2026",
    time: "16:00 WIB",
    location: "Masjid Al-Ikhlas",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.45678!2d106.72345!3d-6.55678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzMnMjQuNCJTIDEwNsKwNDMnMjQuNCJF!5e0!3m2!1sen!2sid!4v1717140000000!5m2!1sen!2sid",
    type: "Publik",
    status: "Selesai",
    progressValue: 91,
    progressLabel: "Kehadiran",
    targetParticipants: 500,
    registeredParticipants: 462,
  },
];

const summaryCardsData = [
  {
    title: "Total Event",
    value: "18",
    note: "bulan ini",
    icon: IconCalendarEvent,
    tone: "emerald",
  },
  {
    title: "Target Peserta",
    value: "1,240",
    note: "akumulasi",
    icon: IconUsers,
    tone: "sky",
  },
  {
    title: "Event Publik",
    value: "7",
    note: "terbuka umum",
    icon: IconWorld,
    tone: "emerald",
  },
  {
    title: "Event Internal",
    value: "11",
    note: "khusus kader",
    icon: IconLock,
    tone: "violet",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "18" },
  { label: "Terjadwal", value: "Terjadwal", count: "12" },
  { label: "Selesai", value: "Selesai", count: "5" },
  { label: "Dibatalkan", value: "Dibatalkan", count: "1" },
];

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
    case "violet":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getBadgeClass(status: string) {
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

export default function JadwalEventPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    mapUrl: "",
    type: "Publik",
    status: "Terjadwal",
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchTab = activeTab === "all" || event.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        event.title.toLowerCase().includes(keyword) ||
        event.description.toLowerCase().includes(keyword) ||
        event.location.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, search, events]);

  const openAdd = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      mapUrl: "",
      type: "Publik",
      status: "Terjadwal",
    });
    setIsFormOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setSelectedEvent(event);
    setFormData(event);
    setIsFormOpen(true);
  };

  const openDelete = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const handleSave = () => {
    if (selectedEvent) {
      // Update
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...formData } as EventItem : e));
    } else {
      // Add
      const newEvent: EventItem = {
        ...formData as EventItem,
        id: `EVT-${Date.now()}`,
        progressValue: 0,
        progressLabel: "Persiapan",
        targetParticipants: 0,
        registeredParticipants: 0,
      };
      setEvents([newEvent, ...events]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    setEvents(events.filter(e => e.id !== selectedEvent.id));
    setIsDeleteOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCardsData.map((card) => {
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
                    placeholder="Cari event, lokasi..."
                  />
                </div>

                <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>Semua Tipe</option>
                  <option>Publik</option>
                  <option>Internal</option>
                </select>

                <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>September 2026</option>
                  <option>Oktober 2026</option>
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
                onClick={openAdd}
                className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
              >
                <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                Tambah Event
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
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-zinc-100">
                              {event.title}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getBadgeClass(
                                event.status
                              )}`}
                            >
                              {event.status}
                            </Badge>

                            <Badge
                              variant="outline"
                              className="rounded-lg border-white/10 bg-white/5 px-2 py-0 text-[10px] text-zinc-400"
                            >
                              {event.type}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {event.description}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                          >
                            <Link href={`/admin/event/${event.id}`}>
                              <IconEye className="mr-1.5 h-3.5 w-3.5" />
                              Detail
                            </Link>
                          </Button>

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
                              <DropdownMenuItem onClick={() => openEdit(event)}>
                                <IconEdit className="mr-2 h-3.5 w-3.5" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => openDelete(event)}
                              >
                                <IconTrash className="mr-2 h-3.5 w-3.5" />
                                Hapus Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconCalendarEvent className="h-3.5 w-3.5" />
                            Waktu
                          </div>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {event.date}, {event.time}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconMapPin className="h-3.5 w-3.5" />
                            Lokasi
                          </div>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {event.location}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <IconUsers className="h-3.5 w-3.5" />
                            Pendaftar
                          </div>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {event.registeredParticipants}/{event.targetParticipants} Peserta
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">
                            {event.progressLabel}
                          </span>
                          <span className="font-semibold text-zinc-200">
                            {event.progressValue}%
                          </span>
                        </div>
                        <Progress
                          value={event.progressValue}
                          className="h-1.5 bg-white/5"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Evaluasi Event
              </CardTitle>
              <CardDescription className="text-xs">
                Ringkasan agenda dan kesiapan event.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3">
                <p className="text-xs font-medium text-sky-200">12 event masih terjadwal</p>
                <p className="mt-1 text-[11px] leading-5 text-sky-100/70">
                  Pastikan PIC dan kebutuhan logistik sudah dikunci.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-xs font-medium text-amber-200">Bakti Sosial butuh finalisasi</p>
                <p className="mt-1 text-[11px] leading-5 text-amber-100/70">
                  Koordinasi peserta dan logistik perlu diselesaikan minggu ini.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-xs font-medium text-emerald-200">Kajian terbuka berjalan baik</p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Kehadiran peserta melewati target awal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Event" : "Tambah Event Baru"}</DialogTitle>
            <DialogDescription>
              Isi data detail kegiatan untuk agenda DPC Dramaga.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-xs">Judul Event</Label>
              <Input
                id="title"
                className="col-span-3 h-9"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right text-xs">Deskripsi</Label>
              <Input
                id="desc"
                className="col-span-3 h-9"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 ml-auto w-3/4">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs">Tanggal</Label>
                <Input
                  id="date"
                  className="h-9"
                  placeholder="28 Sep 2026"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-xs">Waktu</Label>
                <Input
                  id="time"
                  className="h-9"
                  placeholder="08:00 WIB"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
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
              <Label htmlFor="map" className="text-right text-xs">Embed Map URL</Label>
              <Input
                id="map"
                className="col-span-3 h-9"
                placeholder="https://www.google.com/maps/embed?..."
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 ml-auto w-3/4">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs">Tipe</Label>
                <select
                  id="type"
                  className="w-full h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                >
                  <option value="Publik">Publik</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs">Status</Label>
                <select
                  id="status"
                  className="w-full h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Simpan Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Event</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedEvent?.title}</strong>? Data kehadiran dan logistik terkait akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600">Hapus Permanen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}