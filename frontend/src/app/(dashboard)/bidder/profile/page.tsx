"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, CheckCircle, Phone, Mail, MapPin, FileText, Hash } from "lucide-react";

export default function CompanyProfilePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    pan: "",
    udyam: "",
    turnover: "",
    employeeCount: "",
    category: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage for now; will connect to backend later
    localStorage.setItem("gem_company_profile", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Company Profile</h2>
        <p className="text-slate-500 mt-1">Fill in your company details once — they will auto-fill all bid applications.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Details */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">Basic Company Details</CardTitle>
            </div>
            <CardDescription>Name and contact information of your registered company.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Company / Firm Name *</Label>
              <Input required placeholder="e.g. Sharma Enterprises Pvt. Ltd." value={form.companyName} onChange={e => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Owner / Director Name *</Label>
              <Input required placeholder="Full name" value={form.ownerName} onChange={e => update("ownerName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input required className="pl-9" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={e => update("phone", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Official Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input required className="pl-9" type="email" placeholder="contact@company.com" value={form.email} onChange={e => update("email", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">Registered Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-3">
              <Label>Street Address *</Label>
              <Input required placeholder="Plot No., Street, Area" value={form.address} onChange={e => update("address", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>City *</Label>
              <Input required placeholder="City" value={form.city} onChange={e => update("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>State *</Label>
              <Input required placeholder="State" value={form.state} onChange={e => update("state", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>PIN Code *</Label>
              <Input required placeholder="6-digit PIN" value={form.pincode} onChange={e => update("pincode", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Statutory Details */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">Statutory & Registration Numbers</CardTitle>
            </div>
            <CardDescription>These are verified against government databases during bid submission.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GSTIN *</Label>
              <Input required placeholder="22AAAAA0000A1Z5" value={form.gstin} onChange={e => update("gstin", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>PAN Number *</Label>
              <Input required placeholder="AAAAA0000A" value={form.pan} onChange={e => update("pan", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Udyam Registration Number</Label>
              <Input placeholder="UDYAM-XX-00-0000000" value={form.udyam} onChange={e => update("udyam", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">Business Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Annual Turnover (₹ Cr)</Label>
              <Input type="number" placeholder="e.g. 2.5" value={form.turnover} onChange={e => update("turnover", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Employee Count</Label>
              <Input type="number" placeholder="e.g. 45" value={form.employeeCount} onChange={e => update("employeeCount", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Enterprise Category</Label>
              <select
                className="w-full h-10 rounded-md border border-slate-200 px-3 text-sm text-slate-900 bg-white"
                value={form.category}
                onChange={e => update("category", e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Micro">Micro Enterprise</option>
                <option value="Small">Small Enterprise</option>
                <option value="Medium">Medium Enterprise</option>
                <option value="Large">Large Enterprise</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" className="bg-blue-700 hover:bg-blue-800 px-8">
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
          {saved && (
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
              <CheckCircle className="h-4 w-4" />
              Profile saved successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
