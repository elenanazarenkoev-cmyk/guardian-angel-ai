
-- Function for auto-updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Threats database (public catalog of known threat patterns)
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'phishing', 'vishing', 'smishing', 'deepfake', 'game_scam'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  red_flags TEXT[] NOT NULL DEFAULT '{}',
  target_audience TEXT[] NOT NULL DEFAULT '{}', -- 'elderly', 'child', 'professional'
  severity TEXT NOT NULL DEFAULT 'high', -- 'low', 'medium', 'high', 'critical'
  examples TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Threats are publicly readable"
  ON public.threats FOR SELECT
  USING (true);

CREATE TRIGGER update_threats_updated_at
  BEFORE UPDATE ON public.threats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Training progress (tracks user scenario completions)
CREATE TABLE public.training_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_fell_for_trap BOOLEAN NOT NULL DEFAULT false,
  user_mode TEXT NOT NULL DEFAULT 'elderly', -- 'elderly' or 'child'
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training progress"
  ON public.training_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training progress"
  ON public.training_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_training_progress_user ON public.training_progress(user_id);
CREATE INDEX idx_training_progress_scenario ON public.training_progress(scenario_id);

-- STOP protocol progress
CREATE TABLE public.stop_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_steps TEXT[] NOT NULL DEFAULT '{}',
  fully_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.stop_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own STOP progress"
  ON public.stop_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own STOP progress"
  ON public.stop_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own STOP progress"
  ON public.stop_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_stop_progress_updated_at
  BEFORE UPDATE ON public.stop_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Message analysis log (tracks analyzed messages)
CREATE TABLE public.analysis_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  threat_level TEXT NOT NULL, -- 'safe', 'warning', 'danger'
  detected_flags TEXT[] NOT NULL DEFAULT '{}',
  user_mode TEXT NOT NULL DEFAULT 'elderly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analysis log"
  ON public.analysis_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis log"
  ON public.analysis_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_analysis_log_user ON public.analysis_log(user_id);

-- Seed the threats table with initial data
INSERT INTO public.threats (category, title, description, red_flags, target_audience, severity, examples) VALUES
('vishing', 'Звонок от «службы безопасности банка»', 'Мошенники звонят, представляясь сотрудниками банка, и сообщают о несанкционированном переводе. Просят назвать ПИН-код или код из SMS.', ARRAY['Срочность', 'Запрос секретных кодов', 'Неизвестный номер'], ARRAY['elderly', 'professional'], 'critical', ARRAY['«Ваш счёт заблокирован, назовите код для разблокировки»', '«Зафиксирован перевод на 150 000 ₽, подтвердите ПИН-код»']),
('phishing', 'Фишинг через игровые платформы', 'Обещание бесплатной валюты или предметов в играх в обмен на данные аккаунта.', ARRAY['Бесплатные призы', 'Поддельная ссылка', 'Запрос пароля'], ARRAY['child'], 'high', ARRAY['«Получи 10 000 V-Bucks бесплатно!»', '«Введи логин для получения приза»']),
('deepfake', 'Дипфейк-звонок от «родственника»', 'Использование технологий подделки голоса для имитации звонка от родственника с просьбой о срочном переводе денег.', ARRAY['Эмоциональное давление', 'Срочность', 'Запрос денег'], ARRAY['elderly'], 'critical', ARRAY['«Бабушка, у меня авария! Срочно переведи деньги!»', '«Мама, я в полиции, нужны деньги на залог»']),
('smishing', 'SMS о блокировке карты', 'SMS с сообщением о блокировке карты и ссылкой на поддельный сайт банка.', ARRAY['Срочность', 'Поддельная ссылка', 'Запрос данных карты'], ARRAY['elderly', 'professional'], 'high', ARRAY['«Ваша карта заблокирована! Перейдите по ссылке bank-security.xyz»']),
('phishing', 'Фишинг через «Госуслуги»', 'Поддельные письма от «Госуслуг» с просьбой подтвердить личные данные или оплатить штраф.', ARRAY['Имитация госоргана', 'Срочность', 'Запрос личных данных'], ARRAY['elderly', 'professional'], 'high', ARRAY['«Ваш аккаунт на Госуслугах заблокирован»', '«Подтвердите паспортные данные»']);
