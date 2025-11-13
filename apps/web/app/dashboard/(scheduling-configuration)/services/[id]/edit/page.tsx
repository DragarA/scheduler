'use client';

import { useParams } from 'next/navigation';
import { ServiceForm, type ServiceFormData } from '@/components/services/service-form';
import { useUpdateServiceMutation } from '@/hooks/services/update-service-mutation';
import { useGetServiceQuery } from '@/hooks/services/get-service-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditServicePage() {
  const params = useParams();
  const serviceId = parseInt(params.id as string, 10);
  const { data: service, isLoading, error } = useGetServiceQuery(serviceId);
  const updateMutation = useUpdateServiceMutation(serviceId);

  const handleSubmit = (data: ServiceFormData) => {
    // Convert to update format (all fields optional except organizationId)
    const updateData: Partial<ServiceFormData> = {
      name: data.name,
      description: data.description,
      durationMinutes: data.durationMinutes,
      paddingBeforeMinutes: data.paddingBeforeMinutes,
      paddingAfterMinutes: data.paddingAfterMinutes,
      priceCents: data.priceCents,
      currency: data.currency,
      isActive: data.isActive,
      categoryId: data.categoryId,
    };
    updateMutation.mutate(updateData);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <div className="rounded-md border border-destructive p-4">
          <p className="text-destructive">
            Error loading service:{' '}
            {error instanceof Error ? error.message : 'Service not found'}
          </p>
        </div>
      </div>
    );
  }

  const initialData: Partial<ServiceFormData> = {
    organizationId: service.organizationId,
    categoryId: service.categoryId ?? undefined,
    name: service.name,
    description: service.description ?? undefined,
    durationMinutes: service.durationMinutes,
    paddingBeforeMinutes: service.paddingBeforeMinutes,
    paddingAfterMinutes: service.paddingAfterMinutes,
    priceCents: service.priceCents ?? undefined,
    currency: service.currency ?? undefined,
    isActive: service.isActive,
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Service</h1>
      <div className="max-w-2xl">
        <ServiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          isEdit={true}
        />
        {updateMutation.isError && (
          <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Error updating service:{' '}
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : 'Unknown error'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

