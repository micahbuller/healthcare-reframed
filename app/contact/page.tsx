import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Healthcare Reframed team — story ideas, partnerships, or just to say hello.",
};

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4">Healthcare Reframed</p>
        <h1 className="font-mono uppercase text-5xl md:text-7xl text-[#2F2C2C] leading-none mb-4">CONTACT</h1>
        <p className="font-sans text-lg text-[#2F2C2C]/60 mb-16">
          Have a question, story idea, or want to get involved?{" "}
          <span className="text-[#2F2C2C]/80">We&apos;d love to hear from you.</span>
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
