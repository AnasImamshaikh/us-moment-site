# Work page v2 + reel library — paused (26 Oct 2026, 20:27)

Branch `wip/work-page-reels` (not merged into main; the live folder still shows the previous Work page).

## Done in this branch
- `work.html`: "Every campaign, in detail" removed; "How engagements work" replaced by
  "How a moment gets made" (4 stages: Strategy, Creative, Production, Growth + Project/Retainer line).
- Reel wall: 3 rows x 5 cards (fewer columns on smaller screens), "More work" adds 3 rows,
  "View all", "Show less"; filter chips; hover-to-play. Code: `js/work.js`, `css/work.css`.
- `js/reels-data.js`: all 78 reels/posts from the archive doc (Ritika excluded), mapped to brands.
  Posters/videos not wired yet (cards show colour placeholders).

## Downloads (Instagram Downloader Pro extension, in Chrome)
- Files land in `C:\Users\admin\Downloads\Instagram Downloader Pro\<account>\`,
  named `<account>_<date>_<mediaId>_<ownerId>.mp4`. mediaId = shortcode decoded (see download-status.py).
- 16 of 79 downloaded when paused. Each download needs ~10 s on the page before navigating away,
  otherwise it's cut off (cut-off attempts left `Unconfirmed *.crdownload` files in Downloads).
- Carousel posts use the extension's post button (`.igdl-pro-btn.post-download-button-visible`).
- `instagram-meta.log`: likes / comments / account / date captured per reel so far.

## Next
1. Finish downloads (run `download-status.py` against the folder listing to get the to-do list).
2. Copy originals to `_media/reels/<brand>/` (git-ignored), make web versions
   (`assets/reels/<code>.jpg` poster + short low-res `<code>.mp4`), regenerate `js/reels-data.js`.
3. Verify desktop / 390 / 320, then merge into main.
