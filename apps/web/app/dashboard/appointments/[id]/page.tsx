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
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Appointments
        </Button>
        <div className="rounded-md border border-destructive p-4">
          <p className="text-destructive">
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
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(appointment.start)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ends at {formatTime(appointment.end)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Service</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.service.name}
                </p>
                {appointment.service.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {appointment.service.description}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(appointment.service.durationMinutes)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(
                    appointment.service.priceCents!,
                    appointment.service.currency!
                  )}
                </p>
              </div>
            </div>

            {appointment.location && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.location.name}
                    </p>
                    {appointment.location.address && (
                      <p className="text-sm text-muted-foreground">
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
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
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
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{customerName}</p>
                </div>
              </div>

              {appointment.customer.email && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.customer.email}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {appointment.customer.phone && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.customer.phone}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {appointment.customer.notes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Customer Notes</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {appointment.customer.notes}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Current Status</p>
                  <AppointmentStatusBadge status={appointment.status} />
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-3">Update Status</p>
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
