import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome – Client Works</title>
        <meta name="description" content="Premium streaming platform built with Antigravity." />
      </Head>
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center animate-fade-in">
          <h1 className="text-4xl font-display text-primary mb-4">Welcome to Client Works</h1>
          <p className="text-surface mb-6">
            Experience a premium UI with modern fonts and vibrant colors.
          </p>
          <Link href="/api/auth/signin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors">
            Sign In
          </Link>
        </div>
      </main>
    </>
  );
}
