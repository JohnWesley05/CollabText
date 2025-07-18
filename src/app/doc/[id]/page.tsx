
'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronLeft, PenSquare } from 'lucide-react';
import CollabEditor from '@/components/CollabEditor';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CollaborationProvider, useCollaboration } from '@/context/CollaborationContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function CollaboratorIndicator() {
  const { collaborators } = useCollaboration();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center -space-x-2">
        {collaborators.map((collaborator) => (
          <Tooltip key={collaborator.clientId}>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background cursor-pointer">
                <AvatarFallback style={{ backgroundColor: collaborator.color, color: 'white' }}>
                  {collaborator.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collaborator.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

function DocPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const username = searchParams.get('name') || undefined;

  return (
    <div className="flex flex-col h-screen bg-background">
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
          <div className="text-sm text-muted-foreground hidden md:block">
            Document ID: <span className="font-mono p-1 rounded-md bg-muted">{id}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-grow">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground capitalize font-headline">{id}</h1>
          <div className="flex-grow flex flex-col">
            <CollabEditor docId={id} username={username} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DocPage() {
  return (
    <CollaborationProvider>
      <DocPageContent />
    </CollaborationProvider>
  );
}
