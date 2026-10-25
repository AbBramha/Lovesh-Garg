import projectsData from './projects.json';

export interface Project {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  area: string;
  year: string;
  status: string;
  image: string;
  gallery: string[];
  description: string;
  concept: string;
  highlights: string[];
  materials: string[];
}

export const projects: Project[] = projectsData as Project[];
