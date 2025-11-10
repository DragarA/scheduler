// app/page.tsx
import Link from 'next/link';
import { ArrowRight, Users, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-20">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/5 px-3 py-1 text-xs font-medium text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Modern scheduling for busy teams
        </div>

        <div className="space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your time, <span className="text-sky-400">perfectly scheduled</span>
            .
          </h1>
          <p className="text-balance text-sm text-slate-300 sm:text-base">
            Scheduler is your all-in-one booking system inspired by Setmore. Let
            clients book online, automate reminders, and keep your calendar in
            sync—without the back-and-forth messages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            asChild
            className="gap-2 transition-colors hover:bg-sky-500/10 hover:text-sky-400"
          >
            <Link href="/get-started">
              Get started now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <p className="text-xs text-slate-400">
            Free to start. Create your account with Clerk in seconds.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-300 sm:text-sm">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 rounded-md bg-slate-800/70 p-1">
              <Users className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="font-medium text-slate-100">Client self-booking</p>
              <p className="text-slate-400">
                Share a booking link and let clients book 24/7.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 rounded-md bg-slate-800/70 p-1">
              <Clock className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="font-medium text-slate-100">Smart availability</p>
              <p className="text-slate-400">
                Define working hours, buffers, and break times per service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple “preview card” */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-sky-900/30 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Today&apos;s schedule
          </p>
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
            Live preview
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-100">New client booking</p>
              <p className="text-xs text-slate-400">
                10:00–10:30 • Online consult
              </p>
            </div>
            <span className="rounded-full bg-sky-500/15 px-2 py-1 text-[11px] font-medium text-sky-300">
              Auto-confirmed
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
            <div className="space-y-0.5">
              <p className="font-medium text-slate-100">Reminder sent</p>
              <p className="text-xs text-slate-400">
                SMS &amp; email • 24h before
              </p>
            </div>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 px-3 py-3 text-xs text-slate-400">
            Connect your services, set your hours, and share your booking page.
            Scheduler handles confirmations and reminders automatically.
          </div>
        </div>
      </div>
    </section>
  );
}
