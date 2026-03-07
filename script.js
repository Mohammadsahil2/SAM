let audioContext;
let oscillator;
let chart;

let progressData=[0,0,0,0,0];

function startSession(freq,mode){

audioContext = new (window.AudioContext || window.webkitAudioContext)();
oscillator = audioContext.createOscillator();

oscillator.frequency.setValueAtTime(freq,audioContext.currentTime);

oscillator.connect(audioContext.destination);

oscillator.start();

document.getElementById("status").innerText="Playing "+mode;

updateProgress(mode);

}

function stopSession(){

if(oscillator){
oscillator.stop();
document.getElementById("status").innerText="Session stopped";
}

}

function updateProgress(mode){

let index={
"Deep Focus":0,
"Focus":1,
"Relax":2,
"Meditation":3,
"Sleep":4
}[mode];

progressData[index]++;

localStorage.setItem("progress",JSON.stringify(progressData));

renderChart();

}

function renderChart(type="bar"){

let ctx=document.getElementById("progressChart");

if(chart) chart.destroy();

chart=new Chart(ctx,{
type:type,
data:{
labels:["Deep Focus","Focus","Relax","Meditation","Sleep"],
datasets:[{
label:"Sessions",
data:progressData
}]
}
});

}

function changeChart(){

let type=document.getElementById("chartType").value;

renderChart(type);

}

let saved=localStorage.getItem("progress");

if(saved){
progressData=JSON.parse(saved);
}

renderChart();
