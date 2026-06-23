'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SynopsisModalProps {
  title: string;
  synopsis?: string | null;
  className?: string;
}

export function SynopsisModal({
  title,
  synopsis = 'N/A',
  className,
}: SynopsisModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn('w-full', className)}>
          <Book className="h-3 w-3" /> Read Synopsis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Synopsis</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{synopsis ?? 'N/A'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
