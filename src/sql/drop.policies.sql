-- DROPPING CASE POLICIES
drop policy if exists "case_study_public_read" on case_study;
drop policy if exists "case_study_auth_insert" on case_study;
drop policy if exists "case_study_auth_update" on case_study;
drop policy if exists "case_study_auth_delete" on case_study;

-- DROPPING PROJECT POLICIES
drop policy if exists "projects_public_read" on project;
drop policy if exists "projects_auth_insert" on project;
drop policy if exists "projects_auth_update" on project;
drop policy if exists "projects_auth_delete" on project;

-- DROPPING POLICIES ON PROJECT IMAGES
drop policy if exists "project_images_public_read" on storage.objects;
drop policy if exists "project_images_auth_insert" on storage.objects;
drop policy if exists "project_images_auth_update" on storage.objects;
drop policy if exists "project_images_auth_delete" on storage.objects;