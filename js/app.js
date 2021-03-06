var my_news = [
    {
        id: 1,
        author: 'Alex',
        text: 'CSS link',
        moreText: 'An external style sheet can be written in any text editor. The file should not contain any html tags. The style sheet file must be saved with a .css extension'
    },
    {
        id: 2,
        author: 'Vasia',
        text: 'Getting started',
        moreText: "For this tutorial, we're going to make it as easy as possible. Included in the server package discussed above is an HTML file which we'll work in. "
    },
    {
        id: 3,
        author: 'Dmitry',
        text: 'Installing Watchman. It is absolutely free!',
        moreText: ''
    }
];


window.ee = new EventEmitter();


var Article = React.createClass({
    propTypes: {
        article: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            moreText: React.PropTypes.string
        })
    },

    getInitialState: function() {
        return {
            readMore: false
        }
    },

    afterReadMoreClick: function() {
        console.log('Click Boooom! on artcile with ID: ' + this.props.article.id);
    },

    readMoreClick: function(e) {
        e.preventDefault();
        this.setState({'readMore': !this.state.readMore}, this.afterReadMoreClick());
    },

    render: function() {
        var article = this.props.article;
        var readMore = this.state.readMore;

        var readMoreLink = <a href="#" onClick={this.readMoreClick}>{readMore ? 'less': 'more'} details</a>

        return (
            <div className='article'>
                <p className="news__author">{article.author}:</p>
                <p className="news__text">{article.text}</p>
                <p className={"news__moreText " + (readMore ? '': 'hidden')}>{article.moreText}</p>
                {article.moreText ? readMoreLink: <p>no details</p>}
            </div>
        )
    }
});

var News = React.createClass({
   propTypes: {
       data: React.PropTypes.array.isRequired
   },

   render: function() {
       var data = this.props.data;
       var newsTemplate = data.map(function(article, index){
          return (
              <Article  article={article} key={index} />
          )
       }) ;

       return (
           <div className='news'>
               {data.length ? newsTemplate : "Unfortunately news aren't existed"}
               <p className={data.length ? '': 'hidden'}>Total news: {data.length}</p>
           </div>);
   }

});

var App = React.createClass({
   getInitialState: function() {
       return {
           news: my_news
       }
   },

   componentDidMount: function(){
       console.log("APP componentDidMount");

       var self = this;
       window.ee.addListener('News.add', function(item){
           item.id = self.state.news.length || 0 + 1;
           self.setState({news: [item].concat(self.state.news)});
       });

   },

   render: function() {
        return (
            <div className='app'>
                <strong className='title'>The latest news:</strong>
                <News data={this.state.news}/>
                <Add />
            </div>
        );
   }
});

var Comment = React.createClass({
    render: function() {
        return (
            <div className='comments'>No news - no comments</div>
        )
    }
});

var Add = React.createClass({
    getInitialState: function(){
        return {
            authorIsEmpty: true,
            textIsEmpty: true
        }
    },

    componentDidMount: function(){
        ReactDOM.findDOMNode(this.refs.authorInput).focus();
    },

    submit: function(e) {
        e.preventDefault();
        var new_news = {
            author: ReactDOM.findDOMNode(this.refs.authorInput).value,
            text: ReactDOM.findDOMNode(this.refs.textInput).value,
            moreText: ReactDOM.findDOMNode(this.refs.moreTextInput).value
        };

        window.ee.emit('News.add', new_news);
    },

    onFieldChange: function(fieldName, e){
        var changedState = {};
        changedState[fieldName] = e.target.value.trim().length ? false : true;
        this.setState(changedState);
        //this.setState({[''+fieldName]:e.target.value.trim().length ? false : true});
    },

    render: function() {
        var submitIsDisabled = this.state.authorIsEmpty || this.state.textIsEmpty;
        return (
            <form className="add-news">
                <input type="text" placeholder='Enter author' defaultValue=''
                       ref='authorInput' onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}/>

                <textarea placeholder='Enter text' defaultValue='' ref='textInput'
                     onChange={this.onFieldChange.bind(this, 'textIsEmpty')}/>

                <textarea placeholder='Enter moreText' defaultValue='' ref='moreTextInput' />

                <button onClick={this.submit} disabled={submitIsDisabled}>Submit</button>
            </form>
        )
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);