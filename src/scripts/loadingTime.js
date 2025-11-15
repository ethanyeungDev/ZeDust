const devmode=true;
//Note: if the delay is zero, browser tracking protection may activate and stop access to libraries.
if(devmode){
    document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector("#loadingBox").style.display = "none";
        document.querySelector("#gameBox").classList.add("default");
    }, 1000);
    });
}
else{
    document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector("#loadingBox").style.display = "none";
        document.querySelector("#gameBox").classList.add("default");
    }, 5000);
    });
}
