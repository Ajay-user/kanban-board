// list containers
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// buttons
const add = document.querySelectorAll(".add");
const save = document.querySelectorAll(".save");

// add-input-container
const addInputContainer = document.querySelectorAll(".add-container");

// default list to populate in the absense of local-storage
let mylist = {
  backlogList: ["Learn something new", "Sit back and relax"],
  progressList: ["Work on projects", "Listen to music"],
  completeList: ["Being cool", "Getting stuff done"],
  onHoldList: ["Being uncool"],
};

const listNames = ["backlogList", "progressList", "completeList", "onHoldList"];

const deleteListItem = (content, key) => {
  console.log("delete fn");
  editStore(null, key, content);
};
const editListItem = (content, key) => {
  deleteListItem(content, key);
  const index = listNames.findIndex((item) => item === key);
  addInputContainer[index].children[0].textContent = content;
  addButton(index);
};

const createListItem = (content, key) => {
  const element = document.createElement("li");
  element.classList.add("drag-item");
  element.textContent = content;
  element.draggable = true;
  element.ondragstart = dragStart;

  element.id = key;

  const deleteEl = document.createElement("span");
  deleteEl.classList.add("delete-drag-item");
  deleteEl.textContent = "✖";
  deleteEl.onclick = () => {
    deleteListItem(content, key);
  };
  const editEl = document.createElement("span");
  editEl.classList.add("edit-drag-item");
  editEl.textContent = "✐";
  editEl.onclick = () => {
    editListItem(content, key);
  };

  element.append(deleteEl, editEl);

  return element;
};

const updateElement = (key) => {
  switch (key) {
    case "backlogList":
      return backlogList;
    case "progressList":
      return progressList;
    case "completeList":
      return completeList;
    case "onHoldList":
      return onHoldList;
    default:
      break;
  }
};

// populate list items
const updateDOM = (list) => {
  let element;
  for (const [key, value] of Object.entries(list)) {
    console.log(`${key}: ${value}`);
    element = updateElement(key);
    element.textContent = "";
    value.forEach((item) => element.appendChild(createListItem(item, key)));
  }
};

// set-up local storage
const createStore = (store) => {
  window.localStorage.setItem("myList", JSON.stringify(store));
  updateDOM(store);
};

// local-storage check
const checkLocalStore = () => {
  const store = window.localStorage.getItem("myList");
  if (store) {
    //   update Dom
    mylist = JSON.parse(store);
    updateDOM(mylist);
  } else {
    //   create a default - local storage
    createStore(mylist);
  }
};

// update the store
const editStore = (add, remove, value) => {
  let newStore = mylist;
  if (remove) {
    newStore[remove] = newStore[remove].filter((val) => val != value);
  }
  if (add) {
    newStore[add].push(value);
  }

  createStore(newStore);
};

// -------------- drag functionality ----------------

let dragItem;
let parentList;

const dragStart = (e) => {
  dragItem = e.target;
  parentList = e.target.id;
  console.log(e);
};

const dragEnter = (el) => {
  element = updateElement(el);
  element.classList.add(`${el}-over`);
};

const dragOver = (el) => {
  event.preventDefault();
  element = updateElement(el);
  element.classList.add(`${el}-over`);
};

const dragLeave = (el) => {
  element = updateElement(el);
  element.classList.remove(`${el}-over`);
};

const drop = (el) => {
  event.preventDefault();
  element = updateElement(el);
  element.classList.remove(`${el}-over`);
  element.appendChild(dragItem);

  editStore(el, parentList, dragItem.childNodes[0].data);
};

// ----------------   save , add  button functionality  ----------

const addButton = (num) => {
  add[num].classList.toggle("solid");
  save[num].classList.toggle("solid");
  addInputContainer[num].classList.toggle("solid");
};

const saveButton = (num) => {
  add[num].classList.toggle("solid");
  save[num].classList.toggle("solid");
  addInputContainer[num].classList.toggle("solid");

  const listName = listNames[num];
  const content = addInputContainer[num].children[0].textContent;

  element = updateElement(listName);
  element.appendChild(createListItem(content, listName));
  editStore(listName, null, content);

  addInputContainer[num].children[0].textContent = "";
};

// ------------------------ onLoad -------------------------------
checkLocalStore();
