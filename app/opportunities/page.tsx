import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Zap } from "lucide-react"

const OPPORTUNITIES = [
  {
    type: "Write for ARK",
    description: "Contribute chronicles, research stories, or editorials to the ARK platform.",
    cta: "Submit a Story",
    href: "/submit-story",
    badge: "OPEN",
  },
  {
    type: "Founder Spotlight",
    description: "Apply to be featured as a builder on the ARK Founders directory.",
    cta: "Apply as Founder",
    href: "/founders",
    badge: "OPEN",
  },
  {
    type: "College Collab",
    description: "Partner your college with ARK to run Chronicles chapters and build community.",
    cta: "Apply Now",
    href: "/college-collabs",
    badge: "OPEN",
  },
  {
    type: "Investor Connect",
    description: "Get warm introductions to investors suited for your startup stage.",
    cta: "Request Intro",
    href: "/investors",
    badge: "OPEN",
  },
]

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            Opportunities
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Ways to contribute, connect, and grow within the ARK network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OPPORTUNITIES.map((opp) => (
            <div
              key={opp.type}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-[#D4A017]" />
                </div>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold tracking-widest rounded-full">
                  {opp.badge}
                </span>
              </div>
              <div>
                <h3 className="font-black text-[#1B2A6B] text-lg">{opp.type}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{opp.description}</p>
              </div>
              <Link
                href={opp.href}
                className="mt-auto inline-block px-5 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-full hover:bg-[#1B2A6B]/90 transition w-fit"
              >
                {opp.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
