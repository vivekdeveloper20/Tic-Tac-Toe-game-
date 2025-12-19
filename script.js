const cells=document.querySelectorAll(".cell");
const turnEl=document.getElementById("turn");
const historyEl=document.getElementById("history");
const tx=document.getElementById("tx");
const to=document.getElementById("to");

let board=Array(9).fill("");
let current="X";
let active=true;
let moves=[],redoStack=[];
let timeX=0,timeO=0;

const winPatterns=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const coords=["A1","B1","C1","A2","B2","C2","A3","B3","C3"];

setInterval(()=>{
  if(!active)return;
  current==="X"?timeX++:timeO++;
  tx.textContent=timeX;
  to.textContent=timeO;
},1000);

cells.forEach((c,i)=>c.onclick=()=>play(c,i));

function play(cell,i){
  if(!active||board[i])return;
  board[i]=current;
  cell.textContent=current;
  moves.push({i,player:current});
  redoStack=[];
  historyEl.innerHTML+=`<div>${current} → ${coords[i]}</div>`;

  if(checkWin()){
    turnEl.textContent=`🎉 ${name(current)} Wins`;
    active=false;
    celebrate();
    return;
  }
  if(board.every(v=>v)){
    turnEl.textContent="😐 Draw";
    active=false;
    return;
  }
  current=current==="X"?"O":"X";
  updateTurn();
}

function checkWin(){
  return winPatterns.some(p=>{
    if(board[p[0]]&&board[p[0]]===board[p[1]]&&board[p[0]]===board[p[2]]){
      p.forEach(i=>cells[i].classList.add("win"));
      return true;
    }
  });
}

function undo(){
  if(!moves.length||!active)return;
  const last=moves.pop();
  redoStack.push(last);
  board[last.i]="";
  cells[last.i].textContent="";
  historyEl.lastChild.remove();
  current=last.player;
  updateTurn();
}

function redo(){
  if(!redoStack.length||!active)return;
  const move=redoStack.pop();
  board[move.i]=move.player;
  cells[move.i].textContent=move.player;
  moves.push(move);
  historyEl.innerHTML+=`<div>${move.player} → ${coords[move.i]}</div>`;
  current=move.player==="X"?"O":"X";
  updateTurn();
}

function reset(){
  board.fill("");
  cells.forEach(c=>{c.textContent="";c.classList.remove("win")});
  moves=[];redoStack=[];
  active=true;current="X";
  timeX=0;timeO=0;
  historyEl.innerHTML="<b>Moves:</b>";
  updateTurn();
}

function updateTurn(){
  turnEl.className="turn "+current.toLowerCase();
  turnEl.textContent=`${name(current)}'s Turn (${current})`;
}

function name(p){
  return document.getElementById(p==="X"?"px":"po").value||("Player "+p);
}

function celebrate(){
  for(let i=0;i<40;i++){
    const c=document.createElement("div");
    c.className="confetti";
    c.style.left=Math.random()*100+"vw";
    c.style.background=`hsl(${Math.random()*360},100%,50%)`;
    c.style.animationDuration=(Math.random()*2+2)+"s";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3000);
  }
}
