import path from 'path';
import { Project } from '../../types/backend';
import {
  deleteDirectory,
  getDirectoryStructure,
  loadDatabaseFile,
  readFileContent,
  saveFileContent,
  updateDatabase,
} from '../utils/fileHelper';
import SettingsService from './settings.service';

export default class ProjectsService {
  static loadProjects() {
    return loadDatabaseFile().projects;
  }

  static saveProjects(projects: Project[]) {
    updateDatabase<'projects'>('projects', projects);
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
    const projectToDelete = projects.find((p) => p.id === id);
    if (projectToDelete) {
      if (projectToDelete.path) {
        deleteDirectory(projectToDelete.path);
      }
      const filteredProjects = projects.filter((p) => p.id !== id);
      this.saveProjects(filteredProjects);
      return true;
    }
    return false;
  }

  static getProjectPath(name: string) {
    return path.join(SettingsService.loadSettings().projectsDirectory, name);
  }

  static getDirectoryStructure(dirPath: string) {
    return getDirectoryStructure(dirPath);
  }

  static readFileContent(filePath: string) {
    return readFileContent(filePath);
  }

  static saveFileContent(filePath: string, content: string) {
    return saveFileContent(filePath, content);
  }
}
