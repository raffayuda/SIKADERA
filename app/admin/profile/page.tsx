"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCamera,
  IconDeviceFloppy,
  IconCreditCard,
  IconQrcode,
  IconShieldCheck,
  IconWifi,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Admin DPC Dramaga",
    role: "Super Admin",
    memberId: "DPC-DRM-2026-001",
    email: "admin@sikadera.org",
    phone: "+62 812 3456 7890",
    address: "Kec. Dramaga, Kabupaten Bogor, Jawa Barat",
    joinedDate: "January 2026",
    status: "Aktif",
  });

  // Data for QR Code - typically a URL to verify member
  const qrValue = JSON.stringify({
    id: user.memberId,
    name: user.name,
    role: user.role,
    status: user.status,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Side: KTA Design */}
        <div className="w-full lg:w-[450px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <IconCreditCard className="h-5 w-5 text-emerald-400" />
              Digital Member Card (KTA)
            </h2>
            
            {/* The ATM/VISA Style Card */}
            <div className="relative h-[260px] w-full overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl transition-transform hover:scale-[1.02]">
              {/* Card Background Patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-zinc-900 to-zinc-900" />
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 blur-[60px]" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-emerald-500/5 blur-[50px]" />
              
              {/* Card Glossy Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_50%,rgba(255,255,255,0)_100%)]" />

              <div className="relative flex h-full flex-col justify-between p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20">
                        SK
                      </div>
                      <span className="font-bold tracking-tight text-white">SIKADERA</span>
                    </div>
                    <p className="text-[10px] font-medium text-emerald-400/80 uppercase tracking-widest">DPC Dramaga Member</p>
                  </div>
                  <IconWifi className="h-6 w-6 text-zinc-500 rotate-90" />
                </div>

                {/* Chip & NFC Icon Area */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-10 w-12 rounded-lg bg-gradient-to-br from-amber-200/80 via-amber-400/80 to-amber-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                  <div className="flex flex-col gap-0.5">
                    <div className="h-0.5 w-4 bg-zinc-600 rounded-full" />
                    <div className="h-0.5 w-6 bg-zinc-600 rounded-full" />
                    <div className="h-0.5 w-4 bg-zinc-600 rounded-full" />
                  </div>
                </div>

                {/* Member Details & QR */}
                <div className="mt-auto flex items-end justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Member Name</p>
                      <p className="text-lg font-bold tracking-wide text-white drop-shadow-md">{user.name}</p>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest">ID Number</p>
                        <p className="font-mono text-xs font-semibold text-zinc-300 tracking-wider">{user.memberId}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest">Status</p>
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{user.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code on Card */}
                  <div className="rounded-xl border border-white/20 bg-white/90 p-2 shadow-xl backdrop-blur-md">
                    <QRCodeSVG 
                      value={qrValue} 
                      size={64} 
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 text-center px-4">
              KTA Digital ini adalah identitas resmi kader DPC Dramaga. Gunakan QR Code di atas untuk verifikasi saat kegiatan.
            </p>
          </div>
        </div>

        {/* Right Side: Profile Settings */}
        <div className="flex-1">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Profile Settings</CardTitle>
              <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-white/10 shadow-xl">
                    <AvatarImage src="https://picsum.photos/seed/admin/128/128" />
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-xl font-bold">AD</AvatarFallback>
                  </Avatar>
                  <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconCamera className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">{user.name}</h3>
                  <p className="text-sm text-zinc-400">{user.role}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 rounded-lg text-[11px] border-white/10 bg-white/5 hover:bg-white/10">
                      Change Photo
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 rounded-lg text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs text-zinc-400">Full Name</Label>
                  <div className="relative">
                    <IconUser className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input id="name" defaultValue={user.name} className="pl-10 h-10 rounded-xl border-white/10 bg-zinc-950/50 text-zinc-100 focus:border-emerald-500/50 focus:ring-emerald-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-zinc-400">Email Address</Label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input id="email" type="email" defaultValue={user.email} className="pl-10 h-10 rounded-xl border-white/10 bg-zinc-950/50 text-zinc-100 focus:border-emerald-500/50 focus:ring-emerald-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs text-zinc-400">Phone Number</Label>
                  <div className="relative">
                    <IconPhone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input id="phone" defaultValue={user.phone} className="pl-10 h-10 rounded-xl border-white/10 bg-zinc-950/50 text-zinc-100 focus:border-emerald-500/50 focus:ring-emerald-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs text-zinc-400">Role / Position</Label>
                  <div className="relative">
                    <IconShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input id="role" defaultValue={user.role} disabled className="pl-10 h-10 rounded-xl border-white/10 bg-zinc-800/50 text-zinc-400 cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-xs text-zinc-400">Home Address</Label>
                  <div className="relative">
                    <IconMapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input id="address" defaultValue={user.address} className="pl-10 h-10 rounded-xl border-white/10 bg-zinc-950/50 text-zinc-100 focus:border-emerald-500/50 focus:ring-emerald-500/20" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" className="rounded-xl border border-white/10 hover:bg-white/5">
                  Cancel
                </Button>
                <Button className="rounded-xl bg-emerald-500 px-6 font-semibold text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <IconDeviceFloppy className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verification Info */}
      <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 border shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <IconQrcode className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-100">QR Code Verification</h4>
            <p className="text-xs text-emerald-400/80">
              Scan this QR code from any SIKADERA mobile app or event scanner to instantly verify your membership and attendance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
