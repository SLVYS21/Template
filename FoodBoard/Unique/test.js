const list = [{a: 1, b: 3}, {a: 0, b: 5}, {a: 4, b: 7}];
console.log(list);

let s = 0;
list.map(it => {
    s += it.a
});
console.log(s);

const damn = []

if (!damn[0])
    console.log("Not damn")