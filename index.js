const student = {
  name: "Donald",
  course: "CSC 400",
};

const { name, course } = student;

console.log(name, course);

let count = 100;

const interval = setInterval(() => {
  if (count <= 0) {
    return (count = 0);
  }
  return count--;
}, 2000);

clearInterval(interval);
setTimeout(() => {}, 2000);

const array = [1, 23, 3, 3, 34, 4, 4, 43, 5, 53, 5, 5, 545, 55];

const newArray = array.map((item, index) => {
  const newItem = item + index
  return newItem
});

console.log(newArray)