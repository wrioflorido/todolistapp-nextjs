import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kpnlodhaxacmxlbstemh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbmxvZGhheGFjbXhsYnN0ZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MTIwMzksImV4cCI6MjAyNTQ4ODAzOX0.GdjYOPsU_MX_HxH7vyGKu4PNaP0gpL8vDCyZrl3U0-o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);