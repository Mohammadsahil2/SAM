let audioContext
let osc1
let osc2

let sessions=0
let minutes=0

function samSpeak(text){

document.getElementById("samText").innerText=text

let speech=new SpeechSynthesisUtterance(text)

speech.rate=0.9

speechSynthesis.speak(speech)

}

function startSession(type){

if(!audioContext){

audioContext=new(window.AudioContext||window.webkitAudioContext)()

}

let base=200
let beat=10

if(type==="focus") beat=16
if(type==="relax") beat=10
if(type==="creative") beat=6
if(type==="sleep") beat=2

osc1=audioContext.createOscillator()
osc2=audioContext.createOscillator()

osc1.frequency.value=base
osc2.frequency.value=base+beat

let pan1=audioContext.createStereoPanner()
let pan2=audioContext.createStereoPanner()

pan1.pan.value=-1
pan2.pan.value=1

osc1.connect(pan1).connect(audioContext.destination)
osc2.connect(pan2).connect(audioContext.destination)

osc1.start()
osc2.start()

let len=document.getElementById("sessionLength").value

sessions++
minutes+=parseInt(len)

updateChart()

samSpeak("Starting your "+type+" session.")

}

function stopSession(){

if(osc1)osc1.stop()
if(osc2)osc2.stop()

samSpeak("Session stopped.")

}

function startListening(){

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition

let recog=new SpeechRecognition()

recog.start()

recog.onresult=function(e){

let speech=e.results[0][0].transcript.toLowerCase()

handleCommand(speech)

}

}

function handleCommand(text){

if(text.includes("focus")) startSession("focus")

else if(text.includes("relax")) startSession("relax")

else if(text.includes("sleep")) startSession("sleep")

else if(text.includes("stop")) stopSession()

else samSpeak("I'm here with you.")

}

function startPomodoro(){

let focus=25*60

samSpeak("Pomodoro started.")

setTimeout(()=>{

samSpeak("Take a break.")

},focus*1000)

}

let chart=new Chart(

document.getElementById("progressChart"),

{

type:"bar",

data:{

labels:["Sessions","Minutes"],

datasets:[{

label:"Progress",

data:[0,0]

}]

}

}

)

function updateChart(){

chart.data.datasets[0].data=[sessions,minutes]

chart.update()

}

const canvas=document.getElementById("visuals")

const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth

canvas.height=200

let particles=[]

for(let i=0;i<80;i++){

particles.push({

x:Math.random()*canvas.width,

y:Math.random()*canvas.height,

size:Math.random()*3

})

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height)

particles.forEach(p=>{

ctx.beginPath()

ctx.arc(p.x,p.y,p.size,0,Math.PI*2)

ctx.fillStyle="#8a2be2"

ctx.fill()

p.y+=0.3

if(p.y>canvas.height)p.y=0

})

requestAnimationFrame(animate)

}

animate()
