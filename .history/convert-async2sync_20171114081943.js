function somethingSync(args){
    var ret; //the result-holding variable
    //doing something async here...
    somethingAsync(args,function(result){
        ret = result;
    });
    while(ret === undefined){} //wait for the result until it's available, cause the blocking
    return ret;
}