# MATH 1190 Exam 3 Practice Center — Version 8

Upload index.html, style.css, app.js, advanced.js, extra.js, more.js, and fixes.js to teaching/1190/ in your GitHub Pages repository.

## Navigation fixes
- Topic selection uses cards only; the old topic dropdown is hidden.
- Topic cards highlight on selection and request a new problem from the corresponding generator.
- Graph investigation lives within Topic practice; New graph investigation requests another derivative graph.
- A freehand sketch area appears for non-quadratic derivative graphs, instead of the unsupported four-handle cubic model.
- Practice exam start uses an explicit click handler with error reporting.
- The Study guide & instructions tab has been removed.
- A keyboard icon beside answer inputs attempts to load MathLive on demand. If the CDN is blocked, the text field remains usable.

This is a functional repair of v7; the question bank is retained. JavaScript syntax and ZIP integrity have been checked. Full browser interaction testing was not possible in the current environment; test on GitHub Pages before assigning to students.
