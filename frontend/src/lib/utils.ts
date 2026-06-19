import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | undefined | null) {
  if (!path) return undefined;
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return `${API_BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}`;
}

export const getAvatarUrl = getImageUrl;
