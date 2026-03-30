import { notFound } from "next/navigation";
import Link from "next/link";
import { casesMock } from "@/lib/research/data/cases.mock";

export default function CaseStudyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const c = casesMock.find((x) => x.slug === params.slug);
  if (!c) notFound();

  const sections = [
    { title: "Problem", content: c.problem },
    { title: "Approach", content: c.approach },
    { title: "Result", content: c.result },
    { title: "Learnings", content: c.learnings },
    { title: "Next", content: c.next },
  ];

  return (
    <article className="terminal-container space-y-4">
      <Link
        href="/case-studies"
        className="terminal-label inline-flex items-center gap-2 text-[0.66rem] text-accent-orange hover:text-accent-orange/80"
      >
        ← Case Studies
      </Link>

      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">{c.date}</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          {c.title}
        </h1>
      </section>

      <section className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="terminal-card p-5">
          <div className="terminal-label mb-4">Sections</div>
          <div className="space-y-2">
            {sections.map(({ title }) => (
              <a
                key={title}
                href={`#${title.toLowerCase()}`}
                className="block text-sm text-text-dark hover:text-accent-orange"
              >
                {title}
              </a>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {sections.map(({ title, content }) => (
            <section key={title} id={title.toLowerCase()} className="terminal-card p-6">
              <div className="terminal-label mb-3">{title}</div>
              <p className="terminal-copy text-sm md:text-base">{content}</p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
