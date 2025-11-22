'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAppointmentQuery } from '@/hooks/appointments/get-appointment-query';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { AppointmentStatusSelector } from '@/components/appointments/appointment-status-selector';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, FileText } from 'lucide-react';

function formatDateTime(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(d);
}

function formatTime(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
  }).format(d);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  return `${mins}m`;
}

function formatPrice(priceCents: number, currency: string) {
  const price = priceCents / 100;
  const currencySymbol = currency || '$';
  return `${currencySymbol}${price.toFixed(2)}`;
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params?.id as string, 10);

  const { data: appointment, isLoading, error } = useGetAppointmentQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/appointments')}
          className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Appointments
        </Button>
        <div className="rounded-md border border-red-900 bg-red-950/30 p-4">
          <p className="text-red-400">
            Error loading appointment:{' '}
            {error instanceof Error ? error.message : 'Appointment not found'}
          </p>
        </div>
      </div>
    );
  }

  const customerName = `${appointment.customer.firstName} ${
    appointment.customer.lastName || ''
  }`.trim();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Appointment Information */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-200">Date & Time</p>
                <p className="text-sm text-slate-400">
                  {formatDateTime(appointment.start)}
                </p>
                <p className="text-sm text-slate-400">
                  Ends at {formatTime(appointment.end)}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-purple-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Service</p>
                <p className="text-sm text-slate-400">
                  {appointment.service.name}
                </p>
                {appointment.service.description && (
                  <p className="text-sm text-slate-500 mt-1">
                    {appointment.service.description}
                  </p>
                )}
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-200">Duration</p>
                <p className="text-sm text-slate-400">
                  {formatDuration(appointment.service.durationMinutes)}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-200">Price</p>
                <p className="text-sm text-slate-400">
                  {formatPrice(
                    appointment.service.priceCents!,
                    appointment.service.currency!
                  )}
                </p>
              </div>
            </div>

            {appointment.location && (
              <>
                <Separator className="bg-slate-800" />
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Location</p>
                    <p className="text-sm text-slate-400">
                      {appointment.location.name}
                    </p>
                    {appointment.location.address && (
                      <p className="text-sm text-slate-500">
                        {appointment.location.address}
                        {appointment.location.city && `, ${appointment.location.city}`}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {appointment.notes && (
              <>
                <Separator className="bg-slate-800" />
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Notes</p>
                    <p className="text-sm text-slate-400 whitespace-pre-wrap">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Name</p>
                  <p className="text-sm text-slate-400">{customerName}</p>
                </div>
              </div>

              {appointment.customer.email && (
                <>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">Email</p>
                      <p className="text-sm text-slate-400">
                        {appointment.customer.email}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {appointment.customer.phone && (
                <>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">Phone</p>
                      <p className="text-sm text-slate-400">
                        {appointment.customer.phone}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {appointment.customer.notes && (
                <>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">Customer Notes</p>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">
                        {appointment.customer.notes}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-2">Current Status</p>
                  <AppointmentStatusBadge status={appointment.status} />
                </div>
                <Separator className="bg-slate-800" />
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-3">Update Status</p>
                  <AppointmentStatusSelector
                    appointmentId={appointment.id}
                    currentStatus={appointment.status}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
