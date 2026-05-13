export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold">Humanaut Health — Nav Preview</h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Hover the desktop items to test the 150 / 200ms hover delays, tab through to verify keyboard
        nav, scroll past 80px to see the sticky border, and resize below 1024px to try the mobile
        overlay. Placeholder routes exist for a handful of pages so you can confirm active state
        styling (e.g. /memberships/path, /testing/dexa, /treatments/regenerative/stem-cells).
      </p>
      <div className="mt-12 h-[150vh] rounded border border-white/10 bg-slate-900/50 p-6">
        <p className="text-white/50">Long body — scroll to test sticky header behavior.</p>
      </div>
    </div>
  );
}
