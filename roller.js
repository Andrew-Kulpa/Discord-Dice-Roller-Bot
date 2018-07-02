const math = require('mathjs')

module.exports = {
    eval_roll: function (roll_string) {
        try {
            const node = math.parse(roll_string);
            const transformed = node.transform(function (node, path, parent) {
                var roll_info = rollInfo(node);
                if (node.isOperatorNode && node.op === '*' && roll_info[0] != null && roll_info[1] != null) {
                    return new math.expression.node.ConstantNode(d(roll_info[0], roll_info[1]));
                }
                else {
                    return node;
                }
            });
            var message = transformed.toString();
            var message = message + "\n" + math.eval(transformed.toString());
        } catch {
            var message = "Error with roll argument string '" + roll_string + "'.";
        }
        return message;
    }
};
function rollInfo(node) {
    var lhs = null;
    var rhs = null;
    var regex = /[dw]\d+/;
    node.traverse(function (node, path, parent) {
        switch (node.type) {
            case 'ConstantNode':
                lhs = node.value;
                break;
            case 'SymbolNode':
                rhs = node.name.match(regex)[0].substring(1);
                op = node.name[0];
                break;
        }
    })
    return [lhs, rhs, op];
};
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
};
function d(num_rolls, max) {
    var roll_total = 0;
    for (i = 0; i < num_rolls; i++) {
        roll_total += random(1, max);
    }
    return roll_total;
};