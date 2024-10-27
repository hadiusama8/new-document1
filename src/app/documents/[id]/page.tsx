// app/documents/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Editor from "@/components/editor";

const DocumentPage = () => {
  const params = useParams();
  const documentId = params.id;  // Access the dynamic route parameter

  if (!documentId) { 
    return <div>Loading in doc...</div>;  // Show loading until document ID is available
  }

  return (
    <Editor documentId={documentId} />
  );
};

export default DocumentPage;
