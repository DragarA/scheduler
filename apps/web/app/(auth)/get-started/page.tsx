import { SignUp } from "@clerk/nextjs";

export default function GetStartedPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 lg:py-20">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* First Row: Get Started and Sign Up */}
        <section className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-6">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Get started with Scheduler
            </h1>
            <p className="text-balance text-sm text-slate-300 sm:text-base">
              Scheduler is your all-in-one booking system inspired by Setmore. Let
              clients book online, automate reminders, and keep your calendar in
              sync—without the back-and-forth messages.
            </p>
          </div>
          <div className="w-full max-w-md flex items-center justify-center">
            <SignUp signInUrl="/sign-in"
             />
          </div>
        </section>

        {/* Second Row: 4 Columns */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col items-start">
            <div className="mb-2 rounded-md bg-sky-500/20 p-2">
              <span role="img" aria-label="Calendar">📅</span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-1">Easy Booking</h3>
            <p className="text-sm text-slate-400">
              Clients can book appointments online, any time that suits them.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col items-start">
            <div className="mb-2 rounded-md bg-emerald-500/20 p-2">
              <span role="img" aria-label="Bell">🔔</span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-1">Automated Reminders</h3>
            <p className="text-sm text-slate-400">
              Reminders sent by email & SMS—reduce no-shows with friendly nudges.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col items-start">
            <div className="mb-2 rounded-md bg-purple-500/20 p-2">
              <span role="img" aria-label="Clock">⏰</span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-1">Smart Scheduling</h3>
            <p className="text-sm text-slate-400">
              Flexible work hours, break times, and service buffers—no double-bookings.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col items-start">
            <div className="mb-2 rounded-md bg-pink-500/20 p-2">
              <span role="img" aria-label="Shield">🛡️</span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-1">Privacy & Security</h3>
            <p className="text-sm text-slate-400">
              Your data stays private and protected—powered by Clerk authentication.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
