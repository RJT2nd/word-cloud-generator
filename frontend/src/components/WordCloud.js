import React from 'react';
import axios from 'axios';
import './css/WordCloud.css';
const { defaultStopwords } = require('../utils/stopwords');

class WordCloud extends React.Component {
    
    constructor(props) {
        super();
        
        this.state = {
            file: null,
            uploading: false,
            stopwords: defaultStopwords,
            list: null
        };
        
        this.handleChangeStopWords = this.handleChangeStopWords.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.upload = this.upload.bind(this);
        this.process = this.process.bind(this);
    }
    
    handleChangeStopWords(event) {
        this.setState({ stopwords: event.target.value });
    }
    
    handleChange(event) {
        var file = event.target.files[0];

        this.setState({
            file: file
        });
    }
    
    upload() {
        

        this.setState({
            uploading: true
        });
        
        if(!this.state.uploading) {
        var formData = new FormData();
        formData.append('wordCloudFile', this.state.file);
        formData.append('stopwords', this.state.stopwords);
        axios.post('/word-cloud', formData)
            .then((response) => {
                if(response.data.success) {
                    window.open('/word-cloud/' + response.data.id);
                }
                
                this.setState({
                    uploading: false
                });
            }).catch((err) => {
                console.log(err, err.stack);
                
                this.setState({
                    uploading: false
                });
            });
        }
            
        
    }
    
    process() {
        

        this.setState({
            uploading: true
        });
        
        if(!this.state.uploading) {
        var formData = new FormData();
        formData.append('wordCloudFile', this.state.file);
        formData.append('stopwords', this.state.stopwords);
        axios.post('/word-cloud/process-text', formData)
            .then((response) => {
                
                var sorted_list = [];
                
                if(response.data.success) {
                    
                    var wordcloud_dict = JSON.parse(response.data.wordcloud_dict[0]);
                    

                    for(var key in wordcloud_dict) {
                        sorted_list.push({
                            word: key,
                            count: wordcloud_dict[key]
                        }); 
                    }
                    
                    sorted_list.sort((a, b) => {
                        return b.count - a.count;
                    });
                    
                }
                
                this.setState({
                    uploading: false,
                    list: sorted_list
                });
            }).catch((err) => {
                console.log(err, err.stack);
                
                this.setState({
                    uploading: false
                });
            });
        }
            
        
    }
    
    render() {
        
        var tableContents = "";
        if(this.state.list) {
            const list = this.state.list;
            
            tableContents = list.map((item) => <tr key={item.word}><td>{item.word}</td><td>{item.count}</td></tr>);
            
        }
        
        return (<div className='WordCloudComponent'>
            <input type='file' onChange={this.handleChange} name='wordCloudFile' accept='application/vnd.openxmlformats-officedocument.presentationml.presentation, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document' />
            <label>
                <textarea value={this.state.stopwords} onChange={this.handleChangeStopWords} />
            </label>
            <div className='btn btn-success' onClick={this.upload}>{ this.state.uploading ? 'uploading...' : 'upload' }{ this.state.uploading ? <div className='loader'></div> : null } </div>
            <div className='btn btn-success' onClick={this.process}>{ this.state.uploading ? 'processing...' : 'process' }{ this.state.uploading ? <div className='loader'></div> : null } </div>
            <table className='process-text'><tbody>
                { this.state.list ? <tr><th>Word</th><th>Count</th></tr> : null }
                { this.state.list ? tableContents : null }
            </tbody></table>
        </div>);
    }
}

export default WordCloud;