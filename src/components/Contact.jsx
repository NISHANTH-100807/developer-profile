export default function Contact({ eyebrow, title, intro, links }) {
  return <section id="contact" className="section">
    <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2></div>
    <div className="content-card contact-card"><p>{intro}</p><div className="contact-links">
      {links.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"><span>{link.name}</span><span>{link.detail}</span></a>)}
    </div></div>
  </section>;
}
