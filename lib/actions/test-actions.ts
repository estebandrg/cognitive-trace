"use server";

import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/server-auth-cache";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import type { TestResult, TestType } from "@/lib/types/tests";

type TestResultRow = Database['public']['Tables']['test_results']['Row'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];
type ResponseInsert = Database['public']['Tables']['responses']['Insert'];

interface ActionResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Guardar un resultado de test con todas sus respuestas
 */
export async function saveTestResult(
	sessionId: string,
	testResult: TestResult
): Promise<ActionResponse<TestResultRow>> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		// Verificar que la sesión pertenece al usuario
		const { data: session, error: sessionError } = await supabase
			.from('sessions')
			.select('user_id')
			.eq('id', sessionId)
			.single();
		
		if (sessionError || !session) {
			return { success: false, error: 'Sesión no encontrada' };
		}
		
		if (session.user_id !== user.id) {
			return { success: false, error: 'No autorizado' };
		}
		
		// Preparar datos del test
		// Extraer métricas específicas del tipo de test
		const specificMetrics: Record<string, any> = { ...testResult };
		delete specificMetrics.testType;
		delete specificMetrics.startTime;
		delete specificMetrics.endTime;
		delete specificMetrics.duration;
		delete specificMetrics.accuracy;
		delete specificMetrics.averageReactionTime;
		delete specificMetrics.responses;
		
		const testData: TestResultInsert = {
			session_id: sessionId,
			test_type: testResult.testType,
			start_time: new Date(testResult.startTime).toISOString(),
			end_time: new Date(testResult.endTime).toISOString(),
			duration: testResult.duration,
			accuracy: testResult.accuracy * 100, // Convert 0-1 to 0-100
			avg_reaction_time: testResult.averageReactionTime || null,
			specific_metrics: specificMetrics,
			browser_info: null, // Browser info should be passed from client if needed
		};
		
		// Insertar resultado del test
		const { data: savedTest, error: testError } = await supabase
			.from('test_results')
			.insert(testData)
			.select()
			.single();
		
		if (testError) {
			console.error('Error saving test result:', testError);
			return { success: false, error: testError.message };
		}
		
		// Guardar respuestas individuales si existen
		if (testResult.responses && testResult.responses.length > 0) {
			const responses: ResponseInsert[] = testResult.responses.map((response, index) => ({
				test_result_id: savedTest.id,
				trial_number: index + 1,
				stimulus: String(response.stimulus),
				response_given: response.responseTime !== null && response.responseTime !== undefined,
				response_time: response.responseTime || null,
				is_correct: response.correct,
				timestamp: response.timestamp,
				trial_metadata: {},
			}));
			
			const { error: responsesError } = await supabase
				.from('responses')
				.insert(responses);
			
			if (responsesError) {
				console.error('Error saving responses:', responsesError);
				// No fallar si solo fallan las respuestas individuales
				// El test principal ya está guardado
			}
		}
		
		revalidatePath('/dashboard');
		return { success: true, data: savedTest };
	} catch (error: any) {
		console.error('Unexpected error:', error);
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Obtener todos los resultados de una sesión
 */
export async function getSessionResults(
	sessionId: string
): Promise<ActionResponse<TestResultRow[]>> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('test_results')
			.select(`
				*,
				responses (*)
			`)
			.eq('session_id', sessionId)
			.order('start_time', { ascending: true });
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		return { success: true, data: data as any };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Obtener resultados de un tipo de test específico para el usuario
 */
export async function getTestResultsByType(
	testType: TestType,
	limit: number = 10
): Promise<ActionResponse<TestResultRow[]>> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('test_results')
			.select(`
				*,
				sessions!inner (
					user_id,
					start_time,
					is_sequential
				)
			`)
			.eq('test_type', testType)
			.eq('sessions.user_id', user.id)
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
 * Eliminar un resultado de test
 */
export async function deleteTestResult(
	testResultId: string
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		// RLS se encargará de verificar permisos
		const { error } = await supabase
			.from('test_results')
			.delete()
			.eq('id', testResultId);
		
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
 * Obtener estadísticas agregadas del usuario
 */
export async function getUserStatistics(): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('user_statistics')
			.select('*')
			.eq('user_id', user.id)
			.single();
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		return { success: true, data };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Obtener resumen de rendimiento por tipo de test
 */
export async function getTestPerformanceSummary(): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('test_performance_summary')
			.select('*')
			.eq('user_id', user.id);
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		return { success: true, data };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}

/**
 * Obtener progreso reciente (últimos 30 días)
 */
export async function getRecentProgress(): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		
		const user = await getCachedUser();
		if (!user) {
			return { success: false, error: 'No autenticado' };
		}
		
		const { data, error } = await supabase
			.from('recent_progress')
			.select('*')
			.eq('user_id', user.id)
			.order('test_date', { ascending: false });
		
		if (error) {
			return { success: false, error: error.message };
		}
		
		return { success: true, data };
	} catch (error: any) {
		return { success: false, error: error.message || 'Error inesperado' };
	}
}
