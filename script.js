// ===== Sample Names =====
const names=[
  {name:"Aaliyah",meaning:"Exalted"},
  {name:"Aaron",meaning:"Mountain of strength"},
  {name:"Abel",meaning:"Breath"},
  {name:"Abigail",meaning:"Father's joy"},
  {name:"Adeline",meaning:"Noble"},
  {name:"Adrian",meaning:"Dark one"}
];

// ===== Thoughts =====
const thoughtsPool={
  Happy:["Feeling great today!","Life is wonderful.","Excited for adventure!"],
  Sad:["Feeling tired.","Wish things were easier.","Missing someone."],
  Angry:["Frustrated!","Why can't people understand?","I need to vent."],
  Excited:["So much energy today!","Can't wait for this!","Everything is amazing!"],
  Tired:["Need a nap.","Can't focus.","Want to rest."]
};

// ===== Buff Items =====
const buffItems=[
  {name:"Protein Shake: +2 Strength",strength:2,intelligence:0},
  {name:"Book of Wisdom: +3 Intelligence",strength:0,intelligence:3},
  {name:"Meditation Mat: +1 Strength +1 Intelligence",strength:1,intelligence:1},
  {name:"Golden Idol: x2 Coins",effect:"multiplier",multiplier:2}
];

// ===== Life Events =====
const lifeEvents=[
  {desc:"Found a rare book, gained knowledge!",strength:0,intelligence:2},
  {desc:"Got sick for a week, lost strength.",strength:-2,intelligence:0},
  {desc:"Helped a friend, feel smarter.",strength:1,intelligence:1}
];

// ===== Attributes =====
const attributes=[
  {name:"Hyper Intelligent",desc:"+3 Intelligence, increases lifespan",strength:0,intelligence:3,lifespan:5},
  {name:"Chronic Fatigue",desc:"-2 Strength, decreases lifespan",strength:-2,intelligence:0,lifespan:-5},
  {name:"Lucky",desc:"+1 coin multiplier",effect:"multiplier",multiplier:2}
];

// ===== Careers =====
const careers = [
  { name: "Burger Flipper", req: { strength: 5, intelligence: 5 }, income: 5 },
  { name: "Software Engineer", req: { strength: 7, intelligence: 15 }, income: 20 },
  { name: "Doctor", req: { strength: 10, intelligence: 20 }, income: 30 },
  { name: "Bodybuilder", req: { strength: 20, intelligence: 5 }, income: 25 }
];

// ===== Variables =====
let currentChar, coins=0, age=0, lifespan=50, strength=5, intelligence=5, mood="Happy", thoughts="", actionsState={}, coinMultiplier=1, characterAttribute=null, currentCareer = null;
const envs=["City","Forest","Plains","Desert","Mountain"];
const weathers=["Sunny","Rainy","Stormy","Foggy","Snowy"];
const faces={"Happy":"🙂","Sad":"🙁","Angry":"😠","Excited":"😃","Tired":"😴"};
let highScore=0;

// ===== 3D Placeholder =====
let scene,camera,renderer,humanModel=null;
function init3D(){
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(75,document.getElementById("viewport3D").clientWidth/document.getElementById("viewport3D").clientHeight,0.1,1000);
  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(document.getElementById("viewport3D").clientWidth,document.getElementById("viewport3D").clientHeight);
  document.getElementById("viewport3D").appendChild(renderer.domElement);
  const light=new THREE.DirectionalLight(0xffffff,1);
  light.position.set(5,10,7);
  scene.add(light);
  camera.position.z=5;
  animate3D();
}
function animate3D(){
  requestAnimationFrame(animate3D);
  renderer.render(scene,camera);
}

// ===== Game Functions =====
function startGame(){
  document.getElementById("titleScreen").style.display="none";
  document.getElementById("game").style.display="block";
  init3D();
  generateCharacter();
  setupActions();
  setupCareers();
  tickLoop();
}
function generateCharacter(){
  const idx=Math.floor(Math.random()*names.length);
  currentChar=names[idx];
  document.getElementById("charName").innerText=currentChar.name;
  document.getElementById("charMeaning").innerText=currentChar.meaning;
  characterAttribute=attributes[Math.floor(Math.random()*attributes.length)];
  document.getElementById("attribute").innerText=characterAttribute.name;
  document.getElementById("attributeEffect").innerText=characterAttribute.desc;
  if(characterAttribute.strength) strength+=characterAttribute.strength;
  if(characterAttribute.intelligence) intelligence+=characterAttribute.intelligence;
  if(characterAttribute.lifespan) lifespan+=characterAttribute.lifespan;
  if(characterAttribute.effect=="multiplier") coinMultiplier=characterAttribute.multiplier;
  updateStats();
}
function updateStats(){
  document.getElementById("strength").innerText=Math.floor(strength);
  document.getElementById("intelligence").innerText=intelligence;
  document.getElementById("coins").innerText=coins;
  document.getElementById("age").innerText=age;
  document.getElementById("lifespan").innerText=Math.floor(lifespan);
  document.getElementById("mood").innerText=mood;
  document.getElementById("thoughts").innerText=thoughts;
  document.getElementById("highscoreGame").innerText="High Score (AGE): "+Math.floor(highScore);
  updateCareerButtons();
}

function updateCareerButtons() {
    const buttons = document.querySelectorAll("#careerList button");
    buttons.forEach(button => {
        const career = careers.find(c => c.name === button.innerText.split(' ')[0]);
        if (strength < career.req.strength || intelligence < career.req.intelligence) {
            button.classList.add("cooldown");
        } else {
            button.classList.remove("cooldown");
        }
        if (currentCareer && currentCareer.name === career.name) {
            button.classList.add("cooldown");
        }
    });
}

function setupCareers() {
  const container = document.getElementById("careerList");
  container.innerHTML = "";
  careers.forEach(career => {
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="setCareer('${career.name}')">${career.name} (💪${career.req.strength} 🧠${career.req.intelligence}) - 💰${career.income}/tick</button>`;
    container.appendChild(li);
  });
  updateCareerButtons();
}
function setCareer(name) {
  const career = careers.find(c => c.name === name);
  if (strength >= career.req.strength && intelligence >= career.req.intelligence) {
    currentCareer = career;
    document.getElementById("quote").innerText = `You are now a ${currentCareer.name}!`;
    updateCareerButtons();
  } else {
    alert("You do not meet the requirements for this career!");
  }
}
function setupActions(){
  const container=document.getElementById("actions");
  container.innerHTML="";
  const actionList=[
    {name:"Feed",cost:0,func:()=>doAction("Feed"),cooldown:3},
    {name:"Healthy Feed",cost:5,func:()=>doAction("Healthy Feed"),cooldown:5},
    {name:"Train",cost:0,func:()=>doAction("Train"),cooldown:3},
    {name:"Gym",cost:20,func:()=>doAction("Gym"),cooldown:5}
  ];
  actionList.forEach(a=>{
    const btn=document.createElement("button");
    btn.innerText=a.name+(a.cost? ` (${a.cost} 💰)`:"");
    btn.onclick=()=>{
      if(!btn.classList.contains("cooldown")){
        a.func();
        btn.classList.add("cooldown");
        let time=a.cooldown;
        const cdInt=setInterval(()=>{
          time--;
          btn.innerText=a.name+(a.cost? ` (${a.cost} 💰)`:"")+` (${time}s)`;
          if(time<=0){ clearInterval(cdInt); btn.classList.remove("cooldown"); btn.innerText=a.name+(a.cost? ` (${a.cost} 💰)`:""); }
        },1000);
      }
    };
    container.appendChild(btn);
  });
}
function doAction(action){
  let coinGain=Math.random()<0.2?10:2;
  coinGain*=coinMultiplier;
  coinGain+=Math.floor(intelligence*0.1);
  if(action=="Healthy Feed"){ if(coins>=5){ coins-=5; strength++; } else return alert("Not enough coins!"); }
  if(action=="Gym"){ if(coins>=20){ coins-=20; strength+=2; lifespan+=0.5; } else return alert("Not enough coins!"); }
  if(action=="Train"){ intelligence+=1; }
  coins+=coinGain;
  const moods=Object.keys(faces);
  mood=moods[Math.floor(Math.random()*moods.length)];
  thoughts=thoughtsPool[mood][Math.floor(Math.random()*thoughtsPool[mood].length)];
  document.getElementById("face").innerText=faces[mood];
  updateStats();
}
function buyItem(){
  if(coins>=5){
    coins-=5;
    const item=buffItems[Math.floor(Math.random()*buffItems.length)];
    if(item.effect=="multiplier") coinMultiplier=item.multiplier;
    else { strength+=item.strength; intelligence+=item.intelligence; }
    const li=document.createElement("li"); li.innerText=item.name;
    document.getElementById("inventory").appendChild(li);
    updateStats();
  } else alert("Not enough coins!");
}
function generateLifeEvent(){
  if(coins<20) return alert("Need 20 coins!");
  coins-=20;
  const evt=lifeEvents[Math.floor(Math.random()*lifeEvents.length)];
  strength+=evt.strength;
  intelligence+=evt.intelligence;
  document.getElementById("quote").innerText=evt.desc;
  updateStats();
}
function updateEnv(){
  document.getElementById("environment").innerText=envs[Math.floor(Math.random()*envs.length)];
  document.getElementById("weather").innerText=weathers[Math.floor(Math.random()*weathers.length)];
}
function tickLoop(){
  const interval=setInterval(()=>{
    age++;
    lifespan+=strength*0.01;
    let passiveIncome = Math.floor(intelligence*0.05);
    if (currentCareer) {
      passiveIncome += currentCareer.income;
    }
    coins += passiveIncome;
    if (age > 40) {
      strength = Math.max(0, strength - 0.1);
    }
    updateEnv();
    updateStats();
    if(age>=lifespan){ clearInterval(interval); gameOver(); }
  },4000);
}
function gameOver(){
  document.getElementById("game").style.display="none";
  document.getElementById("gameOverScreen").style.display="block";
  document.getElementById("finalScore").innerText="Your Score: "+Math.floor(age)+" AGE";
  if(age>highScore) highScore=age;
  document.getElementById("finalHighScore").innerText="High Score: "+Math.floor(highScore)+" AGE";
}
function restartGame(){
  coins=0; age=0; strength=5; intelligence=5; lifespan=50; coinMultiplier=1; currentCareer = null;
  document.getElementById("gameOverScreen").style.display="none";
  document.getElementById("game").style.display="block";
  generateCharacter();
  setupActions();
  tickLoop();
}