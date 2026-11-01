# MATH 1001 Practice Center — Version 4

Deploy all five site files (`index.html`, `style.css`, `script.js`, `formulas.html`, `exam.html`, `exam.js`) into the existing `teaching/math1001/` directory on your GitHub Pages site.

- Topic practice has guided four-step explanations in Show Solution.
- `exam.html` creates a single-page randomized 15-question practice exam, drawn from the existing practice bank, with 30+ numeric answer fields.
- Before submission, there is no hint, answer, or feedback in the exam UI. After submission, each field is marked correct or incorrect, and incorrect fields show the correct value.
- Every answer field counts equally (1 point), not every question. Blank answers count as wrong. No results are saved to a server.
- Students can open the formula reference page while taking the practice exam.
- This is self-assessment, not a secure assessment; all answers are in client-side JavaScript.
- The exam structure is based on the existing topic bank and is not a verbatim copy of the instructor's exam.


## Version 5: LaTeX mathematics
MathJax renders formulas on all three HTML pages. The formula reference uses display-style LaTeX, and topic solutions include a typeset formula followed by the numerical working. Dynamic math is re-typeset when solutions are opened or questions regenerated. MathJax is loaded from a CDN, so rendering requires an internet connection.


## Version 6 changes
- Worked explanations now read as connected paragraphs, with formulas and contextual interpretations.
- Dimensional-analysis exercises display MathJax unit fractions with explicit cancellation. Requires the MathJax cancel package and internet access.
- Practice exam follows the progression of the supplied October 20, 2026 MATH 1001 Exam 3: unit conversions, percentage changes, budgeting, interest, financing, amortization, student loans, and mortgages. It has 20 randomized prompts and suggests 70 minutes.
- The practice exam remains an automatically scored approximation: it cannot assess drawn diagrams, pie-chart sketches, or written justifications as a paper exam does.
