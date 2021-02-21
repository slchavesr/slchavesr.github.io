---
layout: blank
title: WeBWork File Generator	
---

<script>
	function combine(){
	  document.f.theFile.value=document.f.tag.value+document.f.init.value+document.f.setup.value+document.f.theText.value+document.f.answer.value+document.f.solution.value
}
</script>
  
<head>
<style>
h1 {
  text-align: center;
}
</style>


<body>
	
<p>
This scripts helps to write a WeBWork problem by filling out the main sections that any problem must have. Just fill out the text fields, and use the buttons at the bottom of this page to merge and download the .pg file.<br>
This script does not render or check the accuracy of the code typed. For this purpose upload the file to your WeBWork server or use a local render as Rederly. This is an updated version of the tool created at <a href="https://www.mathorama.com/">https://www.mathorama.com/</a>.
</p>

<form name="f">
<h2>1. Description </h2>
<table>
<tbody><tr>
<td>

<textarea rows="10" cols="45" style="font-family:Courier" name="tag"># DESCRIPTION
# A simple sample problem that asks students
# to evaluate a quadratic function
# in a given real number
# ENDDESCRIPTION

## DBsubject('')
## DBchapter('')
## DBsection('')
## KEYWORDS('')
## TitleText1('')
## EditionText1('')
## AuthorText1('')
## Section1('')
## Problem1('')
## Author('')
## Institution('')
</textarea></td>

<td valign="top"> Enter the description and meta information of the problem. This section is optional but it is commonly used to tag and distribute WeBWork problems.
</td>
</tr></tbody></table>


<h2>2. Initialization</h2>
<table>
<tbody><tr>
<td>

<textarea rows="10" cols="45" style="font-family:Courier" name="init">DOCUMENT();
loadMacros(
"PGstandard.pl",
"MathObjects.pl",
"PGML.pl",
);
</textarea></td>
<td valign="top">This is the initialization section of the problem. The first executed line of the problem must be the <tt>DOCUMENT();</tt> command. Recall that every command must end with a semicolon.
The loadMacros command loads the Macros needed for the problem. </td>
</tr></tbody></table>

<h2>3. Problem Set Up</h2>

<table>
<tbody><tr>
<td valign="top">

<textarea rows="10" cols="45" style="font-family:Courier" name="setup">$showPartialCorrectAnswers = 1;
Context("Numeric");
$a = random(2,5);
$b = non_zero_random(-4,4);
$c = random(1,10);
	
$x = random(-5,5);
$f = Formula("$a*x**2+ $b*x + $c")->reduce;

$answer = $f->eval(x=>$x);


</textarea></td>
<td valign="top">Set up the problem context, the variables and the answer using PERL syntax. The variable <tt>$showPartialCorrectAnswers = 1;</tt> set to 1 means that feedback as to which sub-questions have been correctly answered in the problem will be given, otherwise (set to 0) the feedback just indicates that there is a wrong answer somewhere.
</td>
</tr></tbody></table>




<h2>4. Display Text</h2>
<table>
<tbody><tr>
<td valign="top">

<textarea rows="10" cols="45" style="font-family:Courier" name="theText">TEXT(beginproblem());
Context()-&gt;texStrings;
BEGIN_PGML
Evaluate the function [`f=[$f]`] at the point [`x=[$x]`].
	
Answer:[_]{$answer}
END_PGML
</textarea></td>
<td valign="top">The TEXT(beginproblem()); line displays a header for 
the problem, and the Context()-&gt;texStrings line sets how formulas are
 displayed in the text, and we reset this after the text section. 
Everything between the BEGIN_PGML and END_PGML lines (each of which must
 appear alone on a line) is shown to the student.
	Mathematical equations are delimited by <tt>[` `]</tt> (for inline equations) or 
	<tt> [``  ``] </tt> (for displayed equations); the text is 
assumed to be TeX code. The value of a perl variable <tt>$x</tt> is displayed by
	<tt>[$x]</tt>.
The line <tt>[_]{$answer}</tt> displays an answer box for studens, and it is compared with the PERL variable <tt>$answer</tt>.
	</td>
</tr></tbody></table>

<h2>5. Answers or Hints</h2>
<table>
<tbody><tr>
<td valign="top">

<textarea rows="5" cols="45" style="font-family:Courier" name="answer">

</textarea></td>
<td valign="top">
Use this field to use other answers evaluators (e.g. weighted) or include hints to students. This is for techniques a bit more advanced.
</td>
</tr></tbody></table>


<h2>6. Solution</h2>
<table>
<tbody><tr>
<td valign="top">

<textarea rows="10" cols="45" style="font-family:Courier" name="solution">
BEGIN_PGML_SOLUTION
Compute [`[$a]([$x]^2 + ([$b][$x]) + ([$c]) = [$answer] `].
END_PGML_SOLUTION

ENDDOCUMENT();

</textarea></td>
<td valign="top">The <tt> PGML_SOLUTION </tt> block displays instructor's solution for the problem after a due date set in the WeBWork homework. This block is optional and it is used when more than just the correct answer wants to be shown to students. 
	The <tt>ENDDOCUMENT();</tt> line must be the last command in the file.
</td>
</tr></tbody></table>


<h2>The .pg file</h2>

<table><tbody>
	<tr> 
		<td> Merge all the sections into a single file. </td>
		<td> <input type="button" value="Merge" onclick="combine()"> </td>
	</tr>
	<tr> 
		<td> Reset all section fields </td>
		<td> <input type="reset" value="Reset"> </td>
	</tr>
	<tr> 
		<td> Show the merged problem: </td>
		<td> <input type="button" value="Show/Hide" onclick="myFunction()"> </td>
	</tr>
	</tbody>
</table>
<br><br>



<div id="myDIV" style="display: none;">
<textarea rows="45" cols="60" style="font-family:Courier" name="theFile" id="source"></textarea>
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
