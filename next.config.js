/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // Untuk Vercel: gambar yang diupload disimpan di Vercel Blob atau public/uploads
  // Untuk lokal: public/uploads berfungsi normal
};
module.exports = nextConfig;
