let addbtn=document.querySelector('.add-btn');
let modalCont=document.querySelector('.modal-cont');
let removebtn=document.querySelector('.remove-btn');
let allPriortitycolors=document.querySelectorAll('.priority-color');
let textareacont=document.querySelector('.text-cont');
let mainCont=document.querySelector('.main-container');
let toolboxcolors=document.querySelectorAll('.color')
let addTaskFlag= false;
let removeTaskFlag=false;
let lockClass='fa-lock';
let unlockClass='fa-lock-open';
let colors=['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor=colors[colors.length-1];
let ticketArr=[];

// find the elements from the array which have the selected color 
// remove all the cards from the screen
// render only the cards which are black on the screen

if(localStorage.getItem('tickets'))
{
    ticketArr = JSON.parse(localStorage.getItem('tickets'));
    ticketArr.forEach(function(ticketobj)
    {
        CreateTicket(ticketobj.ticketcolor,ticketobj.ticketTask,ticketobj.ticketID);
    })
}

for(let i=0;i<toolboxcolors.length;i++)
{
    toolboxcolors[i].addEventListener('click',function()
    {
       let selectedcolors= toolboxcolors[i].classList[0];
       let filterticketcolors=ticketArr.filter(function(e)
       {
            return selectedcolors === e.ticketcolor;
       })
    
    let alltickets=document.querySelectorAll('.ticket-cont');
    for(let j=0;j<alltickets.length;j++)
    {
        alltickets[j].remove();
    }
    filterticketcolors.forEach(function(ticketobj){
        CreateTicket(ticketobj.ticketcolor,ticketobj.ticketTask,ticketobj.ticketid);
    })
    })

    toolboxcolors[i].addEventListener('dblclcick',function(){
        let alltickets = document.querySelectorAll('.ticket-cont')
        {
            for(let j=0;j<alltickets.length;j++)
            {
                alltickets[j].remove();
            }
            ticketArr.forEach(function(ticketobj)
            {
                CreateTicket(ticketobj.ticketcolor,ticketobj.ticketTask,ticket.ticketID);
            })
        }
    })
}

addbtn.addEventListener('click',function(){
     addTaskFlag=!addTaskFlag;
     if(addTaskFlag === true)
     {
        modalCont.style.display='flex';
     }
     else{
        modalCont.style.display='none';
     }
});

removebtn.addEventListener('click',function()
{
    removeTaskFlag=!removeTaskFlag;
   if(removeTaskFlag === true)
   {
       alert('Remove button activated');
       removebtn.style.color='red';
   } 
   else{
       removebtn.style.color='white';
   }
});

allPriortitycolors.forEach(function(colorelm){
 colorelm.addEventListener('click', function()
 {
     allPriortitycolors.forEach(function(prioritycolorEle) {
         prioritycolorEle.classList.remove('active');
     })
     colorelm.classList.add('active');
     modalPriorityColor=colorelm.classList[0];
 })
})


modalCont.addEventListener('keydown', function(e) {
    let key = e.key;
    //console.log(key);
     if(key === 'Enter')
     {
        CreateTicket(modalPriorityColor,textareacont.value);
        modalCont.style.display='none';
        textareacont.value='';
     }
})

function CreateTicket(ticketcolor,ticketTask,ticketID)
{
 let ID=ticketID || shortid();
 //console.log(ID);
 let ticketCont = document.createElement('div')
 ticketCont.setAttribute('class','ticket-cont');
 ticketCont.innerHTML=`
    <div class='ticket-color ${ticketcolor}'></div>
    <div class='ticket-ID'>${ID}</div>
    <div class='ticket-area'>${ticketTask}</div>
    <div class='ticket-lock'>
    <i class="fa-solid fa-lock" aria-hidden="true"></i>
    </div> 
 `
  mainCont.appendChild(ticketCont);
  handlelock(ticketCont,ID);
  handleColor(ticketCont,ticketcolor);
  handleremove(ticketCont,ID);
  if(!ticketID){
  ticketArr.push({ticketcolor,ticketTask, ticketID: ID});
  }
  localStorage.setItem('tickets',JSON.stringify(ticketArr));
  //console.log(ticketArr);
}

function handlelock(ticketCont,ticketID){
     let ticketlockElement=ticketCont.querySelector('.ticket-lock');
     //console.log(ticketlockElement);
     let ticketlockicon= ticketlockElement.children[0];
     //console.log(ticketlockicon);
     let tickettaskArea = ticketCont.querySelector('.ticket-area');
     //console.log(tickettaskArea);
     ticketlockicon.addEventListener('click',function()
     {
         let idx=getTicketIndex(ticketID);
         if(ticketlockicon.classList.contains(lockClass))
         {
            ticketlockicon.classList.add(unlockClass);
            ticketlockicon.classList.remove(lockClass);
            tickettaskArea.setAttribute('contenteditable',true);
         }
         else{
            ticketlockicon.classList.add(lockClass);
            ticketlockicon.classList.remove(unlockClass);
            tickettaskArea.setAttribute('contenteditable',false); 
         }
         ticketArr[idx].ticketTask=tickettaskArea.innerText;
         localStorage.setItem('tickets',JSON.stringify(ticketArr));
     })

}

/*
function handleColor(ticketCont,ticketcoclor)
{
    toolboxcolors.forEach(function(ele)
    {
        ele.addEventListener('click', e => {
            const color = e.target.classList[0];
            removeTasks();
            removeSelection();
            ticketArr.forEach(function(ticket)
            {
                if(color === ticket.ticketcolor)
                {
                    CreateTicket(ticket.ticketcolor,ticket.ticketTask,ticket.ticketID);
                }
            });
            e.target.classList.add('active')
        })

        ele.addEventListener('dblclick', e => 
        {
            removeTasks();
            ticketArr.forEach(function(ticket)
            {
                CreateTicket(ticket.ticketcolor,ticket.ticketTask,ticket.ticketID);
            });
        })
    })
} */

function removeTasks()
{
    mainCont.innerHTML="";
}

function removeSelection()
{
    toolboxcolors.forEach( ele =>
    {
        ele.classList.remove('active');
    })
}


function handleremove(ticketCont,ticketid){
ticketCont.addEventListener('click',function(){
    if(!removeTaskFlag) return; 
    ticketCont.remove();
    let idx=getTicketIndex(ticketid);
    console.log("index = " + idx);
    let deleteElem= ticketArr.splice(idx,1);
    localStorage.setItem('tickets',JSON.stringify(ticketArr));
    console.log(deleteElem);
})
}

function getTicketIndex(ID)
{
    let ticketID =  ticketArr.findIndex(function(ticketobj)
    {
     return ticketobj.ticketID === ID;
     
    })
        
        return ticketID;
}

//handle color
function handleColor(ticket, id){
    let ticketColorEle = ticket.querySelector('.ticket-color');
    ticketColorEle.addEventListener('click', function(){
        let ticketIdx = getTicketIdx(id);
        let ticketCol = ticketColorEle.classList[1];
        ticketColorEle.classList.remove(ticketCol);
        if(ticketCol === 'black'){
            ticketColorEle.classList.add('lightpink');
        } else if(ticketCol === 'lightpink'){
            ticketColorEle.classList.add('lightgreen');
        } else if(ticketCol === 'lightgreen'){
            ticketColorEle.classList.add('lightblue');
        } else{
            ticketColorEle.classList.add('black');
        }
        ticketArr[ticketIdx].ticketColor = ticketColorEle.classList[1];
        localStorage.setItem('tickets', JSON.stringify(ticketArr));
    })
}

//click color to filter
//single click filters same color tickets
//double click brings back all tickets
//find elements from array which have the color
//remove all tickets from screen, except tickets that have selected color
let toolBoxColors = document.querySelectorAll('.color');
for(let i=0; i<toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener('click', function(){
        //select filtered tickets
        let selectedToolBoxColor = toolBoxColors[i].classList[0];
        let filteredTickets = ticketArr.filter(function(ticket){
            return selectedToolBoxColor === ticket.ticketColor;
        })
        //remove all tickets from DOM
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let j=0; j<allTickets.length; j++){
            allTickets[j].remove();
        }
        //add filtered Tickets to DOM
        filteredTickets.forEach(function(ticket){
            CreateTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
        });
    })

    toolBoxColors[i].addEventListener('dblclick', function(){
        //remove all tickets
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let i=0; i<allTickets.length; i++){
            allTickets[i].remove();
        }
        //add all tickets
        ticketArr.forEach(function(ticket){
            CreateTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
        });
    })
}
// whenever we are changing ticketsArr, we use local storage there
// e.g. create ticket, update ticket, remove ticket
if(localStorage.getItem('tickets')){
    ticketsArr = JSON.parse(localStorage.getItem('tickets'));
    ticketsArr.forEach(function(ticket){
        CreateTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
    })   
}