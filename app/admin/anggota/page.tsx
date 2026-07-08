"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
  DropdownMenuSeparator,
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
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import {
  IconPlus,
  IconSearch,
  IconUsers,
  IconUserCheck,
  IconUserPause,
  IconUsersGroup,
  IconDots,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconEye,
  IconRefresh,
} from "@tabler/icons-react";

interface UserData {
  id: number;
  email: string;
  role: string;
}

interface KelompokData {
  id: number;
  namaKelompok: string;
  wilayah: string | null;
}

interface AnggotaData {
  id: number;
  namaLengkap: string;
  nik: string | null;
  noHp: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  alamat: string | null;
  pendidikan: string | null;
  pekerjaan: string | null;
  desil: number | null;
  status: string;
  tahunGabung: number | null;
  userId: number | null;
  kelompokId: number | null;
  user: UserData | null;
  kelompok: KelompokData | null;
}

interface AnggotaForm {
  namaLengkap: string;
  nik: string;
  noHp: string;
  email: string;
  password: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  pendidikan: string;
  pekerjaan: string;
  desil: string;
  status: string;
  tahunGabung: string;
  kelompokId: string;
  role: string;
}

const emptyForm: AnggotaForm = {
  namaLengkap: "",
  nik: "",
  noHp: "",
  email: "",
  password: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "L",
  alamat: "",
  pendidikan: "",
  pekerjaan: "",
  desil: "",
  status: "aktif",
  tahunGabung: String(new Date().getFullYear()),
  kelompokId: "",
  role: "user",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "aktif":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "tidak_aktif":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "aktif": return "Aktif";
    case "tidak_aktif": return "Non Aktif";
    default: return status;
  }
}

function formatRole(role: string) {
  switch (role) {
    case "admin": return "Admin";
    case "pembimbing": return "Pembimbing";
    case "user": return "User";
    default: return role;
  }
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "admin":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "pembimbing":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    case "user":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function AnggotaKaderPage() {
  const [anggotaList, setAnggotaList] = useState<AnggotaData[]>([]);
  const [kelompokList, setKelompokList] = useState<KelompokData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterKelompok, setFilterKelompok] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [selectedMember, setSelectedMember] = useState<AnggotaData | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formData, setFormData] = useState<AnggotaForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [anggotaRes, kelompokRes] = await Promise.all([
        api.get<AnggotaData[]>("/anggota"),
        api.get<KelompokData[]>("/kelompok-upa"),
      ]);
      setAnggotaList(anggotaRes);
      setKelompokList(kelompokRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredList = useMemo(() => {
    return anggotaList.filter((a) => {
      const matchSearch =
        !search ||
        a.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
        (a.nik && a.nik.includes(search)) ||
        (a.user && a.user.email.toLowerCase().includes(search.toLowerCase())) ||
        (a.kelompok && a.kelompok.namaKelompok.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      const matchKelompok =
        filterKelompok === "all" ||
        (a.kelompok && String(a.kelompok.id) === filterKelompok);

      return matchSearch && matchStatus && matchKelompok;
    });
  }, [anggotaList, search, filterKelompok, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / perPage));
  const paginatedList = filteredList.slice((page - 1) * perPage, page * perPage);

  const totalCount = anggotaList.length;
  const aktifCount = anggotaList.filter((a) => a.status === "aktif").length;
  const nonAktifCount = anggotaList.filter((a) => a.status === "tidak_aktif").length;

  const summaryCards = [
    {
      title: "Total Anggota",
      value: String(totalCount),
      icon: IconUsers,
      tone: "emerald",
    },
    {
      title: "Kader Aktif",
      value: String(aktifCount),
      icon: IconUserCheck,
      tone: "emerald",
    },
    {
      title: "Non Aktif",
      value: String(nonAktifCount),
      icon: IconUserPause,
      tone: "amber",
    },
    {
      title: "Kelompok UPA",
      value: String(kelompokList.length),
      icon: IconUsersGroup,
      tone: "sky",
    },
  ];

  function resetForm() {
    setFormData(emptyForm);
  }

  async function handleAdd() {
    setSaving(true);
    try {
      let userId: number | null = null;
      if (formData.email) {
        const registerRes = await api.post<{ user: UserData }>("/auth/register", {
          email: formData.email,
          password: formData.password || "sikadera123",
          role: formData.role,
        });
        userId = registerRes.user.id;
      }

      await api.post("/anggota", {
        namaLengkap: formData.namaLengkap,
        nik: formData.nik || null,
        noHp: formData.noHp || null,
        tempatLahir: formData.tempatLahir || null,
        tanggalLahir: formData.tanggalLahir || null,
        jenisKelamin: formData.jenisKelamin || null,
        alamat: formData.alamat || null,
        pendidikan: formData.pendidikan || null,
        pekerjaan: formData.pekerjaan || null,
        desil: formData.desil || null,
        status: formData.status,
        tahunGabung: formData.tahunGabung || null,
        kelompokId: formData.kelompokId || null,
        userId: userId,
      });

      setIsAddOpen(false);
      resetForm();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah anggota");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!selectedMember) return;
    setSaving(true);
    try {
      const putData: Record<string, unknown> = {
        namaLengkap: formData.namaLengkap,
        nik: formData.nik || null,
        noHp: formData.noHp || null,
        tempatLahir: formData.tempatLahir || null,
        tanggalLahir: formData.tanggalLahir || null,
        jenisKelamin: formData.jenisKelamin || null,
        alamat: formData.alamat || null,
        pendidikan: formData.pendidikan || null,
        pekerjaan: formData.pekerjaan || null,
        desil: formData.desil || null,
        status: formData.status,
        tahunGabung: formData.tahunGabung || null,
        kelompokId: formData.kelompokId || null,
        userRole: formData.role,
        userEmail: formData.email || null,
      };
      if (formData.password) {
        putData.userPassword = formData.password;
      }
      await api.put(`/anggota/${selectedMember.id}`, putData);

      setIsEditOpen(false);
      setSelectedMember(null);
      resetForm();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupdate anggota");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedMember) return;
    try {
      await api.delete(`/anggota/${selectedMember.id}`);
      setIsDeleteOpen(false);
      setSelectedMember(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus anggota");
    }
  }

  function openEdit(member: AnggotaData) {
    setSelectedMember(member);
    setFormData({
      namaLengkap: member.namaLengkap,
      nik: member.nik || "",
      noHp: member.noHp || "",
      email: member.user?.email || "",
      password: "",
      tempatLahir: member.tempatLahir || "",
      tanggalLahir: member.tanggalLahir || "",
      jenisKelamin: member.jenisKelamin || "L",
      alamat: member.alamat || "",
      pendidikan: member.pendidikan || "",
      pekerjaan: member.pekerjaan || "",
      desil: member.desil !== null ? String(member.desil) : "",
      status: member.status,
      tahunGabung: member.tahunGabung ? String(member.tahunGabung) : "",
      kelompokId: member.kelompokId ? String(member.kelompokId) : "",
      role: member.user?.role || "user",
    });
    setIsEditOpen(true);
  }

  function openDetail(member: AnggotaData) {
    setSelectedMember(member);
    setIsDetailOpen(true);
  }

  function openDelete(member: AnggotaData) {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  }

  if (loading && anggotaList.length === 0) {
    return (
      <>
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-2xl bg-white/5" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 bg-white/5" />
                    <Skeleton className="h-5 w-12 bg-white/5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="p-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl bg-white/5" />
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

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
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                    card.tone === "emerald"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : card.tone === "amber"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                        : "border-sky-500/20 bg-sky-500/10 text-sky-300"
                  }`}
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1.5fr_0.8fr_0.8fr_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari nama, NIK, email, UPA..."
                />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">Kelompok UPA</p>
                <select
                  value={filterKelompok}
                  onChange={(e) => { setFilterKelompok(e.target.value); setPage(1); }}
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                >
                  <option value="all">Semua Kelompok</option>
                  {kelompokList.map((k) => (
                    <option key={k.id} value={String(k.id)}>
                      {k.namaKelompok}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">Status</p>
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="tidak_aktif">Non Aktif</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  onClick={fetchData}
                  className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                >
                  <IconRefresh className="mr-1.5 h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>
            </div>

            <Button
              onClick={() => { resetForm(); setIsAddOpen(true); }}
              className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
            >
              <IconPlus className="mr-1.5 h-3.5 w-3.5" />
              Tambah Anggota
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
            <div className="flex flex-wrap gap-2 p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterStatus("all")}
                className={`h-8 rounded-xl px-3 text-xs font-medium ${
                  filterStatus === "all"
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                Semua
                <span className="ml-1 text-[11px] opacity-70">({totalCount})</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterStatus("aktif")}
                className={`h-8 rounded-xl px-3 text-xs font-medium ${
                  filterStatus === "aktif"
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                Aktif
                <span className="ml-1 text-[11px] opacity-70">({aktifCount})</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterStatus("tidak_aktif")}
                className={`h-8 rounded-xl px-3 text-xs font-medium ${
                  filterStatus === "tidak_aktif"
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                Non Aktif
                <span className="ml-1 text-[11px] opacity-70">({nonAktifCount})</span>
              </Button>
            </div>

            <Separator className="bg-white/10" />

            {error && (
              <div className="mx-3 mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                {error}
                <button onClick={() => setError(null)} className="ml-2 underline">Tutup</button>
              </div>
            )}

            <div>
              {paginatedList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <IconUsers className="mb-3 h-10 w-10 text-zinc-600" />
                  <p className="text-sm font-medium text-zinc-400">Tidak ada data anggota</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {search || filterKelompok !== "all" || filterStatus !== "all"
                      ? "Coba ubah filter pencarian"
                      : "Klik Tambah Anggota untuk menambahkan data pertama"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-emerald-500/10 hover:bg-emerald-500/10">
                      <TableHead className="h-10 text-xs text-zinc-300">Anggota</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Role</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">NIK</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">No. HP</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Kelompok</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Pendidikan</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Status</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Tahun</TableHead>
                      <TableHead className="h-10 text-right text-xs text-zinc-300">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedList.map((member) => (
                      <TableRow
                        key={member.id}
                        className="border-white/10 hover:bg-white/[0.03] cursor-pointer"
                        onClick={() => openDetail(member)}
                      >
                        <TableCell className="min-w-[200px] py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://picsum.photos/seed/${member.namaLengkap}/64/64`}
                                alt={member.namaLengkap}
                              />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(member.namaLengkap)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-zinc-100">
                                {member.namaLengkap}
                              </p>
                              <p className="truncate text-[11px] text-zinc-500">
                                {member.user?.email || "Tidak ada akun"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={`rounded-lg px-2 py-0 text-[10px] ${getRoleBadgeClass(member.user?.role || "")}`}
                          >
                            {formatRole(member.user?.role || "user")}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[130px] py-2 text-xs text-zinc-300">
                          {member.nik || "-"}
                        </TableCell>
                        <TableCell className="min-w-[120px] py-2 text-xs text-zinc-300">
                          {member.noHp || "-"}
                        </TableCell>
                        <TableCell className="min-w-[140px] py-2 text-xs text-zinc-300">
                          {member.kelompok?.namaKelompok || "-"}
                        </TableCell>
                        <TableCell className="py-2 text-xs text-zinc-300">
                          {member.pendidikan || "-"}
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(member.status)}`}
                          >
                            {formatStatus(member.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[90px] py-2 text-xs text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <IconCalendar className="h-3.5 w-3.5 text-zinc-500" />
                            {member.tahunGabung || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
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
                              <DropdownMenuItem onClick={() => openDetail(member)}>
                                <IconEye className="mr-2 h-3.5 w-3.5" />
                                Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(member)}>
                                <IconEdit className="mr-2 h-3.5 w-3.5" />
                                Edit Data
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onClick={() => openDelete(member)}>
                                <IconTrash className="mr-2 h-3.5 w-3.5" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {paginatedList.length > 0 && (
              <>
                <Separator className="bg-white/10" />
                <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-zinc-500">
                    Menampilkan{" "}
                    <span className="text-zinc-300">
                      {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredList.length)}
                    </span>{" "}
                    dari <span className="text-zinc-300">{filteredList.length}</span> data
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-40"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => (
                        <span key={p} className="flex items-center gap-1">
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-xs text-zinc-600">...</span>
                          )}
                          <Button
                            size="sm"
                            variant={p === page ? "default" : "outline"}
                            onClick={() => setPage(p)}
                            className={`h-8 min-w-[32px] rounded-xl px-2 text-xs ${
                              p === page
                                ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
                                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                            }`}
                          >
                            {p}
                          </Button>
                        </span>
                      ))}
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-40"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Anggota Baru</DialogTitle>
            <DialogDescription>
              Lengkapi data anggota di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Nama Lengkap</Label>
                <Input className="h-9 text-xs" placeholder="Nama lengkap" value={formData.namaLengkap} onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">NIK</Label>
                <Input className="h-9 text-xs" placeholder="NIK" value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">No. HP</Label>
                <Input className="h-9 text-xs" placeholder="No. HP / WA" value={formData.noHp} onChange={(e) => setFormData({ ...formData, noHp: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Email (Akun)</Label>
                <Input className="h-9 text-xs" type="email" placeholder="Email untuk login" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Password</Label>
                <Input className="h-9 text-xs" type="password" placeholder="Default: sikadera123" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Role</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="pembimbing">Pembimbing</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Status</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="aktif">Aktif</option>
                  <option value="tidak_aktif">Non Aktif</option>
                </select>
              </div>
            </div>

            <Separator className="bg-white/10" />
            <p className="text-[11px] font-medium text-zinc-500">Data Pribadi</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tempat Lahir</Label>
                <Input className="h-9 text-xs" placeholder="Kota kelahiran" value={formData.tempatLahir} onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tanggal Lahir</Label>
                <Input className="h-9 text-xs" type="date" value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jenis Kelamin</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.jenisKelamin} onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Pendidikan</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.pendidikan} onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}>
                  <option value="">Pilih</option>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                  <option value="D1">D1</option><option value="D2">D2</option><option value="D3">D3</option>
                  <option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Pekerjaan</Label>
                <Input className="h-9 text-xs" placeholder="Pekerjaan saat ini" value={formData.pekerjaan} onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Desil</Label>
                <Input className="h-9 text-xs" type="number" min="1" max="10" placeholder="1-10" value={formData.desil} onChange={(e) => setFormData({ ...formData, desil: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Kelompok UPA</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.kelompokId} onChange={(e) => setFormData({ ...formData, kelompokId: e.target.value })}>
                  <option value="">Pilih Kelompok</option>
                  {kelompokList.map((k) => (<option key={k.id} value={String(k.id)}>{k.namaKelompok}</option>))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tahun Gabung</Label>
                <Input className="h-9 text-xs" type="number" min="2000" max="2099" value={formData.tahunGabung} onChange={(e) => setFormData({ ...formData, tahunGabung: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Alamat</Label>
              <textarea className="min-h-[60px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y" placeholder="Alamat lengkap" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleAdd} disabled={saving || !formData.namaLengkap}>{saving ? "Menyimpan..." : "Simpan Anggota"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Anggota</DialogTitle>
            <DialogDescription>
              Perbarui informasi anggota {selectedMember?.namaLengkap}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Nama Lengkap</Label>
                <Input className="h-9 text-xs" value={formData.namaLengkap} onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">NIK</Label>
                <Input className="h-9 text-xs" value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">No. HP</Label>
                <Input className="h-9 text-xs" value={formData.noHp} onChange={(e) => setFormData({ ...formData, noHp: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Role</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="pembimbing">Pembimbing</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Status</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="aktif">Aktif</option>
                  <option value="tidak_aktif">Non Aktif</option>
                </select>
              </div>
            </div>

            <Separator className="bg-white/10" />
            <p className="text-[11px] font-medium text-zinc-500">Akun Pengguna</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Email</Label>
                <Input className="h-9 text-xs" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Password Baru</Label>
                <Input className="h-9 text-xs" type="password" placeholder="Kosongkan jika tidak diubah" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>

            <Separator className="bg-white/10" />
            <p className="text-[11px] font-medium text-zinc-500">Data Pribadi</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tempat Lahir</Label>
                <Input className="h-9 text-xs" value={formData.tempatLahir} onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tanggal Lahir</Label>
                <Input className="h-9 text-xs" type="date" value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jenis Kelamin</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.jenisKelamin} onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Pendidikan</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.pendidikan} onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}>
                  <option value="">Pilih</option>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                  <option value="D1">D1</option><option value="D2">D2</option><option value="D3">D3</option>
                  <option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Pekerjaan</Label>
                <Input className="h-9 text-xs" value={formData.pekerjaan} onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Desil</Label>
                <Input className="h-9 text-xs" type="number" min="1" max="10" value={formData.desil} onChange={(e) => setFormData({ ...formData, desil: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Kelompok UPA</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={formData.kelompokId} onChange={(e) => setFormData({ ...formData, kelompokId: e.target.value })}>
                  <option value="">Pilih Kelompok</option>
                  {kelompokList.map((k) => (<option key={k.id} value={String(k.id)}>{k.namaKelompok}</option>))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tahun Gabung</Label>
                <Input className="h-9 text-xs" type="number" min="2000" max="2099" value={formData.tahunGabung} onChange={(e) => setFormData({ ...formData, tahunGabung: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Alamat</Label>
              <textarea className="min-h-[60px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleEdit} disabled={saving || !formData.namaLengkap}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Anggota</DialogTitle>
            <DialogDescription>Informasi lengkap anggota.</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={`https://picsum.photos/seed/${selectedMember.namaLengkap}/112/112`} />
                  <AvatarFallback>{getInitials(selectedMember.namaLengkap)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{selectedMember.namaLengkap}</p>
                  <p className="text-xs text-zinc-500">{selectedMember.user?.email || "Tidak ada akun"}</p>
                  <div className="flex gap-1.5 mt-1">
                    <Badge variant="outline" className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(selectedMember.status)}`}>
                      {formatStatus(selectedMember.status)}
                    </Badge>
                    <Badge variant="outline" className={`rounded-lg px-2 py-0 text-[10px] ${getRoleBadgeClass(selectedMember.user?.role || "")}`}>
                      {formatRole(selectedMember.user?.role || "user")}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-zinc-500">NIK</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.nik || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">No. HP</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.noHp || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Jenis Kelamin</p>
                  <p className="mt-0.5 text-zinc-200">
                    {selectedMember.jenisKelamin === "L" ? "Laki-laki" : selectedMember.jenisKelamin === "P" ? "Perempuan" : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Tempat Lahir</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.tempatLahir || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Tanggal Lahir</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.tanggalLahir || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Tahun Gabung</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.tahunGabung || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Pendidikan</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.pendidikan || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Pekerjaan</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.pekerjaan || "-"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Desil</p>
                  <p className="mt-0.5 text-zinc-200">{selectedMember.desil ?? "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Alamat</p>
                <p className="mt-0.5 text-xs text-zinc-200">{selectedMember.alamat || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Kelompok UPA</p>
                <p className="mt-0.5 text-xs text-zinc-200">
                  {selectedMember.kelompok?.namaKelompok || "-"}
                  {selectedMember.kelompok?.wilayah && ` (${selectedMember.kelompok.wilayah})`}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
            {selectedMember && (
              <Button onClick={() => { setIsDetailOpen(false); openEdit(selectedMember); }}>
                Edit Data
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Anggota</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedMember?.namaLengkap}</strong>? Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data terkait.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600">
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
