const itemInput = document.getElementById('itemInput');
const addItemBtn = document.getElementById('addItemBtn');
const updateItemBtn = document.getElementById('updateItemBtn');
const itemsdisplaySpace = document.getElementById('itemsdisplaySpace');
const filterItems = document.getElementById('filterItems');
const emptyTheList = document.getElementById('emptyTheList');
itemsdisplaySpace.classList.add('row');
let itemArray = [];
let editingOn = false;
let deletion = true;

if(JSON.parse(localStorage.getItem('iArray'))){
    itemArray=JSON.parse(localStorage.getItem('iArray'));
}else{
    itemArray = [];
}

const editItem = (eve) => {
    if (editingOn === false) {
        localStorage.setItem('editId', eve.id);
        eve.classList.add('faint', 'disable');
        updateItemBtn.classList.remove('d-none');
        updateItemBtn.classList.add('d-block');
        addItemBtn.classList.add('d-none');
        addItemBtn.classList.remove('d-block');
        editingOn = true;
        itemInput.value = eve.innerText.substring(0, eve.innerText.length - 1);
    }
}

const updateItem = () => {
    let id = localStorage.getItem('editId');
    editingOn = false;
    itemArray.forEach(ele => {
        if (id === ele.id) {
            ele.item = itemInput.value;
            return;
        }
    })
    itemInput.value = '';
    localStorage.setItem('iArray', JSON.stringify(itemArray))
    itemArray=JSON.parse(localStorage.getItem('iArray'));
    templating(itemArray);
    updateItemBtn.classList.add('d-none');
    updateItemBtn.classList.remove('d-block');
    addItemBtn.classList.remove('d-none');
    addItemBtn.classList.add('d-block');
    itemInput.focus();
}

const deleteItem = (eve) => {
    deletion = true;
    editingOn = true;
    let deleteIdIndex = itemArray.findIndex(ele => ele.id === eve.closest('div').id);
    if(confirm("Are you sure you want to delete single item?")){
        itemArray.splice(deleteIdIndex, 1);
    }    
    localStorage.setItem('iArray', JSON.stringify(itemArray))
    itemArray=JSON.parse(localStorage.getItem('iArray'));
    templating(itemArray);
    filterItems.value='';
}

const templating = (arr) => {
    let result = ``;
    arr.forEach((ele) => {
        result += `<div id="${ele.id}" onclick="editItem(this)" class="d-flex justify-content-between p-1 border border-secondary rounded col-md-5 mx-1 my-1">
                    <div>${ele.item}</div>
                    <button type="button" class="close text-danger pr-1" aria-label="Close">
                         <span aria-hidden="true" onclick="deleteItem(this)">&times;</span>
                    </button>
                </div>
                `
    })
    itemsdisplaySpace.innerHTML = result;
}

const addItem = () => {
    let obj = {};
    let duplicate = false;
    if(itemInput.value.trim() === ''){
        alert("Empty item can't be created");
        itemInput.value='';
        return;        
    }
    itemArray.forEach(ele => {
        if (ele.item === itemInput.value) {
            duplicate = true;
            alert("Duplicate entry");
        }
    })
    if (!duplicate) {
        obj = {
            item: itemInput.value,
            id: create_UUID()
        }
        itemArray.push(obj);
        localStorage.setItem('iArray', JSON.stringify(itemArray))
    }
    itemInput.value = '';
    itemArray=JSON.parse(localStorage.getItem('iArray'));
    templating(itemArray);
    itemInput.focus();
}

const filterOperation = (eve) => {
    console.log(eve.target.value);
    let dummyArray = [];
    dummyArray = itemArray.filter(ele => ele.item.includes(eve.target.value));
    templating(dummyArray);
}

const clearTheList = (eve) => {
    if(confirm("Are you sure you want to delete all the entries?")){
        itemArray.length = 0;
        localStorage.setItem('iArray', JSON.stringify(itemArray));
        templating(itemArray);
        filterItems.value='';
    } 
}
templating(itemArray);

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

addItemBtn.addEventListener('click', addItem);
updateItemBtn.addEventListener('click', updateItem);
filterItems.addEventListener('keyup', filterOperation);
emptyTheList.addEventListener('click', clearTheList);