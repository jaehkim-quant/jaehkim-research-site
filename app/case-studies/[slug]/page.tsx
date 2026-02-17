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
    <article className="py-section md:py-section-lg">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/case-studies"
          className="text-sm text-accent-blue hover:underline mb-6 inline-block"
        >
          ← Case Studies
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold text-text-dark dark:text-text-title mb-6">
          {c.title}
        </h1>
        {c.date && (
          <span className="text-sm text-text-dark/60 dark:text-text/60">
            {c.date}
          </span>
        )}

        <div className="mt-10 space-y-8">
          {sections.map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-lg font-semibold text-text-dark dark:text-text-title mb-2">
                {title}
              </h2>
              <p className="text-text-dark/80 dark:text-text/80 leading-relaxed">
                {content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
