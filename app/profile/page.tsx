'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User,
  Mail,
  MapPin,
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  ArrowRight,
  ChevronRight,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

interface IAddress {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [stats, setStats] = useState({ orderCount: 0, recentOrders: [] as any[] });

  // Address modal / form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<IAddress>({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setName(data.user.name || '');
      setEmail(data.user.email || '');
      setRole(data.user.role || 'customer');
      setAddresses(data.user.addresses || []);
      setStats(data.stats || { orderCount: 0, recentOrders: [] });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Failed to update name');
      setSuccessMessage('Profile name updated successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    let updatedAddresses = [...addresses];
    if (editingAddressIndex !== null) {
      updatedAddresses[editingAddressIndex] = addressForm;
    } else {
      updatedAddresses.push(addressForm);
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (!res.ok) throw new Error('Failed to save address');
      setAddresses(updatedAddresses);
      setIsAddingAddress(false);
      setEditingAddressIndex(null);
      setAddressForm({
        label: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      });
      setSuccessMessage('Shipping address saved successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    try {
      setIsSaving(true);
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updated }),
      });
      if (!res.ok) throw new Error('Failed to delete address');
      setAddresses(updated);
      setSuccessMessage('Address removed.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove address');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditAddress = (addr: IAddress, index: number) => {
    setAddressForm(addr);
    setEditingAddressIndex(index);
    setIsAddingAddress(true);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Breadcrumb Header */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">My Account & Settings</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Hero Card */}
        <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
              {name.charAt(0).toUpperCase() || <User className="size-8" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {name || 'Customer'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full capitalize">
                  <Shield className="size-3" />
                  {role} Account
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/orders">
              <Button variant="outline" className="h-10 text-xs font-semibold rounded-xl gap-2">
                <Package className="size-4" />
                View All Orders ({stats.orderCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2.5">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Account Details & Recent Orders */}
          <div className="space-y-8 lg:col-span-1">
            {/* Account Details Form */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 space-y-5 shadow-xs">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="size-4 text-primary" />
                Personal Information
              </h2>

              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-foreground">
                    Display Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-9 text-xs bg-background border-border/80 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="h-9 text-xs bg-muted/40 border-border/80 rounded-xl text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Email address cannot be modified once verified.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  size="sm"
                  className="w-full h-9 text-xs font-semibold rounded-xl gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  Save Changes
                </Button>
              </form>
            </div>

            {/* Quick Order Snapshot */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Recent Activity
                </h2>
                <Link
                  href="/orders"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-2.5">
                  {stats.recentOrders.map((ord: any) => (
                    <Link
                      key={ord._id}
                      href={`/orders/${ord._id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:bg-muted/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">
                          {ord.trackingNumber || ord._id}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {' • '}
                          <span className="capitalize text-primary font-medium">{ord.status}</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {formatPrice(ord.total || 0)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No orders placed yet.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Address Book */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Speed up checkout by saving standard delivery locations
                  </p>
                </div>

                {!isAddingAddress && (
                  <Button
                    onClick={() => {
                      setEditingAddressIndex(null);
                      setAddressForm({
                        label: 'Home',
                        street: '',
                        city: '',
                        state: '',
                        zip: '',
                        phone: '',
                      });
                      setIsAddingAddress(true);
                    }}
                    size="sm"
                    className="text-xs h-9 font-semibold rounded-xl gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    Add Address
                  </Button>
                )}
              </div>

              {/* Add / Edit Address Subform */}
              {isAddingAddress && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-4"
                >
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                    {editingAddressIndex !== null ? 'Edit Address' : 'New Address'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Label</label>
                      <Input
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        placeholder="Home, Office, Studio"
                        required
                        className="h-8 text-xs bg-background rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">
                        Phone Number (for SMS Tracking)
                      </label>
                      <Input
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        required
                        className="h-8 text-xs bg-background rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">
                      Street Address
                    </label>
                    <Input
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="Flat 402, Block B, Green Park Extension"
                      required
                      className="h-8 text-xs bg-background rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">City</label>
                      <Input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="New Delhi"
                        required
                        className="h-8 text-xs bg-background rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">State / UT</label>
                      <Input
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        placeholder="Delhi"
                        required
                        className="h-8 text-xs bg-background rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">PIN Code</label>
                      <Input
                        value={addressForm.zip}
                        onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                        placeholder="110019"
                        required
                        className="h-8 text-xs bg-background rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingAddress(false)}
                      className="h-8 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      size="sm"
                      className="h-8 text-xs font-semibold rounded-lg"
                    >
                      {isSaving ? 'Saving...' : 'Save Address'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-border/80 bg-background/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
                          {addr.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditAddress(addr, idx)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Edit address"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(idx)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-foreground font-medium">
                        {addr.street}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {addr.city}, {addr.state} {addr.zip}
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        Phone: {addr.phone}
                      </div>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && !isAddingAddress && (
                  <div className="sm:col-span-2 text-center py-10 border border-dashed border-border/80 rounded-2xl space-y-2">
                    <MapPin className="size-8 text-muted-foreground mx-auto" />
                    <p className="text-xs font-semibold text-foreground">No saved addresses</p>
                    <p className="text-[11px] text-muted-foreground">
                      Add a shipping address to speed up checkout.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
