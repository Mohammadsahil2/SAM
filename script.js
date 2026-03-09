let audioContext
let oscLeft
let oscRight

let sessions=0
let minutes=0

function startSession(type){

if(!audioContext){
audioContext=new(window.AudioContext||window.webkitAudioContext)()
}

let base=200
let beat=10

if(type=="focus") beat=16
if(type=="relax") beat=10
if(type=="creative") beat=6
if(type=="sleep") beat=2

oscLeft=audioContext.createOscillator()
oscRight=audioContext.createOscillator()

oscLeft.frequency.value=base
oscRight.frequency.value=base+beat

let panLeft=audioContext.createStereoPanner()
let panRight=audioContext.createStereoPanner()

panLeft.pan.value=-1
panRight.pan.value=1

oscLeft.connect(panLeft).connect(audioContext.destination)
oscRight.connect(panRight).connect(audioContext.destination)

oscLeft.start()
oscRight.start()

let length=document.getElementById("sessionLength").value

sessions++
minutes+=parseInt(length)

updateChart()

samSpeak("Starting your "+type+" session. Relax and focus.")

}

function stopSession(){

if(oscLeft)oscLeft.stop()
if(oscRight)oscRight.stop()

samSpeak("Session stopped. Great work.")

}

function samSpeak(text){

let chat=document.getElementById("samChat")

chat.innerText=text

let speech=new SpeechSynthesisUtterance(text)

speech.rate=0.9
speech.pitch=1

speechSynthesis.speak(speech)

}

function startPomodoro(){

let focus=25*60
let breakTime=5*60

samSpeak("Pomodoro focus started")

setTimeout(()=>{

samSpeak("Break time")

},focus*1000)

}

function enableVoice(){

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition

let recognition=new SpeechRecognition()

recognition.start()

recognition.onresult=function(e){

let command=e.results[0][0].transcript

handleVoice(command)

}

}

function handleVoice(text){

text=text.toLowerCase()

if(text.includes("focus")) startSession("focus")

else if(text.includes("relax")) startSession("relax")

else if(text.includes("sleep")) startSession("sleep")

else if(text.includes("stop")) stopSession()

else samSpeak("I didn't understand, but I'm here with you.")

}

let ctx=document.getElementById("progressChart").getContext("2d")

let chart=new Chart(ctx,{
type:"bar",
data:{
labels:["Sessions","Minutes"],
datasets:[{
label:"Progress",
data:[0,0]
}]
}
})

function updateChart(){

chart.data.datasets[0].data=[sessions,minutes]
chart.update()

}

const canvas=document.getElementById("visualCanvas")
const ctx2=canvas.getContext("2d")

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

ctx2.clearRect(0,0,canvas.width,canvas.height)

particles.forEach(p=>{

ctx2.beginPath()
ctx2.arc(p.x,p.y,p.size,0,Math.PI*2)
ctx2.fillStyle="#8a2be2"
ctx2.fill()

p.y+=0.3

if(p.y>canvas.height)p.y=0

})

requestAnimationFrame(animate)

}

animate()

if(Notification.permission!=="granted"){

Notification.requestPermission()

}

setInterval(()=>{

new Notification("SAM Reminder",{body:"Time to tune your mind."})

},3600000)
