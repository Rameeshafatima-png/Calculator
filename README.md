# Professional Flask Calculator

A modern, responsive calculator built with Python, Flask, HTML, CSS, and JavaScript. It supports arithmetic operations, parentheses, keyboard input, calculation history, and safe server-side expression evaluation.

## Features

- Addition, subtraction, multiplication, and division
- Parentheses and unary minus support
- Sign toggle and delete/clear controls
- Keyboard input
- Calculation history with the latest five results
- Responsive desktop and mobile design
- Server-side parsing that rejects unsafe expressions
- Clear division-by-zero and input error handling

## Project Structure

```text
calculator/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── app.js
Requirements
Python 3.10 or newer
pip
Flask
Installation
1. Clone the repository
bash
git clone https://github.com/Rameeshafatima-png/Calculator.git
cd Calculator
2. Create a virtual environment
Windows

PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
Linux/macOS

bash
python3 -m venv .venv
source .venv/bin/activate
3. Install dependencies
bash
pip install -r requirements.txt
4. Run the application
bash
python app.py
Open http://127.0.0.1:5000 in a browser.

Keyboard Controls
Key	Action
0–9	Enter numbers
+ - * /	Enter operators
( )	Enter parentheses
.	Enter decimal point
Enter or =	Calculate
Backspace	Delete the last character
Escape	Clear the calculator
Security
Calculations are processed by the Flask backend using Python's abstract syntax tree. Only numeric literals, parentheses, unary signs, addition, subtraction, multiplication, and division are accepted. Arbitrary Python code execution is not permitted.

License
This project is available for educational and personal use.
