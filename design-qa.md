source visual truth path:
- codex_requirements/字母变身局_CodeX开发包_v1.0/01_视觉参考/01_首页_每日任务.png
- codex_requirements/字母变身局_CodeX开发包_v1.0/01_视觉参考/02_听声音找身份.png
- codex_requirements/字母变身局_CodeX开发包_v1.0/01_视觉参考/03_拼音小火车.png
- codex_requirements/字母变身局_CodeX开发包_v1.0/01_视觉参考/04_声调过山车.png
- codex_requirements/字母变身局_CodeX开发包_v1.0/01_视觉参考/05_家长报告.png

implementation screenshot path:
- Computer Use state capture for Chrome window "字母变身局" at http://localhost:5173/
- attempted file capture: visual-qa-home-screen.png, but macOS front-window capture was unreliable and caught another Chrome tab.

viewport:
- Chrome desktop window with app constrained to a centered mobile-width layout.

state:
- Home screen after onboarding skip.

full-view comparison evidence:
- Source home reference uses a warm cream phone canvas, candy-style product title, child profile pill, two illustrated world panels, three illustrated task cards, large green start button, and bottom navigation.
- Implementation now uses the same major structure: centered cream app canvas, candy-style title, profile pill, two image-backed world panels, three image-backed task cards, large start button, and bottom navigation.

focused region comparison evidence:
- World cards: fixed after first QA pass. Initial implementation cropped the design-board color palette; current implementation uses the home visual reference and crops the English/pinyin world panels.
- Product title: fixed after first QA pass. Initial implementation wrapped the logo text; current implementation keeps the title on one line.
- Task cards: implementation uses the supplied game reference images as card backgrounds with real HTML task text and buttons.

findings:
- No remaining P0/P1/P2 issues in the inspected home screen.

patches made since previous QA pass:
- Added visual reference assets under public/visual-refs.
- Reworked homepage to a single mobile-app column.
- Added candy-style logo, profile pill, illustrated world cards, illustrated task cards, and larger start CTA.
- Added game-page and report-page image-backed stage treatment.
- Fixed title wrapping.
- Fixed world-card image crop/source.
- Compressed public image copies to keep PWA build under Workbox limits.

follow-up polish:
- P3: replace screenshot-derived temporary visual crops with independent character/background assets before production.
- P3: tune game-page crops per viewport after iPhone Safari testing.

final result: passed
