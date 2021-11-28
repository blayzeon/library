/*
    This program creates books and adds them to a library array.  
    The books all have their own titles, authors, pages, and statuses

    Tutorials used:
    1. https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/objects-and-object-constructors#the-prototype
    2. https://javascript.info/prototype-inheritance
    3. https://www.youtube.com/watch?v=CDFN1VatiJA
    4. https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    5. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON

    * There is a function that will loop through the library and display each book on the page
    * New books can be added using a new book button on the page
    * Each book will have a button that will allow the user to remove it
    * Each book will have a button to toggle its read status
    * The books will save so that when the user refreshes, the books will still be there

*/

// stores books
let myLibrary = [];

// book prototype
const book = class {
    constructor(title, author, pages, stat){
        this.title = title
        this.author = author
        this.pages = pages
        this.stat = stat
        return this
    }
}

// storage management
function updateStorage(type, index, array="n/a"){
    /* 
        Cycle through the myLibrary Array
        Grab each value and add them to an array
        Add it to local storage (it is automatically turned into a string separated by commas)

    */

    // add the array to storage
    if (type == "add"){
        localStorage.setItem(`book${index}`, array);
    } else {
        localStorage.clear();
        for (i = 0; i < myLibrary.length; i++){
            let tempArray = [myLibrary[i].title, myLibrary[i].author, myLibrary[i].pages, myLibrary[i].stat];
            localStorage.setItem(`book${i}`, tempArray);
        }
    }
}

// add books to library
function addBookToLibrary(valueArray=[]){
    // checks to make sure no values are empty
    function checkForm(idArray){
        for (i = 0; i < idArray.length; i++){
            if (document.getElementById(idArray[i]).value == ''){
                // provide an error if more info is needed
                throw "Please enter all of the required fields."
            }
        }
    }

    try{
        checkForm(['book-title', 'book-author', 'book-pages', 'book-stat']);
    } catch (err){
        if (valueArray == []){
            alert(err);
            return;
        }
    }

    // no errors, add the book to the end of the array myLibrary
    if (valueArray.length == 0){
        valueArray = [
            document.getElementById('book-title').value,
            document.getElementById('book-author').value,
            document.getElementById('book-pages').value,
            document.getElementById('book-stat').value,
        ];

        // update storage
        storage = true;
    }
    let stat = false;
    if (valueArray[3] == "true"){
        stat = true;
    } 
    newBook = new book(valueArray[0], valueArray[1], valueArray[2], stat);
    myLibrary.push(newBook); // add to the library

    // display the book
    updateStorage("add", myLibrary.length-1, valueArray);
    displayBooks();
}    

// makes books appear on page
function displayBooks(){
    const dump = document.getElementById('book-dump');

    if (myLibrary.length > 0){
        // removes the old babies
        document.querySelectorAll('.generated-book').forEach((baby) =>{
            dump.removeChild(baby);
        });

        /* 
            Creates an element for each item in the myLibrary array
            and dumps it in the dump element (#book-dump)
        */

        function generateMsg(index){
            let temp = "Not read yet";
            if (myLibrary[index].stat == true){
                temp = "Read";
            }
            return temp;
        }

        for (i = 0; i < myLibrary.length; i++){
            const book = document.createElement('li');
            book.setAttribute('id', `book-${i}`);
            book.classList.add('generated-book');

            book.innerHTML = `
                <ul class="book-card">
                    <li class="space-between">
                        <i class="material-icons btn-book-toggle" data-index="${i}">visibility</i>
                        <i class="material-icons btn-book-remove" data-index="${i}">close</i>
                    </li>
                    <li class="center"><h3 id="book-title${i}">${myLibrary[i].title}</h3></li>
                    <li>Author: <span>${myLibrary[i].author}<span></li>
                    <li>Pages: <span>${myLibrary[i].pages}<span></li>
                    <li>Status: <span id="book-card-status${i}">${generateMsg(i)}<span></li>
                </ul>
            `;
            dump.appendChild(book);

            const titleFont = document.getElementById(`book-title${i}`);
            if (myLibrary[i].title.length > 20){
                titleFont.classList.add('small-font');
            } else {
                titleFont.classList.add('large-font');
            }
        }

        // add the event listeners
        dump.querySelectorAll('.btn-book-toggle').forEach((btn) =>{
            // when the user clicks the eyeball icon, it toggles whether or not the book was read
            const index = btn.dataset.index;
            btn.addEventListener('click', ()=>{
                if (myLibrary[index].stat == true){
                    myLibrary[index].stat = false;
                } else {
                    myLibrary[index].stat = true;
                }
                document.getElementById(`book-card-status${index}`).innerHTML = `${generateMsg(index)}`;
            });
        });

        dump.querySelectorAll('.btn-book-remove').forEach((btn) =>{
            // when the user clicks the x icon, it removes the book
            btn.addEventListener('click', ()=>{
                const index = btn.dataset.index;
                const cardParent = document.getElementById(`book-${index}`);
                
                if (myLibrary.length == 1){
                    myLibrary = [];
                    dump.removeChild(cardParent);
                } else {
                    myLibrary.splice(index, 1);
                }
                // display the changes
                updateStorage('remove', index);
                displayBooks();
            });
        });
    } else {
        dump.innerHTML = `<li class="generated-book white-text"><h3>There are no books to display; try adding some!</h3></li>`;
    }
}

// event listener to add books
document.getElementById('book-add').addEventListener('click', ()=>{
    addBookToLibrary()
});
document.getElementById('book-clear').addEventListener('click',()=>{
    let r = confirm('Are you sure you wish to clear the form?');
    if (r == true){
        document.getElementById('book-title').value = "";
        document.getElementById('book-author').value = "";
        document.getElementById('book-pages').value = "";
    }
});

// add books for testing
function createBooks(number){
    for (i = 0; i < number+1; i++){
        tempArray = [`cat${i}`, 'mr. cat', '100', false];
        addBookToLibrary(tempArray);
    }
}

if (localStorage.length > 0){
    /*
        We need to loop through local storage and once we have an array, clear it, so we can re-add it 
        We do this to ensure the indexing stays correct in the event a user deletes items out of order 
    */
    let bookArray = [];
    const index = localStorage.length;
    for (i = 0; i < index; i++){
        const index = localStorage.key(i);
        const tempBook = localStorage.getItem(index).split(',');
        bookArray.push(tempBook);
    }

    localStorage.clear();
    for (j = 0; j < index; j++){
        addBookToLibrary(bookArray[j]);        
    }
}
displayBooks();