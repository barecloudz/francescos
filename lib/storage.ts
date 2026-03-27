// Re-export the storage singleton from the server layer so that Next.js route
// handlers can import from '@/lib/storage' rather than '../../../server/storage'.
// This keeps the import path consistent regardless of nesting depth.
export { storage } from '@/server/storage';
