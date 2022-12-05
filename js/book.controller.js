'use strict'
var gLastBookReadId 

// קפץ לי משהו חשוב אסיים את התרגיל מחר
function oninit() {
    renderTable()
    renderFilterByQueryStringParams()
}


function renderTable() {
    const books = getbooks()
    const strHTMLs = books.map(book => {
        return `<tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td><button type="button" class="read btn btn-primary" onclick="onReadClick('${book.id}')">Read</button></td>
        <td><button type="button" class="update btn btn-success" onclick="onUpdateClick('${book.id}')">Update</button></td>
        <td><button type="button" class="delete btn btn-danger" onclick="onDeleteClick('${book.id}')">Delete</button></td>
        
        </tr>`
    })
    document.querySelector('tbody').innerHTML = strHTMLs.join('')
}

function onSetFilterBy(filterBy){
    filterBy = setBookFilter(filterBy)
    renderTable()
    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}
function onSetSortBy(){
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked
    const sortBy = {}
    sortBy[prop] = (isDesc)? -1 : 1
    console.log('sortBy', sortBy)


    setBookSort(sortBy)
    renderTable()

}



function onDeleteClick(bookId) {
    deleteBook(bookId)
    renderTable()
}


function onUpdateClick(bookId) {
    var newPrice = +prompt('enter new price')
    if (isNaN(newPrice)) return
    updatePrice(bookId, newPrice)
    renderTable()
}



function onReadClick(bookId) {
    gLastBookReadId = bookId
    var book = getBookById(bookId)
    var elmodal1 = document.querySelector('.modal1')
    elmodal1.querySelector('.rating').innerText = book.rate
    elmodal1.querySelector('h3').innerText = book.title
    elmodal1.querySelector('h4 span').innerText = book.price
    elmodal1.querySelector('.desc').innerText = book.desc
    elmodal1.classList.add('open')

}

function onPlusClick(ev){
    ev.stopPropagation()
    var book = getBookById(gLastBookReadId)
    updateBookRating(book,'+')

    var elmodal1 = document.querySelector('.modal1')

    
    elmodal1.querySelector('.rating').innerText = book.rate


}

function onMinusClick(){
    var book = getBookById(gLastBookReadId)
    updateBookRating(book,'-')

    var elmodal1 = document.querySelector('.modal1')

    
    elmodal1.querySelector('.rating').innerText = book.rate
}




function onClosemodal1(){
    var elmodal1 = document.querySelector('.modal1')
    elmodal1.classList.remove('open')
}

function onAddBook(){
    var title = prompt('New book title?')
    var price = +prompt('New book price?')
    if (isNaN(price)) return alert('price should be a number')
    
    addBook(title,price)
    renderTable()
}

function onNextPage(elbtn) {
    var books = getbooks()
    var pageSize = getPageSize()
    var pageIdx = getPageIdx()
    if (pageIdx * pageSize >= books.length) {
        // updateGpageIdx(pageIdx)
        // fix later
        elbtn.disable= true
    }
    nextPage()
    renderTable()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = { maxPrice: queryStringParams.get('maxPrice') || '' }
    if (!filterBy.maxPrice) return

    setBookFilter(filterBy.maxPrice)
    document.querySelector('.filter-price-range').value=filterBy.maxPrice
}

