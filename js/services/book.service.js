'use strict'
const STORAGE_KEY = 'carDB'
const PAGE_SIZE = 5


var gPageIdx = 0
var gTitles = ['The alchemist', 'Diary of a whimp', 'Narnia', 'shrek', 'rich dad poor dad']
var gBooks
var gFilterBy = { maxPrice: 500, minRate: 0 }
_createBooks()

function getPageSize(){
    return PAGE_SIZE
}
function getPageIdx(){
    return gPageIdx
}
function setBookFilter(filterBy = {}){
    gPageIdx = 0
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    console.log(gFilterBy)
    return gFilterBy
}
function setBookSort(sortBy = {}){
    gPageIdx = 0
    if (sortBy.maxPrice !== undefined) {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.maxPrice)
       
    } 
     if (sortBy.minRate !== undefined) {
        gBooks.sort((c1, c2) => (c1.rate - c2.rate) * sortBy.minRate)
        
        
    }
}
function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}
// function updateGpageIdx(pageIdx){
//     gPageIdx = pageIdx 
// }



function updatePrice(bookId, newPrice) {
    var bookIdx = findBookIdxById(bookId)
    gBooks[bookIdx].price = newPrice
    _saveBooksToStorage()

}
function deleteBook(bookId) {
    var bookIdx = findBookIdxById(bookId)
    gBooks.splice(bookId, 1)
    _saveBooksToStorage()

}
function addBook(title, price) {
    const BOOK = _createBook(title, price)
    gBooks.unshift(BOOK)
    _saveBooksToStorage()

}
function updateBookRating(book,action){
    var bookIdx = findBookIdxById(book.id)
    if (action === '+') ++gBooks[bookIdx].rate
    if (action === '-') --gBooks[bookIdx].rate
    if(gBooks[bookIdx].rate<0) gBooks[bookIdx].rate = 0
    if(gBooks[bookIdx].rate>10) gBooks[bookIdx].rate = 10
    _saveBooksToStorage()


}
function findBookIdxById(bookId) {
    return gBooks.findIndex(book => book.id === bookId)

}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}



function getbooks() {
    var books =  gBooks.filter(book => book.price<=gFilterBy.maxPrice &&
        book.rate >= gFilterBy.minRate)

    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
    

}


function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 12; i++) {
            var title = gTitles[getRandomIntInclusive(0, gTitles.length - 1)]
            var price = getRandomIntInclusive(0, 100)
            books.push(_createBook(title, price))
        }
    }
    gBooks = books

    _saveBooksToStorage()
}

function _createBook(title, price) {

    return {
        id: makeId(),
        title: title,
        price: price,
        desc: makeLorem(),
        rate: 0
    }

}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}



