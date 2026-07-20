import type { Walk, Stop, WalkGenerationRequest } from '@wander/shared-types';
import type { TypedSupabaseClient, WalkCompletionData } from './types';

/** Generate a new walk using the AI walk engine (via Edge Function) */
export async function generate(
  client: TypedSupabaseClient,
  params: WalkGenerationRequest,
): Promise<Walk> {
  const { data, error } = await client.functions.invoke('generate-walk', {
    body: params,
  });

  if (error) throw new Error(error.message);
  return data as Walk;
}

/** Swap a stop on an active walk for a new alternative */
export async function swapStop(
  client: TypedSupabaseClient,
  walkId: string,
  stopId: string,
): Promise<Stop> {
  const { data, error } = await client.functions.invoke('swap-stop', {
    body: { walk_id: walkId, stop_id: stopId },
  });

  if (error) throw new Error(error.message);
  return data as Stop;
}

/** Complete an active walk, persisting final stats and marking it as done */
export async function completeWalk(
  client: TypedSupabaseClient,
  walkId: string,
  completionData: WalkCompletionData,
): Promise<Walk> {
  const { data, error } = await client
    .from('walks')
    .update({
      title: completionData.title,
      narrative: completionData.narrative,
      distance_km: completionData.distance_km,
      duration_minutes: completionData.duration_minutes,
      completed_at: completionData.completed_at,
    })
    .eq('id', walkId)
    .select('*, stops(*), photos:walk_photos(*)')
    .single();

  if (error) throw new Error(error.message);
  return data as Walk;
}
