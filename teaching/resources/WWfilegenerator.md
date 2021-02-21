---
layout: blank
title: WeBWork File Generator
use-site-title: true	
---

<script>
	function combine(){
	  document.f.theFile.value=document.f.tag.value+document.f.init.value+document.f.setup.value+document.f.theText.value+document.f.answer.value
}
</script>
  
<body>
<h1>Webwork Problem Generator1</h1>
<form name="f">
<h2>1. Tagging</h2>
<table>
<tbody><tr>
<td>

<textarea rows="19" cols="50" style="font-family:Courier" name="tag"># DESCRIPTION
# A simple sample problem that asks students to 
# find the sine of a angle associated with a 
# special right triangle's angle.
# ENDDESCRIPTION

## DBsubject('Trig/Precalculus')
## DBchapter('Chapter ')
## DBsection('Section ')
## KEYWORDS('algebra')
## TitleText1('')
## EditionText1('')
## AuthorText1('')
## Section1('')
## Problem1('')
## Author('Chris Thiel')
## Institution('SFHS')
</textarea></td>
<td valign="top"> There is an on-line list of <a href="http://hobbes.la.asu.edu/Holt/chaps-and-secs.html">current chapter and section names</a> and a similar <a href="http://hobbes.la.asu.edu/Holt/keywords.html">list of keywords</a>. The list of keywords should be comma separated and quoted (e.g., <tt>KEYWORDS('calculus','derivatives'))</tt>.</td>
</tr></tbody></table>


<h2>2. Init</h2>
<table>
<tbody><tr>
<td>

<textarea rows="7" cols="50" style="font-family:Courier" name="init">DOCUMENT();
loadMacros(
"PGstandard.pl",
"MathObjects.pl",
"parserFunction.pl",
);
</textarea></td>
<td valign="top">This is the initialization section of the problem. The first executed line of the problem must be the <tt>DOCUMENT();</tt> command. Note that every command must end with a semicolon.
The loadMacros command loads information that works behind the scenes. </td>
</tr></tbody></table>

<h2>3. Set Up</h2>
<table>
<tbody><tr>
<td>

<textarea rows="10" cols="50" style="font-family:Courier" name="setup"># make sure we're in the context we want
Context("Numeric");

$a = random(2,9,1);  #low, high, step, 
# or non_zero_random(low,high,increment);
$x = list_random(30, 45, 60);
$result = Compute("sin($x*pi/180)+$a");

</textarea></td>
<td valign="top">Contexts and context explanations are given on <a href="http://webwork.maa.org/wiki/ContextList">this help page</a>
<br> All scalar variables are prefaced with a dollar sign: thus $a is a 
variable that has a (non-vector, non-array) value. We also define 
$trigFunc to be a <a href="http://webwork.maa.org/wiki/MathObjectsOverview">MathObject</a></td>
</tr></tbody></table>

<h2>4. Text</h2>
<table>
<tbody><tr>
<td valign="top">

<textarea rows="15" cols="50" style="font-family:Courier" name="theText">TEXT(beginproblem());
Context()-&gt;texStrings;
BEGIN_TEXT
Find  \(f(x) = \sin(x^{\circ})+$a\), where \(x=$x^{\circ}\)
$PAR
\(f(x) = \sin(x^{\circ})+$a = \) \{ ans_rule(20) \}
END_TEXT
$showHint=2;
BEGIN_TEXT
$PAR
If you don't get this in $showHint tries, you can get a hint.
END_TEXT

# old way: HINT(EV3(&lt;&lt;'END_HINT'));
BEGIN_HINT
If you know the \(\sin($x^{\circ})\), you can use
either \(\tt{sqrt(~~)}\) or $CARET(1/2). 
Alternatively, you can use \(\tt{sin(~~)}\) if you
convert \($x^{\circ}\) into radians, typing pi for \(\pi\).   
END_HINT
Context()-&gt;normalStrings;
</textarea></td>
<td valign="top">The TEXT(beginproblem()); line displays a header for 
the problem, and the Context()-&gt;texStrings line sets how formulas are
 displayed in the text, and we reset this after the text section. 
Everything between the BEGIN_TEXT and END_TEXT lines (each of which must
 appear alone on a line) is shown to the student.
Mathematical equations are delimited by \( \) (for inline equations) or 
\[ \] (for displayed equations); in these contexts inserted text is 
assumed to be TeX code.
There are a number of variables that set formatting: $PAR is a paragraph
 break (like \par in TeX). This page gives a list of variables like 
this. Finally, \{ \} sets off code that will be executed in the problem 
text. Here, ans_rule(20) is a function that inserts an answer blank 20 
characters wide.</td>
</tr></tbody></table>
<h2>5. Answer</h2>
<table>
<tbody><tr>
<td valign="top">

<textarea rows="16" cols="50" style="font-family:Courier" name="answer">ANS( $result-&gt;cmp() );

Context()-&gt;texStrings;

#old way: SOLUTION(EV3P(&lt;&lt;'END_SOLUTION'));
BEGIN_SOLUTION
$PAR SOLUTION $PAR
We use the special right triangle associated 
with \($x^{\circ}\), and compute the sine by dividing opposite 
over hypotenuse to compute \(\sin(x)\).   
$PAR 
Finally, we add $a.
END_SOLUTION

Context()-&gt;normalStrings;

ENDDOCUMENT();

</textarea></td>
<td valign="top">The problem answer is set by the <tt>ANS( $trigDeriv-&gt;cmp() );</tt>
 line, which simply says that the answer is marked by comparing the 
student's answer with the trigonometric function derivative that we 
defined before.<p>
Then, we explain the solution to the student. This solution will show up
 when the student clicks the "show solution" checkbox after they've 
finished the problem set.
The ENDDOCUMENT(); command is the last command in the file.&gt;</p></td>
</tr></tbody></table>


<h2>The .pg file</h2>



<input type="reset" value="Reset"><br>
<input type="button" value="Combine Problem" onclick="combine()"><br>


<div id="my" style="display: none;">
<table><tbody><tr>
<td><textarea rows="45" cols="60" style="font-family:Courier" name="theFile" id="source"></textarea></td>
<td valign="top">
There is an extra line used for testing with the <a href="http://hosted2.webwork.rochester.edu/webwork2/wikiExamples/MathObjectsLabs2/2/?login_practice_user=true">Interactive Problem Lab</a>
<p>
<tt>
checkAnswer($result, "1.0");
</tt></p><p>
the first argument is a MathObject, the second the student's answer string
</p><p>
More info on <a href="http://webwork.maa.org/wiki/PGLabs#.UA974Wj9fM8">testing PGLabs here</a>
</p><p>
Alternatively, you can try <a href="https://sites.google.com/site/wpiwebworkguitutorial/home">WPI's WbWrkGUI</a> where you make questions with a free java application you can download, and get video tutorials.
</p></td></tr></tbody></table>
</div>


</form>


<form>
  <label for="fname">Filename (no extension): </label>
  <input type="text" id="fname" name="fname"><br><br>
</form>


  <script type="text/javascript">
        // when document is ready
        document.getElementById("save").onclick = function() {
            // when clicked the button
            var content = document.getElementById('source').value;
            // a [save as] dialog will be shown
            window.open("data:application/txt," + encodeURIComponent(content), "_self");
        }
    </script>
   <script>
    function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

   if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}



</script>
    <input type="button" value="Save and Download" onclick="download(document.getElementById('fname').value+'.pg', document.getElementById('source').value)"><br>

<p>Click the "Try it" button to toggle between hiding and showing the DIV element:</p>

<button onclick="myFunction()">Try it</button>

<div id="myDIV" style="display: none;">
This is my DIV element.
</div>

<p><b>Note:</b> The element will not take up any space when the display property set to "none".</p>

<script>
function myFunction() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
</script>

</body>
