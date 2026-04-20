import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { ok, err, requireAdmin, genFilename, isAllowedImg } from '@/lib/api';

// CATATAN VERCEL:
// Vercel adalah serverless — file yang ditulis ke filesystem TIDAK persisten antar-request.
// Untuk lokal (XAMPP/dev): upload ke public/uploads berfungsi normal.
// Untuk production di Vercel: gambar yang sudah ada di public/uploads (committed ke repo)
// akan tetap bisa diakses. Gambar baru yang diupload via CMS setelah deploy
// akan hilang saat instance restart.
//
// SOLUSI untuk production: ganti penyimpanan ke Vercel Blob, Cloudinary, atau S3.
// Lihat README.md untuk panduan lengkap.
// Untuk sekarang, upload tetap berfungsi di lokal dan untuk static assets yang di-commit.

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return err('Unauthorized', 401);

  const formData = await req.formData().catch(() => null);
  if (!formData) return err('FormData tidak valid');

  const file = formData.get('file') as File | null;
  const type = (formData.get('type') as string) || 'product';

  if (!file) return err('File tidak ditemukan');
  if (!['product', 'gallery', 'about'].includes(type)) return err('Tipe tidak valid');
  if (!isAllowedImg(file.type)) return err('Format tidak didukung. Gunakan jpg/png/webp/gif');
  if (file.size > 10 * 1024 * 1024) return err('Ukuran max 10MB');

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = genFilename(type, ext);
  const dir = join(process.cwd(), 'public', 'uploads');

  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return ok({ filename, url: `/uploads/${filename}` });
}
