import { initModal } from "./ui/modal.js";
import { initCharts, updateCharts } from "./ui/netChart.js";
import {projectedNextTurnValues} from "./campaign/turnSystem.js";
import { renderSidebar } from './ui/sidebar.js';
import { cities } from './campaign/cities.js';
import { simulateTurn } from './campaign/turnSystem.js';
import { updateAllCityCharts } from './ui/cityCharts.js';


// 

// runIntro();

// Introduction scene


// function runIntro(){

// // I broke the audio irrepairably and despite taking an extra day I couldn't fix it without the revert breaking the modal box (?????), so now there is no audio.

//     // Sounds of a cold open - a crowd screams, baying for blood. Your blood. 
//     console.log("Intro script is running.")

//     // Again without context, choose whether to throw an Abbot out of a window or deploy white phosphorus agaisnt the mob.

//     let choice1 =document.createElement('button');
//     choice1.textContent="Call up the relic aircraft - bomb the crowd with white phosphorus."
//     choice1.addEventListener("click", (e)=>{
//         try {
//             localStorage.setItem('massacredProtestersIntro',true)
//         } catch (error) {
//             alert("Insufficient memory available for this browser application - data has not been saved correctly.")
//         }
        
//         clearChoices(e);
//     })
//     let choice2 =document.createElement('button');
//     choice2.textContent="Toss the Abbot to the mob. Save yourself."
//         choice2.addEventListener("click", (e)=>{
//         try {
//             localStorage.setItem('massacredProtestersIntro',false)
//         } catch (error) {
//             alert("Insufficient memory available for this browser application - data has not been saved correctly.")
//         }
        
//         clearChoices(e);
//     })

// You are not permitted to die. Democracy is too fragile to allow elections, and you will be presented to the public to reassure them that Providence is still with us.. 

//     choiceBoxList.appendChild(choice1);
//     choiceBoxList.appendChild(choice2);
//     moveToVH(choiceBox, Number(choiceBox.dataset.defaultVh));
    
//     console.log(choiceBox.dataset.defaultVh); 
//         //If you choose white phosphorus, play the sounds of people burning in agony.
//             //give the ironic title "Candidate of Law and Order" with some stat tweaks and possible dialog changes
//         //If you choose to throw the Abbot out of the window, play in order 1. a man says no 2. heavy thud 3. glass breaks 4. screaming on the way down, fading out
//             //give the ironic title "Champion of Democracy" with some stat tweaks and possible dialog changes

// }
//     //"Like Saturn Before Us"


// real game

// function runStageOne(){
//     resourceChart.classList.add('defaultPos')
//     resourceChart.height = resourceChart.offsetHeight;
       
//     moveToVH(choiceBox, Number(choiceBox.dataset.defaultVh));
// }





//Apotheosis - Before the Fall, there was no darkness in coffins. 

//Darkness is a sensation experienced by a sapient being. Only minds with eyes can experience darkness - the glass stillness of unrevived bodies see nothing. The self-proclaimed Apotheosis speak of the transcendence of unlife over life, claiming the erasure of both life and death. But we say that life in the necromundae has not been extinguished, merely transformed. New cages cannot elevate a damaged spirit. 
// 
//The Apotheotic kill for words like these. Let them. 