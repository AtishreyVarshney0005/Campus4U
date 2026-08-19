import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB, { db } from './config/db.js';

const now = new Date().toISOString();
const id = () => crypto.randomUUID();

const seedData = async () => {
  connectDB();

  const studentPassword = await bcrypt.hash('Student@123', 10);
  const teacherPassword = await bcrypt.hash('Teacher@123', 10);

  const seed = db.transaction(() => {
    db.exec(`
      DELETE FROM placement_applications;
      DELETE FROM attendance;
      DELETE FROM marks;
      DELETE FROM library;
      DELETE FROM placements;
      DELETE FROM news;
      DELETE FROM events;
      DELETE FROM students;
    `);

    const studentId = id();
    const teacherId = id();
    db.prepare(`INSERT INTO students
      (id, full_name, email, student_id, role, password, phone, course, branch, semester, year,
       profile_image, address, date_of_birth, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(studentId, 'Aisha Verma', 'student@abccollege.com', 'ABC2026001', 'student', studentPassword,
        '+91 98765 43210', 'B.Tech', 'Computer Science', 6, 2026,
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        '42 Lakeview Avenue, Bengaluru', '2004-08-14', now, now);

    db.prepare(`INSERT INTO students
      (id, full_name, email, student_id, role, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(teacherId, 'Rahul Mehta', 'teacher@abccollege.com', 'TCH2026001', 'teacher', teacherPassword, now, now);

    const attendance = [
      ['Computer Science', 25, 23, 1, 1, 92],
      ['Mathematics', 20, 17, 2, 1, 85],
      ['Physics', 22, 17, 3, 2, 77],
      ['English', 18, 16, 1, 1, 89],
    ];
    const insertAttendance = db.prepare(`INSERT INTO attendance
      (id, student_id, subject, total_classes, present, absent, leave_count, percentage, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    attendance.forEach((record) => insertAttendance.run(id(), studentId, ...record, now, now));

    const marks = [
      ['Mathematics', 18, 9, 0, 58, 85, 'A'],
      ['Physics', 17, 8, 18, 35, 78, 'A'],
      ['English', 19, 10, 0, 59, 88, 'A+'],
      ['Computer Science', 20, 10, 20, 42, 92, 'A+'],
    ];
    const insertMarks = db.prepare(`INSERT INTO marks
      (id, student_id, subject, internal_marks, assignment_marks, practical_marks, theory_marks,
       total_marks, grade, semester, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 6, ?, ?)`);
    marks.forEach((record) => insertMarks.run(id(), studentId, ...record, now, now));

    const books = [
      ['Data Structures and Algorithms', 'Robert Lafore', '2026-08-01', '2026-08-21', null, 'Issued'],
      ['Operating Systems', 'Abraham Silberschatz', '2026-07-15', '2026-08-15', '2026-08-14', 'Returned'],
      ['Machine Learning Essentials', 'Ethem Alpaydin', '2026-06-28', '2026-08-10', null, 'Overdue'],
    ];
    const insertBook = db.prepare(`INSERT INTO library
      (id, student_id, book_name, author, issue_date, due_date, return_date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    books.forEach((record) => insertBook.run(id(), studentId, ...record, now, now));

    const placements = [
      ['TCS', 'Software Engineer', '₹8.5 LPA', 'Bengaluru', 'CGPA >= 7.5', '2026-09-14', 'Campus placement drive for software engineering roles.'],
      ['Infosys', 'System Engineer', '₹7.2 LPA', 'Hyderabad', 'CGPA >= 7.0', '2026-09-20', 'System engineer role for emerging technologies.'],
      ['Accenture', 'Associate Software Engineer', '₹9.0 LPA', 'Pune', 'CGPA >= 7.8', '2026-10-05', 'Technology consulting focused software roles.'],
    ];
    const insertPlacement = db.prepare(`INSERT INTO placements
      (id, company_name, role, package, location, eligibility, drive_date, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    placements.forEach((record) => insertPlacement.run(id(), ...record, now, now));

    const news = [
      ['Seminar on Artificial Intelligence', 'A guest lecture by industry experts on AI and ML trends in modern engineering.', 'Academic', '2026-08-25'],
      ['Inter-College Sports Meet', 'Register teams for athletics, cricket, and volleyball events for the annual sports week.', 'Sports', '2026-08-28'],
      ['Hackathon Registration Open', 'Students can register for the flagship annual hackathon with mentorship support.', 'Events', '2026-09-02'],
      ['Placement Workshops', 'Resume and aptitude workshops are scheduled for final-year students beginning next week.', 'Placement', '2026-09-05'],
    ];
    const insertNews = db.prepare(`INSERT INTO news
      (id, title, description, category, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    news.forEach((record) => insertNews.run(id(), ...record, now, now));

    const events = [
      ['Career Fair', 'Meet top recruiters, explore internships, and network with industry leaders.', '2026-09-12', '10:00 AM', 'Main Auditorium'],
      ['Technical Fest', 'Coding contests, robotics demos, and innovation showcases open to all students.', '2026-09-25', '9:30 AM', 'Innovation Hall'],
      ['Cultural Fest', 'A vibrant celebration of music, dance, and student performances.', '2026-10-04', '11:00 AM', 'Open Air Theater'],
    ];
    const insertEvent = db.prepare(`INSERT INTO events
      (id, title, description, date, time, location, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    events.forEach((record) => insertEvent.run(id(), ...record, now, now));
  });

  await seed();
  console.log('SQLite demo data seeded successfully.');
};

seedData().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
