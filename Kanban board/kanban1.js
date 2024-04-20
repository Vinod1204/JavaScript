
let ticketsArr = [];
//get value from local storage
//add button functionality
let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont');
let addTaskFlag = false;
modalCont.style.display = 'none';
addBtn.addEventListener('click', function(){
    addTaskFlag = !addTaskFlag;
    if(addTaskFlag === true){
        //style - flex
        modalCont.style.display = 'flex';

    }else{
        // style - none
        modalCont.style.display = 'none';
    }
});

//remove button functionality
let removeBtn = document.querySelector('.remove-btn');
let removeTaskFlag = false;
removeBtn.addEventListener('click', function(){
    removeTaskFlag = !removeTaskFlag;
    if(removeTaskFlag === true){
        //style - flex
        alert("Remove button is activated!");
        removeBtn.style.color = 'red';

    }else{
        // style - none
        removeBtn.style.color = 'white';
        alert("Remove button is deactivated!");
    }
});

//Brute Force Approach - to remove default active and 
// make selected priority color active
let allPriorityColors = document.querySelectorAll('.priority-color');
let color = ['lightpink', 'lightgreen', 'lightblue',  'black'];
let modalPriorityColor = color[color.length-1];
allPriorityColors.forEach(function(colorEle){
    colorEle.addEventListener('click', function(){
            allPriorityColors.forEach(function(priorityColorEle){
            priorityColorEle.classList.remove('active');
        })
        colorEle.classList.add('active');
        modalPriorityColor = colorEle.classList[0];
        
    })
})

//keydown event on modale
let textAreaCont = document.querySelector('.text-cont');
modalCont.addEventListener('keydown', function(e){
    let key = e.key;
    console.log(key);
    if(key==='Enter'){
        createTicket(modalPriorityColor, textAreaCont.value);
        modalCont.style.display = 'none';
        textAreaCont.value = '';
        addTaskFlag = !addTaskFlag;
    }
})

//function to create ticket
//Create ticket - create a div and append that div in our container
//Store ticket - create array of objects, objects will have keys like id, text, color

let mainContainer = document.querySelector('.main-container');
function createTicket(ticketColor, ticketTask, ticketID){
    let id = ticketID || shortid(); //https://www.npmjs.com/package/shortid
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class', 'ticket-cont');
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id"> Token - ${id}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `   
        mainContainer.appendChild(ticketCont);
        handleColor(ticketCont, id);
        handleLock(ticketCont, id);
        handleRemove(ticketCont, id);
        if(!ticketID){
            ticketsArr.push({ticketColor, ticketTask, ticketID: id});
            // localStorage.setItem('tickets', ticketsArr);
            // we can't do this as we can't store arrays as value in local storage
            // only strings are allowed, so we convert array to string
            localStorage.setItem('tickets', JSON.stringify(ticketsArr));
            console.log(ticketsArr);
        }
        
}


//on removal 
//remove container from DOM
//remove object from array
//we need an event listener - on click remove 
function handleRemove(ticket, id){
    ticket.addEventListener('click', function(){
        if(!removeTaskFlag) return;
        ticket.remove();
        let idx = getTicketIdx(id);
        ticketsArr.splice(idx, 1);
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    })
}

function getTicketIdx(id){
    let ticketID = ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketID === id;
    });   
    return ticketID;
}


//handleLock
let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open';
function handleLock(ticket, id){
    let ticketLockEle = ticket.querySelector('.ticket-lock');
    let ticketLockIcon = ticketLockEle.children[0];
    let ticketTaskArea = ticket.querySelector('.task-area');

    ticketLockIcon.addEventListener('click', function(){
        let ticketIdx = getTicketIdx(id);
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.add(unlockClass);
            ticketLockIcon.classList.remove(lockClass);
            ticketTaskArea.setAttribute('contenteditable', true);
        }else{
            ticketLockIcon.classList.add(lockClass);
            ticketLockIcon.classList.remove(unlockClass);
            ticketTaskArea.setAttribute('contenteditable', false);
        }
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    })

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
        ticketsArr[ticketIdx].ticketColor = ticketColorEle.classList[1];
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
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
        let filteredTickets = ticketsArr.filter(function(ticket){
            return selectedToolBoxColor === ticket.ticketColor;
        })
        //remove all tickets from DOM
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let j=0; j<allTickets.length; j++){
            allTickets[j].remove();
        }
        //add filtered Tickets to DOM
        filteredTickets.forEach(function(ticket){
            createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
        });
    })

    toolBoxColors[i].addEventListener('dblclick', function(){
        //remove all tickets
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let i=0; i<allTickets.length; i++){
            allTickets[i].remove();
        }
        //add all tickets
        ticketsArr.forEach(function(ticket){
            createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
        });
    })
}

// whenever we are changing ticketsArr, we use local storage there
// e.g. create ticket, update ticket, remove ticket
if(localStorage.getItem('tickets')){
    ticketsArr = JSON.parse(localStorage.getItem('tickets'));
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
    })   
}