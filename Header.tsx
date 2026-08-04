"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Chronicles", href: "/chronicles" },
  { label: "Founders", href: "/founders" },
  { label: "Magazines", href: "/magazines" },
  { label: "Research", href: "/research" },
  { label: "Investors", href: "/investors" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "College Collabs", href: "/college-collabs" },
  { label: "Submit Story", href: "/submit-story" },
  { label: "About Us", href: "/about" },
  { label: "Rewards", href: "/rewards" },
]

export function Header() {
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="bg-[#F5F0E8] border-b border-[#1B2A6B]/10">
      {/* Top ticker bar */}
      <div className="bg-[#1B2A6B] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-hidden">
          <span className="font-semibold tracking-widest text-[#D4A017] shrink-0">
            ARCHITECTS OF RISING KNOWLEDGE
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium shrink-0">
          <span>Bengaluru</span>
          <span>Mumbai</span>
          <span>Delhi</span>
          <span>Hyderabad</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-[#1B2A6B] hover:bg-[#1B2A6B]/10 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="flex flex-col leading-tight">
              <span className="text-xl font-black tracking-tight">
                <span className="text-[#D4A017]">A.R.K</span>{" "}
                <span className="text-[#1B2A6B]">CHRONICLES</span>
              </span>
              <span className="text-[9px] text-[#1B2A6B]/60 tracking-widest font-medium">
                ARCHITECTS OF RISING KNOWLEDGE
              </span>
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/submit-story"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold border-2 border-[#1B2A6B] text-[#1B2A6B] rounded-full hover:bg-[#1B2A6B] hover:text-white transition"
            >
              Submit Story
            </Link>

            {status === "loading" ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-full" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1B2A6B] text-white text-sm font-semibold hover:bg-[#1B2A6B]/90 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#D4A017] flex items-center justify-center text-xs font-bold text-[#1B2A6B]">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {session.user.name}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#1B2A6B]">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
                    </div>
                    <Link
                      href="/my-submissions"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={14} />
                      My Submissions
                    </Link>
                    <Link
                      href="/rewards"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={14} />
                      Rewards & XP
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4A017] font-semibold hover:bg-gray-50"
                      >
                        <Settings size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold border-2 border-[#1B2A6B] text-[#1B2A6B] rounded-full hover:bg-[#1B2A6B] hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold bg-[#1B2A6B] text-white rounded-full hover:bg-[#1B2A6B]/90 transition"
                >
                  Join Ark
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile slide-out nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-[#1B2A6B] h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <p className="text-[#D4A017] font-black text-lg">ARK CHRONICLES</p>
                <p className="text-white/60 text-[9px] tracking-widest">
                  ARCHITECTS OF RISING KNOWLEDGE
                </p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-3 px-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition"
                >
                  {link.label}
                </Link>
              ))}
              {session?.user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-3 px-3 text-[#D4A017] font-semibold hover:bg-white/10 rounded-lg text-sm transition"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </header>
  )
}
