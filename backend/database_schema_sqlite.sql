-- CareerOpen SQLite Database Schema
-- Optimized for SQLite with proper indexing

-- Core indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_email_active ON authentication_user(email, is_active);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON authentication_user(role, is_active);

-- Job search optimization indexes
CREATE INDEX IF NOT EXISTS idx_jobs_search_filters ON jobs_job(job_type, experience_level, is_published, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs_job(location, is_published);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs_job(title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs_job(company_id, is_published);

-- Profile and skills optimization
CREATE INDEX IF NOT EXISTS idx_user_skills_proficiency ON skills_userskill(user_id, proficiency, is_verified);
CREATE INDEX IF NOT EXISTS idx_skills_category_name ON skills_skill(category, name);

-- Social features optimization
CREATE INDEX IF NOT EXISTS idx_connections_network ON social_connection(from_user_id, to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_feed ON social_post(author_id, created_at, is_active);
CREATE INDEX IF NOT EXISTS idx_posts_engagement ON social_post(likes_count, comments_count, created_at);

-- Messaging optimization
CREATE INDEX IF NOT EXISTS idx_messages_conversation_time ON messaging_message(conversation_id, created_at, is_read);

-- Notifications optimization
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications_notification(recipient_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type_time ON notifications_notification(notification_type, created_at);

-- Analytics optimization
CREATE INDEX IF NOT EXISTS idx_user_activity_analytics ON analytics_useractivity(user_id, activity_type, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_type ON analytics_aiinsight(user_id, insight_type, confidence_score);

-- Application tracking optimization
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON applications_application(job_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications_application(applicant_id, status, created_at);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_jobs_compound_search ON jobs_job(company_id, job_type, experience_level, is_published, created_at);
CREATE INDEX IF NOT EXISTS idx_profile_search ON profiles_profile(user_id, is_open_to_work, experience_years);