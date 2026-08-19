import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(__dirname, '../data');
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(path.join(dataDirectory, 'college_portal.sqlite'));
db.pragma('foreign_keys = ON');

const connectDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      student_id TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
      password TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '+91 98765 43210',
      course TEXT NOT NULL DEFAULT 'B.Tech',
      branch TEXT NOT NULL DEFAULT 'Computer Science',
      semester INTEGER NOT NULL DEFAULT 6,
      year INTEGER NOT NULL DEFAULT 2026,
      profile_image TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '123 Green Park, Bengaluru, India',
      date_of_birth TEXT NOT NULL DEFAULT '2004-08-14',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      total_classes INTEGER NOT NULL,
      present INTEGER NOT NULL,
      absent INTEGER NOT NULL DEFAULT 0,
      leave_count INTEGER NOT NULL DEFAULT 0,
      percentage REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS marks (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      internal_marks REAL NOT NULL DEFAULT 0,
      assignment_marks REAL NOT NULL DEFAULT 0,
      practical_marks REAL NOT NULL DEFAULT 0,
      theory_marks REAL NOT NULL DEFAULT 0,
      total_marks REAL NOT NULL,
      grade TEXT NOT NULL DEFAULT 'A',
      semester INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS library (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      book_name TEXT NOT NULL,
      author TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      return_date TEXT,
      status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Issued', 'Returned', 'Overdue')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS placements (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      role TEXT NOT NULL,
      package TEXT NOT NULL,
      location TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      drive_date TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS placement_applications (
      placement_id TEXT NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      applied_at TEXT NOT NULL,
      PRIMARY KEY (placement_id, student_id)
    );
    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Announcement',
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  console.log('SQLite database ready.');
};

export { db };
export default connectDB;
