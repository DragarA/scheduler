'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ServiceFormData {
  organizationId: number;
  categoryId?: number;
  name: string;
  description?: string;
  durationMinutes: number;
  paddingBeforeMinutes: number;
  paddingAfterMinutes: number;
  priceCents?: number;
  currency?: string;
  isActive: boolean;
}

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function ServiceForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    organizationId: initialData?.organizationId ?? 1, // TODO: Get from user context
    categoryId: initialData?.categoryId ?? undefined,
    name: initialData?.name ?? '',
    description: initialData?.description ?? undefined,
    durationMinutes: initialData?.durationMinutes ?? 30,
    paddingBeforeMinutes: initialData?.paddingBeforeMinutes ?? 0,
    paddingAfterMinutes: initialData?.paddingAfterMinutes ?? 0,
    priceCents: initialData?.priceCents ?? undefined,
    currency: initialData?.currency ?? 'USD',
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (formData.durationMinutes < 1) {
      newErrors.durationMinutes = 'Duration must be at least 1 minute';
    }
    if (formData.paddingBeforeMinutes < 0) {
      newErrors.paddingBeforeMinutes = 'Padding before must be non-negative';
    }
    if (formData.paddingAfterMinutes < 0) {
      newErrors.paddingAfterMinutes = 'Padding after must be non-negative';
    }
    if (formData.priceCents !== null && formData.priceCents !== undefined && formData.priceCents < 0) {
      newErrors.priceCents = 'Price must be non-negative';
    }
    if (formData.currency && formData.currency.length !== 3) {
      newErrors.currency = 'Currency must be a 3-letter code (e.g., EUR, USD)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (
    field: keyof ServiceFormData,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Service Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Consultation"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) =>
              handleChange('description', e.target.value || null)
            }
            placeholder="Service description"
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="durationMinutes"
              className="block text-sm font-medium mb-1"
            >
              Duration (minutes) <span className="text-destructive">*</span>
            </label>
            <Input
              id="durationMinutes"
              type="number"
              min="1"
              value={formData.durationMinutes}
              onChange={(e) =>
                handleChange('durationMinutes', parseInt(e.target.value) || 0)
              }
              aria-invalid={!!errors.durationMinutes}
            />
            {errors.durationMinutes && (
              <p className="text-sm text-destructive mt-1">
                {errors.durationMinutes}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium mb-1"
            >
              Category ID (optional)
            </label>
            <Input
              id="categoryId"
              type="number"
              min="1"
              value={formData.categoryId || ''}
              onChange={(e) =>
                handleChange(
                  'categoryId',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="paddingBeforeMinutes"
              className="block text-sm font-medium mb-1"
            >
              Padding Before (minutes)
            </label>
            <Input
              id="paddingBeforeMinutes"
              type="number"
              min="0"
              value={formData.paddingBeforeMinutes}
              onChange={(e) =>
                handleChange(
                  'paddingBeforeMinutes',
                  parseInt(e.target.value) || 0
                )
              }
              aria-invalid={!!errors.paddingBeforeMinutes}
            />
            {errors.paddingBeforeMinutes && (
              <p className="text-sm text-destructive mt-1">
                {errors.paddingBeforeMinutes}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paddingAfterMinutes"
              className="block text-sm font-medium mb-1"
            >
              Padding After (minutes)
            </label>
            <Input
              id="paddingAfterMinutes"
              type="number"
              min="0"
              value={formData.paddingAfterMinutes}
              onChange={(e) =>
                handleChange(
                  'paddingAfterMinutes',
                  parseInt(e.target.value) || 0
                )
              }
              aria-invalid={!!errors.paddingAfterMinutes}
            />
            {errors.paddingAfterMinutes && (
              <p className="text-sm text-destructive mt-1">
                {errors.paddingAfterMinutes}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceCents" className="block text-sm font-medium mb-1">
              Price (in cents)
            </label>
            <Input
              id="priceCents"
              type="number"
              min="0"
              value={formData.priceCents || ''}
              onChange={(e) =>
                handleChange(
                  'priceCents',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="e.g., 5000 for $50.00"
              aria-invalid={!!errors.priceCents}
            />
            {errors.priceCents && (
              <p className="text-sm text-destructive mt-1">
                {errors.priceCents}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">
              Currency Code
            </label>
            <Input
              id="currency"
              type="text"
              maxLength={3}
              value={formData.currency || ''}
              onChange={(e) =>
                handleChange('currency', e.target.value.toUpperCase() || null)
              }
              placeholder="USD"
              aria-invalid={!!errors.currency}
            />
            {errors.currency && (
              <p className="text-sm text-destructive mt-1">{errors.currency}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Service is active
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

