'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGetServicesQuery } from '@/hooks/services/get-services-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDeleteServiceMutation } from '@/hooks/services/delete-service-mutation';

function formatPrice(priceCents?: number | null, currency?: string | null) {
  if (priceCents === null || priceCents === undefined) {
    return 'N/A';
  }
  const price = priceCents / 100;
  const currencySymbol = currency || '$';
  return `${currencySymbol}${price.toFixed(2)}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function ServicesPage() {
  const { data: services, isLoading, error } = useGetServicesQuery();
  const deleteMutation = useDeleteServiceMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (serviceId: number, serviceName: string) => {
    if (
      !confirm(
        `Are you sure you want to deactivate "${serviceName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(serviceId);
    try {
      await deleteMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert(
        `Failed to deactivate service: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <div className="rounded-md border border-destructive p-4">
          <p className="text-destructive">
            Error loading services: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild>
          <Link href="/dashboard/services/new">Create Service</Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Padding</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services && services.length > 0 ? (
              services.map((service) => {
                const description = (service.description as string | undefined) || '-';
                const priceCents = (service.priceCents as number | undefined) ?? null;
                const currency = (service.currency as string | undefined) ?? null;
                
                const isDeleting = deletingId === service.id;

                return (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {description}
                    </TableCell>
                    <TableCell>{formatDuration(service.durationMinutes)}</TableCell>
                    <TableCell>
                      {service.paddingBeforeMinutes > 0 || service.paddingAfterMinutes > 0
                        ? `${service.paddingBeforeMinutes}m / ${service.paddingAfterMinutes}m`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {formatPrice(priceCents, currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          service.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                        >
                          <Link href={`/dashboard/services/${service.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(service.id, service.name)}
                          disabled={isDeleting || deleteMutation.isPending}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}