const choiceBox=document.getElementById("choiceBox");
const choiceBoxList=document.getElementById("choiceBoxList");
const resourceChart=document.getElementById('resourceChart')
 
// Various helper functions

function clearChoices(e){
    const parent = e.currentTarget.parentElement;
    //kill the child, save the parent
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
        } 
    const grandfather=parent.parentElement;
    grandfather.style.display = "none";
}

runIntro();
runStageOne();


// Introduction scene


function runIntro(){
    // Sounds of a cold open - a crowd screams, baying for blood. Your blood. 
    console.log("Intro script is running.")

    // Again without context, choose whether to throw an Abbot out of a window or deploy white phosphorus agaisnt the mob.

    let choice1 =document.createElement('button');
    choice1.textContent="Call up the relic aircraft - bomb the crowd with white phosphorus."
    choice1.addEventListener("click", (e)=>{
        try {
            localStorage.setItem('massacredProtestersIntro',true)
        } catch (error) {
            alert("Insufficient memory available for this browser application - data has not been saved correctly.")
        }
        
        clearChoices(e);
    })
    let choice2 =document.createElement('button');
    choice2.textContent="Toss the Abbot to the mob. Save yourself."
        choice2.addEventListener("click", (e)=>{
        try {
            localStorage.setItem('massacredProtestersIntro',false)
        } catch (error) {
            alert("Insufficient memory available for this browser application - data has not been saved correctly.")
        }
        
        clearChoices(e);
    })

    choiceBoxList.appendChild(choice1);
    choiceBoxList.appendChild(choice2);

        //If you choose white phosphorus, play the sounds of people burning in agony.
            //give the ironic title "Candidate of Law and Order" with some stat tweaks and possible dialog changes
        //If you choose to throw the Abbot out of the window, play in order 1. a man says no 2. heavy thud 3. glass breaks 4. screaming on the way down, fading out
            //give the ironic title "Champion of Democracy" with some stat tweaks and possible dialog changes

}
    //"Like Saturn Before Us"


// real game

function runStageOne(){
    resourceChart.classList.add('defaultPos')
    // resourceChart.update();
}




function runStageTwo()
{
    
}
//Apotheosis - Before the Fall, there was no darkness in coffins. 

//Darkness is a sensation experienced by a sapient being. Only minds with eyes can experience darkness - the glass stillness of unrevived bodies see nothing. The self-proclaimed Apotheosis speak of the transcendence of unlife over life, claiming the erasure of both life and death. But we say that life in the necromundae has not been extinguished, merely transformed. New cages cannot elevate a damaged spirit. 
// 
//The Apotheotic kill for words like these. Let them. 