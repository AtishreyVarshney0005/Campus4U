import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Attendance from './models/Attendance.js';
import Marks from './models/Marks.js';
import Library from './models/Library.js';
import Placement from './models/Placement.js';
import News from './models/News.js';
import Event from './models/Event.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college_portal');

    await Student.deleteMany({});
    await Attendance.deleteMany({});
    await Marks.deleteMany({});
    await Library.deleteMany({});
    await Placement.deleteMany({});
    await News.deleteMany({});
    await Event.deleteMany({});

    const password = await bcrypt.hash('Student@123', 10);

    const student = await Student.create({
      fullName: 'Aisha Verma',
      email: 'student@abccollege.com',
      studentId: 'ABC2026001',
      password,
      phone: '+91 98765 43210',
      course: 'B.Tech',
      branch: 'Computer Science',
      semester: 6,
      year: 2026,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      address: '42 Lakeview Avenue, Bengaluru',
      dateOfBirth: '2004-08-14',
    });

    await Attendance.insertMany([
      { studentId: student._id, subject: 'Computer Science', totalClasses: 25, present: 23, absent: 1, leave: 1, percentage: 92 },
      { studentId: student._id, subject: 'Mathematics', totalClasses: 20, present: 17, absent: 2, leave: 1, percentage: 85 },
      { studentId: student._id, subject: 'Physics', totalClasses: 22, present: 17, absent: 3, leave: 2, percentage: 77 },
      { studentId: student._id, subject: 'English', totalClasses: 18, present: 16, absent: 1, leave: 1, percentage: 89 },
    ]);

    await Marks.insertMany([
      { studentId: student._id, subject: 'Mathematics', internalMarks: 18, assignmentMarks: 9, practicalMarks: 0, theoryMarks: 58, totalMarks: 85, grade: 'A', semester: 6 },
      { studentId: student._id, subject: 'Physics', internalMarks: 17, assignmentMarks: 8, practicalMarks: 18, theoryMarks: 35, totalMarks: 78, grade: 'A', semester: 6 },
      { studentId: student._id, subject: 'English', internalMarks: 19, assignmentMarks: 10, practicalMarks: 0, theoryMarks: 59, totalMarks: 88, grade: 'A+', semester: 6 },
      { studentId: student._id, subject: 'Computer Science', internalMarks: 20, assignmentMarks: 10, practicalMarks: 20, theoryMarks: 42, totalMarks: 92, grade: 'A+', semester: 6 },
    ]);

    await Library.insertMany([
      { studentId: student._id, bookName: 'Data Structures and Algorithms', author: 'Robert Lafore', issueDate: new Date('2026-08-01'), dueDate: new Date('2026-08-21'), returnDate: null, status: 'Issued' },
      { studentId: student._id, bookName: 'Operating Systems', author: 'Abraham Silberschatz', issueDate: new Date('2026-07-15'), dueDate: new Date('2026-08-15'), returnDate: new Date('2026-08-14'), status: 'Returned' },
      { studentId: student._id, bookName: 'Machine Learning Essentials', author: 'Ethem Alpaydin', issueDate: new Date('2026-06-28'), dueDate: new Date('2026-08-10'), returnDate: null, status: 'Overdue' },
    ]);

    await Placement.insertMany([
      { companyName: 'TCS', role: 'Software Engineer', package: '₹8.5 LPA', location: 'Bengaluru', eligibility: 'CGPA >= 7.5', driveDate: new Date('2026-09-14'), studentsApplied: [student._id], description: 'Campus placement drive for software engineering roles.' },
      { companyName: 'Infosys', role: 'System Engineer', package: '₹7.2 LPA', location: 'Hyderabad', eligibility: 'CGPA >= 7.0', driveDate: new Date('2026-09-20'), studentsApplied: [student._id], description: 'System engineer role for emerging technologies.' },
      { companyName: 'Accenture', role: 'Associate Software Engineer', package: '₹9.0 LPA', location: 'Pune', eligibility: 'CGPA >= 7.8', driveDate: new Date('2026-10-05'), studentsApplied: [], description: 'Technology consulting focused software roles.' },
    ]);

    await News.insertMany([
      { title: 'Seminar on Artificial Intelligence', description: 'A guest lecture by industry experts on AI and ML trends in modern engineering.', category: 'Academic', date: new Date('2026-08-25') },
      { title: 'Inter-College Sports Meet', description: 'Register teams for athletics, cricket, and volleyball events for the annual sports week.', category: 'Sports', date: new Date('2026-08-28') },
      { title: 'Hackathon Registration Open', description: 'Students can register for the flagship annual hackathon with mentorship support.', category: 'Events', date: new Date('2026-09-02') },
      { title: 'Placement Workshops', description: 'Resume and aptitude workshops are scheduled for final-year students beginning next week.', category: 'Placement', date: new Date('2026-09-05') },
    ]);

    await Event.insertMany([
      { title: 'Career Fair', description: 'Meet top recruiters, explore internships, and network with industry leaders.', date: new Date('2026-09-12'), time: '10:00 AM', location: 'Main Auditorium' },
      { title: 'Technical Fest', description: 'Coding contests, robotics demos, and innovation showcases open to all students.', date: new Date('2026-09-25'), time: '9:30 AM', location: 'Innovation Hall' },
      { title: 'Cultural Fest', description: 'A vibrant celebration of music, dance, and student performances.', date: new Date('2026-10-04'), time: '11:00 AM', location: 'Open Air Theater' },
    ]);

    console.log('Demo data seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
