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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  IconDownload,
  IconFilter,
  IconPlus,
  IconSearch,
  IconUsers,
  IconUserCheck,
  IconUserPause,
  IconClock,
  IconUsersGroup,
  IconDots,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

type MemberStatus = "Aktif" | "Non Aktif" | "Menunggu";
type MemberLevel = "Dasar" | "Madya" | "Muda" | "Penggerak";
type MemberRole = "Admin" | "Murabbi" | "Anggota";

interface Member {
  name: string;
  email: string;
  nik: string;
  wilayah: string;
  upa: string;
  jenjang: MemberLevel;
  status: MemberStatus;
  role: MemberRole;
  joinedAt: string;
}

const initialMembers: Member[] = [
  {
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    nik: "3201011203980001",
    wilayah: "Dramaga",
    upa: "UPA Dramaga",
    jenjang: "Madya",
    status: "Aktif",
    role: "Murabbi",
    joinedAt: "16 Sep 2024",
  },
  {
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@email.com",
    nik: "3201012505020002",
    wilayah: "Babakan",
    upa: "UPA Babakan",
    jenjang: "Dasar",
    status: "Aktif",
    role: "Anggota",
    joinedAt: "14 Sep 2024",
  },
  {
    name: "Dedi Kurniawan",
    email: "dedi.kurniawan@email.com",
    nik: "3201014119900003",
    wilayah: "Cikerang",
    upa: "UPA Cikerang",
    jenjang: "Muda",
    status: "Aktif",
    role: "Murabbi",
    joinedAt: "10 Sep 2024",
  },
  {
    name: "Nadia Putri",
    email: "nadia.putri@email.com",
    nik: "320101111030004",
    wilayah: "Cikarawang",
    upa: "UPA Cikarawang",
    jenjang: "Dasar",
    status: "Menunggu",
    role: "Anggota",
    joinedAt: "16 Sep 2026",
  },
  {
    name: "Rizky Pratama",
    email: "rizky.pratama@email.com",
    nik: "3201012208050005",
    wilayah: "Dramaga",
    upa: "UPA Dramaga",
    jenjang: "Madya",
    status: "Aktif",
    role: "Anggota",
    joinedAt: "12 Sep 2024",
  },
  {
    name: "Maya Sari",
    email: "maya.sari@email.com",
    nik: "3201010807010006",
    wilayah: "Cihideung Udik",
    upa: "UPA Cihideung Udik",
    jenjang: "Dasar",
    status: "Non Aktif",
    role: "Anggota",
    joinedAt: "05 Sep 2023",
  },
  {
    name: "Fajar Ramadhan",
    email: "fajar.ramadhan@email.com",
    nik: "3201011303000007",
    wilayah: "Babakan",
    upa: "UPA Babakan",
    jenjang: "Muda",
    status: "Aktif",
    role: "Murabbi",
    joinedAt: "03 Sep 2024",
  },
  {
    name: "Putri Amelia",
    email: "putri.amelia@email.com",
    nik: "3201011908040008",
    wilayah: "Ciherang",
    upa: "UPA Ciherang",
    jenjang: "Dasar",
    status: "Menunggu",
    role: "Anggota",
    joinedAt: "02 Sep 2026",
  },
];

const summaryCards = [
  {
    title: "Total Anggota",
    value: "2,845",
    delta: "+8.4%",
    note: "dari bulan lalu",
    icon: IconUsers,
    tone: "emerald",
  },
  {
    title: "Kader Aktif",
    value: "2,137",
    delta: "+6.2%",
    note: "dari bulan lalu",
    icon: IconUserCheck,
    tone: "emerald",
  },
  {
    title: "Menunggu Verifikasi",
    value: "37",
    delta: "-2",
    note: "dari bulan lalu",
    icon: IconClock,
    tone: "violet",
  },
  {
    title: "Non Aktif",
    value: "671",
    delta: "+1.3%",
    note: "dari bulan lalu",
    icon: IconUserPause,
    tone: "amber",
  },
  {
    title: "UPA Aktif",
    value: "24",
    delta: "-",
    note: "dari bulan lalu",
    icon: IconUsersGroup,
    tone: "sky",
  },
];

const tabs = [
  { label: "Semua", count: "2.845", value: "all" },
  { label: "Aktif", count: "2.137", value: "Aktif" },
  { label: "Non Aktif", count: "671", value: "Non Aktif" },
  { label: "Menunggu Verifikasi", count: "37", value: "Menunggu" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getLevelBadgeClass(level: MemberLevel) {
  switch (level) {
    case "Dasar":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "Madya":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Muda":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    case "Penggerak":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStatusBadgeClass(status: MemberStatus) {
  switch (status) {
    case "Aktif":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Menunggu":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Non Aktif":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function AnggotaKaderPage() {
  const [membersList, setMembersList] = useState<Member[]>(initialMembers);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Filter states
  const [filterWilayah, setFilterWilayah] = useState("Semua Wilayah");
  const [filterUpa, setFilterUpa] = useState("Semua UPA");
  const [filterJenjang, setFilterJenjang] = useState("Semua Jenjang");

  // Derive unique UPA values for the filter
  const upaOptions = useMemo(() => {
    const upas = new Set(membersList.map((m) => m.upa));
    return ["Semua UPA", ...Array.from(upas).sort()];
  }, [membersList]);

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states
  const [formData, setFormData] = useState<Member>({
    name: "",
    email: "",
    nik: "",
    wilayah: "Dramaga",
    upa: "",
    jenjang: "Dasar",
    status: "Aktif",
    role: "Anggota",
    joinedAt: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  });

  const filteredMembers = useMemo(() => {
    return membersList.filter((member) => {
      // Status filter (synced with activeTab)
      const matchStatus = activeTab === "all" || member.status === activeTab;

      // Dropdown filters
      const matchWilayah =
        filterWilayah === "Semua Wilayah" || member.wilayah === filterWilayah;
      const matchUpa = filterUpa === "Semua UPA" || member.upa === filterUpa;
      const matchJenjang =
        filterJenjang === "Semua Jenjang" || member.jenjang === filterJenjang;

      const keyword = search.toLowerCase();
      const matchSearch =
        member.name.toLowerCase().includes(keyword) ||
        member.email.toLowerCase().includes(keyword) ||
        member.nik.toLowerCase().includes(keyword) ||
        member.wilayah.toLowerCase().includes(keyword) ||
        member.upa.toLowerCase().includes(keyword);

      return (
        matchStatus &&
        matchWilayah &&
        matchUpa &&
        matchJenjang &&
        matchSearch
      );
    });
  }, [
    activeTab,
    search,
    filterWilayah,
    filterUpa,
    filterJenjang,
    membersList,
  ]);

  const handleAdd = () => {
    setMembersList([formData, ...membersList]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedMember) return;
    setMembersList(
      membersList.map((m) => (m.nik === selectedMember.nik ? formData : m))
    );
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedMember) return;
    setMembersList(membersList.filter((m) => m.nik !== selectedMember.nik));
    setIsDeleteOpen(false);
    setSelectedMember(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      nik: "",
      wilayah: "Dramaga",
      upa: "",
      jenjang: "Dasar",
      status: "Aktif",
      role: "Anggota",
      joinedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
  };

  const openEdit = (member: Member) => {
    setSelectedMember(member);
    setFormData(member);
    setIsEditOpen(true);
  };

  const openDelete = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
                    card.tone === "emerald"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : card.tone === "violet"
                        ? "border-violet-500/20 bg-violet-500/10 text-violet-300"
                        : card.tone === "amber"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                          : "border-sky-500/20 bg-sky-500/10 text-sky-300",
                  ].join(" ")}
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
                    <span
                      className={
                        card.delta.startsWith("-")
                          ? "text-rose-300"
                          : "text-emerald-300"
                      }
                    >
                      {card.delta}
                    </span>{" "}
                    {card.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari nama, NIK, wilayah, UPA..."
                />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">
                  Wilayah
                </p>
                <select
                  value={filterWilayah}
                  onChange={(e) => setFilterWilayah(e.target.value)}
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                >
                  <option>Semua Wilayah</option>
                  <option>Dramaga</option>
                  <option>Babakan</option>
                  <option>Cikarawang</option>
                  <option>Ciherang</option>
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">UPA</p>
                <select
                  value={filterUpa}
                  onChange={(e) => setFilterUpa(e.target.value)}
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                >
                  {upaOptions.map((upa) => (
                    <option key={upa} value={upa}>
                      {upa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">
                  Jenjang
                </p>
                <select
                  value={filterJenjang}
                  onChange={(e) => setFilterJenjang(e.target.value)}
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                >
                  <option>Semua Jenjang</option>
                  <option>Dasar</option>
                  <option>Madya</option>
                  <option>Muda</option>
                  <option>Penggerak</option>
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">
                  Status
                </p>
                <select
                  value={activeTab === "all" ? "Semua Status" : activeTab}
                  onChange={(e) =>
                    setActiveTab(
                      e.target.value === "Semua Status" ? "all" : e.target.value
                    )
                  }
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                >
                  <option>Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Non Aktif">Non Aktif</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                >
                  <IconFilter className="mr-1.5 h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAddOpen(true)}
                className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
              >
                <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                Tambah Anggota
              </Button>
            </div>
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
                    {tab.label}{" "}
                    <span className="ml-1 text-[11px] opacity-70">
                      ({tab.count})
                    </span>
                  </Button>
                );
              })}
            </div>

            <Separator className="bg-white/10" />

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 bg-emerald-500/10 hover:bg-emerald-500/10">
                    <TableHead className="h-10 w-10 text-zinc-300">
                      <Checkbox className="border-emerald-500/40 data-[state=checked]:bg-emerald-500" />
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      Anggota
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      NIK
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      Wilayah
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      UPA
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      Jenjang
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      Status
                    </TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">
                      Bergabung
                    </TableHead>
                    <TableHead className="h-10 text-right text-xs text-zinc-300">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow
                      key={member.nik}
                      className="border-white/10 hover:bg-white/[0.03]"
                    >
                      <TableCell className="py-2">
                        <Checkbox className="border-emerald-500/40 data-[state=checked]:bg-emerald-500" />
                      </TableCell>

                      <TableCell className="min-w-[220px] py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://picsum.photos/seed/${member.name}/64/64`}
                              alt={member.name}
                            />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-zinc-100">
                              {member.name}
                            </p>
                            <p className="truncate text-[11px] text-zinc-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="min-w-[150px] py-2 text-xs text-zinc-300">
                        {member.nik}
                      </TableCell>

                      <TableCell className="py-2 text-xs text-zinc-300">
                        <div className="flex flex-col">
                          <span className="text-zinc-100">{member.wilayah}</span>
                          <span className="text-[10px] text-zinc-500">
                            {member.role}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="min-w-[150px] py-2 text-xs text-zinc-300">
                        {member.upa}
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge
                          variant="outline"
                          className={`rounded-lg px-2 py-0 text-[10px] ${getLevelBadgeClass(
                            member.jenjang
                          )}`}
                        >
                          {member.jenjang}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge
                          variant="outline"
                          className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="min-w-[110px] py-2 text-xs text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <IconCalendar className="h-3.5 w-3.5 text-zinc-500" />
                          {member.joinedAt}
                        </div>
                      </TableCell>

                      <TableCell className="py-2 text-right">
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
                            <DropdownMenuItem onClick={() => openEdit(member)}>
                              <IconEdit className="mr-2 h-3.5 w-3.5" />
                              Edit Data
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => openDelete(member)}
                            >
                              <IconTrash className="mr-2 h-3.5 w-3.5" />
                              Hapus Anggota
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="bg-white/10" />

            <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-zinc-500">
                Menampilkan{" "}
                <span className="text-zinc-300">
                  1 - {filteredMembers.length}
                </span>{" "}
                dari <span className="text-zinc-300">2.845</span> data
              </p>

              <div className="flex items-center gap-2">
                <select className="h-8 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>10 / halaman</option>
                  <option>25 / halaman</option>
                  <option>50 / halaman</option>
                </select>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  className="h-8 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 text-xs text-emerald-200 hover:bg-emerald-500/25"
                >
                  1
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-300 hover:bg-white/10"
                >
                  2
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

      {/* Add Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Anggota Baru</DialogTitle>
            <DialogDescription>
              Lengkapi data anggota di bawah ini. Pastikan NIK sesuai dengan KTP.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nik" className="text-right">
                NIK
              </Label>
              <Input
                id="nik"
                className="col-span-3"
                value={formData.nik}
                onChange={(e) =>
                  setFormData({ ...formData, nik: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wilayah" className="text-right">
                Wilayah
              </Label>
              <select
                id="wilayah"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.wilayah}
                onChange={(e) =>
                  setFormData({ ...formData, wilayah: e.target.value })
                }
              >
                <option>Dramaga</option>
                <option>Babakan</option>
                <option>Cikarawang</option>
                <option>Ciherang</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upa" className="text-right">
                UPA
              </Label>
              <Input
                id="upa"
                className="col-span-3"
                value={formData.upa}
                onChange={(e) =>
                  setFormData({ ...formData, upa: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role Akun
              </Label>
              <select
                id="role"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as MemberRole })
                }
              >
                <option value="Anggota">Anggota</option>
                <option value="Murabbi">Murabbi</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jenjang" className="text-right">
                Jenjang
              </Label>
              <select
                id="jenjang"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.jenjang}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jenjang: e.target.value as MemberLevel,
                  })
                }
              >
                <option>Dasar</option>
                <option>Madya</option>
                <option>Muda</option>
                <option>Penggerak</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAdd}>Simpan Anggota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Data Anggota</DialogTitle>
            <DialogDescription>
              Perbarui informasi anggota {selectedMember?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nama
              </Label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                className="col-span-3"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-wilayah" className="text-right">
                Wilayah
              </Label>
              <select
                id="edit-wilayah"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.wilayah}
                onChange={(e) =>
                  setFormData({ ...formData, wilayah: e.target.value })
                }
              >
                <option>Dramaga</option>
                <option>Babakan</option>
                <option>Cikarawang</option>
                <option>Ciherang</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-upa" className="text-right">
                UPA
              </Label>
              <Input
                id="edit-upa"
                className="col-span-3"
                value={formData.upa}
                onChange={(e) =>
                  setFormData({ ...formData, upa: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role Akun
              </Label>
              <select
                id="edit-role"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as MemberRole })
                }
              >
                <option value="Anggota">Anggota</option>
                <option value="Murabbi">Murabbi</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <select
                id="edit-status"
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as MemberStatus,
                  })
                }
              >
                <option>Aktif</option>
                <option>Non Aktif</option>
                <option>Menunggu</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Anggota</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedMember?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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