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
const book = function createNewBook(title, author, pages, stat, array=myLibrary) {
    return {
        title,
        author,
        pages,
        stat,
        remove(parent, child){
            const a = confirm('Would you like to remove this book?');
            if (a === true){
                array.splice(array.indexOf(this), 1);
                parent.removeChild(child);
            }
            toggle();
        },
        toggle(){
            if (this.stat === "true"){
                this.stat = "false"
            } else {
                this.stat = "true";
            }
        }
    }
}

// add books to library
const add = function addBookToLibrary(valueArray=[document.getElementById('book-title').value, document.getElementById('book-author').value, document.getElementById('book-pages').value, document.getElementById('book-stat').value]){
    newBook = book(valueArray[0], valueArray[1], valueArray[2], valueArray[3]);
    myLibrary.push(newBook); // add to the library
    return newBook;
}    

// creates the DOM element for the book
const display = function displayBook(newBook){
    function updateStatusMsg(){
        if (newBook.stat === 'false'){
            return 'Not read';
        } else {
            return 'Read'
        }
    }

    function updateStorage(){
        localStorage.setItem('books', JSON.stringify(myLibrary));
    }

    const statusMsg = updateStatusMsg();

    // create the elements
    const library = document.getElementById('book-dump');
    const book = document.createElement('ul');
    const btnContainer = document.createElement('li')
    const removeBtn = document.createElement('h3');
    const authorContainer = document.createElement('li');
    const pagesContainer = document.createElement('li');
    const statusContainer = document.createElement('li');
    const author = document.createElement('span');
    const pages = document.createElement('span');
    const status = document.createElement('span');
    
    // adding classes
    btnContainer.classList.add('space-between');
    book.classList.add('book-card');
    statusContainer.classList.add('book-pointer');
    removeBtn.classList.add('book-pointer');

    // adding flavor
    removeBtn.innerText = newBook.title;
    authorContainer.innerText = 'Author: ';
    pagesContainer.innerText = 'Pages: ';
    statusContainer.innerText = 'Status: ';
    author.innerText = newBook.author;
    pages.innerText = newBook.pages;
    status.innerText = statusMsg;

    // append the flavor to the <li>
    btnContainer.appendChild(removeBtn);
    authorContainer.appendChild(author);
    pagesContainer.appendChild(pages);
    statusContainer.appendChild(status);
    // append the <li> to the <ul>
    book.appendChild(btnContainer);
    book.appendChild(authorContainer);
    book.appendChild(pagesContainer);
    book.appendChild(statusContainer);
    // append together
    library.appendChild(book);

    // add event listeners
    removeBtn.addEventListener('click', ()=>{
        newBook.remove(library, book);
        updateStorage();
    });

    statusContainer.addEventListener('click', ()=>{
        newBook.toggle();
        status.innerText = updateStatusMsg();
        updateStorage();
    });
}

// toggle the no books message
const toggle = function toggleDisplayMessage(){
    const elm = document.getElementById('default-msg');
    if (myLibrary.length === 0){
        elm.classList.remove('hide-me');
    } else {
        elm.classList.add('hide-me');
    }
}

// add existing books from local storage (if available)
const storage = JSON.parse(localStorage.getItem('books'));
if (storage !== null && storage.length > 0){
    for (let i = 0; i < storage.length; i += 1){
        const adding = add([storage[i].title, storage[i].author, storage[i].pages, storage[i].stat]);
        display(adding);
    }
} else {
    document.getElementById('default-msg').classList.remove('hide-me');
}

// event listener to add books
document.getElementById('book-add').addEventListener('click', ()=>{
    const elm1 = document.getElementById('book-title');
    const elm2 = document.getElementById('book-author');
    const elm3 = document.getElementById('book-pages');
    
    let valid = true;
    if (!elm1.checkValidity() || !elm2.checkValidity() || !elm3.checkValidity()){
        valid = false;
    } 

    if (valid === true){
        const newBook = add();
        display(newBook);
        localStorage.setItem('books', JSON.stringify(myLibrary));
        document.getElementById('book-title').value = "";
        document.getElementById('book-author').value = "";
        document.getElementById('book-pages').value = "";
        toggle();
    }
});

document.getElementById('book-clear').addEventListener('click',()=>{
    const r = confirm('Would you like to clear all books?');
    if (r === true){
        localStorage.clear();
        document.getElementById('book-dump').innerHTML = '<li id="default-msg" class="hide-me white-text">There are no books to display</li>';
        myLibrary = [];
        toggle();
    }
});

toggle();
