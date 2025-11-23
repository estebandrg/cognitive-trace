import { createTestSession, completeSession } from '@/lib/actions/session-actions';
import { saveTestResult } from '@/lib/actions/test-actions';
import type { TestResult } from '@/lib/types/tests';

/**
 * Helper para iniciar una nueva sesión de tests
 * Maneja la creación en DB y vinculación con estado local
 */
export async function startTestSession(
	isSequential: boolean,
	startSessionLocal: (isSequential: boolean, dbSessionId?: string) => void
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
	try {
		// Crear sesión en DB
		const response = await createTestSession(isSequential);
		
		if (!response.success || !response.data) {
			return {
				success: false,
				error: response.error || 'Error creando sesión',
			};
		}

		// Iniciar sesión local con ID de DB
		startSessionLocal(isSequential, response.data.id);

		return {
			success: true,
			sessionId: response.data.id,
		};
	} catch (error: any) {
		console.error('Error starting test session:', error);
		return {
			success: false,
			error: error.message || 'Error inesperado',
		};
	}
}

/**
 * Helper para guardar resultado de test con manejo de errores
 * Incluye guardado en estado local y sincronización con DB
 */
export async function saveTestResultWithSync(
	dbSessionId: string,
	testResult: TestResult,
	addTestResultLocal: (result: TestResult) => void
): Promise<{ success: boolean; error?: string }> {
	try {
		// 1. Guardar localmente primero (UX inmediata)
		addTestResultLocal(testResult);

		// 2. Sincronizar con DB
		const response = await saveTestResult(dbSessionId, testResult);

		if (!response.success) {
			console.warn('Failed to save to DB, but saved locally:', response.error);
			// No fallar completamente, el resultado está en localStorage
			return {
				success: true, // true porque está guardado localmente
				error: `Advertencia: ${response.error}. El resultado está guardado localmente.`,
			};
		}

		return { success: true };
	} catch (error: any) {
		console.error('Error saving test result:', error);
		// Resultado ya está guardado localmente
		return {
			success: true,
			error: `Advertencia: ${error.message}. El resultado está guardado localmente.`,
		};
	}
}

/**
 * Helper para completar una sesión secuencial
 */
export async function finalizeSequentialSession(
	dbSessionId: string,
	completedTestsCount: number
): Promise<{ success: boolean; error?: string }> {
	try {
		// Solo completar si tiene los 4 tests
		if (completedTestsCount < 4) {
			return {
				success: false,
				error: 'Sesión incompleta. Faltan tests por completar.',
			};
		}

		const response = await completeSession(dbSessionId);

		if (!response.success) {
			return {
				success: false,
				error: response.error || 'Error completando sesión',
			};
		}

		return { success: true };
	} catch (error: any) {
		console.error('Error finalizing session:', error);
		return {
			success: false,
			error: error.message || 'Error inesperado',
		};
	}
}

/**
 * Helper para verificar si una sesión debe auto-completarse
 */
export function shouldAutoComplete(isSequential: boolean, completedCount: number): boolean {
	return isSequential && completedCount >= 4;
}
