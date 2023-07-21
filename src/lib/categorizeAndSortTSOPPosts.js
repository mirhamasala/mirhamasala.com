const spinOffCategoriesOrdered = {
  1: "polyglot",
  2: "artist",
  3: "artist",
  4: "kiteboarder",
  5: "philanthropist",
  6: "dancer",
  7: "entrepreneur",
  8: "reader",
  9: "snowboarder",
  10: "surfer",
  11: "traveler",
  12: "photographer",
};

export function categorizeAndSortTSOPPosts(posts) {
  let categorizedPosts = posts.reduce((acc, post) => {
    post.categories.forEach((category) => {
      if (Object.values(spinOffCategoriesOrdered).includes(category)) {
        acc[category] = acc[category] || [];
        acc[category].push(post);
      }
    });
    return acc;
  }, {});

  return Object.entries(categorizedPosts).map(([categoryName, posts]) => {
    posts.sort((a, b) => new Date(a.date) - new Date(b.date));
    let spinoffNumber = Object.keys(spinOffCategoriesOrdered).find(
      (key) => spinOffCategoriesOrdered[key] === categoryName
    );

    return {
      spinoffNumber: spinoffNumber,
      spinOffName: categoryName,
      posts,
    };
  });
}
