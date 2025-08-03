-- Script de seed para poblar la base de datos con datos de ejemplo
-- Usuario existente ID: a89c58be-09cd-4fc6-9d9e-2093942d72c1

-- Limpiar datos existentes (en orden para respetar foreign keys)
DELETE FROM dispute_evidence;
DELETE FROM disputes;
DELETE FROM reviews;
DELETE FROM payments;
DELETE FROM milestones;
DELETE FROM contract_contractors;
DELETE FROM contract_clients;
DELETE FROM contracts;
DELETE FROM subscriptions;
DELETE FROM contractor_profiles;
DELETE FROM client_profiles;
DELETE FROM user_profiles WHERE user_id != 'a89c58be-09cd-4fc6-9d9e-2093942d72c1';
DELETE FROM notifications;
DELETE FROM status_history;

-- Insertar usuarios en auth.user
INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at) VALUES
-- Contratistas
('550e8400-e29b-41d4-a716-446655440001', 'Ana García', 'ana.garcia@gmail.com', true, 'user', '2023-06-15 10:00:00+00', '2024-03-20 15:30:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Carlos Rodríguez', 'carlos.rodriguez@outlook.com', true, 'user', '2023-08-01 08:00:00+00', '2024-03-18 12:45:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'María López', 'maria.lopez@yahoo.com', true, 'user', '2023-09-15 09:30:00+00', '2024-03-19 14:20:00+00'),
-- Contratantes
('550e8400-e29b-41d4-a716-446655440011', 'Carlos Méndez', 'carlos.mendez@techsolutions.com', true, 'user', '2023-01-01 08:00:00+00', '2024-03-20 16:00:00+00'),
('550e8400-e29b-41d4-a716-446655440012', 'María Torres', 'maria.torres@innovatemx.com', true, 'user', '2023-06-01 10:00:00+00', '2024-03-19 11:30:00+00'),
('550e8400-e29b-41d4-a716-446655440013', 'Luis Ramírez', 'luis.ramirez@digitalco.co', true, 'user', '2023-09-01 09:00:00+00', '2024-03-20 10:15:00+00');

-- Insertar perfiles de usuario
-- El usuario existente ya tiene perfil, no necesitamos insertarlo
-- User profile ID real: ed6a81b5-f69e-4f56-a892-226e03322389

INSERT INTO user_profiles (id, user_id, first_name, last_name, phone, country, user_type, preferred_currency, created_at, updated_at, active) VALUES
-- Contratistas
('550e8401-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Ana', 'García', '+541234567890', 'Argentina', 'contractor', 'USD', '2023-06-15 10:00:00+00', '2024-03-20 15:30:00+00', true),
('550e8401-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Carlos', 'Rodríguez', '+521234567890', 'México', 'contractor', 'USD', '2023-08-01 08:00:00+00', '2024-03-18 12:45:00+00', true),
('550e8401-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'María', 'López', '+571234567890', 'Colombia', 'contractor', 'USD', '2023-09-15 09:30:00+00', '2024-03-19 14:20:00+00', true),
-- Contratantes (clients)
('550e8401-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 'Carlos', 'Méndez', '+541234567891', 'Argentina', 'client', 'USD', '2023-01-01 08:00:00+00', '2024-03-20 16:00:00+00', true),
('550e8401-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 'María', 'Torres', '+521234567892', 'México', 'client', 'USD', '2023-06-01 10:00:00+00', '2024-03-19 11:30:00+00', true),
('550e8401-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 'Luis', 'Ramírez', '+571234567893', 'Colombia', 'client', 'USD', '2023-09-01 09:00:00+00', '2024-03-20 10:15:00+00', true);

-- Insertar perfiles de contratistas
-- El usuario existente ya tiene perfil de contratista
-- Contractor profile ID real: 5e2258a3-ccce-479d-a8e2-afaf87fefe7a
-- Actualizar datos del perfil existente
UPDATE contractor_profiles SET
  username = 'ataherrera',
  specialties = ARRAY['Full-Stack Development', 'Frontend Development'],
  experience_years = 5,
  hourly_rate = 70.00,
  portfolio_url = 'https://ataherrera.dev',
  bio = 'Desarrollador full-stack con experiencia en tecnologías modernas y proyectos complejos',
  skills = ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'Next.js'],
  availability = 'full-time',
  timezone = 'Europe/Madrid',
  profile_complete = true
WHERE user_profile_id = 'ed6a81b5-f69e-4f56-a892-226e03322389';

INSERT INTO contractor_profiles (id, user_profile_id, username, specialties, experience_years, hourly_rate, portfolio_url, bio, skills, availability, timezone, profile_complete, average_rating, total_projects_completed, created_at) VALUES
-- Nuevos contratistas
('550e8402-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440001', 'anagarcia', ARRAY['Frontend Development', 'Mobile Development'], 4, 65.00, 'https://anagarcia.dev', 'Desarrolladora frontend especializada en React y React Native con experiencia en proyectos de gran escala', ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'React Native'], 'full-time', 'America/Argentina/Buenos_Aires', true, 4.8, 12, '2023-06-15 10:00:00+00'),
('550e8402-e29b-41d4-a716-446655440002', '550e8401-e29b-41d4-a716-446655440002', 'carlosr', ARRAY['Backend Development', 'DevOps', 'Cloud Architecture'], 6, 75.00, 'https://carlosrodriguez.tech', 'Backend developer y DevOps engineer con experiencia en arquitecturas cloud y microservicios', ARRAY['Python', 'Django', 'AWS', 'DevOps', 'Kubernetes'], 'full-time', 'America/Mexico_City', true, 4.9, 18, '2023-08-01 08:00:00+00'),
('550e8402-e29b-41d4-a716-446655440003', '550e8401-e29b-41d4-a716-446655440003', 'marialopez', ARRAY['UI/UX Design', 'Product Design'], 3, 60.00, 'https://marialopez.design', 'Diseñadora UI/UX especializada en productos digitales y experiencias móviles', ARRAY['UI/UX', 'Figma', 'Adobe XD', 'React', 'Mobile Design'], 'full-time', 'America/Bogota', true, 4.7, 8, '2023-09-15 09:30:00+00');

-- Insertar perfiles de clientes
INSERT INTO client_profiles (id, user_profile_id, company, industry, website, company_description, size, verification_status, total_contracts_created, average_rating, created_at) VALUES
('550e8403-e29b-41d4-a716-446655440011', '550e8401-e29b-41d4-a716-446655440011', 'TechSolutions SA', 'Software Development', 'https://techsolutions.com', 'Empresa líder en desarrollo de software empresarial con más de 10 años de experiencia', '50-200', 'verified', 8, 4.6, '2023-01-01 08:00:00+00'),
('550e8403-e29b-41d4-a716-446655440012', '550e8401-e29b-41d4-a716-446655440012', 'InnovateMX', 'Technology Consulting', 'https://innovatemx.com', 'Consultora tecnológica especializada en transformación digital', '10-50', 'verified', 5, 4.8, '2023-06-01 10:00:00+00'),
('550e8403-e29b-41d4-a716-446655440013', '550e8401-e29b-41d4-a716-446655440013', 'DigitalCO', 'Digital Marketing', 'https://digitalco.co', 'Agencia de marketing digital enfocada en estrategias omnicanal', '10-50', 'verified', 3, 4.5, '2023-09-01 09:00:00+00');

-- Insertar suscripciones
INSERT INTO subscriptions (id, client_profile_id, plan, status, start_date, end_date, created_at, updated_at) VALUES
('550e8404-e29b-41d4-a716-446655440011', '550e8403-e29b-41d4-a716-446655440011', 'enterprise', 'active', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00'),
('550e8404-e29b-41d4-a716-446655440012', '550e8403-e29b-41d4-a716-446655440012', 'business', 'active', '2024-02-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-02-01 00:00:00+00', '2024-02-01 00:00:00+00'),
('550e8404-e29b-41d4-a716-446655440013', '550e8403-e29b-41d4-a716-446655440013', 'business', 'active', '2024-03-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-03-01 00:00:00+00', '2024-03-01 00:00:00+00');

-- Insertar contratos
INSERT INTO contracts (id, client_id, contractor_id, title, description, amount, currency, start_date, end_date, deliverables, terms_and_conditions, status, accepted_at, created_at, updated_at) VALUES
('550e8405-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440011', '550e8401-e29b-41d4-a716-446655440001', 'Desarrollo Plataforma E-commerce', 'Desarrollo completo de plataforma de comercio electrónico incluyendo frontend React, backend Node.js y arquitectura cloud en AWS.', 25000.00, 'USD', '2024-02-01', '2024-06-30', ARRAY['Frontend en React', 'Backend en Node.js', 'Integración con AWS', 'Panel de administración', 'Documentación técnica'], 'Contrato para desarrollo de plataforma e-commerce con tecnologías modernas. Incluye 3 revisiones y soporte post-lanzamiento.', 'in_progress', '2024-01-20 10:00:00+00', '2024-01-15 10:00:00+00', '2024-03-20 15:30:00+00'),
('550e8405-e29b-41d4-a716-446655440002', '550e8401-e29b-41d4-a716-446655440012', '550e8401-e29b-41d4-a716-446655440003', 'Diseño Sistema de Identidad Visual', 'Diseño completo de sistema de identidad visual, incluyendo logo, guía de estilo y materiales de marketing digital.', 12000.00, 'USD', '2024-01-15', '2024-04-15', ARRAY['Logo y variaciones', 'Guía de estilo completa', 'Templates de marketing', 'Iconografía custom', 'Manual de uso'], 'Proyecto de branding completo con todas las piezas gráficas necesarias para el lanzamiento de la marca.', 'in_dispute', '2024-01-12 08:00:00+00', '2024-01-10 08:00:00+00', '2024-03-19 16:45:00+00'),
('550e8405-e29b-41d4-a716-446655440003', '550e8401-e29b-41d4-a716-446655440013', '550e8401-e29b-41d4-a716-446655440002', 'Implementación DevOps & Cloud', 'Modernización de infraestructura y implementación de prácticas DevOps, incluyendo CI/CD y monitoreo.', 45000.00, 'USD', '2024-03-01', '2024-08-31', ARRAY['Setup de CI/CD', 'Migración a cloud', 'Implementación de monitoreo', 'Documentación de procesos', 'Capacitación del equipo'], 'Proyecto de modernización completa de infraestructura con migración a cloud y implementación de DevOps.', 'in_progress', '2024-02-20 14:00:00+00', '2024-02-15 14:00:00+00', '2024-03-20 14:00:00+00'),
-- Contrato con el usuario existente
('550e8405-e29b-41d4-a716-446655440004', '550e8401-e29b-41d4-a716-446655440011', 'ed6a81b5-f69e-4f56-a892-226e03322389', 'Desarrollo API REST Avanzada', 'Desarrollo de API REST con Node.js y TypeScript, incluyendo autenticación, autorización y documentación completa.', 18000.00, 'EUR', '2024-01-01', '2024-04-30', ARRAY['API REST completa', 'Documentación con Swagger', 'Tests unitarios', 'Deployment automatizado'], 'Desarrollo de API backend robusta con todas las mejores prácticas de desarrollo.', 'completed', '2023-12-20 09:00:00+00', '2023-12-15 09:00:00+00', '2024-04-30 16:00:00+00'),
('550e8405-e29b-41d4-a716-446655440005', '550e8401-e29b-41d4-a716-446655440013', 'ed6a81b5-f69e-4f56-a892-226e03322389', 'Dashboard Analytics React', 'Desarrollo de dashboard interactivo con React y D3.js para visualización de datos de analytics.', 22000.00, 'EUR', '2024-02-15', '2024-06-15', ARRAY['Dashboard responsive', 'Gráficos interactivos', 'Filtros avanzados', 'Exportación de reportes'], 'Dashboard completo para visualización de métricas y KPIs empresariales.', 'in_progress', '2024-02-10 11:00:00+00', '2024-02-05 11:00:00+00', '2024-03-20 10:00:00+00');

-- Insertar milestones
INSERT INTO milestones (id, contract_id, title, description, amount, currency, due_date, status, created_at, updated_at) VALUES
-- Milestones para contract 1
('550e8406-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440001', 'Setup inicial y arquitectura', 'Configuración del proyecto, setup de CI/CD y definición de arquitectura', 5000.00, 'USD', '2024-02-29', 'completed', '2024-01-15 10:00:00+00', '2024-02-28 15:00:00+00'),
('550e8406-e29b-41d4-a716-446655440002', '550e8405-e29b-41d4-a716-446655440001', 'Backend API desarrollo', 'Desarrollo completo de la API backend con todas las funcionalidades', 8000.00, 'USD', '2024-04-15', 'completed', '2024-01-15 10:00:00+00', '2024-04-14 12:00:00+00'),
('550e8406-e29b-41d4-a716-446655440003', '550e8405-e29b-41d4-a716-446655440001', 'Frontend desarrollo', 'Desarrollo del frontend completo en React', 7000.00, 'USD', '2024-05-31', 'pending', '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00'),
('550e8406-e29b-41d4-a716-446655440004', '550e8405-e29b-41d4-a716-446655440001', 'Testing y deployment', 'Testing completo, optimización y deployment final', 5000.00, 'USD', '2024-06-30', 'pending', '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00'),
-- Milestones para contract 2
('550e8406-e29b-41d4-a716-446655440005', '550e8405-e29b-41d4-a716-446655440002', 'Investigación y conceptualización', 'Research de marca y desarrollo de conceptos iniciales', 3000.00, 'USD', '2024-02-15', 'completed', '2024-01-10 08:00:00+00', '2024-02-14 16:00:00+00'),
('550e8406-e29b-41d4-a716-446655440006', '550e8405-e29b-41d4-a716-446655440002', 'Diseño de logo y elementos base', 'Diseño del logo principal y elementos gráficos base', 4500.00, 'USD', '2024-03-15', 'completed', '2024-01-10 08:00:00+00', '2024-03-14 14:00:00+00'),
('550e8406-e29b-41d4-a716-446655440007', '550e8405-e29b-41d4-a716-446655440002', 'Guía de estilo y aplicaciones', 'Manual de marca completo y aplicaciones en diferentes medios', 4500.00, 'USD', '2024-04-15', 'pending', '2024-01-10 08:00:00+00', '2024-01-10 08:00:00+00');

-- Insertar pagos
INSERT INTO payments (id, contract_id, milestone_id, amount, currency, type, payment_method, processing_fee, total_amount, status, transferred_at, released_at, paid_at, transaction_reference, created_at, updated_at) VALUES
('550e8407-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440001', '550e8406-e29b-41d4-a716-446655440001', 5000.00, 'USD', 'milestone', 'bank_transfer', 150.00, 5150.00, 'released', '2024-03-01 10:00:00+00', '2024-03-01 10:30:00+00', '2024-03-01 11:00:00+00', 'TXN-20240301-001', '2024-02-28 15:00:00+00', '2024-03-01 11:00:00+00'),
('550e8407-e29b-41d4-a716-446655440002', '550e8405-e29b-41d4-a716-446655440001', '550e8406-e29b-41d4-a716-446655440002', 8000.00, 'USD', 'milestone', 'bank_transfer', 240.00, 8240.00, 'released', '2024-04-15 09:00:00+00', '2024-04-15 09:30:00+00', '2024-04-15 10:00:00+00', 'TXN-20240415-002', '2024-04-14 12:00:00+00', '2024-04-15 10:00:00+00'),
('550e8407-e29b-41d4-a716-446655440003', '550e8405-e29b-41d4-a716-446655440002', '550e8406-e29b-41d4-a716-446655440005', 3000.00, 'USD', 'milestone', 'bank_transfer', 90.00, 3090.00, 'released', '2024-02-16 14:00:00+00', '2024-02-16 14:30:00+00', '2024-02-16 15:00:00+00', 'TXN-20240216-003', '2024-02-14 16:00:00+00', '2024-02-16 15:00:00+00'),
('550e8407-e29b-41d4-a716-446655440004', '550e8405-e29b-41d4-a716-446655440002', '550e8406-e29b-41d4-a716-446655440006', 4500.00, 'USD', 'milestone', 'bank_transfer', 135.00, 4635.00, 'held', NULL, NULL, NULL, NULL, '2024-03-14 14:00:00+00', '2024-03-14 14:00:00+00');

-- Insertar reviews
INSERT INTO reviews (id, contract_id, reviewer_id, reviewed_id, rating, comment, review_type, created_at) VALUES
('550e8408-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440004', '550e8401-e29b-41d4-a716-446655440011', 'ed6a81b5-f69e-4f56-a892-226e03322389', 5, 'Excelente trabajo en el desarrollo de la API. Código limpio, bien documentado y entregado a tiempo. Muy profesional en la comunicación.', 'client_to_contractor', '2024-05-01 10:00:00+00'),
('550e8408-e29b-41d4-a716-446655440002', '550e8405-e29b-41d4-a716-446655440004', 'ed6a81b5-f69e-4f56-a892-226e03322389', '550e8401-e29b-41d4-a716-446655440011', 4, 'Buen cliente, requisitos claros y pagos puntuales. Comunicación fluida durante todo el proyecto.', 'contractor_to_client', '2024-05-02 14:00:00+00'),
('550e8408-e29b-41d4-a716-446655440003', '550e8405-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440011', '550e8401-e29b-41d4-a716-446655440001', 5, 'Ana es una desarrolladora excepcional. Su atención al detalle y capacidad para resolver problemas complejos es impresionante.', 'client_to_contractor', '2024-04-16 16:00:00+00'),
('550e8408-e29b-41d4-a716-446655440004', '550e8405-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440011', 5, 'TechSolutions SA es una empresa muy profesional. Procesos claros y comunicación excelente.', 'contractor_to_client', '2024-04-17 09:00:00+00');

-- Insertar disputas
INSERT INTO disputes (id, contract_id, milestone_id, initiator_id, initiated_by, reason, description, status, created_at, updated_at) VALUES
('550e8409-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440002', '550e8406-e29b-41d4-a716-446655440006', '550e8401-e29b-41d4-a716-446655440003', 'contractor', 'El cliente no está satisfecho con el resultado final del diseño del logo y solicita cambios que están fuera del scope original del proyecto.', 'El cliente solicita modificaciones que no estaban contempladas en el brief inicial y que requieren trabajo adicional significativo.', 'under_review', '2024-03-18 10:00:00+00', '2024-03-20 15:00:00+00');

-- Insertar evidencia de disputa
INSERT INTO dispute_evidence (id, dispute_id, user_profile_id, evidence_type, description, file_url, created_at) VALUES
('550e840a-e29b-41d4-a716-446655440001', '550e8409-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440003', 'document', 'Brief original del proyecto firmado por ambas partes', 'https://storage.example.com/evidence/brief-original.pdf', '2024-03-18 11:00:00+00'),
('550e840a-e29b-41d4-a716-446655440002', '550e8409-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440003', 'image', 'Capturas de pantalla de las comunicaciones por email', 'https://storage.example.com/evidence/emails-screenshots.png', '2024-03-18 12:00:00+00');

-- Insertar relaciones de contratos con clientes y contratistas
INSERT INTO contract_clients (id, contract_id, client_id, is_primary, created_at) VALUES
('550e840b-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440011', true, '2024-01-15 10:00:00+00'),
('550e840b-e29b-41d4-a716-446655440002', '550e8405-e29b-41d4-a716-446655440002', '550e8401-e29b-41d4-a716-446655440012', true, '2024-01-10 08:00:00+00'),
('550e840b-e29b-41d4-a716-446655440003', '550e8405-e29b-41d4-a716-446655440003', '550e8401-e29b-41d4-a716-446655440013', true, '2024-02-15 14:00:00+00'),
('550e840b-e29b-41d4-a716-446655440004', '550e8405-e29b-41d4-a716-446655440004', '550e8401-e29b-41d4-a716-446655440011', true, '2023-12-15 09:00:00+00'),
('550e840b-e29b-41d4-a716-446655440005', '550e8405-e29b-41d4-a716-446655440005', '550e8401-e29b-41d4-a716-446655440013', true, '2024-02-05 11:00:00+00');

INSERT INTO contract_contractors (id, contract_id, contractor_id, is_primary, created_at) VALUES
('550e840c-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440001', true, '2024-01-15 10:00:00+00'),
('550e840c-e29b-41d4-a716-446655440002', '550e8405-e29b-41d4-a716-446655440002', '550e8401-e29b-41d4-a716-446655440003', true, '2024-01-10 08:00:00+00'),
('550e840c-e29b-41d4-a716-446655440003', '550e8405-e29b-41d4-a716-446655440003', '550e8401-e29b-41d4-a716-446655440002', true, '2024-02-15 14:00:00+00'),
('550e840c-e29b-41d4-a716-446655440004', '550e8405-e29b-41d4-a716-446655440004', 'ed6a81b5-f69e-4f56-a892-226e03322389', true, '2023-12-15 09:00:00+00'),
('550e840c-e29b-41d4-a716-446655440005', '550e8405-e29b-41d4-a716-446655440005', 'ed6a81b5-f69e-4f56-a892-226e03322389', true, '2024-02-05 11:00:00+00');

-- Insertar notificaciones de ejemplo
INSERT INTO notifications (id, user_profile_id, type, title, message, read, action_url, created_at) VALUES
('550e840d-e29b-41d4-a716-446655440001', '550e8401-e29b-41d4-a716-446655440001', 'payment_received', 'Pago recibido', 'Has recibido un pago de $8,240 USD por el milestone "Backend API desarrollo"', false, '/dashboard/payments', '2024-04-15 10:00:00+00'),
('550e840d-e29b-41d4-a716-446655440002', '550e8401-e29b-41d4-a716-446655440003', 'dispute_created', 'Nueva disputa', 'Se ha creado una disputa para el contrato "Diseño Sistema de Identidad Visual"', false, '/dashboard/disputes', '2024-03-18 10:00:00+00'),
('550e840d-e29b-41d4-a716-446655440003', '550e8401-e29b-41d4-a716-446655440011', 'contract_completed', 'Contrato completado', 'El contrato "Desarrollo API REST Avanzada" ha sido marcado como completado', true, '/dashboard/contracts', '2024-04-30 16:00:00+00'),
('550e840d-e29b-41d4-a716-446655440004', 'ed6a81b5-f69e-4f56-a892-226e03322389', 'review_received', 'Nueva reseña', 'Has recibido una nueva reseña de 5 estrellas', false, '/dashboard/reviews', '2024-05-01 10:00:00+00');

-- Insertar historial de estados
INSERT INTO status_history (id, contract_id, previous_status, new_status, user_profile_id, notes, created_at) VALUES
('550e840e-e29b-41d4-a716-446655440001', '550e8405-e29b-41d4-a716-446655440001', 'draft', 'sent', '550e8401-e29b-41d4-a716-446655440011', 'Contrato enviado al contratista para revisión', '2024-01-16 09:00:00+00'),
('550e840e-e29b-41d4-a716-446655440002', '550e8405-e29b-41d4-a716-446655440001', 'sent', 'accepted', '550e8401-e29b-41d4-a716-446655440001', 'Contrato aceptado por el contratista', '2024-01-20 10:00:00+00'),
('550e840e-e29b-41d4-a716-446655440003', '550e8405-e29b-41d4-a716-446655440001', 'accepted', 'in_progress', '550e8401-e29b-41d4-a716-446655440011', 'Proyecto iniciado oficialmente', '2024-02-01 08:00:00+00'),
('550e840e-e29b-41d4-a716-446655440004', '550e8405-e29b-41d4-a716-446655440004', 'in_progress', 'completed', '550e8401-e29b-41d4-a716-446655440011', 'Proyecto completado satisfactoriamente', '2024-04-30 16:00:00+00'),
('550e840e-e29b-41d4-a716-446655440005', '550e8405-e29b-41d4-a716-446655440002', 'in_progress', 'in_dispute', '550e8401-e29b-41d4-a716-446655440003', 'Disputa iniciada por discrepancias en el scope', '2024-03-18 10:00:00+00');

-- Actualizar estadísticas de los perfiles
UPDATE contractor_profiles SET 
  average_rating = 4.8,
  total_projects_completed = 2
WHERE user_profile_id = 'ed6a81b5-f69e-4f56-a892-226e03322389';

UPDATE contractor_profiles SET 
  average_rating = 5.0,
  total_projects_completed = 1
WHERE user_profile_id = '550e8401-e29b-41d4-a716-446655440001';

UPDATE client_profiles SET 
  average_rating = 4.5,
  total_contracts_created = 3
WHERE user_profile_id = '550e8401-e29b-41d4-a716-446655440011';

UPDATE client_profiles SET 
  average_rating = 4.8,
  total_contracts_created = 1
WHERE user_profile_id = '550e8401-e29b-41d4-a716-446655440012';

UPDATE client_profiles SET 
  average_rating = 4.2,
  total_contracts_created = 2
WHERE user_profile_id = '550e8401-e29b-41d4-a716-446655440013';