import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import BookShelf from './BookShelf';
import { Link } from 'react-router-dom';
import Book from './Book';




class App extends Component {
   
    state = {
      books : [],
      showingBooks: [],
      query: ""
    }

    // what this mean is that the component will not load until the book has
    // been load

    updateShelf = (book, shelf) => {
      let books;
      if (this.state.books.findIndex(b => b.id === book.id) > 0) {
        // change the position of an existing book in the shelf
        books = this.state.books.map(b => {
          if (b.id === book.id) {
            return {...book, shelf}
          } else {
            return b
          }
        })
      } else {
        // add a new book to the shelf
        books = [...this.state.books, {...book, shelf}]
      }
  
      this.setState({books})
  
      BooksAPI.update(book, shelf).then((data) => {
        // shelf updated on the server
      })
    }


    // what this mean is that the component will not load until the book has
    // been load

    componentDidMount() {
      // it is Promise, then is the response
      BooksAPI.getAll()
      .then((books) => {
           this.setState(() => ({
              books
           }))
      })
    }

    updateQuery = (query) => {
      this.setState({query:query})
      let showingBooks = []
      if(query) {
        // that is a promise, it work with asynchoronus function. it is not executed immedaiately. so the response is
        BooksAPI.search(query).then(response => {
          if(response.length) {

            // The map() method creates a new array populated with the 
            //results of calling a provided function on every element in the calling array
            //showing book is an array where b
            showingBooks = response.map(b => {
               
              // findIndex() is an inbuilt function that returns an index of the first item in an array
              //it runs for every element i
              //the next line want to know if the first item due to the query exist
               const index = this.state.books.findIndex(c => c.id === b.id)
               
               if(index>=0) {
                 return this.state.books[index]  //if it exist it will display the index of the book it find to be exist
               }else {
                 return b;
               }
            })
          }
          this.setState({showingBooks})
        })
      }
      else{
        this.setState({showingBooks})
      }

    }





    render () {

      const { query } = this.state;
       return (
          <div>
            <Route exact path ='/' render = {() => (
              <BookShelf books = {this.state.books}  onUpdateShelf = {(book,shelf) => this.updateShelf(book, shelf)}/>
            )}/>

            <Route path = '/search' render = {() => (
                 <div className = "app">
                 <div className="search-books">
             <div className="search-books-bar">
               <Link className="close-search" to = '/'>Close</Link>
               <div className="search-books-input-wrapper">
                 <input 
                 value= {query} 
                 onChange = {(event) => this.updateQuery(event.target.value)} 
                 type="text" 
                 placeholder="Search by title or author"/>
     
               </div>
             </div>


             <div className="search-books-results">
               <ol className="books-grid">
                 {this.state.showingBooks.map((book, i) => (
                      <Book key={i} book={book}
                      onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)}/>
                 ))}
               </ol>
             </div>
           </div>
          
         </div>
            )}/>

          </div>

       )
    }


}



export default App;
