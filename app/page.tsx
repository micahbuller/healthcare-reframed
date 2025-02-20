import ThreeScene from "@/components/ThreeScene";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col flex-1 overflow-hidden m-6">
        <ThreeScene />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
