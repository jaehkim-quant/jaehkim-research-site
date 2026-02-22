import { prisma } from "@/lib/prisma";
import { ResearchLibraryClient } from "./ResearchLibraryClient";
import {
  postListSelect,
  serializePostListItem,
} from "@/lib/research/serializers";

export default async function ResearchLibraryPage() {
  const posts = await prisma.post.findMany({
    where: { published: true, seriesId: null },
    orderBy: { date: "desc" },
    select: postListSelect,
  });

  const initialPosts = posts.map(serializePostListItem);

  return <ResearchLibraryClient initialPosts={initialPosts} />;
}
