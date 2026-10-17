import { useEffect, useMemo, useState } from 'react';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import { projects, skills, socials } from './data.js';
import profileImage from '../profile.jpeg';

const aboutParagraphs = [
  "I'm an AI and Machine Learning engineering student at NMAM Institute of Technology, Nitte, with an interest in web development, artificial intelligence, and problem-solving.",
  "I enjoy learning by building projects, collaborating with teams, and exploring how technology can be used to create practical solutions. I'm currently developing my skills across frontend development and the MERN stack.",
];

function GuessingGame() {
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('Make your first guess!');
  const [gameOver, setGameOver] = useState(false);
  function submit(event) {
    event.preventDefault();
    const value = Number(guess);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      setMessage('Enter a whole number between 1 and 100.');
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    if (value === secret) {
      setMessage(`Correct! You found the number in ${next} ${next === 1 ? 'attempt' : 'attempts'}!`);
      setGameOver(true);
    } else setMessage(value < secret ? 'Too low! Try a higher number.' : 'Too high! Try a lower number.');
    setGuess('');
  }
  function restart() {
    setSecret(Math.floor(Math.random() * 100) + 1); setGuess(''); setAttempts(0);
    setMessage('Make your first guess!'); setGameOver(false);
  }
  return <section id="guessing-game" className="section">
    <div className="section-heading"><p>TAKE A BREAK</p><h2>Number Guessing Game</h2></div>
    <div className="interactive-card game-card"><div className="game-symbol">?</div>
      <p className="card-description">I'm thinking of a number between 1 and 100. Can you guess it?</p>
      <form className="game-input-area" onSubmit={submit}><input type="number" min="1" max="100" value={guess} onChange={(event) => setGuess(event.target.value)} placeholder="Enter your guess" aria-label="Your guess" required disabled={gameOver} /><button className="primary-btn" disabled={gameOver}>Guess</button></form>
      <p className={`game-message${gameOver ? ' success' : ''}`} aria-live="polite">{message}</p>
      <div className="attempt-display"><span>Attempts</span><strong>{attempts}</strong></div>
      <button type="button" onClick={restart} className="secondary-btn">Play Again</button>
    </div>
  </section>;
}

function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nishanthTasks') || '[]');
      return Array.isArray(saved) ? saved.filter((task) => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.completed === 'boolean') : [];
    } catch { return []; }
  });
  const [filter, setFilter] = useState('all');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    try { localStorage.setItem('nishanthTasks', JSON.stringify(tasks)); }
    catch { setError('Could not save tasks in this browser.'); }
  }, [tasks]);
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const shown = useMemo(() => tasks.filter((task) => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed)), [tasks, filter]);
  function addTask(event) {
    event.preventDefault(); const text = value.trim();
    if (!text) { setError('Please enter a task before adding it.'); return; }
    setTasks((items) => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, completed: false }, ...items]);
    setFilter('all'); setValue(''); setError('');
  }
  const emptyText = tasks.length === 0 ? 'No tasks yet. Add your first task above!' : filter === 'completed' ? 'No completed tasks yet.' : filter === 'pending' ? 'No pending tasks. Great job!' : 'No tasks to display.';
  return <section id="task-manager" className="section">
    <div className="section-heading"><p>STAY PRODUCTIVE</p><h2>My Task Manager</h2></div>
    <div className="interactive-card task-card"><div className="task-header"><div><h3>Today's Tasks</h3><p className="card-description">Small steps. Big progress.</p></div><div className="task-counter"><strong>{tasks.length}</strong><span>Total tasks</span></div></div>
      <form className="task-input-area" onSubmit={addTask}><input type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder="What do you need to do?" maxLength="150" aria-label="New task" required /><button className="primary-btn">Add Task +</button></form>
      <p className="task-message" aria-live="polite">{error}</p>
      <div className="task-stats">{[['All', tasks.length, 'all-dot'], ['Completed', completed, 'completed-dot'], ['Pending', pending, 'pending-dot']].map(([label, count, dot]) => <div key={label}><span className={`stat-dot ${dot}`} /><span>{label}</span><strong>{count}</strong></div>)}</div>
      <div className="task-toolbar"><h3>Your List</h3><div className="filter-buttons" role="group" aria-label="Filter tasks">{['all', 'pending', 'completed'].map((item) => <button type="button" key={item} className={`filter-btn${filter === item ? ' active' : ''}`} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div></div>
      <ul className="task-list">{shown.map((task) => <li key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}><input type="checkbox" className="task-checkbox" checked={task.completed} onChange={(event) => setTasks((items) => items.map((item) => item.id === task.id ? { ...item, completed: event.target.checked } : item))} aria-label={`Mark ${task.text} as completed`} /><span className="task-text">{task.text}</span><button type="button" className="delete-btn" aria-label={`Delete ${task.text}`} onClick={() => setTasks((items) => items.filter((item) => item.id !== task.id))}>×</button></li>)}</ul>
      {shown.length === 0 && <p className="empty-message">{emptyText}</p>}
      <div className="task-footer"><span>{pending === 0 ? tasks.length === 0 ? 'Add a task to get started!' : "You're all caught up!" : `${pending} ${pending === 1 ? 'task' : 'tasks'} remaining`}</span><button type="button" className="text-btn" disabled={completed === 0} onClick={() => setTasks((items) => items.filter((task) => !task.completed))}>Clear Completed</button></div>
    </div>
  </section>;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('nishanthTheme') || 'dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('nishanthTheme', theme); }, [theme]);
  return <div className="app-shell">
    <header className="navbar"><a href="#home" className="logo">Nishanth<span>.</span></a>
      <nav className="nav-links" aria-label="Main navigation"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#guessing-game">Guessing Game</a><a href="#task-manager">Task Manager</a><a href="#contact">Contact</a></nav>
      <button type="button" className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀ Light' : '☾ Dark'}</button>
    </header>
    <main>
      <section id="home" className="hero section"><div className="hero-content"><p className="eyebrow">HELLO, WORLD!</p><h1>I'm <span>J Nishanth Bhat</span></h1><h2>AI &amp; ML Engineering Student</h2><p className="hero-description">Exploring the world of technology, building web experiences, and turning ideas into projects that solve real problems.</p>
        <div className="hero-buttons"><a href="#projects" className="primary-btn">Explore My Work</a><a href="#contact" className="secondary-btn">Contact Me</a></div>
        <div className="social-links">{socials.map((link) => <a href={link.href} key={link.name} target="_blank" rel="noopener noreferrer">{link.name} ↗</a>)}</div>
      </div><div className="hero-image-wrapper"><div className="image-glow" /><img src={profileImage} alt="J Nishanth Bhat" className="profile-image" /><div className="floating-card"><span className="status-dot" />Learning. Building. Improving.</div></div></section>
      <About eyebrow="GET TO KNOW ME" title="About Me" paragraphs={aboutParagraphs} />
      <Skills eyebrow="WHAT I WORK WITH" title="My Skills" skills={skills} />
      <Projects eyebrow="THINGS I'VE BUILT" title="Featured Projects" projects={projects} />
      <GuessingGame /><TaskManager />
      <Contact eyebrow="LET'S CONNECT" title="Contact Me" intro="Have an interesting project, collaboration idea, or opportunity? Feel free to reach out." links={socials} />
    </main>
    <footer className="footer"><a href="#home" className="logo">Nishanth<span>.</span></a><p>Designed and built with curiosity.</p><p>© {new Date().getFullYear()} J Nishanth Bhat</p></footer>
  </div>;
}
