-- 🔥 FIX: Kolom hasil seleksi dua tahap.
ALTER TABLE applications ADD COLUMN IF NOT EXISTS final_accepted_from INTEGER;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS final_accepted_department_id UUID REFERENCES departments(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS choice1_status TEXT DEFAULT 'pending';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS choice2_status TEXT DEFAULT 'pending';
