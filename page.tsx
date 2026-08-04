import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const TEAM = [
  { name: "ARK Editorial Board", role: "Curation & Quality", city: "Bangalore" },
  { name: "ARK Research Desk", role: "Analysis & Deep-dives", city: "Hyderabad" },
  { name: "ARK Campus Network", role: "College Chapters", city: "Pan-India" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            About ARK Chronicles
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Architects of Rising Knowledge
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-[#1B2A6B] mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              ARK Chronicles is India&apos;s premier knowledge platform for builders, founders, and
              researchers. We believe the next wave of technological progress will be driven by
              young builders from India&apos;s emerging startup ecosystem — and we exist to tell
              their stories, amplify their ideas, and connect them with capital and community.
            </p>
          </div>

          <div className="bg-[#1B2A6B] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-black mb-4">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Deep-Dive Chronicles", desc: "Long-form analysis on startups, tech trends, and the India builder scene." },
                { title: "Founder Spotlights", desc: "Profiles of India's most promising early-stage founders and their journeys." },
                { title: "Research Publishing", desc: "Academic and applied research from our collegiate network partners." },
                { title: "ARK Magazines", desc: "Curated quarterly publications covering the best of ARK's content." },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-black text-[#D4A017] mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-[#1B2A6B] mb-6">The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="bg-[#F5F0E8] rounded-xl p-5 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1B2A6B] flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#D4A017] font-black text-lg">
                      {member.name[0]}
                    </span>
                  </div>
                  <h3 className="font-black text-[#1B2A6B] text-sm">{member.name}</h3>
                  <p className="text-[#D4A017] text-xs font-semibold mt-0.5">{member.role}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{member.city}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-black text-[#1B2A6B] mb-3">Join the ARK Network</h2>
            <p className="text-gray-600 mb-6">
              Contribute stories, apply as a founder, or partner your college with us.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 bg-[#1B2A6B] text-white font-bold rounded-full text-sm hover:bg-[#1B2A6B]/90 transition"
              >
                Create Account
              </Link>
              <Link
                href="/submit-story"
                className="px-6 py-3 border-2 border-[#1B2A6B] text-[#1B2A6B] font-bold rounded-full text-sm hover:bg-[#1B2A6B] hover:text-white transition"
              >
                Submit a Story
              </Link>
              <Link
                href="/college-collabs"
                className="px-6 py-3 border-2 border-[#D4A017] text-[#D4A017] font-bold rounded-full text-sm hover:bg-[#D4A017] hover:text-[#1B2A6B] transition"
              >
                College Collabs
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
