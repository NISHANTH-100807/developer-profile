import { useState } from 'react';

export default function Projects({ eyebrow, title, projects }) {
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(projects.map((project) => project.category))];
  const shown = category === 'All' ? projects : projects.filter((project) => project.category === category);
  return <section id="projects" className="section">
    <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2></div>
    <div className="filter-buttons section-filters" role="group" aria-label="Filter projects">
      {categories.map((item) => <button key={item} type="button" className={`filter-btn${category === item ? ' active' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <div className="projects-grid">{shown.map((project) => <article className="project-card" key={project.number}>
      <div className="project-number">{project.number}</div><h3>{project.name}</h3><p>{project.description}</p>
      <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">Visit Website ↗</a>}
    </article>)}</div>
  </section>;
}
