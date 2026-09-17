import{lesson}from'../content/lesson';export const getNextActivity=(i:number)=>lesson[i]??null;export const progress=(i:number)=>Math.round((i/lesson.length)*100);
