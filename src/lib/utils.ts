import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getSupabaseBrowserClient } from './supabase/client'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// src/lib/utils.ts







