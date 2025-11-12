const devmode=false;

if(devmode){
  document.querySelector("#loadingBox").style.display = "none";
    document.querySelector("#gameBox").style.display = "flex";
}
else{
    document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector("#loadingBox").style.display = "none";
        document.querySelector("#gameBox").classList.add("default");
    }, 5000);
    });
}
