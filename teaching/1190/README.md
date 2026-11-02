MATH 1190 Exam 3 Practice Center — Version 13

Based on the Version 9 visual layout. Replace all website files together in teaching/1190/.

Changes:
- One interactive graphing component for practice sketch-from-formula, derivative graph investigation, and both exam sketches. Freehand strokes, seven tool choices (curve, pan, ordinary/open/closed/extremum/inflection point), zoom, pan, undo, reset and clear. Axes start at the canvas center and the background grid is offset half a grid cell.
- Show Solution includes a plotted reference graph for formula sketches and derivative investigations; solutions PDF includes the same reference function plot.
- Exam fixed at ten questions, one per topic, with answer fields and dropdowns reflecting each question's actual subparts. Automatic scoring reports total assessed items, percentage, unanswered entries and per-topic results.
- Graph grading is approximate and formative. It compares sampled freehand strokes with the reference function where one exists; do not interpret it as proof that all calculus features are correct. Sketches without a usable reference are marked for manual review, not automatically correct.
- Equation-editor buttons for multi-part fields no longer create an extra input. Keyboard buttons switch to a math-field in place when MathLive is available.
- Simple standalone trig functions and parabolas excluded from formula sketch generator.
- PDF generation still requires third-party jsPDF, html2canvas, and KaTeX to load online. PDF rendering has not been tested end-to-end in this environment.

Tested: JavaScript syntax; local Chromium (with external libraries blocked) generated ten questions, two interactive graph editors and a scored summary; practice graph editors loaded without page errors. The PDF itself has not been visually validated.
