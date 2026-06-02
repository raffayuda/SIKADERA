"use client";

import { useMemo, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import {
  IconChartDots,
  IconDownload,
  IconFilter,
  IconMapPin,
  IconMapPins,
  IconRefresh,
  IconSearch,
  IconTargetArrow,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

type ClusterStatus = "Basis Kuat" | "Berkembang" | "Perlu Penguatan";

type Village = {
  name: string;
  kader: number;
  anggota: number;
  upa: number;
  growth: string;
  score: number;
  status: ClusterStatus;
  center: [number, number];
  description: string;
};

const summaryCards = [
  {
    title: "Total Desa Terpantau",
    value: "12",
    note: "wilayah Dramaga",
    icon: IconMapPins,
    tone: "emerald",
  },
  {
    title: "Total Kader Aktif",
    value: "2,137",
    note: "tersebar di 12 desa",
    icon: IconUsers,
    tone: "sky",
  },
  {
    title: "Basis Kuat",
    value: "4",
    note: "desa prioritas stabil",
    icon: IconTrendingUp,
    tone: "emerald",
  },
  {
    title: "Perlu Penguatan",
    value: "3",
    note: "butuh kaderisasi aktif",
    icon: IconTargetArrow,
    tone: "amber",
  },
];

const villageData: Village[] = [
  {
    name: "Babakan",
    kader: 512,
    anggota: 684,
    upa: 5,
    growth: "+12.4%",
    score: 92,
    status: "Basis Kuat",
    center: [106.7298, -6.5594],
    description: "Konsentrasi kader paling tinggi and UPA aktif stabil.",
  },
  {
    name: "Dramaga",
    kader: 376,
    anggota: 498,
    upa: 4,
    growth: "+8.7%",
    score: 84,
    status: "Basis Kuat",
    center: [106.7385, -6.5741],
    description: "Basis aktif dengan agenda and pembinaan berjalan rutin.",
  },
  {
    name: "Cikarawang",
    kader: 298,
    anggota: 362,
    upa: 3,
    growth: "+6.2%",
    score: 76,
    status: "Berkembang",
    center: [106.7186, -6.5689],
    description: "Pertumbuhan kader cukup baik and perlu konsolidasi lanjutan.",
  },
  {
    name: "Ciherang",
    kader: 274,
    anggota: 331,
    upa: 3,
    growth: "+5.1%",
    score: 72,
    status: "Berkembang",
    center: [106.7468, -6.5868],
    description: "Sebaran kader mulai merata namun UPA perlu diperkuat.",
  },
  {
    name: "Cihideung Udik",
    kader: 221,
    anggota: 287,
    upa: 2,
    growth: "+3.9%",
    score: 64,
    status: "Berkembang",
    center: [106.6991, -6.5772],
    description: "Potensi wilayah cukup baik tetapi keaktifan perlu ditingkatkan.",
  },
  {
    name: "Cihideung Ilir",
    kader: 186,
    anggota: 244,
    upa: 2,
    growth: "+2.8%",
    score: 58,
    status: "Perlu Penguatan",
    center: [106.7075, -6.5852],
    description: "Jumlah kader belum optimal dibanding potensi anggota.",
  },
  {
    name: "Margajaya",
    kader: 164,
    anggota: 219,
    upa: 2,
    growth: "+2.2%",
    score: 54,
    status: "Perlu Penguatan",
    center: [106.7551, -6.5673],
    description: "Butuh aktivasi agenda lokal and rekrutmen kader baru.",
  },
  {
    name: "Petir",
    kader: 106,
    anggota: 171,
    upa: 1,
    growth: "+1.5%",
    score: 43,
    status: "Perlu Penguatan",
    center: [106.7281, -6.5992],
    description: "Sebaran kader masih rendah and perlu pembinaan intensif.",
  },
];

const clusterInsights = [
  {
    title: "Babakan menjadi basis kader terkuat",
    description: "512 kader aktif, 5 kelompok UPA, and skor sebaran tertinggi.",
    tone: "emerald",
  },
  {
    title: "Petir perlu penguatan kaderisasi",
    description: "Jumlah kader aktif masih rendah dibanding potensi anggota.",
    tone: "amber",
  },
  {
    title: "Cikarawang and Ciherang berkembang",
    description: "Pertumbuhan positif, tetapi masih perlu konsolidasi pembinaan.",
    tone: "sky",
  },
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
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStatusBadgeClass(status: ClusterStatus) {
  switch (status) {
    case "Basis Kuat":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Berkembang":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "Perlu Penguatan":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getMarkerClass(status: ClusterStatus, isSelected: boolean) {
  const selectedClass = isSelected
    ? "scale-110 ring-4 ring-white/25"
    : "scale-100";

  switch (status) {
    case "Basis Kuat":
      return `${selectedClass} border-emerald-300/70 bg-emerald-400 text-emerald-950 shadow-emerald-500/40`;
    case "Berkembang":
      return `${selectedClass} border-sky-300/70 bg-sky-400 text-sky-950 shadow-sky-500/40`;
    case "Perlu Penguatan":
      return `${selectedClass} border-amber-300/70 bg-amber-400 text-amber-950 shadow-amber-500/40`;
    default:
      return `${selectedClass} border-zinc-400 bg-zinc-300 text-zinc-950`;
  }
}

export default function PetaSebaranPage() {
  const [search, setSearch] = useState("");
  const [activeCluster, setActiveCluster] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState<Village>(
    villageData[0]
  );

  const filteredVillages = useMemo(() => {
    return villageData.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCluster =
        activeCluster === "all" || item.status === activeCluster;

      return matchSearch && matchCluster;
    });
  }, [search, activeCluster]);

  const maxKader = Math.max(...villageData.map((item) => item.kader));

  const handleSelectVillage = (village: Village) => {
    setSelectedVillage(village);
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
                Peta Interaktif Sebaran Kader
              </CardTitle>
              <CardDescription className="text-xs">
                Visualisasi titik konsentrasi kader berbasis desa.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300"
              >
                Basis Kuat
              </Badge>
              <Badge
                variant="outline"
                className="rounded-xl border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-300"
              >
                Berkembang
              </Badge>
              <Badge
                variant="outline"
                className="rounded-xl border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-300"
              >
                Perlu Penguatan
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="relative h-[630px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60">
              <Map
                key={`${selectedVillage.name}-${selectedVillage.center[0]}-${selectedVillage.center[1]}`}
                center={selectedVillage.center}
                zoom={13}
                theme="dark"
                className="h-full w-full"
              >
                {villageData.map((village) => {
                  const isSelected =
                    selectedVillage.name === village.name;

                  return (
                    <MapMarker
                      key={village.name}
                      longitude={village.center[0]}
                      latitude={village.center[1]}
                      onClick={() => handleSelectVillage(village)}
                    >
                      <MarkerContent>
                        <button
                          type="button"
                          className={[
                            "relative flex h-10 w-10 items-center justify-center rounded-full border text-[10px] font-bold shadow-lg transition duration-200 hover:scale-110",
                            getMarkerClass(village.status, isSelected),
                          ].join(" ")}
                        >
                          <span className="absolute inset-0 rounded-full bg-current opacity-20 blur-md" />
                          <span className="relative z-10">
                            {village.kader}
                          </span>
                        </button>
                      </MarkerContent>

                      <MarkerTooltip>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold">
                            {village.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {village.kader} kader • {village.status}
                          </p>
                        </div>
                      </MarkerTooltip>
                    </MapMarker>
                  );
                })}
              </Map>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/5 via-transparent to-zinc-950/30" />

              <div className="absolute bottom-4 left-4 z-20 max-w-[360px] rounded-2xl border border-white/10 bg-zinc-950/85 p-4 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-50">
                      {selectedVillage.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {selectedVillage.description}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`shrink-0 rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                      selectedVillage.status
                    )}`}
                  >
                    {selectedVillage.status}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <p className="text-[10px] text-zinc-500">Kader</p>
                    <p className="text-sm font-semibold text-zinc-100">
                      {selectedVillage.kader}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <p className="text-[10px] text-zinc-500">Anggota</p>
                    <p className="text-sm font-semibold text-zinc-100">
                      {selectedVillage.anggota}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <p className="text-[10px] text-zinc-500">UPA</p>
                    <p className="text-sm font-semibold text-zinc-100">
                      {selectedVillage.upa}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Filter Wilayah
            </CardTitle>
            <CardDescription className="text-xs">
              Klik wilayah untuk memindahkan fokus peta.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-4 pt-0">
            <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
              <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                placeholder="Cari desa..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                "all",
                "Basis Kuat",
                "Berkembang",
                "Perlu Penguatan",
              ].map((cluster) => {
                const isActive = activeCluster === cluster;

                return (
                  <Button
                    key={cluster}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCluster(cluster)}
                    className={[
                      "h-8 rounded-xl px-3 text-xs font-medium",
                      isActive
                        ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    {cluster === "all" ? "Semua" : cluster}
                  </Button>
                );
              })}
            </div>

            <Separator className="bg-white/10" />

            <div className="sidebar-scroll max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {filteredVillages.map((village) => {
                const isSelected = selectedVillage.name === village.name;

                return (
                  <button
                    key={village.name}
                    type="button"
                    onClick={() => handleSelectVillage(village)}
                    className={[
                      "w-full rounded-2xl border p-3 text-left transition duration-200",
                      isSelected
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-white/10 bg-zinc-950/40 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-zinc-100">
                          {village.name}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {village.kader} kader • {village.upa} UPA aktif
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                          village.status
                        )}`}
                      >
                        {village.status}
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">
                          Skor sebaran
                        </span>
                        <span className="font-medium text-zinc-200">
                          {village.score}/100
                        </span>
                      </div>
                      <Progress
                        value={(village.kader / maxKader) * 100}
                        className="h-1.5 bg-white/5"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-8">
          <CardHeader className="p-4 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Ranking Sebaran Per Desa
                </CardTitle>
                <CardDescription className="text-xs">
                  Urutan wilayah berdasarkan jumlah kader aktif.
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
            {villageData.map((village, index) => (
              <button
                key={village.name}
                type="button"
                onClick={() => handleSelectVillage(village)}
                className={[
                  "w-full rounded-2xl border p-3 text-left transition duration-200",
                  selectedVillage.name === village.name
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-white/10 bg-zinc-950/40 hover:bg-white/[0.04]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-300">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-100">
                        {village.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {village.anggota} anggota • {village.upa} UPA •{" "}
                        {village.growth}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`hidden rounded-lg px-2 py-0 text-[10px] md:inline-flex ${getStatusBadgeClass(
                        village.status
                      )}`}
                    >
                      {village.status}
                    </Badge>

                    <p className="w-16 text-right text-xs font-semibold text-zinc-100">
                      {village.kader}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress
                    value={(village.kader / maxKader) * 100}
                    className="h-1.5 bg-white/5"
                  />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Insight Klusterisasi
              </CardTitle>
              <CardDescription className="text-xs">
                Ringkasan analisis wilayah kader.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {clusterInsights.map((insight) => (
                <div
                  key={insight.title}
                  className={`rounded-2xl border p-3 ${getToneClass(
                    insight.tone
                  )}`}
                >
                  <p className="text-xs font-semibold">{insight.title}</p>
                  <p className="mt-1 text-[11px] leading-5 opacity-75">
                    {insight.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Rekomendasi Penguatan
              </CardTitle>
              <CardDescription className="text-xs">
                Wilayah yang perlu diprioritaskan.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-4 w-4 text-amber-300" />
                  <p className="text-xs font-semibold text-amber-200">
                    Prioritas 1: Petir
                  </p>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-amber-100/70">
                  Tambah minimal 1 kelompok UPA and lakukan agenda
                  rekrutmen lokal.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconChartDots className="h-4 w-4 text-sky-300" />
                  <p className="text-xs font-semibold text-sky-200">
                    Optimalkan wilayah berkembang
                  </p>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-sky-100/70">
                  Cikarawang and Ciherang perlu monitoring kehadiran UPA
                  bulanan.
                </p>
              </div>

              <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                Buat Rencana Penguatan
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}