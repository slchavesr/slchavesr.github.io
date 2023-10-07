---
layout: blank
title: Find your adjusted curved value
---

<head>
    <title>Data Interpolation2</title>
    <script>
    var data = [
            { originalValue: 100, curvedValue: 100 },
            { originalValue: 90, curvedValue: 80 },
            { originalValue: 80, curvedValue: 70 },
            { originalValue: 70, curvedValue: 60 },
            { originalValue: 60, curvedValue: 50 },
            { originalValue: 0, curvedValue: 0 }
        ];
function interpolateY(y) {
            for (var i = 0; i < data.length - 1; i++) {
                if (y >= data[i].curvedValue && y <= data[i + 1].curvedValue) {
                    var x1 = data[i].originalValue;
                    var x2 = data[i + 1].originalValue;
                    var y1 = data[i].curvedValue;
                    var y2 = data[i + 1].curvedValue;
                    var x = x1 + ((x2 - x1) / (y2 - y1)) * (y - y1);
                    return x;
                }
            }
            return "Value not in range";
        }
        function findX() {
            var userInput = parseFloat(document.getElementById("userInput").value);
            var result = interpolateY(userInput);
            document.getElementById("result").innerHTML = "For y = " + userInput + ", x = " + result;
        }
    </script>
</head>
<body>
    <h1>Data Interpolation</h1>
    <p>Enter a value (y) to find the corresponding value (x) in the table:</p>
    <input type="text" id="userInput">
    <button onclick="findX()">Find X</button>
    <p id="result"></p>
</body>
