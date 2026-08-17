import { createClient } from '../server';
import { endOfDay } from './date-filters';
import type { DiagnosticCallback, DiagnosticCallbackStatus } from '@/types';

export interface DiagnosticCallbackCounts {
  total: number;
  new: number;
  contacted: number;
  booked: number;
  archived: number;
}

export async function getAllDiagnosticCallbacks(options?: {
  status?: DiagnosticCallbackStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}): Promise<{ callbacks: DiagnosticCallback[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from('sws2026_diagnostic_callbacks')
    .select('*', { count: 'exact' });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.dateFrom) {
    query = query.gte('created_at', options.dateFrom);
  }

  if (options?.dateTo) {
    query = query.lte('created_at', endOfDay(options.dateTo));
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    const offset = options.offset || 0;
    query = query.range(offset, offset + options.limit - 1);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching diagnostic callbacks:', error);
    return { callbacks: [], total: 0 };
  }

  return {
    callbacks: (data || []) as DiagnosticCallback[],
    total: count || 0,
  };
}

export async function getDiagnosticCallbackById(
  id: string
): Promise<DiagnosticCallback | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sws2026_diagnostic_callbacks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching diagnostic callback:', error);
    return null;
  }

  return data as DiagnosticCallback;
}

// Just the sidebar badge / dashboard tile figure - avoids the five count queries
// getDiagnosticCallbackCounts runs when only the unworked total is needed.
export async function getNewDiagnosticCallbackCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('sws2026_diagnostic_callbacks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  if (error) {
    console.error('Error counting new diagnostic callbacks:', error);
    return 0;
  }

  return count || 0;
}

export async function getDiagnosticCallbackCounts(): Promise<DiagnosticCallbackCounts> {
  const supabase = await createClient();

  const countFor = (status?: DiagnosticCallbackStatus) => {
    const query = supabase
      .from('sws2026_diagnostic_callbacks')
      .select('*', { count: 'exact', head: true });

    return status ? query.eq('status', status) : query;
  };

  const [total, newCount, contacted, booked, archived] = await Promise.all([
    countFor(),
    countFor('new'),
    countFor('contacted'),
    countFor('booked'),
    countFor('archived'),
  ]);

  return {
    total: total.count || 0,
    new: newCount.count || 0,
    contacted: contacted.count || 0,
    booked: booked.count || 0,
    archived: archived.count || 0,
  };
}
