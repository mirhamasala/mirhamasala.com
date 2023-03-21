import fetch from "node-fetch";
const NEWSLETTER_CATEGORY_ID = 27;

let pageSlugs = [];
let postSlugs = [];
let letterSlugs = [];

const fetchContent = async (endpoint) => {
  const url = `https://mirhamasala.com/wp-json/wp/v2/${endpoint}`;
  const response = await fetch(url);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

const getSlugs = (posts, pages) => {
  const content = [...posts, ...pages];

  posts.map((entry) =>
    entry.categories.includes(NEWSLETTER_CATEGORY_ID)
      ? letterSlugs.push(entry.slug)
      : postSlugs.push(entry.slug)
  );

  pages.map((entry) => pageSlugs.push(entry.slug));

  console.log(
    "Matches totals",
    content.length === postSlugs.length + letterSlugs.length + pageSlugs.length
  );

  return { pageSlugs, postSlugs, letterSlugs };
  // console.log("Posts", postSlugs.length);
  // console.log("Letters", letterSlugs.length);
  // console.log("Pages", pageSlugs.length);
  // console.log(
  //   "Total",
  //   postSlugs.length + letterSlugs.length + pageSlugs.length
  // );
  // console.log({ pageSlugs, postSlugs, letterSlugs });
};

export const getWPArticlesSlugs = async () => {
  try {
    const [posts, pages] = await Promise.all([
      fetchContent("posts/?per_page=100"),
      fetchContent("pages/?per_page=50"),
    ]);

    return getSlugs(posts, pages);
  } catch (err) {
    console.log(err);
  }
};
