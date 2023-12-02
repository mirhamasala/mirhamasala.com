import spinOffs from "@/data/spinOffs.ts";

export function categorizeAndSortTSOPPosts(posts) {
  const categorizedPosts = {};

  posts.forEach((post) => {
    post.categories.forEach((category) => {
      if (spinOffs[category]) {
        if (!categorizedPosts[category]) {
          categorizedPosts[category] = [];
        }
        categorizedPosts[category].push(post);
      }
    });
  });

  return Object.keys(categorizedPosts)
    .sort((a, b) => spinOffs[a].number - spinOffs[b].number)
    .map((category) => ({
      category,
      number: spinOffs[category].number,
      img: spinOffs[category].img,
      posts: categorizedPosts[category].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    }));
}
