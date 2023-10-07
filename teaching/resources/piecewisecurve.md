---
layout: blank
title: Find your adjusted curved value
---


<html>
<head>
    <title>Data Interpolation</title>
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
</head>
<body>
    <h1>Data Interpolation</h1>
    <p>Enter values for the table:</p>
    Original Value: <input type="text" id="originalValue">
    Curved Value: <input type="text" id="curvedValue">
    <button onclick="addRow()">Add Row</button>

    <table border="1">
        <thead>
            <tr>
                <th>Original Value</th>
                <th>Curved Value</th>
            </tr>
        </thead>
        <tbody id="tableBody">
            <!-- Table rows will be added here dynamically -->
        </tbody>
    </table>

    <p>Enter a value (y) to find the corresponding value (x) in the table:</p>
    <input type="text" id="userInput">
    <button onclick="findX()">Find X</button>
    <p id="result"></p>
</body>
</html>
