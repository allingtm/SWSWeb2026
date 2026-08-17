import { createClient } from '../server';
import type { DiagnosticCallbackStatus } from '@/types';

const TABLE = 'sws2026_diagnostic_callbacks';

export interface DiagnosticCallbackUpdate {
  status?: DiagnosticCallbackStatus;
  notes?: string | null;
}

// Status and notes are edited independently in the UI, but accepting both in one
// update keeps it to a single round trip when they change together.
export async function updateDiagnosticCallback(
  id: string,
  updates: DiagnosticCallbackUpdate
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLE).update(updates).eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function bulkUpdateDiagnosticCallbackStatus(
  ids: string[],
  status: DiagnosticCallbackStatus
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLE).update({ status }).in('id', ids);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteDiagnosticCallback(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function bulkDeleteDiagnosticCallbacks(
  ids: string[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLE).delete().in('id', ids);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
