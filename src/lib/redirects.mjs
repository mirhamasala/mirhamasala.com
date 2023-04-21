const pages = [
  {
    source: "/all-posts",
    destination: "/posts",
    permanent: true,
  },
  {
    source: "/paper-planes-packets",
    destination: "/letters",
    permanent: true,
  },
];

const posts = [
  {
    source: "/10-things-melbourne",
    destination: "/posts/10-things-melbourne",
    permanent: true,
  },
  {
    source: "/amsterdam-favorites",
    destination: "/posts/amsterdam-favorites",
    permanent: true,
  },
  {
    source: "/beautiful-stranger",
    destination: "/posts/beautiful-stranger",
    permanent: true,
  },
  {
    source: "/best-friends",
    destination: "/posts/best-friends",
    permanent: true,
  },
  {
    source: "/california-pit-stops",
    destination: "/posts/california-pit-stops",
    permanent: true,
  },
  {
    source: "/choosing-parenthood-and-my-pregnancy-notes",
    destination: "/posts/choosing-parenthood-and-my-pregnancy-notes",
    permanent: true,
  },
  {
    source: "/everything-i-never-told-you",
    destination: "/posts/everything-i-never-told-you",
    permanent: true,
  },
  {
    source: "/fasting-keto",
    destination: "/posts/fasting-keto",
    permanent: true,
  },
  {
    source: "/favorite-things-2017",
    destination: "/posts/favorite-things-2017",
    permanent: true,
  },
  {
    source: "/favorite-things-2018",
    destination: "/posts/favorite-things-2018",
    permanent: true,
  },
  {
    source: "/favorite-things-2019",
    destination: "/posts/favorite-things-2019",
    permanent: true,
  },
  {
    source: "/favorite-things-2020",
    destination: "/posts/favorite-things-2020",
    permanent: true,
  },
  {
    source: "/favorite-things-2021",
    destination: "/posts/favorite-things-2021",
    permanent: true,
  },
  {
    source: "/favorite-things-2022",
    destination: "/posts/favorite-things-2022",
    permanent: true,
  },
  {
    source: "/found-in-nothing",
    destination: "/posts/found-in-nothing",
    permanent: true,
  },
  {
    source: "/from-war-with-love",
    destination: "/posts/from-war-with-love",
    permanent: true,
  },
  {
    source: "/goodbye-little-red-dot",
    destination: "/posts/goodbye-little-red-dot",
    permanent: true,
  },
  {
    source: "/happily-ever-after",
    destination: "/posts/happily-ever-after",
    permanent: true,
  },
  {
    source: "/hello-world",
    destination: "/posts/hello-world",
    permanent: true,
  },
  {
    source: "/kill-your-monsters",
    destination: "/posts/kill-your-monsters",
    permanent: true,
  },
  {
    source: "/korean-skin-care-routine",
    destination: "/posts/korean-skin-care-routine",
    permanent: true,
  },
  {
    source: "/leap-of-code",
    destination: "/posts/leap-of-code",
    permanent: true,
  },
  {
    source: "/like-love-exploding",
    destination: "/posts/like-love-exploding",
    permanent: true,
  },
  {
    source: "/love-in-a-time-machine",
    destination: "/posts/love-in-a-time-machine",
    permanent: true,
  },
  {
    source: "/mirha-left",
    destination: "/posts/mirha-left",
    permanent: true,
  },
  {
    source: "/poppy",
    destination: "/posts/poppy",
    permanent: true,
  },
  {
    source: "/resilience-pie",
    destination: "/posts/resilience-pie",
    permanent: true,
  },
  {
    source: "/sarajevo-favorites",
    destination: "/posts/sarajevo-favorites",
    permanent: true,
  },
  {
    source: "/slow-coffee",
    destination: "/posts/slow-coffee",
    permanent: true,
  },
  {
    source: "/the-fear-list",
    destination: "/posts/the-fear-list",
    permanent: true,
  },
  {
    source: "/the-knitting-club",
    destination: "/posts/the-knitting-club",
    permanent: true,
  },
  {
    source: "/the-knitting-club-season-two-creative-dream",
    destination: "/posts/the-knitting-club-season-two-creative-dream",
    permanent: true,
  },
  {
    source: "/the-making-of-slow-retreats",
    destination: "/posts/the-making-of-slow-retreats",
    permanent: true,
  },
  {
    source: "/the-story-of-us",
    destination: "/posts/the-story-of-us",
    permanent: true,
  },
  {
    source: "/tunes-between-friends",
    destination: "/posts/tunes-between-friends",
    permanent: true,
  },
  {
    source: "/we-need-to-talk-about-me",
    destination: "/posts/we-need-to-talk-about-me",
    permanent: true,
  },
];

const letters = [
  {
    source: "/0818",
    destination: "/letters/0818",
    permanent: true,
  },
  {
    source: "/black-hole-0522",
    destination: "/letters/black-hole-0522",
    permanent: true,
  },
  {
    source: "/courage-again-091022",
    destination: "/letters/courage-again-091022",
    permanent: true,
  },
  {
    source: "/courage-for-sale-1221",
    destination: "/letters/courage-for-sale-1221",
    permanent: true,
  },
  {
    source: "/dead-time-010223",
    destination: "/letters/dead-time-010223",
    permanent: true,
  },
  {
    source: "/doing-nothing-0121",
    destination: "/letters/doing-nothing-0121",
    permanent: true,
  },
  {
    source: "/four-day-workweeks-0821",
    destination: "/letters/four-day-workweeks-0821",
    permanent: true,
  },
  {
    source: "/heal-111222",
    destination: "/letters/heal-111222",
    permanent: true,
  },
  {
    source: "/in-another-life-0721",
    destination: "/letters/in-another-life-0721",
    permanent: true,
  },
  {
    source: "/keeping-secrets-0221",
    destination: "/letters/keeping-secrets-0221",
    permanent: true,
  },
  {
    source: "/learning-optimism-0122",
    destination: "/letters/learning-optimism-0122",
    permanent: true,
  },
  {
    source: "/less-mad-0421",
    destination: "/letters/less-mad-0421",
    permanent: true,
  },
  {
    source: "/life-suspended-0422",
    destination: "/letters/life-suspended-0422",
    permanent: true,
  },
  {
    source: "/no-excuses-030423",
    destination: "/letters/no-excuses-030423",
    permanent: true,
  },
  {
    source: "/nomad-no-more-0921",
    destination: "/letters/nomad-no-more-0921",
    permanent: true,
  },
  {
    source: "/one-big-thing-0222",
    destination: "/letters/one-big-thing-0222",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0118",
    destination: "/letters/paper-planes-packets-0118",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0119",
    destination: "/letters/paper-planes-packets-0119",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0120",
    destination: "/letters/paper-planes-packets-0120",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0218",
    destination: "/letters/paper-planes-packets-0218",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0219",
    destination: "/letters/paper-planes-packets-0219",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0220",
    destination: "/letters/paper-planes-packets-0220",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0318",
    destination: "/letters/paper-planes-packets-0318",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0319",
    destination: "/letters/paper-planes-packets-0319",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0320",
    destination: "/letters/paper-planes-packets-0320",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0418",
    destination: "/letters/paper-planes-packets-0418",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0419",
    destination: "/letters/paper-planes-packets-0419",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0420",
    destination: "/letters/paper-planes-packets-0420",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0518",
    destination: "/letters/paper-planes-packets-0518",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0519",
    destination: "/letters/paper-planes-packets-0519",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0520",
    destination: "/letters/paper-planes-packets-0520",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0618",
    destination: "/letters/paper-planes-packets-0618",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0619",
    destination: "/letters/paper-planes-packets-0619",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0620",
    destination: "/letters/paper-planes-packets-0620",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0718",
    destination: "/letters/paper-planes-packets-0718",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0719",
    destination: "/letters/paper-planes-packets-0719",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0720",
    destination: "/letters/paper-planes-packets-0720",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0819",
    destination: "/letters/paper-planes-packets-0819",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0820",
    destination: "/letters/paper-planes-packets-0820",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0918",
    destination: "/letters/paper-planes-packets-0918",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-0920",
    destination: "/letters/paper-planes-packets-0920",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1018",
    destination: "/letters/paper-planes-packets-1018",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1019",
    destination: "/letters/paper-planes-packets-1019",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1020",
    destination: "/letters/paper-planes-packets-1020",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1118",
    destination: "/letters/paper-planes-packets-1118",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1119",
    destination: "/letters/paper-planes-packets-1119",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1120",
    destination: "/letters/paper-planes-packets-1120",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1218",
    destination: "/letters/paper-planes-packets-1218",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1219",
    destination: "/letters/paper-planes-packets-1219",
    permanent: true,
  },
  {
    source: "/paper-planes-packets-1220",
    destination: "/letters/paper-planes-packets-1220",
    permanent: true,
  },
  {
    source: "/shifting-sands-0621",
    destination: "/letters/shifting-sands-0621",
    permanent: true,
  },
  {
    source: "/spike-it-070822",
    destination: "/letters/spike-it-070822",
    permanent: true,
  },
  {
    source: "/stop-thinking-you-are-special-0322",
    destination: "/letters/stop-thinking-you-are-special-0322",
    permanent: true,
  },
  {
    source: "/stress-1021",
    destination: "/letters/stress-1021",
    permanent: true,
  },
  {
    source: "/surprise-0622",
    destination: "/letters/surprise-0622",
    permanent: true,
  },
  {
    source: "/turning-insult-into-strength-1121",
    destination: "/letters/turning-insult-into-strength-1121",
    permanent: true,
  },
  {
    source: "/we-need-to-talk-0521",
    destination: "/letters/we-need-to-talk-0521",
    permanent: true,
  },
];

const redirects = [...pages, ...posts, ...letters];

export default redirects;
