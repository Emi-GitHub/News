import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NewsList from './NewsList';
import ButtonBar from './ButtonBar';
import SearchBarEverything from './SearchBarEverything';
import '../styles/Home.css';
import '../styles/Everything.css';

class Everything extends Component { 
    state = {
        news: [],
        rememberTerm:'',
        radio1: true,
        radio2: false,
        radio3: false,
        background: 'ui text loader', 
        loaded: 'loaded-api',
        loading: 'ui active inverted dimmer',
        forSearch: 'hide-app',
        forHeader: 'hide-app'
    }
    EverythingApi = term => {
        this.setState({
            radio1: true,
            radio2: false,
            radio3: false
        })
        const BASE_URL = 'https://newsapi.org/v2/everything?';
        const API_KEY = 'apiKey=' + process.env.REACT_APP_API_KEY;
        const q = term; 
        const url = BASE_URL + 'q=' + q + '&' + API_KEY;
        axios.get(url).then(response => {
            this.setState({
                news: response.data.articles,
                rememberTerm: q,
                background: 'background',
                loaded: 'nothing',
                loading: 'nothing',
                forSearch: 'nothing',
                forHeader: 'topheadlines-card'
            })
        })
        .catch(error => console.error('Api error', error)) 
    }
    EverythingApiCheck = ( term, radio ) => {
        var sortBy;
        if(radio === "radio1") {
            this.setState({
                radio1: true,
                radio2: false,
                radio3: false
            })
            sortBy = 'populartiy';
        }
        else if(radio === "radio2") {
            this.setState({
                radio1: false,
                radio2: true,
                radio3: false
            })
            sortBy = 'relevance';
        }
        else if(radio === "radio3") {
            this.setState({
                radio1: false,
                radio2: false,
                radio3: true
            })
            sortBy = 'publishedAt';
        }
        const BASE_URL = 'https://newsapi.org/v2/everything?';
        const API_KEY = 'apiKey=' + process.env.REACT_APP_API_KEY;
        const q = term; 
        const url = BASE_URL + 'q=' + q + '&sortBy=' + sortBy + '&' + API_KEY;
        axios.get(url).then(response => {
            this.setState({
                news: response.data.articles,
                rememberTerm: q
            })
        })
        .catch(error => console.error('Api error', error))  
    }
    render() {
        const notFound = () =>{
            return (
                <div className="not-found"> 
                    <p>Your search - <b>{this.state.rememberTerm}</b> - did not match any documents.</p>
                    <p>Suggestions:</p> 
                    <li>Make sure that all words are spelled correctly.</li>
                    <li>Try different keywords.</li>
                    <li>Try more general keywords.</li>
                    <li>Try fewer keywords.</li>
                </div>
            )
        }
        return (
           <div className={this.state.loaded}>
               <div className={this.state.loading}>
                    <div className={this.state.background}>
                        <div className={this.state.forSearch}>
                            <SearchBarEverything 
                                EverythingApi={this.EverythingApi} 
                                EverythingApiCheck={this.EverythingApiCheck} 
                                rememberTerm={this.state.rememberTerm} 
                                radio1={this.state.radio1} 
                                radio2={this.state.radio2} 
                                radio3={this.state.radio3}
                                firstTerm = {this.props.location.state.term}
                            />
                        </div>
                        <div className={this.state.forSearch}>
                            <div className="topheadlines-card">
                                <div className="transparent-div">
                                    <Link to="/" className="go-back">
                                        <i className="left chevron icon"/>
                                        Go back to home page
                                    </Link>
                                    <div className="header-top">Search for...</div>
                                    <NewsList news={this.state.news} />
                                    {this.state.news.length === 0 ? notFound() : <ButtonBar news={this.state.news} /> }
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
           </div>
        )
    }
}

export default Everything;