-- Password hash below is for: Password123!
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Admin User', 'admin@school.edu', '$2a$10$BL.ZN7fBj7NEvMJ1N2kNiuw6Fc0T0oA0C7DW7h6f9Gho4j5lC7xX6', 'admin'),
('Teacher One', 'teacher1@school.edu', '$2a$10$BL.ZN7fBj7NEvMJ1N2kNiuw6Fc0T0oA0C7DW7h6f9Gho4j5lC7xX6', 'teacher');

INSERT INTO classes (name, grade_level, section, class_teacher_id) VALUES
('Grade 8 - A', '8', 'A', 2),
('Grade 9 - B', '9', 'B', 2);

INSERT INTO students (student_code, first_name, last_name, guardian_name, guardian_phone, class_id) VALUES
('STU-1001', 'Mia', 'Carter', 'Jenna Carter', '555-0101', 1),
('STU-1002', 'Noah', 'Lee', 'Daniel Lee', '555-0102', 1),
('STU-1003', 'Ava', 'Nguyen', 'Helen Nguyen', '555-0103', 2);

INSERT INTO subjects (name) VALUES
('Math'), ('Science'), ('English');
