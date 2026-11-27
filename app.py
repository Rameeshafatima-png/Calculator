import ast
import math
import operator

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

BINARY_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
}

UNARY_OPERATORS = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


def evaluate_node(node):
    """Evaluate only numeric literals and approved arithmetic operations."""
    if isinstance(node, ast.Expression):
        return evaluate_node(node.body)

    if isinstance(node, ast.Constant) and type(node.value) in (int, float):
        return node.value

    if isinstance(node, ast.BinOp) and type(node.op) in BINARY_OPERATORS:
        left = evaluate_node(node.left)
        right = evaluate_node(node.right)
        result = BINARY_OPERATORS[type(node.op)](left, right)
        return check_result(result)

    if isinstance(node, ast.UnaryOp) and type(node.op) in UNARY_OPERATORS:
        result = UNARY_OPERATORS[type(node.op)](evaluate_node(node.operand))
        return check_result(result)

    raise ValueError("Unsupported expression")


def check_result(value):
    if not math.isfinite(value) or abs(value) > 1e100:
        raise ValueError("Result is out of range")
    return value


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/calculate")
def calculate():
    data = request.get_json(silent=True) or {}
    expression = data.get("expression", "")

    if not isinstance(expression, str) or not expression.strip():
        return jsonify(error="Enter a calculation."), 400

    if len(expression) > 200:
        return jsonify(error="Calculation is too long."), 400

    try:
        tree = ast.parse(expression, mode="eval")
        result = check_result(evaluate_node(tree))
        return jsonify(result=result)
    except ZeroDivisionError:
        return jsonify(error="Cannot divide by zero."), 400
    except (SyntaxError, ValueError, OverflowError):
        return jsonify(error="Invalid calculation."), 400


if __name__ == "__main__":
    app.run(debug=True)