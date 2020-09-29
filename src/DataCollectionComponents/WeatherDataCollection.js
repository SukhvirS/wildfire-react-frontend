import React from 'react';
import './reactPaginationStyle.css';
import { MDBDataTable } from 'mdbreact';
import CountySelector from '../CountySelector';

const devUrl = '';
const prodUrl = 'https://wildfire-flask-backend.herokuapp.com';

class WeatherDataCollection extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            source: 'NOAA',
            lat: props.lat,
            lon: props.lon,
            firstTime: true,
            currentCounty: 'Almeda',
            data: null,
        }

        this.getData = this.getData.bind(this);
        this.getNOAAdata = this.getNOAAdata.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.changeCounty = this.changeCounty.bind(this);
        this.toggleFilterDiv = this.toggleFilterDiv.bind(this);
    }

    componentDidMount(){
        var today = new Date();

        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDate();

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        if(month < 10){
            month = "0" + month;
        }
        if(day < 10){
            day = "0" + day;
        }

        var monthAgo = year+'-'+month+'-'+day;

        this.getNOAAdata(monthAgo, today);

    }


    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }


    getData(){
        var startDate = document.getElementById('startDateInput').value;
        var endDate = document.getElementById('endDateInput').value;

        var today = new Date();
        today = this.formatDate(today);

        if(startDate > today || startDate > today || endDate > today || endDate > today){
            alert("Can't pick future dates.");
            return;
        }

        if(startDate > endDate){
            alert('Start date must be before end date.');
            return;
        }

        if(startDate === '' || endDate === ''){
            alert('Please select a start and end date');
            return;
        }

        if(this.state.source === 'NOAA'){
            this.getNOAAdata(startDate, endDate);
        }

    }

    getNOAAdata(start, end){
        fetch(prodUrl + '/api/getNOAAdata', {
            method:'POST',
            body: JSON.stringify({
                startDate: start,
                endDate: end
            })
        })
        .then(res => res.json())
        .then(response => {
            var rawData = response['rawData'];
            var parsedData = JSON.parse(rawData);

            var cols = [];
            var rows = [];
        
            for(const key in parsedData){
                var newColEntry = {
                    label: key,
                    field: key,
                    sort: 'asc',
                    width: 150,
                }
                cols.push(newColEntry);
            }

            for(var i=0; i<Object.keys(parsedData['DATE']).length; i++){      
                var newRowEntry = {}
                for(const key in parsedData){
                    var val = parsedData[key][i];
                    if (val == null){
                        val = ''
                    }
                    newRowEntry[key] = val
                }
                rows.push(newRowEntry);
            }

            var data = {
                columns: cols,
                rows: rows,
            }

            this.setState({
                data: data,
            })
        })
    }

    toggleFilterDiv(){
        var filterDiv = document.getElementById('filterDiv');
        if(filterDiv.style.display == ''){
            filterDiv.style.display = 'none';
        }
        else{
            filterDiv.style.display = '';
        }
    }

    changeCounty(childData){
        this.setState({
            currentCounty: childData,
        })
    }

    render(){
        return(
            <div className="jumbotron" style={{margin:'10px 0 50px 0', paddingTop:'20px'}}>
                <div style={{width:'100%', height:'50px'}}>
                    <h4 style={{padding:'0 10px 0 0', float:'left', padding:'12px 0 0 0'}}>
                        Weather
                    </h4>
                    <button className='btn btn-dark' style={{float:'right'}} onClick={this.toggleFilterDiv}>
                        Filter 
                        &nbsp;
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-filter" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                </div>
                <hr/>
                <div style={{display:'none', height:'auto'}} id='filterDiv'>
                    <div style={{width:'100%'}}>
                        <div style={{float:'left'}}>
                            Source: &nbsp;&nbsp;
                            <select id="dataSourceInput" style={{padding:'14px'}}>
                                <option value='NOAA'>NOAA</option>
                            </select>
                        </div>
                        <div style={{float:'right'}}>
                            From:&nbsp;
                            <input type='date' style={{padding:'10px'}} id="startDateInput"/>
                            &nbsp; - &nbsp;
                            <input type='date' style={{padding:'10px'}} id='endDateInput'/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                    <div style={{width:'100%'}}>
                        <div style={{float:'left'}}>
                            County: &nbsp;&nbsp;
                            <CountySelector parentCallback={this.changeCounty}/>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <button className='btn btn-primary' onClick={this.getData} style={{margin:'0 auto', display:'block'}}>Get Data</button>
                    <hr/>
                </div>
                <div>
                    <div>
                        {
                            !this.state.data?
                            <div>Getting data...</div>
                            :
                            <MDBDataTable responsive
                            striped
                            bordered
                            data={this.state.data}
                            />
                        }
                    </div>
                </div>
            </div>

        );
    }
}

export default WeatherDataCollection;