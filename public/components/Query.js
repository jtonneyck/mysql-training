
class Query extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "", results: [], query: "", db: "sakila" };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleDbChange = this.handleDbChange.bind(this);
    this.export = this.export.bind(this);

  }

  changeHandler(e){
    this.setState({
      query: e.target.value
    })
  }

  submitHandler() {
    axios({
      url: "/query",
      data: {
        query: this.state.query,
        db: this.state.db
      },
      method: "post"
    })
    .then((response)=> {

      this.setState({
        results: response.data.results,
        error: ""
      })
    })
    .catch((err)=> {
      this.setState({error: err.response.data.sqlMessage})
    })
  }
  handleDbChange(e){
    this.setState({
      db: e.target.value
    })
  }

  export() {
    if(this.state.results.length === 0) {
      this.setState({
        error: "There's nothing to export"
      })
    } else {
      let headers = Object.keys(this.state.results[0])
      let values = this.state.results.map((row)=> 
        headers.map((head)=> row[head]).join(",")
      )
      let csv = headers.join(',');
      csv = csv.concat('\n')
      let body = values.join('\n')
      csv = csv.concat(body)
  
      let csvFile = new Blob([csv], {type: "text/csv"});
      window.URL.createObjectURL(csvFile);
      let downloadLink = document.createElement("a");
      downloadLink.download = "export.csv";
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.click()
    }
    
  }
  render() {

    if(this.state.results.length > 0) {
      let headers = Object.keys(this.state.results[0])
      var header = 
        <tr>
            {headers.map((header)=><th>{header}</th>)}
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
        <textarea selected={this.state.db} onChange={this.changeHandler}>{this.state.query}</textarea>
        <button onClick={this.submitHandler}> Query</button>
        <select onChange={this.handleDbChange}>
          <option value="sakila">Sakila</option>
          <option value="northwind">Northwind</option>
          <option value="Chinook">Chinook</option>
        </select>
        <button onClick={this.export}>Export as CSV</button>
        {this.state.error? <h1>{this.state.error}  </h1>
        : ""  
        }
        {header? 
          <div className="table-container">
            <table>
              <thead>
                {header}
              </thead>
              <tbody>
                {results}
              </tbody>
            </table>
          </div>
          :""
        }
      </div>
    )
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<Query />, domContainer);