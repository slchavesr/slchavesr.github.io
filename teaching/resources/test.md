<html>

<head>
    <title>Fake download via datauri</title>
</head>

<body>

<p>Enter the filename (no extension).</p>

<form>
  <label for="fname">Filename: </label>
  <input type="text" id="fname" name="fname"><br><br>
</form>




    <textarea cols="50" rows="10" id="source">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</textarea>
    <br>
    <button type="button" id="save" title="Save as text file">Save</button>

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
    <input type="button" value="Combine into a .pg file below" onclick="download(document.getElementById('fname').value+'.pg', document.getElementById('source').value)"><br>
    
    
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

</html>
