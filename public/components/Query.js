
const e = React.createElement;

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "", result: "", query: "" };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);

  }

  changeHandler(e){
    this.setState({
      query: e.target.value
    })
  }

  submitHandler() {
    axios.get("/query")
      .then((response)=> {
        debugger
        this.setState({
          results: response.data.results
        })
      })
      .catch((err)=> {
        this.setState({error: err.response.data.sqlMessage})
      })
  }
  
  render() {

    if(this.state.results) {
      let headers = Object.keys(this.state.results[0])
      var header = 
        <tr>
            {headers.map((header)=><td>{header}</td>)}
        </tr>
        
        var results =
            this.state.results.map((row)=> 
              <tr>
                {headers.map((header)=><td>{row[header]}</td>)}
              </tr>
            )
    }
    return (
      <div>
        <textarea onChange={this.changeHandler}>{this.state.query}</textarea>
        <button onClick={this.submitHandler}> Query</button>

        {this.state.error? <h1>{this.state.error}  </h1>
        : ""  
        }
        {header? 
          <table>
            {header}
            {results}
          </table>
          :""
        }
      </div>
    )
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Query), domContainer);