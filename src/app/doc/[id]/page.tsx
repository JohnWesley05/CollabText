'use client';

import Link from 'next/link';
import { ChevronLeft, PenSquare, Users } from 'lucide-react';
import CollabEditor from '@/components/CollabEditor';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CollaborationProvider, useCollaboration } from '@/context/CollaborationContext';

type DocPageProps = {
  params: {
    id: string;
  };
};

function CollaboratorIndicator() {
  const { collaboratorCount } = useCollaboration();

  return (
    <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-muted shadow-inner">
      <Users className="w-5 h-5 text-muted-foreground" />
      <span className="font-semibold text-muted-foreground">{collaboratorCount}</span>
    </div>
  );
}

function DocPageContent({ id }: { id: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
                <Link href="/">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
            </Button>
            <PenSquare className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold font-headline">CollabText</h1>
        </div>
        <div className="flex items-center gap-4">
          <CollaboratorIndicator />
          <div className="text-sm text-muted-foreground">
            Document ID: <span className="font-mono p-1 rounded-md bg-muted">{id}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <CollabEditor docId={id} />
      </main>
    </div>
  );
}

export default function DocPage({ params }: DocPageProps) {
  const { id } = params;

  return (
    <CollaborationProvider>
      <DocPageContent id={id} />
    </CollaborationProvider>
  );
}
