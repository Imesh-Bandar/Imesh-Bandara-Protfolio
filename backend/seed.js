const mongoose = require('mongoose');
require('dotenv').config();

const About      = require('./models/About');
const Project    = require('./models/Project');
const Skill      = require('./models/Skill');
const Tool       = require('./models/Tool');
const Education  = require('./models/Education');
const Experience = require('./models/Experience');
const Sdlc       = require('./models/Sdlc');
const Contact    = require('./models/Contact');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected — seeding...');

  await About.deleteMany({});
  await About.create({
    name: 'Imesh',
    title: 'Full Stack Trainee Software Engineer',
    bio: 'Passionate full-stack software engineer with 3 years of hands-on experience building web applications. I specialize in both frontend and backend development, with expertise across multiple languages and frameworks. Currently working at Synergy Information Systems, I am eager to bring value to new opportunities.',
    yearsOfExp: 3,
    location: 'Sri Lanka',
    tagline: 'Building clean, scalable web solutions'
  });

  await Project.deleteMany({});
  await Project.insertMany([
    {
      title: 'The Next Step',
      description: 'A comprehensive job portal platform connecting job seekers with employers. Features include job listings, applicant tracking, company profiles, and real-time notifications.',
      techStack: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'],
      order: 1
    },
    {
      title: 'The Smart Campus',
      description: 'A smart campus management system for universities, featuring student management, course scheduling, attendance tracking, and resource booking.',
      techStack: ['React', 'Spring Boot', 'MySQL', 'Java'],
      order: 2
    }
  ]);

  await Skill.deleteMany({});
  await Skill.insertMany([
    { category: 'Languages', name: 'C',           proficiency: 75, order: 1 },
    { category: 'Languages', name: 'C++',         proficiency: 75, order: 2 },
    { category: 'Languages', name: 'PHP',         proficiency: 70, order: 3 },
    { category: 'Languages', name: 'Java',        proficiency: 80, order: 4 },
    { category: 'Languages', name: 'Python',      proficiency: 70, order: 5 },
    { category: 'Backend',   name: 'Node.js',     proficiency: 85, order: 6 },
    { category: 'Backend',   name: 'Express.js',  proficiency: 85, order: 7 },
    { category: 'Backend',   name: 'Spring Boot', proficiency: 75, order: 8 },
    { category: 'Frontend',  name: 'Angular',     proficiency: 85, order: 9 },
    { category: 'Frontend',  name: 'React',       proficiency: 80, order: 10 },
    { category: 'Frontend',  name: 'JavaScript',  proficiency: 88, order: 11 },
    { category: 'Frontend',  name: 'TypeScript',  proficiency: 82, order: 12 },
    { category: 'Database',  name: 'MySQL',       proficiency: 85, order: 13 },
    { category: 'Database',  name: 'MongoDB',     proficiency: 80, order: 14 },
    { category: 'Database',  name: 'PostgreSQL',  proficiency: 75, order: 15 }
  ]);

  await Tool.deleteMany({});
  await Tool.insertMany([
    { name: 'VS Code',          order: 1 },
    { name: 'WebStorm',         order: 2 },
    { name: 'Postman',          order: 3 },
    { name: 'MySQL Workbench',  order: 4 },
    { name: 'Dev C++',          order: 5 },
    { name: 'NeonDB',           order: 6 },
    { name: 'SQL Server',       order: 7 },
    { name: 'ClickUp',          order: 8 },
    { name: 'Draw.io',          order: 9 }
  ]);

  await Education.deleteMany({});
  await Education.insertMany([
    {
      type: 'degree',
      title: 'BSc Hons Information Technology (Special)',
      institution: 'University',
      status: 'completed',
      order: 1
    },
    {
      type: 'diploma',
      title: 'Diploma in Information Technology',
      institution: 'ICBT',
      grade: 'A Pass',
      status: 'completed',
      order: 2
    },
    {
      type: 'certification',
      title: 'IBM Certified Full Stack JavaScript Developer',
      institution: 'IBM',
      status: 'in-progress',
      order: 3
    },
    {
      type: 'certification',
      title: 'Responsive Web Application',
      institution: 'freeCodeCamp',
      status: 'completed',
      order: 4
    },
    {
      type: 'certification',
      title: 'MongoDB Developer Path — Node.js Developer',
      institution: 'MongoDB University',
      status: 'completed',
      order: 5
    },
    {
      type: 'certification',
      title: 'Trainee Full Stack Developer',
      institution: 'University of Moratuwa',
      status: 'completed',
      order: 6
    },
    {
      type: 'certification',
      title: 'Computer Application Assistance',
      institution: 'E Nenasala',
      status: 'completed',
      order: 7
    }
  ]);

  await Experience.deleteMany({});
  await Experience.create({
    company: 'Synergy Information Systems',
    role: 'Full Stack Trainee Software Engineer',
    startDate: '2022-01',
    current: true,
    description: 'Developing and maintaining full-stack web applications for enterprise clients. Working across the entire software development lifecycle — from requirements gathering and design to deployment and maintenance.',
    order: 1
  });

  await Sdlc.deleteMany({});
  await Sdlc.insertMany([
    { phase: '01', title: 'Requirement Analysis',  description: 'Gathering and documenting client requirements, defining project scope, and creating functional specifications.', icon: 'description',  order: 1 },
    { phase: '02', title: 'System Design',         description: 'Architecting the system, designing database schemas, UI/UX wireframes, and choosing the technology stack.', icon: 'design_services', order: 2 },
    { phase: '03', title: 'Implementation',        description: 'Writing clean, maintainable code following best practices. Building both frontend and backend components.', icon: 'code',            order: 3 },
    { phase: '04', title: 'Testing & QA',          description: 'Unit testing, integration testing, and user acceptance testing to ensure quality and reliability.', icon: 'bug_report',      order: 4 },
    { phase: '05', title: 'Deployment',            description: 'Deploying to production environments, setting up CI/CD pipelines, and ensuring smooth go-live.', icon: 'rocket_launch',    order: 5 },
    { phase: '06', title: 'Maintenance & Support', description: 'Ongoing support, bug fixes, performance monitoring, and feature enhancements post-launch.', icon: 'support',          order: 6 }
  ]);

  await Contact.deleteMany({});
  await Contact.create({
    email: 'imesh.fsd.info@gmail.com',
    whatsapp: '',
    linkedin: '',
    facebook: '',
    github: ''
  });

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
