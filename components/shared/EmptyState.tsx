import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/70 bg-card/50 my-6">
      {Icon && (
        <div className="p-4 rounded-full bg-muted/60 mb-4 text-muted-foreground">
          <Icon className="size-10" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1.5 mb-6">{description}</p>
      {action && (
        action.href ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}
