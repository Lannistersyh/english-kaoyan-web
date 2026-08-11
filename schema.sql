-- ===== 考研英语练习 · Supabase 数据库 Schema =====
-- 在 Supabase SQL Editor 中执行此文件即可建表

-- 用户数据表：每个用户一行，所有学习数据以 JSONB 存储
CREATE TABLE user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  progress JSONB NOT NULL DEFAULT '{}',
  sessions JSONB NOT NULL DEFAULT '[]',
  wrong_records JSONB NOT NULL DEFAULT '[]',
  vocab JSONB NOT NULL DEFAULT '[]',
  vocab_progress JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{"promptThinkingOnWrong":true}',
  imported_questions JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: 用户只能读写自己的数据
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = user_id);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_data_updated_at
  BEFORE UPDATE ON user_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
