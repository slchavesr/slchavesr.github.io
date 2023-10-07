function combine(){
	document.f.theFile.value=document.f.tag.value+document.f.init.value+document.f.setup.value+document.f.theText.value+document.f.answer.value
	}

        function interpolateY(y) {
            for (var i = 0; i < data.length - 1; i++) {
                if (y >= data[i].curvedValue && y <= data[i + 1].curvedValue) {
                    var x1 = data[i].originalValue;
                    var x2 = data[i + 1].originalValue;
                    var y1 = data[i].curvedValue;
                    var y2 = data[i + 1].curvedValue;

                    // Linear interpolation formula
                    var x = x1 + ((x2 - x1) / (y2 - y1)) * (y - y1);
                    return x;
                }
            }
            return "Value not in range";
        }

        // Function to handle user input and display the result
        function findX() {
            var userInput = parseFloat(document.getElementById("userInput").value);
            var result = interpolateY(userInput);
            document.getElementById("result").innerHTML = "For y = " + userInput + ", x = " + result;
        }
