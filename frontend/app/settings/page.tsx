"use client";

import { useEffect, useRef, useState } from "react";
import {
  Save,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  User,
  Mail,
  Phone,
  Camera,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { apiGet, apiSend } from "@/lib/api";

interface AdminProfile {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
}

export default function SettingsPage() {
  // Admin Profile Info
  const [adminName, setAdminName] = useState("Kushal Sharma");
  const [adminEmail, setAdminEmail] = useState("admin@nktech.in");
  const [adminPhone, setAdminPhone] = useState("+91 98765 43210");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Password Management
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the stored profile from the API
  useEffect(() => {
    apiGet<AdminProfile>("/settings/profile")
      .then((p) => {
        setAdminName(p.name);
        setAdminEmail(p.email);
        setAdminPhone(p.phone ?? "");
        setAvatarUrl(p.avatarUrl);
      })
      .catch(() => {}); // offline -> keep defaults
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await apiSend("PATCH", "/settings/profile", {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        avatarUrl,
      });
      if (currentPassword || newPassword || confirmPassword) {
        await apiSend("POST", "/settings/change-password", {
          currentPassword,
          newPassword,
          confirmPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      window.dispatchEvent(new Event("profile-updated")); // navbar refreshes avatar/name
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setError(null);
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) {
      setError("Please choose a PNG, JPG, WEBP or GIF image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image is too large — maximum size is 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(String(reader.result)); // data URL, saved to DB on Save
    reader.onerror = () => setError("Could not read the selected image.");
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = () => {
    setAvatarUrl(null);
  };

  // Get initials of admin name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your admin profile, upload an avatar photo, and change security credentials."
        breadcrumbs={[{ label: "Settings" }]}
      />

      {saved && (
        <div className="flex items-center gap-2 p-3.5 bg-success/15 border border-success/30 text-success-light rounded-xl text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-success" />
          Profile settings and security credentials updated successfully.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3.5 bg-danger/15 border border-danger/30 text-danger rounded-xl text-xs font-semibold animate-fade-in">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        
        {/* Module 1: Admin Profile Details */}
        <div className="bg-card/60 border border-border/30 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Admin Profile</h3>
                <p className="text-[11px] text-muted">Update your avatar, email address, and personal parameters</p>
              </div>
            </div>

            {/* Profile Avatar Editor */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-navy/40 border border-border/10">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple flex items-center justify-center border-2 border-border/50 shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white tracking-wider">
                    {getInitials(adminName)}
                  </span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <p className="text-xs font-semibold text-white">Profile Photo</p>
                <p className="text-[10px] text-muted">Recommend PNG or JPG (min. 150x150px)</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileSelected}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-dark text-[10px] font-semibold text-white rounded-lg transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Upload Photo
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handlePhotoRemove}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-danger/40 bg-danger/10 hover:bg-danger/25 text-[10px] font-semibold text-danger-light rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Inputs */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-muted mb-1.5 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted mb-1.5 font-medium">System Role</label>
                  <input
                    type="text"
                    value="Super Admin"
                    disabled
                    className="w-full px-3.5 py-2 bg-navy-300/20 border border-border/30 rounded-xl text-xs text-muted cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-muted mb-1.5 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/60" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-muted mb-1.5 font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/60" />
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Change Password */}
        <div className="bg-card/60 border border-border/30 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple/10 text-purple rounded-lg">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Change Credentials</h3>
                <p className="text-[11px] text-muted">Update your account password and security configuration keys</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Save Button for Credentials Form alignment */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/10 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-border/40 bg-card/40 text-xs font-semibold text-muted rounded-xl hover:bg-white/5 hover:text-white transition-all"
            >
              Reset Defaults
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-xs font-semibold text-white rounded-xl transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
