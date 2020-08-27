/** 
 * Using Shunting-yard algorithm to evaluate with reverse polish notation https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 * infixToRPN code from https://www.thepolyglotdeveloper.com/2015/03/parse-with-the-shunting-yard-algorithm-using-javascript/
 * reversePolishEvaluate from https://dev.to/subinedge/evaluate-reverse-polish-notation-expressions-using-javascript-algorithms-jmb
**/

String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
}
Array.prototype.clean = function() {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === "") {
            this.splice(i, 1);
        }
    }
    return this;
}

function infixToRPN(infix) {
    var outputQueue = "";
    var operatorStack = [];
    var operators = {
        "^": {
            precedence: 4,
            associativity: "Right"
        },
        "/": {
            precedence: 3,
            associativity: "Left"
        },
        "*": {
            precedence: 3,
            associativity: "Left"
        },
        "+": {
            precedence: 2,
            associativity: "Left"
        },
        "-": {
            precedence: 2,
            associativity: "Left"
        }
    }
    infix = infix.replace(/\s+/g, "");
    infix = infix.split(/([\+\-\*\/\^\(\)])/).clean();
    for(var i = 0; i < infix.length; i++) {
        var token = infix[i];
        if(token.isNumeric()) {
            outputQueue += token + " ";
        } else if("^*/+-".indexOf(token) !== -1) {
            var o1 = token;
            var o2 = operatorStack[operatorStack.length - 1];
            while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                outputQueue += operatorStack.pop() + " ";
                o2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(o1);
        } else if(token === "(") {
            operatorStack.push(token);
        } else if(token === ")") {
            while(operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue += operatorStack.pop() + " ";
            }
            operatorStack.pop();
        }
    }
    while(operatorStack.length > 0) {
        outputQueue += operatorStack.pop() + " ";
    }
    return outputQueue;
}

function reversePolishEvaluate(newExpr) {
    let expr = newExpr.split(" ");
    let stack =[];
        if(expr === ''){
        return 0;
    }
    for(let i=0; i<expr.length; i++) {
        if(!isNaN(expr[i]) && isFinite(expr[i])) {
        stack.push(expr[i]);

        } else {
        let a = stack.pop();
        let b = stack.pop();
        if(expr[i] === "+") {
            stack.push(parseInt(a) + parseInt(b));
        } else if(expr[i] === "-") {
            stack.push(parseInt(b) - parseInt(a));
            } else if(expr[i] === "*") {
                stack.push(parseInt(a) * parseInt(b));
            } else if(expr[i] === "/") {
                stack.push(parseInt(b) / parseInt(a));
            } else if(expr[i] === "^") {
                stack.push(Math.pow(parseInt(b), parseInt(a)));
            }
        }
    }
    if(stack.length > 1) {
        return "ERROR";
    }else {
        return stack[0];
    }
}

// custom function to replace var by there value from a dict
function insertValue(dict, expression) {
    let expr = ""
    expression.split('').forEach(c => Object.keys(dict).indexOf(c) !== -1 ? expr += dict[c] : expr += c)
    return expr;
}

module.exports ={
    infixToRPN, reversePolishEvaluate, insertValue
}