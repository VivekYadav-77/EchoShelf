ALTER TABLE ai_insights
ADD CONSTRAINT fk_ai_insights_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
