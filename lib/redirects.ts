/**
 * Permanent redirects from legacy URLs to their equivalent pages.
 * Four letters never had a root alias and are omitted:
 * here-comes-the-hulk-050623, jobless-but-balanced-070823,
 * life-escaping-life-091023, and lost-on-mars-111223.
 * Published articles keep their legacy root aliases. Drafts do not,
 * including /we-need-to-talk-about-me. /amsterdam-favorites has no article.
 */
export const legacyRedirects = [
  {
    source: "/all-posts",
    destination: "/posts",
  },
  {
    source: "/10-things-melbourne",
    destination: "/posts/10-things-melbourne",
  },
  {
    source: "/beautiful-stranger",
    destination: "/posts/beautiful-stranger",
  },
  {
    source: "/best-friends",
    destination: "/posts/best-friends",
  },
  {
    source: "/california-pit-stops",
    destination: "/posts/california-pit-stops",
  },
  {
    source: "/choosing-parenthood-and-my-pregnancy-notes",
    destination: "/posts/choosing-parenthood-and-my-pregnancy-notes",
  },
  {
    source: "/everything-i-never-told-you",
    destination: "/posts/everything-i-never-told-you",
  },
  {
    source: "/fasting-keto",
    destination: "/posts/fasting-keto",
  },
  {
    source: "/favorite-things-2017",
    destination: "/posts/favorite-things-2017",
  },
  {
    source: "/favorite-things-2018",
    destination: "/posts/favorite-things-2018",
  },
  {
    source: "/favorite-things-2019",
    destination: "/posts/favorite-things-2019",
  },
  {
    source: "/favorite-things-2020",
    destination: "/posts/favorite-things-2020",
  },
  {
    source: "/favorite-things-2021",
    destination: "/posts/favorite-things-2021",
  },
  {
    source: "/favorite-things-2022",
    destination: "/posts/favorite-things-2022",
  },
  {
    source: "/found-in-nothing",
    destination: "/posts/found-in-nothing",
  },
  {
    source: "/from-war-with-love",
    destination: "/posts/from-war-with-love",
  },
  {
    source: "/goodbye-little-red-dot",
    destination: "/posts/goodbye-little-red-dot",
  },
  {
    source: "/happily-ever-after",
    destination: "/posts/happily-ever-after",
  },
  {
    source: "/hello-world",
    destination: "/posts/hello-world",
  },
  {
    source: "/kill-your-monsters",
    destination: "/posts/kill-your-monsters",
  },
  {
    source: "/korean-skin-care-routine",
    destination: "/posts/korean-skin-care-routine",
  },
  {
    source: "/leap-of-code",
    destination: "/posts/leap-of-code",
  },
  {
    source: "/like-love-exploding",
    destination: "/posts/like-love-exploding",
  },
  {
    source: "/love-in-a-time-machine",
    destination: "/posts/love-in-a-time-machine",
  },
  {
    source: "/mirha-left",
    destination: "/posts/mirha-left",
  },
  {
    source: "/poppy",
    destination: "/posts/poppy",
  },
  {
    source: "/resilience-pie",
    destination: "/posts/resilience-pie",
  },
  {
    source: "/slow-coffee",
    destination: "/posts/slow-coffee",
  },
  {
    source: "/the-fear-list",
    destination: "/posts/the-fear-list",
  },
  {
    source: "/the-knitting-club",
    destination: "/posts/the-knitting-club",
  },
  {
    source: "/the-knitting-club-season-two-creative-dream",
    destination: "/posts/the-knitting-club-season-two-creative-dream",
  },
  {
    source: "/the-making-of-slow-retreats",
    destination: "/posts/the-making-of-slow-retreats",
  },
  {
    source: "/read-100-books",
    destination: "/posts/read-100-books",
  },
  {
    source: "/the-story-of-us",
    destination: "/posts/the-story-of-us",
  },
  {
    source: "/tunes-between-friends",
    destination: "/posts/tunes-between-friends",
  },
  {
    source: "/paper-planes-packets",
    destination: "/letters",
  },
  {
    source: "/0818",
    destination: "/letters/0818",
  },
  {
    source: "/black-hole-0522",
    destination: "/letters/black-hole-0522",
  },
  {
    source: "/courage-again-091022",
    destination: "/letters/courage-again-091022",
  },
  {
    source: "/courage-for-sale-1221",
    destination: "/letters/courage-for-sale-1221",
  },
  {
    source: "/dead-time-010223",
    destination: "/letters/dead-time-010223",
  },
  {
    source: "/doing-nothing-0121",
    destination: "/letters/doing-nothing-0121",
  },
  {
    source: "/four-day-workweeks-0821",
    destination: "/letters/four-day-workweeks-0821",
  },
  {
    source: "/heal-111222",
    destination: "/letters/heal-111222",
  },
  {
    source: "/in-another-life-0721",
    destination: "/letters/in-another-life-0721",
  },
  {
    source: "/keeping-secrets-0221",
    destination: "/letters/keeping-secrets-0221",
  },
  {
    source: "/learning-optimism-0122",
    destination: "/letters/learning-optimism-0122",
  },
  {
    source: "/less-mad-0421",
    destination: "/letters/less-mad-0421",
  },
  {
    source: "/life-suspended-0422",
    destination: "/letters/life-suspended-0422",
  },
  {
    source: "/no-excuses-030423",
    destination: "/letters/no-excuses-030423",
  },
  {
    source: "/nomad-no-more-0921",
    destination: "/letters/nomad-no-more-0921",
  },
  {
    source: "/one-big-thing-0222",
    destination: "/letters/one-big-thing-0222",
  },
  {
    source: "/paper-planes-packets-0118",
    destination: "/letters/paper-planes-packets-0118",
  },
  {
    source: "/paper-planes-packets-0119",
    destination: "/letters/paper-planes-packets-0119",
  },
  {
    source: "/paper-planes-packets-0120",
    destination: "/letters/paper-planes-packets-0120",
  },
  {
    source: "/paper-planes-packets-0218",
    destination: "/letters/paper-planes-packets-0218",
  },
  {
    source: "/paper-planes-packets-0219",
    destination: "/letters/paper-planes-packets-0219",
  },
  {
    source: "/paper-planes-packets-0220",
    destination: "/letters/paper-planes-packets-0220",
  },
  {
    source: "/paper-planes-packets-0318",
    destination: "/letters/paper-planes-packets-0318",
  },
  {
    source: "/paper-planes-packets-0319",
    destination: "/letters/paper-planes-packets-0319",
  },
  {
    source: "/paper-planes-packets-0320",
    destination: "/letters/paper-planes-packets-0320",
  },
  {
    source: "/paper-planes-packets-0418",
    destination: "/letters/paper-planes-packets-0418",
  },
  {
    source: "/paper-planes-packets-0419",
    destination: "/letters/paper-planes-packets-0419",
  },
  {
    source: "/paper-planes-packets-0420",
    destination: "/letters/paper-planes-packets-0420",
  },
  {
    source: "/paper-planes-packets-0518",
    destination: "/letters/paper-planes-packets-0518",
  },
  {
    source: "/paper-planes-packets-0519",
    destination: "/letters/paper-planes-packets-0519",
  },
  {
    source: "/paper-planes-packets-0520",
    destination: "/letters/paper-planes-packets-0520",
  },
  {
    source: "/paper-planes-packets-0618",
    destination: "/letters/paper-planes-packets-0618",
  },
  {
    source: "/paper-planes-packets-0619",
    destination: "/letters/paper-planes-packets-0619",
  },
  {
    source: "/paper-planes-packets-0620",
    destination: "/letters/paper-planes-packets-0620",
  },
  {
    source: "/paper-planes-packets-0718",
    destination: "/letters/paper-planes-packets-0718",
  },
  {
    source: "/paper-planes-packets-0719",
    destination: "/letters/paper-planes-packets-0719",
  },
  {
    source: "/paper-planes-packets-0720",
    destination: "/letters/paper-planes-packets-0720",
  },
  {
    source: "/paper-planes-packets-0819",
    destination: "/letters/paper-planes-packets-0819",
  },
  {
    source: "/paper-planes-packets-0820",
    destination: "/letters/paper-planes-packets-0820",
  },
  {
    source: "/paper-planes-packets-0918",
    destination: "/letters/paper-planes-packets-0918",
  },
  {
    source: "/paper-planes-packets-0920",
    destination: "/letters/paper-planes-packets-0920",
  },
  {
    source: "/paper-planes-packets-1018",
    destination: "/letters/paper-planes-packets-1018",
  },
  {
    source: "/paper-planes-packets-1019",
    destination: "/letters/paper-planes-packets-1019",
  },
  {
    source: "/paper-planes-packets-1020",
    destination: "/letters/paper-planes-packets-1020",
  },
  {
    source: "/paper-planes-packets-1118",
    destination: "/letters/paper-planes-packets-1118",
  },
  {
    source: "/paper-planes-packets-1119",
    destination: "/letters/paper-planes-packets-1119",
  },
  {
    source: "/paper-planes-packets-1120",
    destination: "/letters/paper-planes-packets-1120",
  },
  {
    source: "/paper-planes-packets-1218",
    destination: "/letters/paper-planes-packets-1218",
  },
  {
    source: "/paper-planes-packets-1219",
    destination: "/letters/paper-planes-packets-1219",
  },
  {
    source: "/paper-planes-packets-1220",
    destination: "/letters/paper-planes-packets-1220",
  },
  {
    source: "/shifting-sands-0621",
    destination: "/letters/shifting-sands-0621",
  },
  {
    source: "/spike-it-070822",
    destination: "/letters/spike-it-070822",
  },
  {
    source: "/stop-thinking-you-are-special-0322",
    destination: "/letters/stop-thinking-you-are-special-0322",
  },
  {
    source: "/stress-1021",
    destination: "/letters/stress-1021",
  },
  {
    source: "/surprise-0622",
    destination: "/letters/surprise-0622",
  },
  {
    source: "/turning-insult-into-strength-1121",
    destination: "/letters/turning-insult-into-strength-1121",
  },
  {
    source: "/we-need-to-talk-0521",
    destination: "/letters/we-need-to-talk-0521",
  },
  {
    source:
      "/pages/letters/life-escaping-life-091023/parents-dylan-g-walking-beach-sunset.jpg",
    destination:
      "/letters/life-escaping-life-091023/parents-dylan-g-walking-beach-sunset.jpg",
  },
  {
    source: "/pages/trade_expert.png",
    destination: "/posts/read-100-books/trade_expert.png",
  },
  {
    source:
      "/pages/posts/10-things-melbourne/2017_08_Melbourne_Sydney_iphone_276A_web.jpg",
    destination:
      "/posts/10-things-melbourne/2017_08_Melbourne_Sydney_iphone_276A_web.jpg",
  },
  {
    source: "/pages/posts/beautiful-stranger/lv_woman_canggu_after_mm.jpg",
    destination: "/posts/beautiful-stranger/lv_woman_canggu_after_mm.jpg",
  },
  {
    source: "/pages/posts/beautiful-stranger/lv_woman_canggu_before_mm.jpg",
    destination: "/posts/beautiful-stranger/lv_woman_canggu_before_mm.jpg",
  },
  {
    source: "/pages/posts/california-pit-stops/point_dume_malibu_mm60_c2.jpg",
    destination: "/posts/california-pit-stops/point_dume_malibu_mm60_c2.jpg",
  },
  {
    source: "/pages/posts/found-in-nothing/yanaka_ginza.jpg",
    destination: "/posts/found-in-nothing/yanaka_ginza.jpg",
  },
  {
    source: "/pages/posts/kill-your-monsters/firefly_1.png",
    destination: "/posts/kill-your-monsters/firefly_1.png",
  },
  {
    source: "/pages/posts/like-love-exploding/we_dance_jarom_vogel.jpg",
    destination: "/posts/like-love-exploding/we_dance_jarom_vogel.jpg",
  },
  {
    source: "/pages/posts/poppy/poppy_tiffany_lovage.jpg",
    destination: "/posts/poppy/poppy_tiffany_lovage.jpg",
  },
  {
    source:
      "/pages/posts/resilience-pie/mirha_masala_resilience_pie_chart_8.png",
    destination:
      "/posts/resilience-pie/mirha_masala_resilience_pie_chart_8.png",
  },
  {
    source: "/pages/posts/slow-coffee/five_oars_g_q90.jpg",
    destination: "/posts/slow-coffee/five_oars_g_q90.jpg",
  },
  {
    source: "/pages/posts/the-fear-list/tmf_challenge_photo_sheet-1.jpg",
    destination: "/posts/the-fear-list/tmf_challenge_photo_sheet-1.jpg",
  },
  {
    source: "/pages/posts/the-knitting-club/4_the_habit_list_draw.jpg",
    destination: "/posts/the-knitting-club/4_the_habit_list_draw.jpg",
  },
  {
    source: "/pages/posts/the-knitting-club/6_artist_date_50_things_i_love.jpg",
    destination: "/posts/the-knitting-club/6_artist_date_50_things_i_love.jpg",
  },
  {
    source:
      "/pages/posts/the-knitting-club/6_artist_date_collage_your_creative_dream.jpg",
    destination:
      "/posts/the-knitting-club/6_artist_date_collage_your_creative_dream.jpg",
  },
  {
    source:
      "/pages/posts/the-knitting-club/6_artist_date_write_a_letter_from_you_at_eighty.jpg",
    destination:
      "/posts/the-knitting-club/6_artist_date_write_a_letter_from_you_at_eighty.jpg",
  },
  {
    source: "/pages/posts/the-knitting-club/congee_1@0.5x.jpg",
    destination: "/posts/the-knitting-club/congee_1@0.5x.jpg",
  },
  {
    source: "/pages/posts/the-knitting-club/congee_2.jpg",
    destination: "/posts/the-knitting-club/congee_2.jpg",
  },
  {
    source:
      "/pages/posts/the-knitting-club/devons_wait_but_why_career_path_worksheets_.pdf",
    destination:
      "/posts/the-knitting-club/devons_wait_but_why_career_path_worksheets_.pdf",
  },
  {
    source: "/pages/posts/the-knitting-club/gnocchi_1.jpg",
    destination: "/posts/the-knitting-club/gnocchi_1.jpg",
  },
  {
    source: "/pages/posts/the-knitting-club/gnocchi_2@0.5x.jpg",
    destination: "/posts/the-knitting-club/gnocchi_2@0.5x.jpg",
  },
  {
    source: "/pages/posts/the-knitting-club/ustipci@0.5x.jpg",
    destination: "/posts/the-knitting-club/ustipci@0.5x.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_cooking.jpg",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_cooking.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_dinner_conversations.jpg",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_dinner_conversations.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_ericeira.jpg",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_ericeira.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_flower_workshop.jpg",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_flower_workshop.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_foz_de_lizandro.jpg",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_foz_de_lizandro.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_sao_lourenco.jpg",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_sao_lourenco.jpg",
  },
  {
    source:
      "/pages/posts/the-making-of-slow-retreats/slow_retreats_reset_screencapture_website-1.png",
    destination:
      "/posts/the-making-of-slow-retreats/slow_retreats_reset_screencapture_website-1.png",
  },
  {
    source: "/pages/posts/the-story-of-us/gm_seoul_1.jpg",
    destination: "/posts/the-story-of-us/gm_seoul_1.jpg",
  },
  {
    source: "/pages/posts/the-story-of-us/gm_wedding_day-scaled.jpg",
    destination: "/posts/the-story-of-us/gm_wedding_day-scaled.jpg",
  },
] as const;
