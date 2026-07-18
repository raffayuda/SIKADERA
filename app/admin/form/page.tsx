"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import {
  IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconEye, IconShare, IconClipboardCheck,
} from "@tabler/icons-react";

interface FormData {
  id: number;
  judul: string;
  deskripsi: string | null;
  status: string;
  createdAt: string;
  jumlahResponse: number;
}

export default function FormPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await api.get<FormData[]>("/form");
      setForms(res);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/form/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch {}
  }

  const filtered = forms.filter((f) =>
    f.judul.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && forms.length === 0) {
    return (
      <>
        <Skeleton className="h-8 w-48 rounded-xl bg-white/5" />
        <Skeleton className="h-64 rounded-2xl bg-white/5 mt-4" />
      </>
    );
  }

  return (
    <>
      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] overflow-visible">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-3">
              <div className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari form..." />
              </div>
            </div>
            <Link href="/admin/form/create">
              <Button className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                <IconPlus className="mr-1.5 h-3.5 w-3.5" /> Buat Form Baru
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40 overflow-visible">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 bg-emerald-500/10 hover:bg-emerald-500/10">
                  <TableHead className="h-10 text-xs text-zinc-300">Form</TableHead>
                  <TableHead className="h-10 text-xs text-zinc-300 text-center">Status</TableHead>
                  <TableHead className="h-10 text-xs text-zinc-300 text-center">Response</TableHead>
                  <TableHead className="h-10 text-xs text-zinc-300">Tanggal</TableHead>
                  <TableHead className="h-10 text-right text-xs text-zinc-300">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-zinc-500">
                      Belum ada form
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((f) => (
                    <TableRow key={f.id} className="border-white/10 hover:bg-white/[0.03]">
                      <TableCell className="py-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-100">{f.judul}</p>
                          {f.deskripsi && <p className="truncate text-[10px] text-zinc-500 mt-0.5">{f.deskripsi}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Badge variant="outline" className={`rounded-lg px-2 py-px text-[10px] ${
                          f.status === "aktif"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                        }`}>
                          {f.status === "aktif" ? "Aktif" : "Ditutup"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-center text-xs text-zinc-300">{f.jumlahResponse}</TableCell>
                      <TableCell className="py-3 text-xs text-zinc-400">
                        {new Date(f.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100">
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="right">
                            <Link href={`/admin/form/${f.id}/edit`} className="flex items-center gap-2">
                              <DropdownMenuItem onClick={() => {}}>
                                <IconEdit className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/form/${f.id}/response`}>
                              <IconClipboardCheck className="mr-2 h-3.5 w-3.5" /> Lihat Response
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/form/${f.id}`);
                              const el = document.createElement("div");
                              el.className = "fixed bottom-4 right-4 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 shadow-lg";
                              el.textContent = "Link disalin!";
                              document.body.appendChild(el);
                              setTimeout(() => el.remove(), 2000);
                            }}>
                              <IconShare className="mr-2 h-3.5 w-3.5" /> Salin Link Publik
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(f.id)}>
                              <IconTrash className="mr-2 h-3.5 w-3.5" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Form</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus form ini? Semua response akan terhapus permanen.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
