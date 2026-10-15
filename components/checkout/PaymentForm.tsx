'use client';

import React from 'react';
import { CreditCard, ShieldCheck, Lock, Building, Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface PaymentData {
  method: 'card' | 'store_pickup' | 'cod';
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface PaymentFormProps {
  data: PaymentData;
  onChange: (updated: PaymentData) => void;
  errors: Record<string, string>;
  deliveryMethod?: 'delivery' | 'pickup';
}

export function PaymentForm({
  data,
  onChange,
  errors,
  deliveryMethod = 'delivery',
}: PaymentFormProps) {
  const handleChange = (field: keyof PaymentData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    handleChange('cardNumber', formatted);
  };

  // Format expiry with slash
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    handleChange('expiry', raw);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CreditCard className="size-4.5 text-primary" />
          Payment Method
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          All transactions are encrypted with 256-bit banking-grade TLS security.
        </p>
      </div>

      {/* Payment Selection Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleChange('method', 'card')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            data.method === 'card'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border/80 bg-card/60 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="size-4 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Instant</span>
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">Credit / Debit Card</span>
            <span className="text-[10px] text-muted-foreground">Visa, Mastercard, RuPay</span>
          </div>
        </button>

        {deliveryMethod === 'pickup' && (
          <button
            type="button"
            onClick={() => handleChange('method', 'store_pickup')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              data.method === 'store_pickup'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border/80 bg-card/60 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Building className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">At Store</span>
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Pay Upon Store Pickup</span>
              <span className="text-[10px] text-muted-foreground">Cash, Card, or UPI</span>
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={() => handleChange('method', 'cod')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            data.method === 'cod'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border/80 bg-card/60 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Banknote className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Cash/Card</span>
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">Cash on Delivery</span>
            <span className="text-[10px] text-muted-foreground">Pay courier at your door</span>
          </div>
        </button>
      </div>

      {/* Credit Card Inputs */}
      {data.method === 'card' && (
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-foreground">Secure Card Entry</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Simulated Sandbox Processor</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Cardholder Name *
            </label>
            <Input
              type="text"
              placeholder="Rahul Sharma"
              value={data.cardName}
              onChange={(e) => handleChange('cardName', e.target.value)}
              className="text-xs h-10 bg-background"
            />
            {errors.cardName && (
              <p className="text-[11px] text-destructive font-medium">{errors.cardName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Card Number *
            </label>
            <Input
              type="text"
              placeholder="4532 •••• •••• 8892"
              value={data.cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className="text-xs h-10 font-mono bg-background tracking-wider"
            />
            {errors.cardNumber && (
              <p className="text-[11px] text-destructive font-medium">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Expiration (MM/YY) *
              </label>
              <Input
                type="text"
                placeholder="10/28"
                value={data.expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                className="text-xs h-10 font-mono bg-background"
              />
              {errors.expiry && (
                <p className="text-[11px] text-destructive font-medium">{errors.expiry}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Security Code (CVV) *
              </label>
              <Input
                type="password"
                placeholder="•••"
                value={data.cvv}
                onChange={(e) =>
                  handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                maxLength={4}
                className="text-xs h-10 font-mono bg-background"
              />
              {errors.cvv && (
                <p className="text-[11px] text-destructive font-medium">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {data.method === 'store_pickup' && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1.5">
          <span className="font-semibold text-primary block">Pay When You Collect</span>
          <p className="text-muted-foreground">
            No upfront payment required online. Present your order confirmation barcode at
            ElectroMart Delhi Flagship checkout counter (Plot 18, Commercial Complex, Nehru Place).
          </p>
        </div>
      )}

      {data.method === 'cod' && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs space-y-1.5">
          <span className="font-semibold text-amber-700 dark:text-amber-400 block">
            Cash / Mobile POS on Delivery
          </span>
          <p className="text-muted-foreground">
            Pay directly to the courier via cash, UPI QR, or wireless card terminal upon package arrival.
            Please have the exact sum ready if paying cash.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck className="size-3.5 text-primary" />
        <span>PCI-DSS Compliant Gateway Simulation for ElectroMart Store</span>
      </div>
    </div>
  );
}
