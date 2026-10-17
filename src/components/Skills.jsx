import { useState } from 'react';

export default function Skills({ eyebrow, title, skills }) {
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(skills.map((skill) => skill.category))];
  const shown = category === 'All' ? skills : skills.filter((skill) => skill.category === category);
  return <section id="skills" className="section">
    <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2></div>
    <div className="filter-buttons section-filters" role="group" aria-label="Filter skill categories">
      {categories.map((item) => <button key={item} type="button" className={`filter-btn${category === item ? ' active' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <div className="skills-grid">{shown.map((skill) => <article className="skill-card" key={skill.name}>
      <div className="skill-icon" aria-hidden="true">{skill.icon}</div><h3>{skill.name}</h3>
      <div className="tags">{skill.items.map((item) => <span key={item}>{item}</span>)}</div>
    </article>)}</div>
  </section>;
}
