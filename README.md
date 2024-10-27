This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## About the app
This project focuses on developing an online document editor with core editing features, built primarily using React for the frontend, Firebase for document storage and data persistence, and Quill as the rich text editor library. Socket connections are implemented for real-time server connectivity, enabling collaborative editing capabilities.

## Implemented Features:

1. Quill Toolbar Functionality:
- Integrated a wide range of toolbar options for font styling, color changes, image embedding, and more, allowing for a seamless text editing experience.
- The toolbar empowers users to make customizations efficiently, with visual and intuitive options for document formatting.

2. Save Document Feature:
- Users can save their documents within the application, preserving any text and media formatting changes made during editing.
- This feature is implemented to ensure that edits are not lost, even if users leave the page or refresh.

3. Document Sharing and Collaboration:
- A sync documents feature enables real-time, collaborative editing, where multiple users can work on the same document simultaneously using a shared URL.
- The share functionality generates a unique URL for each document, allowing users to copy and share it with collaborators, fostering teamwork and easy accessibility.

4. Data Persistence with Firebase:
- Integrated Firebase to persist documents, enabling document retrieval and synchronization across sessions.
- Documents are saved in Firebase along with relevant metadata, allowing users to retrieve documents and continue editing from where they left off.

5. Real-Time Collaboration with Sockets:
- Used socket connections to enable real-time collaboration, allowing multiple users, including myself, to edit the same document concurrently. This server connectivity keeps everyone’s edits synchronized in real time, so we can enjoy a truly shared editing experience.
- By generating and sharing a unique URL, we can easily invite collaborators to join in. 
- All changes are instantly reflected on everyone’s screens, making the collaborative process smooth and interactive. This feature has enhanced the way users interact with and contribute to documents together.

## Next Steps (To-Do Items):

1. Database Integration:
- Implement a backend database, such as MySQL, for structured data storage. This will enable better management of documents and user data, providing enhanced security, scalability, and querying capabilities.

2. Table Functionality:
- Extend the Quill editor to support tables within documents, allowing users to organize content in rows and columns. 
- This feature will be useful for creating structured data layouts, such as schedules, lists, and comparative content.

3. Dashboard Integration:
- Add a dashboard interface to manage documents, user access, and document metadata. 
- The dashboard will provide users with an overview of all saved documents, recently edited files, and collaboration links, enhancing user experience and productivity.
g