-- ============================================================================
-- COGNITIVE TRACE - DATABASE SCHEMA
-- Version: 1.0.1
-- Description: Schema completo para la aplicación de tests cognitivos
-- Incluye: 4 tablas, RLS optimizado, triggers, vistas y funciones
-- ============================================================================

-- ============================================================================
-- LIMPIEZA PREVIA (OPCIONAL - Descomentar solo si necesitas reiniciar)
-- ============================================================================

/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_complete_session ON test_results;
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

DROP VIEW IF EXISTS recent_progress;
DROP VIEW IF EXISTS test_performance_summary;
DROP VIEW IF EXISTS user_statistics;

DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS complete_session();
DROP FUNCTION IF EXISTS update_updated_at_column();
*/

-- ============================================================================
-- TABLAS
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
	id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
	full_name TEXT,
	avatar_url TEXT,
	preferences JSONB DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

COMMENT ON TABLE profiles IS 'Perfiles de usuario extendidos';
COMMENT ON COLUMN profiles.preferences IS 'Configuraciones: {theme, language, notifications}';

-- ────────────────────────────────────────────────────────────────────────────
-- 2. SESSIONS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	start_time TIMESTAMPTZ NOT NULL,
	end_time TIMESTAMPTZ,
	is_sequential BOOLEAN DEFAULT false,
	is_completed BOOLEAN DEFAULT false,
	total_tests_completed INTEGER DEFAULT 0,
	notes TEXT,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_completed ON sessions(user_id, is_completed);

COMMENT ON TABLE sessions IS 'Sesiones de testing (individual o secuencial)';
COMMENT ON COLUMN sessions.is_sequential IS 'TRUE para sesiones con todos los tests';
COMMENT ON COLUMN sessions.is_completed IS 'TRUE cuando finalizó exitosamente';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. TEST_RESULTS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_results (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
	test_type VARCHAR(50) NOT NULL,
	start_time TIMESTAMPTZ NOT NULL,
	end_time TIMESTAMPTZ NOT NULL,
	duration INTEGER NOT NULL CHECK (duration > 0),
	accuracy DECIMAL(5, 2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
	avg_reaction_time DECIMAL(10, 2) CHECK (avg_reaction_time >= 0),
	specific_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
	browser_info JSONB,
	device_info JSONB,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	
	CONSTRAINT unique_test_per_session UNIQUE (session_id, test_type)
);

CREATE INDEX IF NOT EXISTS idx_test_results_session_id ON test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_start_time ON test_results(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_specific_metrics ON test_results USING GIN (specific_metrics);

COMMENT ON TABLE test_results IS 'Resultados de tests cognitivos';
COMMENT ON COLUMN test_results.test_type IS 'Tipo de test (sart, flanker, nback, pvt, etc.) - Extensible sin modificar schema';
COMMENT ON COLUMN test_results.specific_metrics IS 'Métricas específicas en JSON - Estructura flexible por tipo de test';
COMMENT ON COLUMN test_results.duration IS 'Duración en milisegundos';
COMMENT ON COLUMN test_results.accuracy IS 'Precisión 0-100';

-- ────────────────────────────────────────────────────────────────────────────
-- 4. RESPONSES
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS responses (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	test_result_id UUID NOT NULL REFERENCES test_results(id) ON DELETE CASCADE,
	trial_number INTEGER NOT NULL CHECK (trial_number > 0),
	stimulus TEXT NOT NULL,
	response_given BOOLEAN NOT NULL,
	response_time INTEGER CHECK (response_time >= 0),
	is_correct BOOLEAN NOT NULL,
	timestamp BIGINT NOT NULL,
	trial_metadata JSONB DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	
	CONSTRAINT unique_trial_per_test UNIQUE (test_result_id, trial_number)
);

CREATE INDEX IF NOT EXISTS idx_responses_test_result_id ON responses(test_result_id);
CREATE INDEX IF NOT EXISTS idx_responses_trial_number ON responses(trial_number);
CREATE INDEX IF NOT EXISTS idx_responses_is_correct ON responses(is_correct);
CREATE INDEX IF NOT EXISTS idx_responses_trial_metadata ON responses USING GIN (trial_metadata);

COMMENT ON TABLE responses IS 'Respuestas individuales por trial';
COMMENT ON COLUMN responses.trial_metadata IS 'Metadatos adicionales del trial';

-- ============================================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- Función: Actualizar timestamp updated_at
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
	BEFORE UPDATE ON profiles
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at
	BEFORE UPDATE ON sessions
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────────────────────────────
-- Función: Completar sesión automáticamente
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION complete_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
	-- Actualizar contador
	UPDATE public.sessions
	SET 
		total_tests_completed = (
			SELECT COUNT(*) 
			FROM public.test_results 
			WHERE session_id = NEW.session_id
		),
		updated_at = NOW()
	WHERE id = NEW.session_id;
	
	-- Marcar como completada si es secuencial y tiene 4 tests
	UPDATE public.sessions
	SET 
		is_completed = true,
		end_time = NEW.end_time,
		updated_at = NOW()
	WHERE id = NEW.session_id
		AND is_sequential = true
		AND total_tests_completed >= 4
		AND is_completed = false;
	
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_complete_session ON test_results;
CREATE TRIGGER trigger_complete_session
	AFTER INSERT ON test_results
	FOR EACH ROW
	EXECUTE FUNCTION complete_session();

-- ────────────────────────────────────────────────────────────────────────────
-- Función: Crear perfil automáticamente al registrarse
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
	INSERT INTO public.profiles (id, full_name, created_at)
	VALUES (
		NEW.id,
		COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
		NOW()
	);
	RETURN NEW;
EXCEPTION
	WHEN unique_violation THEN
		RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - OPTIMIZADO
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────────────────
-- PROFILES RLS (Optimizado)
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
	ON profiles FOR SELECT
	USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
	ON profiles FOR UPDATE
	USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
	ON profiles FOR INSERT
	WITH CHECK ((select auth.uid()) = id);

-- ────────────────────────────────────────────────────────────────────────────
-- SESSIONS RLS (Optimizado)
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own sessions" ON sessions;
CREATE POLICY "Users can view own sessions"
	ON sessions FOR SELECT
	USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON sessions;
CREATE POLICY "Users can insert own sessions"
	ON sessions FOR INSERT
	WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON sessions;
CREATE POLICY "Users can update own sessions"
	ON sessions FOR UPDATE
	USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own sessions" ON sessions;
CREATE POLICY "Users can delete own sessions"
	ON sessions FOR DELETE
	USING ((select auth.uid()) = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- TEST_RESULTS RLS (Optimizado)
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own test results" ON test_results;
CREATE POLICY "Users can view own test results"
	ON test_results FOR SELECT
	USING (
		EXISTS (
			SELECT 1 FROM sessions
			WHERE sessions.id = test_results.session_id
				AND sessions.user_id = (select auth.uid())
		)
	);

DROP POLICY IF EXISTS "Users can insert own test results" ON test_results;
CREATE POLICY "Users can insert own test results"
	ON test_results FOR INSERT
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM sessions
			WHERE sessions.id = test_results.session_id
				AND sessions.user_id = (select auth.uid())
		)
	);

DROP POLICY IF EXISTS "Users can update own test results" ON test_results;
CREATE POLICY "Users can update own test results"
	ON test_results FOR UPDATE
	USING (
		EXISTS (
			SELECT 1 FROM sessions
			WHERE sessions.id = test_results.session_id
				AND sessions.user_id = (select auth.uid())
		)
	);

DROP POLICY IF EXISTS "Users can delete own test results" ON test_results;
CREATE POLICY "Users can delete own test results"
	ON test_results FOR DELETE
	USING (
		EXISTS (
			SELECT 1 FROM sessions
			WHERE sessions.id = test_results.session_id
				AND sessions.user_id = (select auth.uid())
		)
	);

-- ────────────────────────────────────────────────────────────────────────────
-- RESPONSES RLS (Optimizado)
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own responses" ON responses;
CREATE POLICY "Users can view own responses"
	ON responses FOR SELECT
	USING (
		EXISTS (
			SELECT 1 FROM test_results tr
			JOIN sessions s ON s.id = tr.session_id
			WHERE tr.id = responses.test_result_id
				AND s.user_id = (select auth.uid())
		)
	);

DROP POLICY IF EXISTS "Users can insert own responses" ON responses;
CREATE POLICY "Users can insert own responses"
	ON responses FOR INSERT
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM test_results tr
			JOIN sessions s ON s.id = tr.session_id
			WHERE tr.id = responses.test_result_id
				AND s.user_id = (select auth.uid())
		)
	);

DROP POLICY IF EXISTS "Users can delete own responses" ON responses;
CREATE POLICY "Users can delete own responses"
	ON responses FOR DELETE
	USING (
		EXISTS (
			SELECT 1 FROM test_results tr
			JOIN sessions s ON s.id = tr.session_id
			WHERE tr.id = responses.test_result_id
				AND s.user_id = (select auth.uid())
		)
	);

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- Vista: Estadísticas generales del usuario
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
	p.id as user_id,
	p.full_name,
	COUNT(DISTINCT s.id) as total_sessions,
	COUNT(DISTINCT CASE WHEN s.is_completed THEN s.id END) as completed_sessions,
	COUNT(DISTINCT tr.id) as total_tests_completed,
	ROUND(AVG(tr.accuracy)::numeric, 2) as avg_accuracy,
	ROUND(AVG(tr.avg_reaction_time)::numeric, 2) as avg_reaction_time,
	MIN(s.start_time) as first_session_date,
	MAX(s.start_time) as last_session_date,
	MAX(s.start_time) >= NOW() - INTERVAL '7 days' as active_last_week
FROM profiles p
LEFT JOIN sessions s ON s.user_id = p.id
LEFT JOIN test_results tr ON tr.session_id = s.id
GROUP BY p.id, p.full_name;

-- ────────────────────────────────────────────────────────────────────────────
-- Vista: Resumen de rendimiento por tipo de test
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW test_performance_summary AS
SELECT 
	s.user_id,
	tr.test_type,
	COUNT(*) as times_taken,
	ROUND(AVG(tr.accuracy)::numeric, 2) as avg_accuracy,
	ROUND(AVG(tr.avg_reaction_time)::numeric, 2) as avg_reaction_time,
	ROUND(MIN(tr.accuracy)::numeric, 2) as min_accuracy,
	ROUND(MAX(tr.accuracy)::numeric, 2) as max_accuracy,
	ROUND(STDDEV(tr.accuracy)::numeric, 2) as stddev_accuracy,
	MAX(tr.start_time) as last_taken
FROM test_results tr
JOIN sessions s ON s.id = tr.session_id
GROUP BY s.user_id, tr.test_type;

-- ────────────────────────────────────────────────────────────────────────────
-- Vista: Progreso reciente (últimos 30 días)
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW recent_progress AS
SELECT 
	s.user_id,
	tr.test_type,
	DATE_TRUNC('day', tr.start_time) as test_date,
	ROUND(AVG(tr.accuracy)::numeric, 2) as avg_accuracy,
	ROUND(AVG(tr.avg_reaction_time)::numeric, 2) as avg_rt,
	COUNT(*) as tests_that_day
FROM test_results tr
JOIN sessions s ON s.id = tr.session_id
WHERE tr.start_time >= NOW() - INTERVAL '30 days'
GROUP BY s.user_id, tr.test_type, DATE_TRUNC('day', tr.start_time)
ORDER BY test_date DESC;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

DO $$
DECLARE
	table_count INTEGER;
	trigger_count INTEGER;
	policy_count INTEGER;
BEGIN
	-- Verificar tablas
	SELECT COUNT(*) INTO table_count
	FROM information_schema.tables
	WHERE table_schema = 'public'
		AND table_name IN ('profiles', 'sessions', 'test_results', 'responses');
	
	-- Verificar triggers
	SELECT COUNT(*) INTO trigger_count
	FROM information_schema.triggers
	WHERE trigger_schema = 'public'
		AND trigger_name IN (
			'update_profiles_updated_at',
			'update_sessions_updated_at',
			'trigger_complete_session',
			'on_auth_user_created'
		);
	
	-- Verificar políticas RLS
	SELECT COUNT(*) INTO policy_count
	FROM pg_policies
	WHERE schemaname = 'public'
		AND tablename IN ('profiles', 'sessions', 'test_results', 'responses');
	
	-- Reporte
	RAISE NOTICE '================================';
	RAISE NOTICE 'MIGRACIÓN COMPLETADA';
	RAISE NOTICE '================================';
	RAISE NOTICE 'Tablas creadas: %/4', table_count;
	RAISE NOTICE 'Triggers activos: %/4', trigger_count;
	RAISE NOTICE 'Políticas RLS: %/15', policy_count;
	RAISE NOTICE '================================';
	
	IF table_count = 4 AND trigger_count = 4 AND policy_count = 15 THEN
		RAISE NOTICE '✓ Todo configurado correctamente';
		RAISE NOTICE '✓ RLS optimizado (sin warnings de performance)';
		RAISE NOTICE '✓ Funciones seguras (search_path inmutable)';
	ELSE
		RAISE WARNING '⚠ Algunas configuraciones no se aplicaron';
	END IF;
	
	RAISE NOTICE '================================';
END $$;
