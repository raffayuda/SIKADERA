"use client";

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const summaryCards = [
  {
    title: "Total Anggota",
    value: "2,845",
    delta: "+8.4%",
    note: "dari bulan lalu",
    tone: "up",
  },
  {
    title: "Kader Aktif",
    value: "2,137",
    delta: "+6.2%",
    note: "dari bulan lalu",
    tone: "up",
  },
  {
    title: "Agenda Bulan Ini",
    value: "12",
    delta: "-2",
    note: "dari bulan lalu",
    tone: "down",
  },
  {
    title: "Iuran Masuk",
    value: "Rp48.392.740",
    delta: "+12.6%",
    note: "dari bulan lalu",
    tone: "up",
  },
  {
    title: "Kehadiran UPA",
    value: "76.4%",
    delta: "-2.1%",
    note: "dari bulan lalu",
    tone: "down",
  },
];

const activityChartData = [
  { month: "Mar", value: 68.2 },
  { month: "Apr", value: 71.9 },
  { month: "Mei", value: 73.6 },
  { month: "Jun", value: 74.8 },
  { month: "Jul", value: 75.6 },
  { month: "Aug", value: 76.4 },
];

const activityChartConfig = {
  value: {
    label: "Rata-rata kehadiran",
    color: "hsl(152 54% 44%)",
  },
} satisfies ChartConfig;

const sebaranData = [
  { label: "Babakan", value: 512 },
  { label: "Dramaga", value: 376 },
  { label: "Cikarawang", value: 298 },
  { label: "Cikerang", value: 274 },
  { label: "Cihideung Udik", value: 221 },
];

const newMembers = [
  {
    name: "Ahmad Fauzi",
    area: "Dramaga",
    date: "16 Sep",
  },
  {
    name: "Siti Nurhaliza",
    area: "Babakan",
    date: "16 Sep",
  },
  {
    name: "Dedi Kurniawan",
    area: "Cikerang",
    date: "15 Sep",
  },
  {
    name: "Nadia Putri",
    area: "Cikarawang",
    date: "15 Sep",
  },
];

const scheduleItems = [
  {
    title: "Kajian Rutin UPA Babakan",
    date: "22 Sep 2026",
    time: "19:30 WIB",
    location: "Masjid Al-Ikhlas Babakan",
    tag: "UPA",
  },
  {
    title: "Rapat Pleno DPC",
    date: "24 Sep 2026",
    time: "20:00 WIB",
    location: "Kantor DPC Dramaga",
    tag: "Internal",
  },
  {
    title: "Bakti Sosial",
    date: "28 Sep 2026",
    time: "07:00 WIB",
    location: "Desa Dramaga",
    tag: "Publik",
  },
];

const attendanceRows = [
  {
    name: "UPA Babakan",
    murobbi: "Ust. Hamdan",
    date: "16 Sep",
    percent: 82.6,
  },
  {
    name: "UPA Dramaga",
    murobbi: "Ust. Farid",
    date: "16 Sep",
    percent: 76.2,
  },
  {
    name: "UPA Cikarawang",
    murobbi: "Ust. Anwar",
    date: "15 Sep",
    percent: 71.4,
  },
  {
    name: "UPA Cihideung",
    murobbi: "Ust. Ibrahim",
    date: "15 Sep",
    percent: 68.9,
  },
];

const duesData = [
  { status: "paid", value: 64.7, count: "1,842" },
  { status: "overdue", value: 28.9, count: "823" },
  { status: "pending", value: 6.3, count: "180" },
];

const duesChartConfig = {
  paid: {
    label: "Sudah Bayar",
    color: "hsl(152 54% 44%)",
  },
  overdue: {
    label: "Menunggak",
    color: "hsl(43 96% 56%)",
  },
  pending: {
    label: "Belum Jatuh Tempo",
    color: "hsl(0 0% 60%)",
  },
} satisfies ChartConfig;

const inventoryStats = [
  { label: "Total Barang", value: "126" },
  { label: "Tersedia", value: "78" },
  { label: "Dipinjam", value: "34" },
  { label: "Rusak", value: "14" },
];

export default function Home() {
  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              {summaryCards.map((card) => (
                <Card
                  key={card.title}
                  className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <CardContent className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0 space-y-1.5">
                      <p className="truncate text-[11px] font-medium text-zinc-400">
                        {card.title}
                      </p>

                      <p className="truncate text-xl font-semibold tracking-tight text-zinc-50">
                        {card.value}
                      </p>

                      <p className="text-[11px] text-zinc-500">
                        <span
                          className={
                            card.tone === "down"
                              ? "text-rose-300"
                              : "text-emerald-300"
                          }
                        >
                          {card.delta}
                        </span>{" "}
                        {card.note}
                      </p>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60">
                      <span className="h-3.5 w-3.5 rounded-full border border-white/20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Grafik Keaktifan UPA
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Rata-rata kehadiran 6 bulan terakhir
                    </CardDescription>
                  </div>

                  <Button
                    className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    6 Bulan
                  </Button>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <ChartContainer
                    className="h-[180px] w-full"
                    config={activityChartConfig}
                  >
                    <AreaChart
                      data={activityChartData}
                      margin={{ left: 4, right: 4, top: 8, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                      />
                      <YAxis hide />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Area
                        dataKey="value"
                        type="monotone"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                        fill="var(--color-value)"
                        fillOpacity={0.18}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Peta Sebaran Kader
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Sebaran kader aktif per desa
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-2">
                  {sebaranData.map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300">{item.label}</span>
                        <span className="font-medium text-zinc-100">
                          {item.value}
                        </span>
                      </div>

                      <Progress
                        className="h-1.5 bg-white/5"
                        value={(item.value / 512) * 100}
                      />
                    </div>
                  ))}

                  <Separator className="bg-white/10" />

                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Total 12 Desa</span>
                    <span className="font-medium text-zinc-300">2,137</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-2">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Pendaftaran Baru
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Menunggu verifikasi
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-2">
                  {newMembers.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={`https://picsum.photos/seed/${member.name}/64/64`}
                            alt={member.name}
                          />
                          <AvatarFallback className="text-[10px]">
                            {member.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-zinc-100">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {member.area}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] text-zinc-500">
                        {member.date}
                      </span>
                    </div>
                  ))}

                  <Button
                    className="h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    Lihat semua
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Jadwal Kegiatan Terdekat
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Agenda terdekat pekan ini
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-2">
                  {scheduleItems.map((item, index) => (
                    <div key={item.title} className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-xs font-medium text-zinc-100">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {item.date} - {item.time}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500">
                            {item.location}
                          </p>
                        </div>

                        <Badge
                          className={
                            item.tag === "Publik"
                              ? "rounded-lg border-emerald-500/40 bg-emerald-500/10 px-2 py-0 text-[10px] text-emerald-300"
                              : item.tag === "UPA"
                                ? "rounded-lg border-sky-500/40 bg-sky-500/10 px-2 py-0 text-[10px] text-sky-300"
                                : "rounded-lg border-white/10 px-2 py-0 text-[10px] text-zinc-300"
                          }
                          variant="outline"
                        >
                          {item.tag}
                        </Badge>
                      </div>

                      {index < scheduleItems.length - 1 ? (
                        <Separator className="bg-white/10" />
                      ) : null}
                    </div>
                  ))}

                  <Button
                    className="h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    Lihat semua agenda
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Absensi UPA Terbaru
                  </CardTitle>
                  <CardDescription className="text-xs">
                    4 pertemuan terakhir
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="h-9 text-xs text-zinc-300">
                          Nama UPA
                        </TableHead>
                        <TableHead className="h-9 text-xs text-zinc-300">
                          Jadwal
                        </TableHead>
                        <TableHead className="h-9 text-right text-xs text-zinc-300">
                          Hadir
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {attendanceRows.map((row) => (
                        <TableRow key={row.name} className="border-white/10">
                          <TableCell className="py-2 text-xs text-zinc-100">
                            {row.name}
                            <p className="text-[11px] text-zinc-500">
                              {row.murobbi}
                            </p>
                          </TableCell>

                          <TableCell className="py-2 text-xs text-zinc-400">
                            {row.date}
                          </TableCell>

                          <TableCell className="py-2 text-right text-xs">
                            <span className="font-medium text-emerald-300">
                              {row.percent.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button
                    className="mt-3 h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    Lihat rapor keaktifan
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Status Iuran Bulan Ini
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-2">
                  <div className="relative">
                    <ChartContainer
                      className="h-[165px] w-full"
                      config={duesChartConfig}
                    >
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              indicator="dot"
                              nameKey="status"
                            />
                          }
                        />

                        <Pie
                          data={duesData}
                          dataKey="value"
                          nameKey="status"
                          innerRadius={48}
                          outerRadius={68}
                          strokeWidth={0}
                        >
                          {duesData.map((entry) => (
                            <Cell
                              key={entry.status}
                              fill={
                                entry.status === "paid"
                                  ? "var(--color-paid)"
                                  : entry.status === "overdue"
                                    ? "var(--color-overdue)"
                                    : "var(--color-pending)"
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xl font-semibold tracking-tight text-zinc-50">
                        2,845
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Total Anggota
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-300">
                    {duesData.map((entry) => (
                      <div
                        key={entry.status}
                        className="flex items-center justify-between"
                      >
                        <span className="text-zinc-400">
                          {entry.status === "paid"
                            ? "Sudah Bayar"
                            : entry.status === "overdue"
                              ? "Menunggak"
                              : "Belum Jatuh Tempo"}
                        </span>

                        <span className="font-medium text-zinc-100">
                          {entry.count} ({entry.value.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    Lihat laporan iuran
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-7">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Inventaris Logistik
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {inventoryStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-zinc-950/50 px-3 py-2"
                      >
                        <p className="text-[11px] text-zinc-500">
                          {stat.label}
                        </p>
                        <p className="text-base font-semibold text-zinc-100">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="mt-3 h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    Lihat inventaris
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-5">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Peminjaman Aktif
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold tracking-tight text-zinc-50">
                        4
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Peminjaman aktif
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-rose-300">1</p>
                      <p className="text-[11px] text-zinc-500">
                        Terlambat kembali
                      </p>
                    </div>
                  </div>

                  <Button
                    className="h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    size="sm"
                    variant="outline"
                  >
                    Lihat semua peminjaman
                  </Button>
                </CardContent>
                </Card>
                </section>
                </>
                );
                }