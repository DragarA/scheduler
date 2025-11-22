'use client';

import { useUser } from '@clerk/nextjs';
import { useGetAppointmentsQuery } from '@/hooks/appointments/get-appointments-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

function getToday() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

function formatTime(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
  }).format(d);
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { data: allAppointments, isLoading } = useGetAppointmentsQuery({
    limit: 100, // Get more appointments for stats
  });

  const { startOfWeek, endOfWeek } = getWeekRange();
  const { startOfDay, endOfDay } = getToday();

  if (!isLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const appointments = allAppointments?.data || [];

  // Filter appointments
  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.start);
    return aptDate >= startOfDay && aptDate <= endOfDay;
  });

  const weekAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.start);
    return aptDate >= startOfWeek && aptDate <= endOfWeek;
  });

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  // Calculate stats
  const stats = {
    today: todayAppointments.length,
    thisWeek: weekAppointments.length,
    pending: appointments.filter((apt) => apt.status === 'PENDING').length,
    confirmed: appointments.filter((apt) => apt.status === 'CONFIRMED').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            {getGreeting()}, {user?.firstName || 'there'}!
          </h1>
          <p className="text-slate-400 mt-1">
            Here's what's happening with your appointments today
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/dashboard/appointments">
            <Calendar className="mr-2 h-4 w-4" />
            View All Appointments
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">
              Today
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.today}</div>
            <p className="text-xs text-slate-400 mt-1">
              {stats.today === 1 ? 'appointment' : 'appointments'} scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">
              This Week
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.thisWeek}</div>
            <p className="text-xs text-slate-400 mt-1">
              appointments total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Confirmed
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.confirmed}</div>
            <p className="text-xs text-slate-400 mt-1">
              ready to go
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-400">
              Pending
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.pending}</div>
            <p className="text-xs text-slate-400 mt-1">
              need confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100">Today's Schedule</CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {formatDate(new Date())}
              </p>
            </div>
            {todayAppointments.length > 0 && (
              <span className="text-sm text-slate-400">
                {todayAppointments.length}{' '}
                {todayAppointments.length === 1 ? 'appointment' : 'appointments'}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-slate-700 mb-4" />
              <p className="text-slate-300 font-medium">No appointments today</p>
              <p className="text-sm text-slate-500 mt-1">
                Enjoy your day off!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map((appointment) => {
                  const customerName = `${appointment.customer.firstName} ${
                    appointment.customer.lastName || ''
                  }`.trim();

                  return (
                    <Link
                      key={appointment.id}
                      href={`/dashboard/appointments/${appointment.id}`}
                      className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/30 p-4 transition-all hover:border-blue-500/50 hover:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-500/20">
                        <Clock className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-100">{customerName}</p>
                          <AppointmentStatusBadge status={appointment.status as any} />
                        </div>
                        <p className="text-sm text-slate-400 truncate">
                          {appointment.service.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {formatTime(appointment.start)} - {formatTime(appointment.end)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-slate-100 hover:bg-slate-800">
              <Link href="/dashboard/appointments">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800 mb-3">
                <Users className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-300 font-medium">No upcoming appointments</p>
              <p className="text-sm text-slate-500 mt-1">
                Your schedule is clear
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.map((appointment) => {
                const customerName = `${appointment.customer.firstName} ${
                  appointment.customer.lastName || ''
                }`.trim();

                return (
                  <Link
                    key={appointment.id}
                    href={`/dashboard/appointments/${appointment.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 p-3 transition-all hover:border-purple-500/50 hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-purple-500/20 text-xs">
                        <span className="font-bold text-purple-400">
                          {new Date(appointment.start).getDate()}
                        </span>
                        <span className="text-purple-400/70">
                          {new Date(appointment.start).toLocaleDateString('en-US', {
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate text-slate-100">{customerName}</p>
                        <p className="text-sm text-slate-400 truncate">
                          {appointment.service.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 font-medium whitespace-nowrap">
                        {formatTime(appointment.start)}
                      </span>
                      <AppointmentStatusBadge status={appointment.status as any} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
