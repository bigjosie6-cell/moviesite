import Head from 'next/head';
import { useSession, getSession } from 'next-auth/react';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const userCount = await prisma.user.count();

  return {
    props: {
      movies: JSON.parse(JSON.stringify(movies)),
      userCount,
    }
  };
};

export default function AdminDashboard({ movies, userCount }: { movies: any[], userCount: number }) {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Admin Panel – Client Works</title>
      </Head>
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 bg-surface border-r border-white/5 hidden md:flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center mb-10">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h2 className="text-xl font-display font-bold text-white tracking-tight">Admin<span className="text-primary text-xs ml-1 font-normal uppercase tracking-wider">Panel</span></h2>
            </div>
            
            <nav className="space-y-2 text-sm font-medium">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 mt-8 px-4">Menu</p>
              <a href="#" className="flex items-center text-white bg-primary/10 rounded-lg px-4 py-3 border border-primary/20 transition-all">
                <span className="mr-3 opacity-80">📊</span> Overview
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-4 py-3 transition-all">
                <span className="mr-3 opacity-80">🎬</span> Movies
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-4 py-3 transition-all">
                <span className="mr-3 opacity-80">👥</span> Users
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-4 py-3 transition-all">
                <span className="mr-3 opacity-80">💳</span> Billing & Stripe
              </a>
              
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 mt-8 px-4">System</p>
              <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-4 py-3 transition-all">
                <span className="mr-3 opacity-80">⚙️</span> Settings
              </a>
            </nav>
          </div>
          <div className="p-6 border-t border-white/5">
             <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white text-sm font-medium transition-colors">
                <span className="mr-3">←</span> Back to App
             </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-display font-semibold text-white mb-1">Dashboard Overview</h1>
              <p className="text-gray-400 text-sm">Welcome back, Admin. Here's what's happening today.</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-surface border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center shadow-sm">
                <span>Export Report</span>
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 border-t-4 border-t-primary rounded-xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Users</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-bold text-white tracking-tight">{userCount}</p>
                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-0.5 rounded flex items-center">
                  Live
                </span>
              </div>
            </div>

            <div className="glass-card p-6 border-t-4 border-t-accent rounded-xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Active Subscriptions</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-bold text-white tracking-tight">0</p>
                <span className="text-gray-400 text-sm font-medium bg-gray-400/10 px-2 py-0.5 rounded flex items-center">
                  Soon
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-3">Stripe not yet linked</p>
            </div>

            <div className="glass-card p-6 border-t-4 border-t-green-500 rounded-xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Movies</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-bold text-white tracking-tight">{movies.length}</p>
                <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-0.5 rounded flex items-center">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Movie Management Table */}
          <div className="glass-card rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-surface/30">
              <div>
                <h2 className="text-lg font-semibold text-white">Content Library</h2>
                <p className="text-xs text-gray-400 mt-1">Manage movies, metadata, and streaming URLs.</p>
              </div>
              <button className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-accent transition-all duration-300 text-sm font-medium flex items-center shadow-lg shadow-primary/20">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Movie
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface/50 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="p-4 font-medium pl-6">Movie Title</th>
                    <th className="p-4 font-medium">Genre</th>
                    <th className="p-4 font-medium">Year</th>
                    <th className="p-4 font-medium">Rating</th>
                    <th className="p-4 font-medium text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                  {movies.map(movie => (
                    <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6 flex items-center">
                        <div className="relative w-10 h-14 rounded overflow-hidden mr-4 shadow-md border border-white/10 group-hover:border-primary/50 transition-colors">
                           <img src={movie.posterUrl} className="absolute inset-0 w-full h-full object-cover" alt={movie.title} />
                        </div>
                        <div>
                          <span className="font-medium text-white block">{movie.title}</span>
                          <span className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px] block">{movie.description}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                          {movie.genre}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{movie.releaseYear}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          {movie.rating}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors mr-4 text-sm font-medium">Edit</button>
                        <button className="text-gray-400 hover:text-red-400 transition-colors text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
