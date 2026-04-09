CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  grade_level VARCHAR(20),
  section VARCHAR(20),
  class_teacher_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_code VARCHAR(30) UNIQUE NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  dob DATE,
  gender VARCHAR(20),
  guardian_name VARCHAR(120),
  guardian_phone VARCHAR(30),
  guardian_email VARCHAR(150),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  class_id INT REFERENCES classes(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  reason TEXT,
  marked_by INT REFERENCES users(id),
  UNIQUE(student_id, attendance_date)
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id),
  title VARCHAR(120) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  graded_on DATE NOT NULL,
  entered_by INT REFERENCES users(id),
  remarks TEXT
);

CREATE TABLE behavior_notes (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  note_type VARCHAR(20) NOT NULL CHECK (note_type IN ('positive', 'negative', 'neutral')),
  note TEXT NOT NULL,
  incident_date DATE NOT NULL,
  created_by INT REFERENCES users(id),
  follow_up_required BOOLEAN DEFAULT FALSE
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  alert_type VARCHAR(40) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);
