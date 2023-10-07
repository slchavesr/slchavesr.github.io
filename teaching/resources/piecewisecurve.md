---
layout: blank
title: Find your adjusted curved value
---
    <script>
        // Initialize an empty data array
        var data = [];

        // Function to add a new row to the table
        function addRow() {
            var originalValue = parseFloat(document.getElementById("originalValue").value);
            var curvedValue = parseFloat(document.getElementById("curvedValue").value);

            if (!isNaN(originalValue) && !isNaN(curvedValue)) {
                data.push({ originalValue: originalValue, curvedValue: curvedValue });
                updateTable();
                document.getElementById("originalValue").value = "";
                document.getElementById("curvedValue").value = "";
            }
        }

        // Function to update the table
        function updateTable() {
            var tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";

            for (var i = 0; i < data.length; i++) {
                var row = tableBody.insertRow(i);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                cell1.innerHTML = data[i].originalValue;
                cell2.innerHTML = data[i].curvedValue;
            }
        }

        // Function to interpolate x for a given y
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
    </script>
    
This script helps you find your adjusted score to the curve given by your prof if they are using a piecewise linear adjustment. 

Usually, courses follow the standard cut offs to estimate letter grade out of a score of 100

- If a grade is greater or equal than 90, the grade is a minimum of A-
- If a grade is greater or equal than 80, the grade is a minimum of B-
- If a grade is greater or equal than 70, the grade is a minimum of C-
- If a grade is greater or equal than 60, the grade is a minimum of D-

A grade lower than 60 is a failing grade.




</head>
<body>
    <h1>Data Interpolation</h1>
    <p>Enter values for data points:</p>
    
    <div>
        <label for="A-original">Category A Original Value:</label>
        <input type="text" id="A-original">
        <label for="A-curved">Category A Curved Value:</label>
        <input type="text" id="A-curved">
        <button onclick="updateDataPoint('A')">Update</button>
    </div>

    <div>
        <label for="B-original">Category B Original Value:</label>
        <input type="text" id="B-original">
        <label for="B-curved">Category B Curved Value:</label>
        <input type="text" id="B-curved">
        <button onclick="updateDataPoint('B')">Update</button>
    </div>

    <!-- Add similar input fields for other categories (C and D) if needed -->

    <p>Enter a value (y) to find the corresponding value (x):</p>
    <input type="text" id="userInput">
    <button onclick="findX()">Find X</button>
    <p id="result"></p>
</body>
</html>
