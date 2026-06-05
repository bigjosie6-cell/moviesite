import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MOCK_MOVIES = [
  {
    title: "Cyberpunk Sunrise",
    description: "A neon-drenched thrill ride through a dystopian future where hackers are the last line of defense against a corrupt mega-corporation trying to control human consciousness.",
    genre: "Sci-Fi",
    releaseYear: 2042,
    rating: 8.5,
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    streamingUrl: "movies/cyberpunk.mp4"
  },
  {
    title: "Mountain Whisper",
    description: "An isolated cabin, an unspoken past, and a snowstorm that traps them all. A psychological thriller that keeps you guessing until the final freeze.",
    genre: "Thriller",
    releaseYear: 2023,
    rating: 7.2,
    posterUrl: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?auto=format&fit=crop&q=80&w=800",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    streamingUrl: "movies/mountain.mp4"
  },
  {
    title: "Neon Drift",
    description: "Underground street racers compete for ultimate glory on the neon-lit streets of Tokyo. Speed, betrayal, and the quest for the ultimate drift.",
    genre: "Action",
    releaseYear: 2025,
    rating: 9.1,
    posterUrl: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&q=80&w=800",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    streamingUrl: "movies/neon.mp4"
  },
  {
    title: "The Silent Cosmos",
    description: "A deep-space exploration mission goes terribly wrong when the crew discovers they are not alone, and silence is their only weapon.",
    genre: "Sci-Fi",
    releaseYear: 2026,
    rating: 8.8,
    posterUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    streamingUrl: "movies/cosmos.mp4"
  },
  {
    title: "Fading Echoes",
    description: "A detective tries to solve a murder where the only clues are the fading memories of the victim, extracted using experimental technology.",
    genre: "Mystery",
    releaseYear: 2024,
    rating: 7.9,
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    streamingUrl: "movies/echoes.mp4"
  }
];

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', parseInt(process.env.BCRYPT_SALT_ROUNDS || '4'));
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // 2. Clear existing movies and seed new ones
  await prisma.movie.deleteMany();
  for (const movie of MOCK_MOVIES) {
    const created = await prisma.movie.create({
      data: movie
    });
    console.log(`Created movie: ${created.title}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
