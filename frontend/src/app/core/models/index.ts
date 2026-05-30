export interface About {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  profileImage?: string;
  yearsOfExp: number;
  location?: string;
  tagline?: string;
  signature?: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  ownerName?: string;
  ownerEmail?: string;
  order?: number;
}

export interface Skill {
  _id?: string;
  category: string;
  name: string;
  icon?: string;
  proficiency: number;
  order?: number;
}

export interface Tool {
  _id?: string;
  name: string;
  icon?: string;
  order?: number;
}

export interface Education {
  _id?: string;
  type: 'degree' | 'diploma' | 'certification';
  title: string;
  institution: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in-progress';
  order?: number;
}

export interface Experience {
  _id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  order?: number;
}

export interface Feedback {
  _id?: string;
  clientName: string;
  clientRole?: string;
  company?: string;
  message: string;
  rating: number;
  avatar?: string;
  approved?: boolean;
  order?: number;
}

export interface Contact {
  _id?: string;
  email: string;
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
}

export interface SdlcPhase {
  _id?: string;
  phase: string;
  title: string;
  description: string;
  icon?: string;
  order?: number;
}
