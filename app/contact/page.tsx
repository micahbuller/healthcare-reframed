"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, honeypot }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      } else {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-[#FFFBF7] text-[#2F2C2C] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4">Healthcare Reframed</p>
        <h1 className="font-mono uppercase text-5xl md:text-7xl text-[#2F2C2C] leading-none mb-4">CONTACT</h1>
        <p className="font-sans text-lg text-[#2F2C2C]/60 mb-16">
          Have a question, story idea, or want to get involved?{" "}
          <span className="text-[#2F2C2C]/80">We&apos;d love to hear from you.</span>
        </p>

        {status === "success" ? (
          <div className="bg-[#2F2C2C] rounded-3xl p-10 text-center space-y-4">
            <p className="font-mono text-3xl uppercase text-[#EC7A5B]">Message Sent</p>
            <p className="font-sans text-[#FFFBF7]/70">Thanks for reaching out. We&apos;ll be in touch soon.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 font-mono uppercase text-sm px-8 py-3 rounded-full border border-[#FFFBF7]/20 text-[#FFFBF7]/60 hover:text-[#EC7A5B] hover:border-[#EC7A5B]/40 transition-colors"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              className="hidden"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/60">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full bg-transparent border border-[#2F2C2C]/20 rounded-full px-6 py-3 font-sans text-sm text-[#2F2C2C] placeholder:text-[#2F2C2C]/30 focus:outline-none focus:border-[#EC7A5B] transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/60">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent border border-[#2F2C2C]/20 rounded-full px-6 py-3 font-sans text-sm text-[#2F2C2C] placeholder:text-[#2F2C2C]/30 focus:outline-none focus:border-[#EC7A5B] transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/60">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                autoComplete="off"
                className="w-full bg-transparent border border-[#2F2C2C]/20 rounded-full px-6 py-3 font-sans text-sm text-[#2F2C2C] placeholder:text-[#2F2C2C]/30 focus:outline-none focus:border-[#EC7A5B] transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/60">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={7}
                className="w-full bg-transparent border border-[#2F2C2C]/20 rounded-3xl px-6 py-4 font-sans text-sm text-[#2F2C2C] placeholder:text-[#2F2C2C]/30 focus:outline-none focus:border-[#EC7A5B] transition-colors resize-none"
                placeholder="Your message…"
              />
            </div>

            {status === "error" && (
              <p className="font-sans text-sm text-red-500">{errorMsg}</p>
            )}

            <div className="flex items-center gap-6">
              <button
                type="submit"
                disabled={status === "sending"}
                className="font-mono uppercase text-sm px-10 py-4 bg-[#EC7A5B] text-white rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
              <Link href="/" className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/40 hover:text-[#EC7A5B] transition-colors">
                ← Back to home
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
