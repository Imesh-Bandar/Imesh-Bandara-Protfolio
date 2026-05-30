import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { About, Contact, Education, Experience, Feedback, Project, Skill, SdlcPhase, Tool } from '../models';

const BASE = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // About
  getAbout()         { return this.http.get<About>(`${BASE}/about`); }
  saveAbout(fd: FormData) { return this.http.post<About>(`${BASE}/about`, fd); }

  // Projects
  getProjects()      { return this.http.get<Project[]>(`${BASE}/projects`); }
  createProject(fd: FormData) { return this.http.post<Project>(`${BASE}/projects`, fd); }
  updateProject(id: string, fd: FormData) { return this.http.put<Project>(`${BASE}/projects/${id}`, fd); }
  deleteProject(id: string)  { return this.http.delete(`${BASE}/projects/${id}`); }

  // Skills
  getSkills()        { return this.http.get<Skill[]>(`${BASE}/skills`); }
  createSkill(s: Partial<Skill>)  { return this.http.post<Skill>(`${BASE}/skills`, s); }
  updateSkill(id: string, s: Partial<Skill>) { return this.http.put<Skill>(`${BASE}/skills/${id}`, s); }
  deleteSkill(id: string)    { return this.http.delete(`${BASE}/skills/${id}`); }

  // Tools
  getTools()         { return this.http.get<Tool[]>(`${BASE}/tools`); }
  createTool(t: Partial<Tool>)    { return this.http.post<Tool>(`${BASE}/tools`, t); }
  updateTool(id: string, t: Partial<Tool>) { return this.http.put<Tool>(`${BASE}/tools/${id}`, t); }
  deleteTool(id: string)     { return this.http.delete(`${BASE}/tools/${id}`); }

  // Education
  getEducation()     { return this.http.get<Education[]>(`${BASE}/education`); }
  createEducation(e: Partial<Education>) { return this.http.post<Education>(`${BASE}/education`, e); }
  updateEducation(id: string, e: Partial<Education>) { return this.http.put<Education>(`${BASE}/education/${id}`, e); }
  deleteEducation(id: string){ return this.http.delete(`${BASE}/education/${id}`); }

  // Experience
  getExperience()    { return this.http.get<Experience[]>(`${BASE}/experience`); }
  createExperience(e: Partial<Experience>) { return this.http.post<Experience>(`${BASE}/experience`, e); }
  updateExperience(id: string, e: Partial<Experience>) { return this.http.put<Experience>(`${BASE}/experience/${id}`, e); }
  deleteExperience(id: string){ return this.http.delete(`${BASE}/experience/${id}`); }

  // Feedback
  getFeedback()      { return this.http.get<Feedback[]>(`${BASE}/feedback`); }
  getAllFeedback()    { return this.http.get<Feedback[]>(`${BASE}/feedback/all`); }
  createFeedback(fd: FormData) { return this.http.post<Feedback>(`${BASE}/feedback`, fd); }
  updateFeedback(id: string, fd: FormData) { return this.http.put<Feedback>(`${BASE}/feedback/${id}`, fd); }
  deleteFeedback(id: string) { return this.http.delete(`${BASE}/feedback/${id}`); }

  // Contact
  getContact()       { return this.http.get<Contact>(`${BASE}/contact`); }
  saveContact(c: Partial<Contact>) { return this.http.post<Contact>(`${BASE}/contact`, c); }

  // SDLC
  getSdlc()          { return this.http.get<SdlcPhase[]>(`${BASE}/sdlc`); }
  createSdlc(s: Partial<SdlcPhase>) { return this.http.post<SdlcPhase>(`${BASE}/sdlc`, s); }
  updateSdlc(id: string, s: Partial<SdlcPhase>) { return this.http.put<SdlcPhase>(`${BASE}/sdlc/${id}`, s); }
  deleteSdlc(id: string)     { return this.http.delete(`${BASE}/sdlc/${id}`); }

  // Resume
  downloadResume()   { return `${BASE}/resume/download`; }
  uploadResume(fd: FormData) { return this.http.post(`${BASE}/resume`, fd); }
}
