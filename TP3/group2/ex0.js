function spy(calledFunction) {
    function wrapped(...args) {
        wrapped.memorizedArgs.push(args);
        return calledFunction(...args);
    }

    wrapped.memorizedArgs = [];
    return wrapped;
}

const adder_decorated = spy((a, b) => a + b);
const minus_decorated = spy((a, b) => a - b);

console.log(adder_decorated(2, 3));
console.log(adder_decorated(3, 4));

