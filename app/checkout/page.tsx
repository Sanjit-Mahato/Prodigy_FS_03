'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  CreditCard,
  PackageCheck,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { AddressForm, ShippingAddressData } from '@/components/checkout/AddressForm';
import { PaymentForm, PaymentData } from '@/components/checkout/PaymentForm';
import { OrderReview } from '@/components/checkout/OrderReview';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { STORE_DETAILS } from '@/lib/constants';

type CheckoutStep = 'address' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, shipping, total, clearCart, isLoading } = useCart();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form states
  const [addressData, setAddressData] = useState<ShippingAddressData>({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    deliveryMethod: 'delivery',
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Recalculate shipping based on delivery method (₹99 under ₹999, free over ₹999 or pickup)
  const effectiveShipping = addressData.deliveryMethod === 'pickup' || subtotal >= STORE_DETAILS.shipping.freeShippingThreshold ? 0 : STORE_DETAILS.shipping.standardShippingFee;
  const effectiveTotal = Math.round((subtotal + tax + effectiveShipping) * 100) / 100;

  // Validation routines
  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addressData.name.trim()) errors.name = 'Full name is required';
    if (!addressData.phone.trim()) errors.phone = 'Phone number is required for tracking';
    if (!addressData.street.trim()) errors.street = 'Street address is required';
    if (!addressData.city.trim()) errors.city = 'City is required';
    if (!addressData.state.trim()) errors.state = 'State / province is required';
    if (!addressData.zip.trim()) errors.zip = 'ZIP code is required';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = (): boolean => {
    const errors: Record<string, string> = {};
    if (paymentData.method === 'card') {
      if (!paymentData.cardName.trim()) errors.cardName = 'Name on card is required';
      const cleanNum = paymentData.cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) errors.cardNumber = 'Please enter a valid 16-digit card number';
      if (!paymentData.expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = 'Format must be MM/YY';
      if (paymentData.cvv.length < 3) errors.cvv = 'CVV must be 3 or 4 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 'address') {
      if (validateAddress()) {
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (step === 'payment') {
      if (validatePayment()) {
        setStep('review');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'payment') setStep('address');
    if (step === 'review') setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: addressData,
          deliveryMethod: addressData.deliveryMethod,
          paymentMethod:
            paymentData.method === 'card'
              ? `Card (ending in ${paymentData.cardNumber.slice(-4) || '8892'})`
              : paymentData.method === 'store_pickup'
              ? 'Pay at Store (Nehru Place)'
              : 'Cash on Delivery',
          notes: orderNotes,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to place order. Please try again.');
      }

      // Empty cart locally & navigate to the created order confirmation page
      clearCart();
      router.push(`/orders/${resData.orderId || resData.orderNumber}?placed=true`);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong while processing your order.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Preparing checkout session...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container mx-auto px-4">
        <div className="max-w-md w-full text-center space-y-5 rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 shadow-xs">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="size-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">Your shopping cart is empty</h2>
            <p className="text-xs text-muted-foreground">
              Add some electronics or accessories to your cart before proceeding to checkout.
            </p>
          </div>
          <Button asChild className="text-xs font-bold px-6 h-10 rounded-xl">
            <Link href="/products">
              <ArrowLeft className="size-3.5 mr-2" />
              Return to Catalog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Header */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Progress Stepper */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-border/60 -z-0" />

            {/* Step 1: Fulfillment */}
            <div className="flex flex-col items-center gap-1.5 bg-background px-3 z-10">
              <div
                className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'address'
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-primary/20 text-primary'
                }`}
              >
                <MapPin className="size-4" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">1. Fulfillment</span>
            </div>

            {/* Step 2: Payment */}
            <div className="flex flex-col items-center gap-1.5 bg-background px-3 z-10">
              <div
                className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'payment'
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : step === 'review'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <CreditCard className="size-4" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">2. Payment</span>
            </div>

            {/* Step 3: Review */}
            <div className="flex flex-col items-center gap-1.5 bg-background px-3 z-10">
              <div
                className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'review'
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <PackageCheck className="size-4" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">3. Place Order</span>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="max-w-4xl mx-auto p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium">
            {submitError}
          </div>
        )}

        {/* Main Grid: Form wizard (8 cols) + Summary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6 shadow-xs">
            {step === 'address' && (
              <AddressForm
                data={addressData}
                onChange={setAddressData}
                errors={addressErrors}
              />
            )}

            {step === 'payment' && (
              <PaymentForm
                data={paymentData}
                onChange={setPaymentData}
                errors={paymentErrors}
                deliveryMethod={addressData.deliveryMethod}
              />
            )}

            {step === 'review' && (
              <OrderReview
                items={items}
                shippingAddress={addressData}
                payment={paymentData}
                subtotal={subtotal}
                tax={tax}
                shipping={effectiveShipping}
                total={effectiveTotal}
                notes={orderNotes}
                onNotesChange={setOrderNotes}
              />
            )}

            {/* Step Control Buttons */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              {step !== 'address' ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="text-xs h-10 px-4 gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </Button>
              ) : (
                <Button asChild variant="ghost" className="text-xs text-muted-foreground p-0">
                  <Link href="/cart">
                    <ArrowLeft className="size-3.5 mr-1.5" />
                    Back to Cart
                  </Link>
                </Button>
              )}

              {step !== 'review' ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="text-xs font-bold h-10 px-6 gap-1.5 shadow-sm cursor-pointer ml-auto"
                >
                  <span>
                    {step === 'address' ? 'Proceed to Payment' : 'Review Your Order'}
                  </span>
                  <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="text-xs font-bold h-11 px-8 gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 cursor-pointer ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Confirming & Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      <span>Place Order & Pay ({formatPrice(effectiveTotal)})</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Sticky Mini Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <CartSummary showCheckoutButton={false} />

            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Buyer Protection Guarantee</span>
              </div>
              <p>
                Every order placed with ElectroMart includes verified hardware warranty, 30-day
                return guarantee, and official store receipt for local tax deduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
