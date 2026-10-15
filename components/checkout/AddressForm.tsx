'use client';

import React from 'react';
import { MapPin, Phone, User, Home, Building2, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface ShippingAddressData {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  deliveryMethod: 'delivery' | 'pickup';
}

interface AddressFormProps {
  data: ShippingAddressData;
  onChange: (updated: ShippingAddressData) => void;
  errors: Record<string, string>;
}

export function AddressForm({ data, onChange, errors }: AddressFormProps) {
  const handleChange = (field: keyof ShippingAddressData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <MapPin className="size-4.5 text-primary" />
          Fulfillment & Shipping Details
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select whether you want Delhi store pickup or direct courier delivery to your doorstep.
        </p>
      </div>

      {/* Delivery Method Selection Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleChange('deliveryMethod', 'delivery')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            data.deliveryMethod === 'delivery'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border/80 bg-card/60 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">Express Door Delivery</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              1-2 Business Days
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Dispatched via tracked local courier service with direct signature confirmation.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleChange('deliveryMethod', 'pickup')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            data.deliveryMethod === 'pickup'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border/80 bg-card/60 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">Free Store Pickup (Nehru Place)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Ready in 2 Hours
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Collect at ElectroMart Flagship Store (Plot 18, Nehru Place, New Delhi) during store hours.
          </p>
        </button>
      </div>

      {/* Recipient Information */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              Full Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="text-xs h-10"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" />
              Phone Number (for SMS Tracking) *
            </label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="text-xs h-10"
            />
            {errors.phone && (
              <p className="text-[11px] text-destructive font-medium">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Street Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Home className="size-3.5 text-muted-foreground" />
            {data.deliveryMethod === 'pickup' ? 'Billing Street Address *' : 'Shipping Street Address *'}
          </label>
          <Input
            type="text"
            placeholder="Flat 402, Block B, Green Park Extension"
            value={data.street}
            onChange={(e) => handleChange('street', e.target.value)}
            className="text-xs h-10"
          />
          {errors.street && (
            <p className="text-[11px] text-destructive font-medium">{errors.street}</p>
          )}
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-muted-foreground" />
              City *
            </label>
            <Input
              type="text"
              placeholder="New Delhi"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="text-xs h-10"
            />
            {errors.city && (
              <p className="text-[11px] text-destructive font-medium">{errors.city}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              State / Union Territory *
            </label>
            <Input
              type="text"
              placeholder="Delhi"
              value={data.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="text-xs h-10"
            />
            {errors.state && (
              <p className="text-[11px] text-destructive font-medium">{errors.state}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Globe className="size-3.5 text-muted-foreground" />
              PIN / Postal Code *
            </label>
            <Input
              type="text"
              placeholder="110019"
              value={data.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              className="text-xs h-10 font-mono"
            />
            {errors.zip && (
              <p className="text-[11px] text-destructive font-medium">{errors.zip}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
