'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Send,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STORE_DETAILS } from '@/lib/constants';

const FAQ_DATA = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How can I track my order?',
        a: 'Visit the Orders & Tracking page and enter your order number (e.g., EM-20261015-1234). You can also sign in to your account to view all your orders and their real-time status updates.',
      },
      {
        q: 'What are the delivery options?',
        a: 'We offer standard shipping (1-2 business days across India), same-day express delivery within Delhi NCR, and free store pickup at our Nehru Place branch. Orders over ₹999 qualify for free standard shipping.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Orders can be modified or cancelled within 1 hour of placement. Contact our support team immediately with your order number. Once processing begins, changes may not be possible.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we ship across India only. International shipping options are being evaluated for future expansion.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for most products in original, unopened packaging with all accessories. Electronics must be in resalable condition. Some items like software, earbuds, and personal care devices may have different return windows.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Sign in to your account, go to Orders, select the order, and click "Request Return". Alternatively, bring the item with your invoice to our Nehru Place flagship store, or contact support for a courier return pickup.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Products & Warranty',
    questions: [
      {
        q: 'Do products come with a warranty?',
        a: 'All products include the manufacturer\'s warranty. Most electronics have a 1-year limited warranty covering defects in materials and workmanship. Extended warranty options are available at checkout.',
      },
      {
        q: 'Are your products authentic?',
        a: 'Yes, ElectroMart is an authorized retailer for all brands we carry. Every product is sourced directly from manufacturers or certified distributors and includes valid warranty coverage.',
      },
      {
        q: 'What if my product arrives damaged or defective?',
        a: 'Contact our support team immediately with your order number and photos of the damage. We\'ll arrange a replacement or full refund at no additional cost to you.',
      },
    ],
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm), all major credit and debit cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery for orders within Delhi NCR.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use industry-standard SSL encryption and never store your full card details. All transactions are processed through PCI-compliant payment processors.',
      },
      {
        q: 'Do you offer price matching?',
        a: 'Yes, we offer price matching on identical items from authorized retailers within 14 days of purchase. Contact support with proof of the lower price to request a price adjustment.',
      },
    ],
  },
  {
    category: 'Account & Support',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign In" in the header and select "Create Account". You\'ll need your email address and a password. An account lets you track orders, save addresses, and receive exclusive offers.',
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click "Sign In" then "Forgot Password". Enter your email address and we\'ll send you a secure link to reset your password.',
      },
      {
        q: 'How can I contact customer support?',
        a: `You can reach us through the contact form below, email us at ${STORE_DETAILS.contact.email}, or call ${STORE_DETAILS.contact.phone} during store hours (${STORE_DETAILS.hours.monSat}).`,
      },
    ],
  },
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleFaq = (key: string) => {
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  const filteredFaq = FAQ_DATA.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Customer Support</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            <HelpCircle className="size-3.5" />
            Help Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How can we help you?
          </h1>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions or reach out to our support team for personalized
            assistance.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3 shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Phone className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Call Us</h3>
              <p className="text-xs text-muted-foreground mt-1">Mon-Sat {STORE_DETAILS.hours.monSat}</p>
              <a
                href={`tel:${STORE_DETAILS.contact.phone.replace(/[^+\d]/g, '')}`}
                className="text-sm font-semibold text-primary hover:underline mt-1 block"
              >
                {STORE_DETAILS.contact.phone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3 shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Email Support</h3>
              <p className="text-xs text-muted-foreground mt-1">We respond within 24-48 hours</p>
              <a
                href={`mailto:${STORE_DETAILS.contact.email}`}
                className="text-sm font-semibold text-primary hover:underline mt-1 block"
              >
                {STORE_DETAILS.contact.email}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3 shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Visit Our Store</h3>
              <p className="text-xs text-muted-foreground mt-1">Delhi Flagship Location</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {STORE_DETAILS.address.street}
                <br />
                {STORE_DETAILS.address.city}, {STORE_DETAILS.address.state} {STORE_DETAILS.address.zip}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-xs text-muted-foreground">
                Quick answers to common inquiries
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <HelpCircle className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-6">
            {filteredFaq.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.questions.map((item, idx) => {
                    const key = `${category.category}-${idx}`;
                    const isExpanded = expandedFaq === key;

                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-border/80 bg-card/60 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(key)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-foreground pr-4">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`size-4 text-muted-foreground shrink-0 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-0">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredFaq.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl bg-muted/10">
              <HelpCircle className="size-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No matching FAQs found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords or contact us directly below.
              </p>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Contact Our Support Team</h2>
              <p className="text-xs text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you
                within 24-48 hours.
              </p>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Message Sent Successfully</h3>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ve received your inquiry and will respond within 24-48 hours. Check your email
                    for a confirmation.
                  </p>
                </div>
                <Button
                  onClick={() => setSubmitStatus('idle')}
                  variant="outline"
                  size="sm"
                  className="text-xs h-9 px-4 rounded-xl"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold text-foreground">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="h-9 text-xs bg-background border-border/80 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-foreground">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="h-9 text-xs bg-background border-border/80 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-foreground">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Order inquiry, return request, product question..."
                    required
                    className="h-9 text-xs bg-background border-border/80 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your question or concern in detail. Include relevant order numbers if applicable..."
                    required
                    rows={5}
                    className="w-full px-3 py-2.5 text-xs bg-background border border-border/80 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 text-xs font-semibold rounded-xl gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Support Hours & Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Support Hours</h3>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-semibold text-foreground">{STORE_DETAILS.hours.monSat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-foreground">{STORE_DETAILS.hours.sun}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-muted/20 p-6 space-y-3">
              <h3 className="font-bold text-sm text-foreground">What to Include</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Order number (if related to a purchase)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Product name or SKU</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Clear description of your question or issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Photos if reporting damage or defects</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <MessageCircle className="size-4 text-primary" />
                Quick Links
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/orders"
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  → Track Your Orders
                </Link>
                <Link
                  href="/products"
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  → Browse Product Catalog
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  → Create an Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
