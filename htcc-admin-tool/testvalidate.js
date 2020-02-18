const pattern =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
console.log(pattern.test("abcA12345677"));
console.log("abc");