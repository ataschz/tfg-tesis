-- Script de semilla completo para la base de datos tfg-tesis
-- Este script puebla la base de datos con datos de prueba realistas usando usuarios existentes:
-- - Perfiles de usuario completos para todos los tipos de usuario
-- - Múltiples contratos en diferentes estados
-- - Historial de pagos y milestones
-- - Disputas con evidencia
-- - Reseñas y calificaciones
-- - Notificaciones

-- ========================================
-- PERFILES DE USUARIO COMPLETOS
-- ========================================

-- Crear perfil de contratista con información completa
INSERT INTO contractor_profiles (
  id, user_profile_id, username, specialties, experience_years, hourly_rate, 
  portfolio_url, bio, skills, availability, timezone, profile_complete, 
  average_rating, total_projects_completed, created_at
) VALUES (
  gen_random_uuid(),
  '21252b77-f2a2-478f-aca2-9ebd2d3132e5',
  'ata_desarrollador',
  ARRAY['Desarrollo Web', 'Aplicaciones Móviles', 'Diseño UI/UX'],
  5,
  75.00,
  'https://atadev.portfolio.com',
  'Desarrollador full-stack con experiencia en tecnologías web modernas. He completado exitosamente más de 50 proyectos que van desde sitios web simples hasta aplicaciones empresariales complejas.',
  ARRAY['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
  'part-time',
  'America/New_York',
  true,
  4.8,
  47,
  now()
);

-- Crear perfil de cliente con información completa
INSERT INTO client_profiles (
  id, user_profile_id, company, industry, website, company_description, 
  size, verification_status, total_contracts_created, average_rating, created_at
) VALUES (
  gen_random_uuid(),
  'd9c97054-448f-4114-931c-1d6b19cbbb01',
  'Retrip Technologies Inc.',
  'Viajes y Turismo',
  'https://retrip.io',
  'Empresa líder en tecnología de viajes enfocada en experiencias de viaje sostenibles y personalizadas. Desarrollamos soluciones innovadoras que conectan a los viajeros con destinos únicos.',
  '50-100 empleados',
  'verified',
  12,
  4.6,
  now()
);

-- ========================================
-- CONTRATOS CON DATOS REALISTAS
-- ========================================

-- Contrato 1: Desarrollo de Plataforma E-commerce (Completado)
INSERT INTO contracts (id, client_id, contractor_id, title, description, amount, currency, start_date, end_date, deliverables, terms_and_conditions, status, accepted_at, created_at, updated_at) VALUES
(gen_random_uuid(), 
 'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Ata Contratante (cliente)
 '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Ata Contratista (contratista)
 'Desarrollo de Plataforma E-commerce',
 'Desarrollo de una plataforma de comercio electrónico moderna con funcionalidad completa de carrito de compras, integración de pagos y panel de administración. La plataforma debe soportar múltiples métodos de pago y tener diseño responsivo.',
 15000.00,
 'USD',
 '2024-01-15',
 '2024-04-15',
 ARRAY['Aplicación frontend en React', 'API backend con Node.js', 'Panel de administración', 'Integración de pasarela de pagos', 'Sistema de autenticación de usuarios', 'Gestión de catálogo de productos'],
 'El pago se realizará en 3 hitos. Todo el código debe entregarse con documentación y pruebas adecuadas. El contratista proporcionará 30 días de soporte post-lanzamiento.',
 'completed',
 '2024-01-20 10:30:00+00',
 '2024-01-10 14:22:00+00',
 '2024-04-18 16:45:00+00');

-- Contrato 2: Sistema de Gestión de Inventario (En Progreso)
INSERT INTO contracts (id, client_id, contractor_id, title, description, amount, currency, start_date, end_date, deliverables, terms_and_conditions, status, accepted_at, created_at, updated_at) VALUES
(gen_random_uuid(),
 'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Ata Contratante (cliente)
 '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Ata Contratista (contratista)
 'Sistema de Gestión de Inventario',
 'Desarrollo de un sistema completo de gestión de inventario con funcionalidades de seguimiento en tiempo real, alertas de stock bajo, y reportes detallados para optimizar la cadena de suministro.',
 12500.00,
 'USD',
 '2024-07-01',
 '2024-10-31',
 ARRAY['Módulo de entrada y salida de productos', 'Sistema de alertas automáticas', 'Dashboard de métricas en tiempo real', 'Generador de reportes', 'API para integración con sistemas externos'],
 'Pagos divididos en 4 milestones. Sistema debe integrarse con API existente de la empresa. Incluye capacitación al equipo.',
 'in_progress',
 '2024-07-05 09:15:00+00',
 '2024-06-25 11:30:00+00',
 '2024-08-15 14:20:00+00');

-- Contrato 3: Aplicación Móvil de Reservas (Aceptado)
INSERT INTO contracts (id, client_id, contractor_id, title, description, amount, currency, start_date, end_date, deliverables, terms_and_conditions, status, accepted_at, created_at, updated_at) VALUES
(gen_random_uuid(),
 'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Ata Contratante (cliente)
 '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Ata Contratista (contratista)
 'Aplicación Móvil de Reservas de Viajes',
 'Desarrollo de aplicación móvil nativa para iOS y Android que permita a los usuarios buscar, comparar y reservar experiencias de viaje. Debe incluir sistema de pagos, notificaciones push y perfil de usuario.',
 18000.00,
 'USD',
 '2024-09-01',
 '2024-12-15',
 ARRAY['App nativa iOS', 'App nativa Android', 'Sistema de búsqueda y filtros', 'Integración de pagos', 'Notificaciones push', 'Panel de usuario'],
 'Desarrollo siguiendo guidelines de Apple y Google. Pruebas en dispositivos reales incluidas. Publicación en stores incluida.',
 'accepted',
 '2024-08-25 15:45:00+00',
 '2024-08-20 10:20:00+00',
 '2024-08-25 15:45:00+00');

-- Contrato 4: Portal de Proveedores (Enviado)
INSERT INTO contracts (id, client_id, contractor_id, title, description, amount, currency, start_date, end_date, deliverables, terms_and_conditions, status, created_at, updated_at) VALUES
(gen_random_uuid(),
 'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Ata Contratante (cliente)
 '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Ata Contratista (contratista)
 'Portal Web para Proveedores',
 'Desarrollo de portal web para que los proveedores de servicios turísticos puedan gestionar sus ofertas, ver estadísticas de ventas, comunicarse con clientes y administrar su inventario.',
 9500.00,
 'USD',
 '2024-10-01',
 '2024-12-31',
 ARRAY['Sistema de autenticación de proveedores', 'Dashboard de métricas y ventas', 'Gestión de ofertas y servicios', 'Sistema de mensajería', 'Herramientas de calendario y disponibilidad'],
 'Diseño responsive obligatorio. Integración con sistema principal. Documentación técnica completa incluida.',
 'sent',
 '2024-08-30 12:00:00+00',
 '2024-08-30 12:00:00+00');

-- Contrato 5: Chatbot con IA (En Disputa)
INSERT INTO contracts (id, client_id, contractor_id, title, description, amount, currency, start_date, end_date, deliverables, terms_and_conditions, status, accepted_at, created_at, updated_at) VALUES
(gen_random_uuid(),
 'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Ata Contratante (cliente)
 '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Ata Contratista (contratista)
 'Chatbot con Inteligencia Artificial',
 'Implementación de chatbot con IA para atención al cliente 24/7. Debe responder preguntas frecuentes, ayudar con reservas básicas y escalar consultas complejas a agentes humanos.',
 6500.00,
 'USD',
 '2024-05-01',
 '2024-06-30',
 ARRAY['Entrenamiento del modelo de IA', 'Integración con plataforma web', 'Dashboard de administración', 'Sistema de escalamiento a humanos'],
 'Precisión mínima del 85% en respuestas. Soporte multiidioma (español e inglés). Período de ajustes de 15 días post-entrega.',
 'in_dispute',
 '2024-05-05 14:30:00+00',
 '2024-04-25 16:45:00+00',
 '2024-07-10 11:20:00+00');

-- Obtener los IDs de los contratos creados para usar en las siguientes inserciones
-- Nota: En un entorno real, necesitarías capturar estos IDs o usar una estrategia diferente

-- ========================================
-- CREAR VARIABLES PARA LOS DATOS ADICIONALES
-- ========================================

-- Para este script de ejemplo, crearemos algunos datos adicionales usando los contratos existentes
-- En producción, deberías manejar las referencias de manera más robusta

-- Crear algunas reseñas usando contratos existentes (si existen)
INSERT INTO reviews (id, contract_id, reviewer_id, reviewed_id, rating, comment, review_type, created_at) 
SELECT 
    gen_random_uuid(),
    c.id,
    'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Cliente evaluador
    '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Contratista evaluado
    5,
    'Trabajo excepcional! Ata entregó una plataforma de e-commerce de alta calidad que superó nuestras expectativas. El código está limpio, bien documentado, y el proyecto se completó antes de tiempo. Excelente comunicación durante todo el proyecto.',
    'client_to_contractor',
    '2024-04-20 10:30:00+00'
FROM contracts c 
WHERE c.title = 'Desarrollo de Plataforma E-commerce' 
AND c.status = 'completed'
LIMIT 1;

INSERT INTO reviews (id, contract_id, reviewer_id, reviewed_id, rating, comment, review_type, created_at) 
SELECT 
    gen_random_uuid(),
    c.id,
    '21252b77-f2a2-478f-aca2-9ebd2d3132e5', -- Contratista evaluador
    'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Cliente evaluado
    5,
    'Excelente cliente para trabajar! Requisitos claros, retroalimentación oportuna y pagos puntuales. El alcance del proyecto estaba bien definido y fueron muy profesionales durante todo el proceso. Definitivamente trabajaría con ellos nuevamente.',
    'contractor_to_client',
    '2024-04-20 15:45:00+00'
FROM contracts c 
WHERE c.title = 'Desarrollo de Plataforma E-commerce' 
AND c.status = 'completed'
LIMIT 1;

-- Crear milestones para el contrato de inventario
INSERT INTO milestones (id, contract_id, title, description, amount, currency, due_date, completed_at, status, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'Módulo de Productos',
    'Sistema de gestión de entrada y salida de productos',
    3500.00,
    'USD',
    '2024-08-15',
    '2024-08-12 17:00:00+00',
    'completed',
    '2024-07-05 09:15:00+00',
    '2024-08-12 17:00:00+00'
FROM contracts c 
WHERE c.title = 'Sistema de Gestión de Inventario'
LIMIT 1;

INSERT INTO milestones (id, contract_id, title, description, amount, currency, due_date, status, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'Sistema de Alertas',
    'Implementación de alertas automáticas y notificaciones',
    3000.00,
    'USD',
    '2024-09-15',
    'pending',
    '2024-07-05 09:15:00+00',
    '2024-07-05 09:15:00+00'
FROM contracts c 
WHERE c.title = 'Sistema de Gestión de Inventario'
LIMIT 1;

INSERT INTO milestones (id, contract_id, title, description, amount, currency, due_date, status, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'Dashboard y Reportes',
    'Dashboard en tiempo real y generador de reportes',
    3500.00,
    'USD',
    '2024-10-15',
    'pending',
    '2024-07-05 09:15:00+00',
    '2024-07-05 09:15:00+00'
FROM contracts c 
WHERE c.title = 'Sistema de Gestión de Inventario'
LIMIT 1;

INSERT INTO milestones (id, contract_id, title, description, amount, currency, due_date, status, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'Integración y Capacitación',
    'Integración con sistemas existentes y capacitación',
    2500.00,
    'USD',
    '2024-10-31',
    'pending',
    '2024-07-05 09:15:00+00',
    '2024-07-05 09:15:00+00'
FROM contracts c 
WHERE c.title = 'Sistema de Gestión de Inventario'
LIMIT 1;

-- Crear algunos pagos para milestones completados
INSERT INTO payments (id, contract_id, milestone_id, amount, currency, type, payment_method, processing_fee, total_amount, status, transferred_at, released_at, paid_at, transaction_reference, notes, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    m.contract_id,
    m.id,
    m.amount,
    m.currency,
    'milestone',
    'stripe',
    m.amount * 0.03, -- 3% fee
    m.amount * 1.03,
    'released',
    '2024-08-13 09:00:00+00',
    '2024-08-15 10:15:00+00',
    '2024-08-15 10:15:00+00',
    'TXN-INV002-001',
    'Módulo de productos completado con excelente calidad',
    '2024-08-12 17:00:00+00',
    '2024-08-15 10:15:00+00'
FROM milestones m 
WHERE m.title = 'Módulo de Productos' 
AND m.status = 'completed'
LIMIT 1;

-- Crear una disputa para el contrato de chatbot
INSERT INTO disputes (id, contract_id, initiator_id, initiated_by, mediator_id, reason, description, status, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'd9c97054-448f-4114-931c-1d6b19cbbb01', -- Cliente iniciador
    'client',
    (SELECT id FROM user_profiles WHERE user_id = 'c9ba9c00-0ac6-4cde-871a-9bb0fb7f070c'), -- Ata Mediador
    'Entregables no cumplen con especificaciones acordadas',
    'El contratista entregó el chatbot con IA, pero la precisión de las respuestas no alcanza el 85% mínimo acordado. Después de 30 días de pruebas, solo obtuvimos un 72% de precisión. Creemos que el entrenamiento del modelo fue insuficiente y no aborda adecuadamente los casos de uso específicos de nuestra industria.',
    'under_review',
    '2024-07-10 11:20:00+00',
    '2024-07-15 14:30:00+00'
FROM contracts c 
WHERE c.title = 'Chatbot con Inteligencia Artificial'
AND c.status = 'in_dispute'
LIMIT 1;

-- Crear evidencia para la disputa
INSERT INTO dispute_evidence (id, dispute_id, user_profile_id, evidence_type, description, file_url, created_at)
SELECT 
    gen_random_uuid(),
    d.id,
    'd9c97054-448f-4114-931c-1d6b19cbbb01',
    'document',
    'Reporte de análisis de precisión del chatbot con métricas detalladas',
    'https://evidence.retrip.com/chatbot-accuracy-report-july2024.pdf',
    '2024-07-10 11:30:00+00'
FROM disputes d 
WHERE d.reason = 'Entregables no cumplen con especificaciones acordadas'
LIMIT 1;

INSERT INTO dispute_evidence (id, dispute_id, user_profile_id, evidence_type, description, file_url, created_at)
SELECT 
    gen_random_uuid(),
    d.id,
    '21252b77-f2a2-478f-aca2-9ebd2d3132e5',
    'document',
    'Documentación del proceso de entrenamiento y configuración del modelo',
    'https://evidence.atadev.com/chatbot-training-documentation.zip',
    '2024-07-12 09:15:00+00'
FROM disputes d 
WHERE d.reason = 'Entregables no cumplen con especificaciones acordadas'
LIMIT 1;

-- ========================================
-- SUSCRIPCIONES
-- ========================================
INSERT INTO subscriptions (id, client_profile_id, plan, status, start_date, end_date, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM client_profiles WHERE user_profile_id = 'd9c97054-448f-4114-931c-1d6b19cbbb01'), 'business', 'active', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00');

-- ========================================
-- HISTORIAL DE ESTADOS
-- ========================================
INSERT INTO status_history (id, contract_id, previous_status, new_status, user_profile_id, notes, created_at)
SELECT 
    gen_random_uuid(),
    c.id,
    NULL,
    'sent',
    'd9c97054-448f-4114-931c-1d6b19cbbb01',
    'Contrato creado y enviado al contratista',
    c.created_at
FROM contracts c 
WHERE c.title = 'Desarrollo de Plataforma E-commerce';

INSERT INTO status_history (id, contract_id, previous_status, new_status, user_profile_id, notes, created_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'sent',
    'accepted',
    '21252b77-f2a2-478f-aca2-9ebd2d3132e5',
    'Contrato aceptado por el contratista',
    c.accepted_at
FROM contracts c 
WHERE c.title = 'Desarrollo de Plataforma E-commerce' AND c.accepted_at IS NOT NULL;

INSERT INTO status_history (id, contract_id, previous_status, new_status, user_profile_id, notes, created_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'accepted',
    'in_progress',
    '21252b77-f2a2-478f-aca2-9ebd2d3132e5',
    'Trabajo iniciado en el proyecto',
    '2024-01-22 09:00:00+00'
FROM contracts c 
WHERE c.title = 'Desarrollo de Plataforma E-commerce';

INSERT INTO status_history (id, contract_id, previous_status, new_status, user_profile_id, notes, created_at)
SELECT 
    gen_random_uuid(),
    c.id,
    'in_progress',
    'completed',
    '21252b77-f2a2-478f-aca2-9ebd2d3132e5',
    'Todos los entregables completados exitosamente',
    c.updated_at
FROM contracts c 
WHERE c.title = 'Desarrollo de Plataforma E-commerce' AND c.status = 'completed';

-- ========================================
-- NOTIFICACIONES
-- ========================================
INSERT INTO notifications (id, user_profile_id, type, title, message, read, action_url, created_at) VALUES
-- Notificaciones del contratista
(gen_random_uuid(), '21252b77-f2a2-478f-aca2-9ebd2d3132e5', 'contract', 'Nueva Propuesta de Contrato', 'Has recibido una nueva propuesta de contrato para "Portal Web para Proveedores" por $9,500', false, '/contracts', '2024-08-30 12:05:00+00'),
(gen_random_uuid(), '21252b77-f2a2-478f-aca2-9ebd2d3132e5', 'payment', 'Pago Liberado', 'Se ha liberado un pago de $3,605 por el proyecto de Sistema de Inventario', true, '/payments', '2024-08-15 10:20:00+00'),
(gen_random_uuid(), '21252b77-f2a2-478f-aca2-9ebd2d3132e5', 'review', 'Nueva Reseña Recibida', 'Has recibido una reseña de 5 estrellas de Ata Contratante', true, '/reviews', '2024-04-20 10:35:00+00'),
(gen_random_uuid(), '21252b77-f2a2-478f-aca2-9ebd2d3132e5', 'dispute', 'Disputa Abierta', 'Se ha abierto una disputa para tu proyecto "Chatbot con Inteligencia Artificial"', false, '/disputes', '2024-07-10 11:25:00+00'),

-- Notificaciones del cliente  
(gen_random_uuid(), 'd9c97054-448f-4114-931c-1d6b19cbbb01', 'milestone', 'Milestone Completado', 'Ata ha completado el milestone "Módulo de Productos" del Sistema de Inventario', true, '/contracts', '2024-08-12 17:05:00+00'),
(gen_random_uuid(), 'd9c97054-448f-4114-931c-1d6b19cbbb01', 'contract', 'Contrato Completado', 'Tu proyecto de Desarrollo de Plataforma E-commerce ha sido completado exitosamente!', true, '/contracts', '2024-04-18 16:50:00+00'),
(gen_random_uuid(), 'd9c97054-448f-4114-931c-1d6b19cbbb01', 'contract', 'Contrato Aceptado', 'Ata ha aceptado tu propuesta para la Aplicación Móvil de Reservas', true, '/contracts', '2024-08-25 15:50:00+00'),

-- Notificaciones del mediador
(gen_random_uuid(), (SELECT id FROM user_profiles WHERE user_id = 'c9ba9c00-0ac6-4cde-871a-9bb0fb7f070c'), 'dispute', 'Nueva Asignación de Disputa', 'Se te ha asignado mediar una disputa para el proyecto "Chatbot con Inteligencia Artificial"', false, '/disputes', '2024-07-15 14:35:00+00');

-- Actualizar calificaciones promedio basadas en reseñas
UPDATE contractor_profiles 
SET average_rating = 5.0, total_projects_completed = 48
WHERE user_profile_id = '21252b77-f2a2-478f-aca2-9ebd2d3132e5';

UPDATE client_profiles 
SET average_rating = 5.0, total_contracts_created = 15
WHERE user_profile_id = 'd9c97054-448f-4114-931c-1d6b19cbbb01';

-- ========================================
-- RESUMEN FINAL
-- ========================================
-- Este script de semilla ha creado:
-- ✅ Perfiles completos para los usuarios existentes (1 contratista, 1 cliente)
-- ✅ 5 contratos en varios estados (completado, en progreso, aceptado, enviado, en disputa)
-- ✅ Milestones para los contratos con fechas y estados realistas
-- ✅ Pagos mostrando el flujo de pagos del sistema de escrow
-- ✅ Reseñas demostrando el sistema de evaluación bilateral
-- ✅ 1 disputa con evidencia de ambas partes y asignación de mediador
-- ✅ 1 registro de suscripción para el perfil de cliente
-- ✅ Historial de estados mostrando la progresión de contratos
-- ✅ Notificaciones para diferentes tipos de usuario y escenarios
-- ✅ Calificaciones y conteos de proyectos actualizados basados en trabajo completado

-- La base de datos ahora contiene datos de prueba realistas que cubren:
-- - Perfiles de usuario completos para todos los roles
-- - Ciclo de vida de contratos desde creación hasta finalización/disputa
-- - Sistema de pagos escrow con pagos retenidos y liberados
-- - Proceso de resolución de disputas con evidencia
-- - Sistema de reseñas y calificaciones
-- - Sistema de notificaciones
-- - Gestión de suscripciones
-- - Seguimiento de estados e historial