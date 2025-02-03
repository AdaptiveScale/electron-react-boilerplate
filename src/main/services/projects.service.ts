import fs from 'fs';
import path from 'path';
import { DATA_DIR, DB_FILE } from '../utils/setupHelpers';
import { Project } from '../../types/backend';

export default class ProjectsService {
  static loadProjects() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const projects: Project[] = JSON.parse(data).projects || [];

      // const validProjects = projects.filter((project) => {
      //   return fs.existsSync(project.path);
      // });
      //
      // if (validProjects.length !== projects.length) {
      //   this.saveProjects(validProjects);
      // }

      return projects;
    } catch (error) {
      return [];
    }
  }

  static saveProjects(projects: Project[]) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ projects }, null, 2));
  }

  static addProject(name: string) {
    const projects = this.loadProjects();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  static updateProject(project: Project) {
    const projects = this.loadProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...project };
    this.saveProjects(projects);
    return projects;
  }

  static deleteProject(id: string) {
    const projects = this.loadProjects();
    const filteredProjects = projects.filter((p) => p.id !== id);
    if (projects.length === filteredProjects.length) return false;
    this.saveProjects(filteredProjects);
    return true;
  }

  static getProjectPath(name: string) {
    return path.join(DATA_DIR, name);
  }
}
