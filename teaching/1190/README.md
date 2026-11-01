# MATH 1190 Exam 3 Practice Center

A static GitHub Pages practice website built around the uploaded MATH 1190 Exam 3 study guide (Sections 3.9–4.6).

## Publish

Create a folder such as `teaching/math1190/exam3/` in your GitHub Pages repository. Upload `index.html`, `style.css`, and `app.js` into that folder, then visit `https://YOUR-DOMAIN/teaching/math1190/exam3/`.

No server, student accounts, or paid API is needed. An internet connection is required to load MathJax, MathLive, and CortexJS Compute Engine from CDNs.

## Included

Eight study-guide topic families, randomized practice, graph interpretation with generated SVGs, math input, feedback, hints, narrative explanations, and 70-minute suggested exam mode with deferred grading.

## Important limitations

- The uploaded LaTeX study guide refers to external image files `prob2.png`, `g2.png`, and `window.png` that were not included. Graph problems use generated, original graphs rather than those exact images.
- This is a starter practice bank reflecting the guide's learning outcomes, not a prediction of the actual exam or an exhaustive representation of every multipart question.
- Symbolic equivalence and interval parsing can be inconclusive. Inconclusive responses are marked for review. Exam mode uses plain-text entry to keep the first version simple; topic practice uses MathLive.
- Automated checks do not grade mathematical justifications or hand-drawn sketches.
- For local testing, serve with a simple HTTP server rather than opening via file:// (ES module imports may be blocked by browsers).

## Version 2 changes
- Added a Graph investigation tab with seven linked questions about the graph of f prime, including extrema, intervals, concavity and an original-function sketch.
- Exam mode includes multi-part graph investigations and MathLive math-field entry for single-answer questions.
- Each graph subpart is scored separately; full worked explanations and an example graph appear after submission.
- Interval answers are text fields; algebraic/numerical answers use MathLive.

## Version 3 — hybrid graph construction
The graph investigation now includes four vertically draggable control points defining a cubic interpolating curve. Automatic formative checks examine derivative sign, extrema locations, inflection/concavity and f(0)=0. Exam mode also includes a graph sketch scored as four properties alongside the seven written parts. The graph editor works offline after initial page load, with no server-side grading. Its graph family is intentionally restricted to cubic curves; it does not grade arbitrary hand-drawn functions.
