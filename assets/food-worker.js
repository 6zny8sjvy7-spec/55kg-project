importScripts('food-core.js');
onmessage=function(e){const {id,lists}=e.data;try{postMessage({id,ids:FoodCore.intersect(lists)});}catch(error){postMessage({id,error:error.message});}};
