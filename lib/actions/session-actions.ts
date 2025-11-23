"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

type Session = Database['public']['Tables']['sessions']['Row'];
type SessionInsert = Database['public']['Tables']['sessions']['Insert'];

interface ActionResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Crear una nueva sesión de tests
 */
export async function createTestSession(
	isSequential: boolean = false
): Promise<ActionResponse<Session>> {
	try {
		const supabase = await createClient();
		
		// Verificar autenticación
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return { success: false, error: 'No autenticado' };
		}
		
		// Crear sesión
		const sessionData: SessionInsert = {
			user_id: user.id,
			start_time: new Date().toISOString(),
			is_sequential: isSequential,
			is_completed: false,
			total_tests_completed: 0,
		};
		
		const { data, error } = await supabase
			.from('sessions')
			.insert(sessionData)
			.select()
			.single();
		
		if (error) {
			console.error('Error creating session:', error);
			return { success: false, error: error.message };
		}
		
		revalidatePath('/dashboard');
		return { success: true, data };
	} catch (error: any) {
		console.error('Unexpected error:', error);
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Completar una sesión manualmente
 */
export async function completeSession(
	sessionId: string
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return { success: false, error: 'No autenticado' };
		}
		
		// Verificar que la sesión pertenece al usuario
		const { data: session, error: fetchError } = await supabase
			.from('sessions')
			.select('user_id, total_tests_completed')
			.eq('id', sessionId)
			.single();
		
		if (fetchError || !session) {
			return { success: false, error: 'Sesión no encontrada' };
		}
		
		if (session.user_id !== user.id) {
			return { success: false, error: 'No autorizado' };
		}
		
		// Completar sesión
		const { error: updateError } = await supabase
			.from('sessions')
			.update({
				end_time: new Date().toISOString(),
				is_completed: true,
			})
			.eq('id', sessionId);
		
		if (updateError) {
			return { success: false, error: updateError.message };
		}
		
		revalidatePath('/dashboard');
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Eliminar una sesión
 */
export async function deleteSession(
	sessionId: string
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return { success: false, error: 'No autenticado' };
		}
		
		// RLS se encargará de verificar permisos
		const { error } = await supabase
			.from('sessions')
			.delete()
			.eq('id', sessionId);
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		revalidatePath('/dashboard');
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Obtener sesiones del usuario actual
 */
export async function getUserSessions(
	limit: number = 10
): Promise<ActionResponse<Session[]>> {
	try {
		const supabase = await createClient();
		
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('sessions')
			.select(`
				*,
				test_results (
					id,
					test_type,
					accuracy,
					avg_reaction_time,
					duration
				)
			`)
			.order('start_time', { ascending: false })
			.limit(limit);
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		return { success: true, data: data as any };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Obtener una sesión específica con todos sus resultados
 */
export async function getSessionById(
	sessionId: string
): Promise<ActionResponse<Session>> {
	try {
		const supabase = await createClient();
		
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('sessions')
			.select(`
				*,
				test_results (
					*,
					responses (*)
				)
			`)
			.eq('id', sessionId)
			.single();
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		return { success: true, data: data as any };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}
