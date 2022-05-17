let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

export const fullDate = `${day}/${month}/${year}`;
