var mainTable = document.getElementById("mainTable")
var codeInput = document.getElementById("inputCode");
var taskInput = document.getElementById("inputTask");
var dateInput = document.getElementById("inputDate");
var codeSearch = document.getElementById("codeSearch")
var taskSearch = document.getElementById("taskSearch")
var dateSearch = document.getElementById("dateSearch")
var alertBox  = document.getElementById("alert")
var alertText = document.getElementById("alertText")

class Task {
    constructor(code, task, date) 
    {
        this.code = code;
        this.task = task;
        this.date = date;
      }
}

Date.prototype.isValid = function () 
{
    return this.getTime() === this.getTime();
};

codeSearch.addEventListener('input', function (evt) {
    filterElements();
});

taskSearch.addEventListener('input', function (evt) {
    filterElements();
});

dateSearch.addEventListener('input', function (evt) {
    filterElements();
});

alertBox.addEventListener("animationend", (ev) => {
    if (ev.type === "animationend" && ev.animationName === "fadeOut") 
        alertBox.style.display = "none";
}, false);

function showAlert(text)
{
    alertText.innerHTML = text;
    alertBox.style.display = "block"; 
    alertBox.classList.toggle('active'); 

function alertClose()
{
    alertBox.classList.toggle('active'); 

}

function validateInput(code, task, date)
{
    let valid = true
    var errorText = ""
    const regex = /^[a-zA-Z]([0-9]{2})$/;
    if(!regex.test(code))
    {
        valid = false;
    }

    if(!(task.length <= 255 && task.length >= 3))
    {
        valid = false;
    }
    if(date !== "")
    {
        date = new Date(date)
        if(!date.isValid())
        {
            valid = false;
        }
    }
    if(!valid)
        showAlert(errorText)
    return valid;
}

function createRow(code, task, date)
{
    var row = document.createElement("tr");
    row.className = "elementRow";
    var col1 = document.createElement("td");
    col1.className = "col1";
    col1.appendChild(document.createTextNode(code.toUpperCase()));
    row.appendChild(col1);
    var col2 = document.createElement("td");
    col2.className = "col2";
    col2.appendChild(document.createTextNode(task));
    row.appendChild(col2);
    var col3 = document.createElement("td");
    col3.className = "col3";
    col3.id = date === "" ? "" : (new Date(date)).toJSON() // The id is used for locale independant date storage
    var date = date === "" ? "" : new Date(date).toLocaleDateString();
    col3.appendChild(document.createTextNode(date));
    row.appendChild(col3);
    var col4 = document.createElement("td");
    col4.className = "col4";
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var icon = document.createElement("i");
    span1.className = "listButton edit";
    span1.onclick = EDITFUNC;
    span2.className = "listButton close";
    span2.onclick = removeElement;
    icon.className  = "fa fa-times";   
    span1.appendChild(document.createTextNode("Edit"));
    span2.appendChild(document.createTextNode("ESC"));
    col4.appendChild(span1);
    col4.appendChild(span2);
    row.appendChild(col4);
    return row
}

function filterElements()
{
    var b = document.getElementById("clearSearchBtn")
    if(window.getComputedStyle(b).display === "none")
    {
        filterElementsMobile();
        return;
    }

    var code = codeSearch.value;
    var task = taskSearch.value;
    var date = dateSearch.value;


    for (let i = 0; i<mainTable.children.length; i++)
        mainTable.children[i].style.display = "";

    if(code !== "")
        for (let i = 0; i<mainTable.children.length; i++) 
        {
            if(!mainTable.children[i].children[0].textContent.toUpperCase().includes(code.toUpperCase()))
                mainTable.children[i].style.display = "none";
        }

    if(task !== "")
        for (let i = 0; i<mainTable.children.length; i++) 
        {
            if(!mainTable.children[i].children[1].textContent.toUpperCase().includes(task.toUpperCase()))
                mainTable.children[i].style.display = "none";
        }
    date = new Date(date)
    if(date.isValid())
    {
        date = date.toLocaleDateString()
        for (let i = 0; i<mainTable.children.length; i++) 
        {
            var rowDate = new Date(mainTable.children[i].children[2].id).toLocaleDateString();
            if(rowDate !== date)
                mainTable.children[i].style.display = "none";
        }
    }
}

function filterElementsMobile()
{
    var search = taskSearch.value;
    for (let i = 0; i<mainTable.children.length; i++)
        mainTable.children[i].style.display = "";

    if(search !== "")
    {
        for (let i = 0; i<mainTable.children.length; i++) 
        {
            var matches = false;
            if(mainTable.children[i].children[0].textContent.toUpperCase().includes(search.toUpperCase()))
                matches = true;
            if(mainTable.children[i].children[1].textContent.toUpperCase().includes(search.toUpperCase()))
                matches = true;
            if(mainTable.children[i].children[2].textContent.toUpperCase().includes(search.toUpperCase()))
                matches = true;
            if(!matches)
                mainTable.children[i].style.display = "none";
        }
    }
}

function clearSearch()
{    
    codeSearch.value = ""
    taskSearch.value = ""
    dateSearch.value = ""

    for (let i = 0; i<mainTable.children.length; i++)
        mainTable.children[i].style.display = "";
}

function updateLocalStorage()
{
    var tasks = []
    for (let i = 0; i<mainTable.children.length; i++) 
    {
        var task = new Task()
        task.code = mainTable.children[i].children[0].textContent
        task.task = mainTable.children[i].children[1].textContent
        task.date = mainTable.children[i].children[2].id 
        tasks.push(task)
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function restoreRows()
{
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    for(let i = 0; i<tasks.length; i++)
        mainTable.appendChild(createRow(tasks[i].code, tasks[i].task, tasks[i].date));
}

function removeElement() 
{
    var div = this.parentElement.parentElement;
    div.parentNode.removeChild(div);
    updateLocalStorage();
}

function addElement()
{
    var code = codeInput.value;
    var task = taskInput.value;
    var date = dateInput.value;
    if(!validateInput(code, task, date))
        return;

    if(editedRow)
    {
        editedRow.parentNode.replaceChild(createRow(code, task, date), editedRow);
        clearInput();
    }
    else
        mainTable.appendChild(createRow(code, task, date));
    
        updateLocalStorage();
}

function EDITFUNC()
{
    editedRow = this.parentElement.parentElement;
    editedRow.style.backgroundColor = "RED";
    btn = document.getElementById("addButton");
    btn.textContent = "Apply"
	
	
    codeInput.value = editedRow.children[0].textContent;
    taskInput.value = editedRow.children[1].textContent;
    date = new Date(editedRow.children[2].id);
    
    var MONTH = ('0' + (date.getMonth() + 1)).slice(-2)
    var DAY = ('0' + date.getDate()).slice(-2) 
    var FULLDATA = date.getFullYear()+"-"+MONTH+"-"+DAY;

    dateInput.value = FULLDATA;
}

function stopEditing()
{
    if(editedRow)
    {
        editedRow.style.backgroundColor = "white";
        editedRow = null;
        btn = document.getElementById("addButton");
        btn.textContent = "Add"
    }
}

function clearInput()
{
    codeInput.value = ""
    taskInput.value = ""
    dateInput.value = ""
    stopEditing();
}

var editedRow = null;
restoreRows();