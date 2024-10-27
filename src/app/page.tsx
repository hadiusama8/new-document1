// app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { v4 as uuidV4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const currentUrl = window.location.pathname;
    const regex = /\/documents\/([a-f0-9\-]{36})/;
    const match = currentUrl.match(regex);

    if (!match) {
      // Redirect to a new document ID
      const newDocId = uuidV4();
      console.log(`Redirecting to /documents/${newDocId}`);
      router.push(`/documents/${newDocId}`);
    }
  }, [router]);

  return <div>Loading in page...</div>;  // Show loading while redirecting
}
