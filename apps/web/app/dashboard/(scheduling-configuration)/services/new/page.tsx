'use client';

import { ServiceForm, type ServiceFormData } from '@/components/services/service-form';
import { useCreateServiceMutation } from '@/hooks/services/create-service-mutation';

export default function NewServicePage() {
  const createMutation = useCreateServiceMutation();

  const handleSubmit = (data: ServiceFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create New Service</h1>
      <div className="max-w-2xl">
        <ServiceForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
        {createMutation.isError && (
          <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Error creating service:{' '}
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : 'Unknown error'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

