import explorer from "./data.js";

const Container = document.getElementById("container");
const Root = document.getElementById("root");


function insertNode(tree,id,isFolder,name){
       if (tree.id === id && tree.isFolder) {
         tree.items.unshift({
           id: ""+new Date().getTime(),
           name: name,
           isFolder: isFolder,
           items: [],
         });

         return tree;
       }

       let latestNode = [];
       latestNode = tree.items.map((ob) => {
         return insertNode(
           ob,
           id,
           isFolder,
           name,
         );
       });

       return { ...tree, items: latestNode };
}

// function deleteNode(event){
//   event.target.parentNode.parentNode.removeChild(event.target.parentNode);
// }


function deleteNode(event){
  event.parentNode.removeChild(event);
}

function deleteNodeById(){
  const input = document.querySelectorAll('#input')
  if(input){
    input.forEach((input)=>{
      deleteNode(input);
    })
  }
}

document.body.addEventListener('click',deleteNodeById);

function enteredFolder(event){
  if(event.key=='Enter'){
    const value = event.target.value;
    const explor = insertNode(explorer,  event.target.parentNode.parentNode.id, true, value);
    Root.innerHTML='';
    renderJSONData(explor, Root);
  }
  
}

function enteredFile(event) {
  if (event.key == "Enter") {
    const value = event.target.value;
    const explor = insertNode(
      explorer,
      event.target.parentNode.parentNode.id,
      false,
      value
    );
    Root.innerHTML = "";
    renderJSONData(explor, Root);
  }
}

function addFolder(event){
 // console.log(event)
  deleteNodeById();
  const div = document.createElement('div');
  const span = document.createElement("span");
  span.innerHTML=`📂`;
const input  = document.createElement('input')
 input.addEventListener("keypress", enteredFolder);
 //input.addEventListener('focusout',deleteNode)
div.id='input'
div.classList.add('child')
div.appendChild(span)
div.appendChild(input)
event.target.parentElement.appendChild(div);

}

//document.getElementById('input').addEventListener('')

function addFile(event){
  deleteNodeById();
  const div = document.createElement("div");
  const span = document.createElement("span");
  span.innerHTML = `📄`;
  const input = document.createElement("input");
  input.addEventListener("keypress", enteredFile);
  input.addEventListener("focusout", deleteNode);
  div.id = "input";
  div.classList.add("child");
  div.appendChild(span);
  div.appendChild(input);
  event.target.parentElement.appendChild(div);
}

function renderJSONData(explorer, Parent) {
  const root = document.createElement("div");
  if (explorer.isFolder == true) {
    const buttonFolder = document.createElement("button");
    buttonFolder.textContent = "Add Folder";
    buttonFolder.classList.add("showbutton");
    buttonFolder.classList.add("float");
    buttonFolder.addEventListener('click',addFolder);
    const buttonFile = document.createElement("button");
    buttonFile.textContent = "Add File";
    buttonFile.classList.add("showbutton");
    buttonFile.classList.add("float");
    buttonFile.addEventListener('click',addFile)
    root.innerHTML = `📂${explorer.name}`;
    root.appendChild(buttonFolder);
     root.appendChild(buttonFile);
     root.id=explorer.id;
    explorer.items.map((value) => {
      renderJSONData(value, root);
    });
    root.addEventListener("click", expand);
  } else {
    root.innerHTML = `📄${explorer.name}`;
    //  root.removeEventListener("click", expand);
  }
  root.classList.add("child");
  for (const child of root.children) {
    child.classList.add("hide");
  }
  Parent.appendChild(root);
}

function expand(event) {
  event.stopPropagation();
  for (const child of event.target.children) {
    child.classList.toggle("show");
  }
}

renderJSONData(explorer, Root);
