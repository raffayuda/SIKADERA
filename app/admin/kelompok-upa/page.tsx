"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  IconUsersGroup,
  IconUsers,
  IconUserCheck,
  IconClock,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconRefresh,
  IconCalendarEvent,
  IconMapPin,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

interface KetuaData {
  id: number;
  namaLengkap: string;
  noHp: string | null;
}

interface KelompokData {
  id: number;
  namaKelompok: string;
  ketuaId: number | null;
  wilayah: string | null;
  jadwalRutin: string | null;
  deskripsi: string | null;
  jumlahAnggota: number;
  ketua: KetuaData | null;
}

interface KelompokForm {
  namaKelompok: string;
  wilayah: string;
  jadwalRutin: string;
  deskripsi: string;
}

const emptyForm: KelompokForm = {
  namaKelompok: "",
  wilayah: "",
  jadwalRutin: "",
  deskripsi: "",
};

export default function KelompokUpaPage() {
  const [kelompokList, setKelompokList] = useState<KelompokData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [selectedGroup, setSelectedGroup] = useState<KelompokData | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<KelompokForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<KelompokData[]>("/kelompok-upa");
      setKelompokList(res);
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
    return kelompokList.filter((k) => {
      const kw = search.toLowerCase();
      return (
        !kw ||
        k.namaKelompok.toLowerCase().includes(kw) ||
        (k.wilayah && k.wilayah.toLowerCase().includes(kw)) ||
        (k.ketua && k.ketua.namaLengkap.toLowerCase().includes(kw))
      );
    });
  }, [kelompokList, search]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / perPage));
  const paginatedList = filteredList.slice((page - 1) * perPage, page * perPage);

  function resetForm() {
    setFormData(emptyForm);
  }

  async function handleAdd() {
    setSaving(true);
    try {
      await api.post("/kelompok-upa", formData);
      setIsAddOpen(false);
      resetForm();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah kelompok");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!selectedGroup) return;
    setSaving(true);
    try {
      await api.put(`/kelompok-upa/${selectedGroup.id}`, formData);
      setIsEditOpen(false);
      setSelectedGroup(null);
      resetForm();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupdate kelompok");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedGroup) return;
    try {
      await api.delete(`/kelompok-upa/${selectedGroup.id}`);
      setIsDeleteOpen(false);
      setSelectedGroup(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus kelompok");
    }
  }

  function openEdit(group: KelompokData) {
    setSelectedGroup(group);
    setFormData({
      namaKelompok: group.namaKelompok,
      wilayah: group.wilayah || "",
      jadwalRutin: group.jadwalRutin || "",
      deskripsi: group.deskripsi || "",
    });
    setIsEditOpen(true);
  }

  function openDelete(group: KelompokData) {
    setSelectedGroup(group);
    setIsDeleteOpen(true);
  }

  const totalKelompok = kelompokList.length;
  const totalAnggota = kelompokList.reduce((s, k) => s + k.jumlahAnggota, 0);

  const summaryCards = [
    { title: "Total Kelompok", value: String(totalKelompok), icon: IconUsersGroup, tone: "emerald" },
    { title: "Total Anggota", value: String(totalAnggota), icon: IconUsers, tone: "sky" },
  ];

  if (loading && kelompokList.length === 0) {
    return (
      <>
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-white/10 bg-zinc-900/60">
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
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
          <CardContent className="p-4">
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
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
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                  card.tone === "emerald"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-sky-500/20 bg-sky-500/10 text-sky-300"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">{card.title}</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1.5fr_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari nama kelompok, wilayah, ketua..."
                />
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
              Buat Kelompok
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
            {error && (
              <div className="mx-3 mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                {error}
                <button onClick={() => setError(null)} className="ml-2 underline">Tutup</button>
              </div>
            )}

            <div>
              {paginatedList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <IconUsersGroup className="mb-3 h-10 w-10 text-zinc-600" />
                  <p className="text-sm font-medium text-zinc-400">Tidak ada kelompok UPA</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {search ? "Coba ubah pencarian" : "Klik Buat Kelompok untuk menambahkan data pertama"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-emerald-500/10 hover:bg-emerald-500/10">
                      <TableHead className="h-10 text-xs text-zinc-300">Kelompok</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Ketua</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Wilayah</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300">Jadwal</TableHead>
                      <TableHead className="h-10 text-xs text-zinc-300 text-center">Anggota</TableHead>
                      <TableHead className="h-10 text-right text-xs text-zinc-300">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedList.map((group) => (
                      <TableRow key={group.id} className="border-white/10 hover:bg-white/[0.03]">
                        <TableCell className="min-w-[180px] py-2">
                          <Link href={`/admin/kelompok-upa/${group.id}`} className="flex items-center gap-2 group">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                              <IconUsersGroup className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                                {group.namaKelompok}
                              </p>
                              {group.deskripsi && (
                                <p className="truncate text-[10px] text-zinc-500">{group.deskripsi}</p>
                              )}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="min-w-[130px] py-2 text-xs text-zinc-300">
                          {group.ketua ? (
                            <div>
                              <p className="text-zinc-100">{group.ketua.namaLengkap}</p>
                              {group.ketua.noHp && <p className="text-[10px] text-zinc-500">{group.ketua.noHp}</p>}
                            </div>
                          ) : (
                            <span className="text-zinc-500">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-xs text-zinc-300">{group.wilayah || "-"}</TableCell>
                        <TableCell className="min-w-[130px] py-2 text-xs text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <IconCalendarEvent className="h-3.5 w-3.5 text-zinc-500" />
                            {group.jadwalRutin || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <Badge variant="outline" className="rounded-lg px-2 py-0 text-[10px] border-sky-500/30 bg-sky-500/10 text-sky-300">
                            {group.jumlahAnggota}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100">
                                <IconDots className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right">
                              <DropdownMenuItem>
                                <Link href={`/admin/kelompok-upa/${group.id}`} className="flex items-center gap-2">
                                  <IconEye className="h-3.5 w-3.5" />
                                  Detail
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(group)}>
                                <IconEdit className="mr-2 h-3.5 w-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onClick={() => openDelete(group)}>
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
                <div className="flex items-center justify-between p-3">
                  <p className="text-xs text-zinc-500">
                    Menampilkan <span className="text-zinc-300">{filteredList.length}</span> kelompok
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline" size="icon" disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-40"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-zinc-500">{page} / {totalPages}</span>
                    <Button
                      variant="outline" size="icon" disabled={page >= totalPages}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buat Kelompok UPA</DialogTitle>
            <DialogDescription>Buat kelompok pembinaan baru.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Nama Kelompok</Label>
                <Input className="h-9 text-xs" placeholder="Nama UPA" value={formData.namaKelompok} onChange={(e) => setFormData({ ...formData, namaKelompok: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Wilayah</Label>
                <Input className="h-9 text-xs" placeholder="Desa/Kelurahan" value={formData.wilayah} onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jadwal Rutin</Label>
                <Input className="h-9 text-xs" placeholder="Contoh: Jumat 19:30" value={formData.jadwalRutin} onChange={(e) => setFormData({ ...formData, jadwalRutin: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Deskripsi</Label>
              <textarea className="min-h-[60px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y" placeholder="Deskripsi kelompok" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleAdd} disabled={saving || !formData.namaKelompok}>{saving ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Kelompok UPA</DialogTitle>
            <DialogDescription>Perbarui data kelompok {selectedGroup?.namaKelompok}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Nama Kelompok</Label>
                <Input className="h-9 text-xs" value={formData.namaKelompok} onChange={(e) => setFormData({ ...formData, namaKelompok: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Wilayah</Label>
                <Input className="h-9 text-xs" value={formData.wilayah} onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jadwal Rutin</Label>
                <Input className="h-9 text-xs" value={formData.jadwalRutin} onChange={(e) => setFormData({ ...formData, jadwalRutin: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Deskripsi</Label>
              <textarea className="min-h-[60px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleEdit} disabled={saving || !formData.namaKelompok}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Kelompok</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedGroup?.namaKelompok}</strong>? Data anggota dan riwayat absensi akan terhapus secara permanen.
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
