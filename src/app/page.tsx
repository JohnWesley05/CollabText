
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenSquare } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [docId, setDocId] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleJoinRoom = () => {
    if (docId.trim()) {
      const url = name.trim() ? `/doc/${docId.trim()}?name=${encodeURIComponent(name.trim())}` : `/doc/${docId.trim()}`;
      router.push(url);
    }
  };
  
  const handleCreateRoom = () => {
    if (name.trim()) {
      const newDocId = Math.random().toString(36).substring(2, 10);
      router.push(`/doc/${newDocId}?name=${encodeURIComponent(name.trim())}`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <PenSquare className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">CollabText</CardTitle>
          </div>
          <CardDescription>
            Enter your name, then join an existing document or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="docId">Document ID</Label>
              <Input
                id="docId"
                placeholder="Enter document ID to join"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={handleJoinRoom}
            className="w-full"
            disabled={!docId.trim()}
          >
            Join Document
          </Button>
          <div className="relative w-full flex items-center">
            <div className="flex-grow border-t border-muted-foreground/20"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-sm">OR</span>
            <div className="flex-grow border-t border-muted-foreground/20"></div>
          </div>
          <Button
            onClick={handleCreateRoom}
            className="w-full"
            variant="secondary"
            disabled={!name.trim()}
          >
            Create New Document with this Name
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
