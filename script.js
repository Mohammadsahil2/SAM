let audioContext
let oscL
let oscR

let sessions=0
let minutes=0

const chart=new Chart(
document.getElementById("chart"),
{
type:"bar",
data:{
labels:["Sessions","Minutes"],
datasets:[{
label:"SAM Usage",
data:[0,0]
}]
}
}
)

function updateChart(){
chart.data.datasets[0].data=[sessions,minutes]
chart.update()
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

oscL=audioContext.createOscillator()
oscR=audioContext.createOscillator()

oscL.frequency.value=base
oscR.frequency.value=base+beat

let panL=audioContext.createStereoPanner()
let panR=audioContext.createStereoPanner()

panL.pan.value=-1
panR.pan.value=1

oscL.connect(panL).connect(audioContext.destination)
oscR.connect(panR).connect(audioContext.destination)

oscL.start()
oscR.start()

let len=document.getElementById("sessionLength").value

sessions++
minutes+=parseInt(len)

updateChart()

samSpeak("Starting your "+type+" session.")

}

function stopSession(){

if(oscL)oscL.stop()
if(oscR)oscR.stop()

samSpeak("Session stopped. Good job.")

}

function samSpeak(text){

document.getElementById("samText").innerText=text

let msg=new SpeechSynthesisUtterance(text)

let voices=speechSynthesis.getVoices()

msg.voice=voices.find(v=>v.name.toLowerCase().includes("female"))||voices[0]

msg.rate=0.9

speechSynthesis.speak(msg)

}

function startListening(){

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition

let recog=new SpeechRecognition()

recog.lang="en-US"

recog.start()

samSpeak("I'm listening.")

recog.onresult=function(e){

let speech=e.results[0][0].transcript.toLowerCase()

handleQuery(speech)

}

}

function handleQuery(q){

if(q.includes("focus")){
startSession("focus")
return
}

if(q.includes("relax")||q.includes("stress")){
startSession("relax")
return
}

if(q.includes("sleep")){
startSession("sleep")
return
}

if(q.includes("stop")){
stopSession()
return
}

samSpeak("I understand. Maybe a focus session could help.")

}

function startPomodoro(){

let focus=25*60

document.getElementById("pomodoroStatus").innerText="Focus session started"

samSpeak("Pomodoro started.")

setTimeout(()=>{

samSpeak("Take a break.")

},focus*1000)

}

const canvas=document.getElementById("visuals")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=200

let particles=[]

for(let i=0;i<100;i++){
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

p.y+=0.4

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
