export default function About({ eyebrow, title, paragraphs }) {
  return <section id="about" className="section">
    <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2></div>
    <div className="content-card">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
  </section>;
}
