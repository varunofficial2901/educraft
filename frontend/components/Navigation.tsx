"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Eye, EyeOff, Loader2 } from "lucide-react";
import Script from "next/script";
<<<<<<< HEAD
=======
import { useCart } from "@/components/CartContext";
>>>>>>> aa0808108ce08e9522b649e0d086794ebaf208f3

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Test Series", href: "/courses" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const API_BASE = "http://localhost:8000/api/v1";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (user: any) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Initialize Google Sign In button
  useEffect(() => {
    const initGoogle = () => {
      if ((window as any).google && googleBtnRef.current && GOOGLE_CLIENT_ID) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: mode === "signin" ? "signin_with" : "signup_with",
          shape: "rectangular",
        });
      }
    };

    // Small delay to ensure google script is loaded
    const timer = setTimeout(initGoogle, 100);
    return () => clearTimeout(timer);
  }, [mode]);

  const handleGoogleResponse = async (response: any) => {
    setGoogleLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Google sign in failed");
        return;
      }

      localStorage.setItem("edu_token", data.access_token);
      localStorage.setItem("edu_user", JSON.stringify(data.user));
      onSuccess(data.user);
      onClose();
    } catch {
      setError("Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "signin" ? "/auth/signin" : "/auth/signup";
      const body = mode === "signin"
        ? { email: form.email, password: form.password }
        : { first_name: form.first_name, last_name: form.last_name, email: form.email, password: form.password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Something went wrong");
        return;
      }

      localStorage.setItem("edu_token", data.access_token);
      localStorage.setItem("edu_user", JSON.stringify(data.user));
      onSuccess(data.user);
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.25s ease" }}
      >
        {/* Header */}
        <div className="relative bg-[#6366F1] px-8 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-fraunces font-bold text-white mb-1">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-white/70 text-sm">
            {mode === "signin" ? "Sign in to access your courses" : "Join EduCraft today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">

          {/* Google Sign In Button */}
          <div className="w-full">
            {googleLoading ? (
              <div className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#374151]">
                <Loader2 size={16} className="animate-spin" />
                Signing in with Google...
              </div>
            ) : (
              <div ref={googleBtnRef} className="w-full" />
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Sign Up extra fields */}
          {mode === "signup" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={e => set("first_name", e.target.value)}
                  placeholder="John"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={e => set("last_name", e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => set("password", e.target.value)}
                placeholder="Min 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#6366F1] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6366F1] text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-1"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>

          {/* Toggle mode */}
          <p className="text-center text-sm text-[#64748B]">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
              className="text-[#6366F1] font-semibold hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#6366F1]/30 hover:border-[#6366F1] transition-all max-w-[140px]"
      >
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt="" 
            className="w-7 h-7 rounded-full object-cover"
          referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        )}
       <span className="text-sm font-medium text-[#374151] hidden sm:block truncate max-w-[80px]">
        {user.first_name}
      </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E2E8F0] shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-[#E2E8F0]">
            <p className="text-sm font-semibold text-[#0F172A]">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-[#64748B] truncate">{user.email}</p>
          </div>

          <button
            onClick={() => { router.push("/dashboard"); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F8FAFC] transition-colors"
          >
            <LayoutDashboard size={15} className="text-[#6366F1]" />
            My Dashboard
          </button>

          <button
            onClick={() => { router.push("/profile"); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F8FAFC] transition-colors"
          >
            <User size={15} className="text-[#6366F1]" />
            My Profile
          </button>

          <div className="border-t border-[#E2E8F0] mt-1 pt-1">
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Navigation ──────────────────────────────────────────────────────────
export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isNavSolid = !isHome || isScrolled;

  useEffect(() => {
    const savedUser = localStorage.getItem("edu_user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("edu_token");
    localStorage.removeItem("edu_user");
    setUser(null);
    router.push("/");
  };

<<<<<<< HEAD
=======
  const { cartCount } = useCart();

>>>>>>> aa0808108ce08e9522b649e0d086794ebaf208f3
  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    router.refresh();
  };

  return (
    <>
      {/* Google Identity Services Script */}
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={`absolute inset-0 transition-all duration-300 -z-10 ${
            isNavSolid
              ? "bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm"
              : "bg-transparent"
          }`}
        />

        <div className={`relative z-10 transition-all duration-300 ${isNavSolid ? "py-4" : "py-6"}`}>
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between">

              <Link href="/" className="text-3xl font-fraunces font-bold text-[#0F172A] dark:text-white">
                EduCraft
              </Link>

              <nav className="hidden md:flex items-center space-x-8">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`transition-colors text-base font-medium px-3 py-1.5 rounded-lg ${
                        isActive
                          ? "bg-[#6366F1]/10 text-[#6366F1]"
                          : "text-[#374151] dark:text-[#CBD5E1] hover:text-[#6366F1]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
<<<<<<< HEAD
                <div className="relative group cursor-pointer mr-2">
                  <ShoppingCart size={24} className="text-[#0F172A] dark:text-white hover:text-[#6366F1] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#6366F1] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    0
                  </span>
                </div>
=======
                <Link href="/cart" className="relative group mr-2">
                  <ShoppingCart size={24} className="text-[#0F172A] dark:text-white hover:text-[#6366F1] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#6366F1] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
>>>>>>> aa0808108ce08e9522b649e0d086794ebaf208f3

                {user ? (
                  <UserDropdown user={user} onLogout={handleLogout} />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded-xl border border-[#6366F1] text-[#6366F1] font-medium transition-all hover:bg-[#6366F1]/10"
                  >
                    Sign In
                  </button>
                )}

                <Link
                  href="/courses?filter=FREE"
                  className="px-5 py-2 rounded-xl bg-[#6366F1] text-white font-medium transition-all hover:bg-indigo-600 hover:shadow-lg"
                >
                  Free Assessment
                </Link>
              </div>

              <div className="flex items-center space-x-4 md:hidden text-[#0F172A] dark:text-white">
<<<<<<< HEAD
                <div className="relative group cursor-pointer mr-2">
                  <ShoppingCart size={24} className="hover:text-[#6366F1] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#6366F1] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    0
                  </span>
                </div>
=======
                <Link href="/cart" className="relative group cursor-pointer mr-2">
                  <ShoppingCart size={24} className="hover:text-[#6366F1] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#6366F1] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
>>>>>>> aa0808108ce08e9522b649e0d086794ebaf208f3
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1 focus:outline-none focus:ring-2 border-transparent focus:ring-[#6366F1] rounded transition-colors hover:text-[#6366F1]"
                >
                  {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-[#FFFFFF] dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155] shadow-xl transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-6 py-6 space-y-4 relative z-10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors text-lg font-medium px-4 py-2 rounded-lg ${
                    isActive
                      ? "bg-[#6366F1]/10 text-[#6366F1]"
                      : "text-[#374151] dark:text-[#CBD5E1] hover:text-[#6366F1] hover:bg-gray-50 dark:hover:bg-[#334155]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt="" 
                        className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-sm font-bold">
                        {`${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#0F172A] text-sm">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-[#64748B]">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="block text-center w-full px-5 py-3 rounded-xl bg-[#6366F1]/10 text-[#6366F1] font-medium text-base" onClick={() => setIsMobileMenuOpen(false)}>
                    My Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full px-5 py-3 rounded-xl border border-red-200 text-red-500 font-medium text-base">
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowAuthModal(true); setIsMobileMenuOpen(false); }}
                  className="w-full px-5 py-3 rounded-xl border border-[#6366F1] text-[#6366F1] font-medium text-lg"
                >
                  Sign In
                </button>
              )}
              <Link
                href="/courses?filter=FREE"
                className="block text-center w-full px-5 py-3 rounded-xl bg-[#6366F1] text-white transition-all hover:bg-indigo-600 font-medium text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
