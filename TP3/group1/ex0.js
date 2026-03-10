function spy(calledFunction) {
  function wrapped(...args) {
    wrapped.memorizedArgs.push(args);
    return calledFunction(...args);
  }

  wrapped.memorizedArgs = [];
  return wrapped;
}


const adderDecorated = spy((a, b) => a + b);

console.log(adderDecorated(2, 3));
console.log(adderDecorated(3, 4));

console.log(adderDecorated.memorizedArgs)