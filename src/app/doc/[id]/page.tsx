import Link from 'next/link';
import { ChevronLeft, PenSquare } from 'lucide-react';
import CollabEditor from '@/components/CollabEditor';
import { Button } from '@/components/ui/button';

type DocPageProps = {
  params: {
    id: string;
  };
};

export default function DocPage({ params }: DocPageProps) {
  const { id } = params;

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
        <div className="text-sm text-muted-foreground">
          Document ID: <span className="font-mono p-1 rounded-md bg-muted">{id}</span>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <CollabEditor docId={id} />
      </main>
    </div>
  );
}
