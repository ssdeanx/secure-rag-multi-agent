'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface FeatureCardProps {
  title: string;
  badgeVariant?: 'secondary' | 'destructive' | 'default';
  badgeText?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function FeatureCard({ title, badgeVariant = 'secondary', badgeText, icon, className, children }: FeatureCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow hover-lift hover-glow animated-gradient border-0 ${className ?? ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg size-fit">
            {icon}
          </div>
          <CardTitle className="ml-3 text-lg font-semibold">{title}</CardTitle>
          {badgeText && (
            <Badge variant={badgeVariant === 'default' ? undefined : badgeVariant} className="ml-auto">{badgeText}</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
