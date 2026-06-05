import Head from 'next/head';
import { signOut, useSession, getSession } from 'next-auth/react';
import Link from 'next/link';
import { prisma } from '../lib/prisma';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return {
    props: {
      movies: JSON.parse(JSON.stringify(movies))
    }
  };
};

export default function Dashboard({ movies }: { movies: any[] }) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  // The first movie acts as the "Hero" feature, fallback to null if no movies
  const featuredMovie = movies[0] || null;
  const catalogMovies = movies.slice(1);

  return (
    <>
      <Head>
        <title>Browse – Client Works</title>
      </Head>
      
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-display font-bold text-primary tracking-tight">C-Works</h1>
            <div className="hidden md:flex space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="text-white hover:text-primary transition-colors">Home</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Movies</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">My List</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium bg-accent/20 text-accent border border-accent/50 px-4 py-1.5 rounded-full hover:bg-accent hover:text-white transition-all">
                Admin Panel
              </Link>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm font-medium bg-surface border border-white/10 text-white px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-background pb-12">
        {featuredMovie ? (
          /* Hero Section */
          <div className="relative h-[75vh] w-full bg-surface mb-12 overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-50 transform scale-105 transition-transform duration-[20s] ease-out hover:scale-110"
              style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            
            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-4xl animate-fade-in z-10">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 drop-shadow-2xl">
                {featuredMovie.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm font-medium text-gray-300 mb-6 drop-shadow-md">
                <span className="bg-primary/20 text-primary border border-primary/50 px-2 py-0.5 rounded shadow-sm">
                  {featuredMovie.genre}
                </span>
                <span>{featuredMovie.releaseYear}</span>
                <span className="flex items-center bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  <span className="text-yellow-500 mr-1">★</span> {featuredMovie.rating}
                </span>
              </div>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl line-clamp-3 drop-shadow-xl leading-relaxed">
                {featuredMovie.description}
              </p>
              <div className="flex space-x-4">
                <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 flex items-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  Watch Now
                </button>
                <button className="glass-card px-8 py-3 rounded-lg font-medium text-white hover:bg-white/20 transition-all duration-300 flex items-center group">
                  <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  My List
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[75vh] flex items-center justify-center text-white">No movies found. Add some in the Admin panel!</div>
        )}

        {/* Catalog Row */}
        {catalogMovies.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-display font-semibold text-white mb-6 flex items-center">
              Trending Now
              <span className="ml-3 h-px w-24 bg-gradient-to-r from-primary to-transparent"></span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {catalogMovies.map(movie => (
                <div key={movie.id} className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3] bg-surface border border-white/5 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:z-10 hover:border-primary/50">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-medium truncate mb-1 text-shadow-sm">{movie.title}</h4>
                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <div className="flex items-center space-x-2 text-xs font-medium text-gray-300">
                        <span>{movie.releaseYear}</span>
                        <span className="text-primary">{movie.genre}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/90 backdrop-blur-md rounded-full p-4 shadow-[0_0_30px_rgba(37,99,235,0.5)] transform scale-50 group-hover:scale-100 transition-transform duration-300 ease-out">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
