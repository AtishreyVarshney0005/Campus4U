export const ROLE_PASSWORDS = {
  student: 'Student@123',
  teacher: 'Teacher@123',
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getDisplayName = (email, role) => {
  const name = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return name ? name.replace(/\b\w/g, (letter) => letter.toUpperCase()) : role;
};
