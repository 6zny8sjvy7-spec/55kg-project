/* Shared pure matching and arithmetic. No data or storage access. */
(function(root){'use strict';
const aliases=[['三文魚','鮭魚'],['酸奶','優格'],['西蘭花','青花菜'],['豆浆','豆漿'],['鸡','雞'],['鱼','魚'],['饭','飯'],['面条','麵條'],['饺','餃'],['韩','韓'],['汤','湯']];
function normalize(s){s=String(s||'').toLowerCase().normalize('NFKC');for(const [a,b] of aliases)s=s.split(a).join(b);return s.replace(/[^a-z0-9\u3400-\u9fff]/g,'');}
function tokens(q){const out=[];for(const block of String(q).toLowerCase().normalize('NFKC').match(/[\u3400-\u9fff]+|[a-z0-9]+/g)||[]){if(/[\u3400-\u9fff]/.test(block)){const b=normalize(block);out.push(b.slice(0,2));if(b.length>2)out.push(b.slice(-2));}else out.push(block);}return [...new Set(out)].slice(0,8);}
function bucket(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h%64;}
function intersect(lists){if(!lists.length)return [];lists.sort((a,b)=>a.length-b.length);let a=lists[0];for(const b of lists.slice(1)){const set=new Set(b);a=a.filter(v=>set.has(v));}return a;}
function rank(row,q){if(!q)return 100;const n=normalize(q),name=normalize(row[6]),all=normalize(row[1]+' '+row[2]);if(name===n)return 0;if(name.startsWith(n))return 1;if(name.includes(n))return 2;if(all.includes(n))return 3;const words=String(q).toLowerCase().normalize('NFKC').match(/[\u3400-\u9fff]+|[a-z0-9]+/g);if(words&&words.every(x=>all.includes(normalize(x))))return 5;return null;}
function scale(record,amount,mode){const a=Number(amount);if(!Number.isFinite(a)||a<=0||a>100000)throw Error('請填寫有效份量');let factor;if(mode==='grams'){if(record.basis.kind!=='100g')throw Error('沒有可靠重量，僅能換算份數');factor=a/100;}else if(mode==='servings'){if(record.basis.kind!=='serving')throw Error('此資料以每100g記錄，請輸入克數或選資料庫重量');factor=a;}else throw Error('份量單位不明');const out={};for(const k of ['kcal','protein','fat','carbs']){const v=record.nutrition[k];out[k]=typeof v==='number'&&Number.isFinite(v)?Math.round(v*factor*10)/10:null;}return out;}
root.FoodCore={normalize,tokens,bucket,intersect,rank,scale};if(typeof module==='object')module.exports=root.FoodCore;
})(typeof self==='object'?self:globalThis);
