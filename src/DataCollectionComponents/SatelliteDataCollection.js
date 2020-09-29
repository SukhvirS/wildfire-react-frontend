import React from 'react';
import CountySelector from '../CountySelector';
import { MDBDataTable } from 'mdbreact';

const devUrl = '';
const prodUrl = 'https://wildfire-flask-backend.herokuapp.com';

class SatelliteDataCollection extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            source: 'USGS',
            lat: props.lat,
            lon: props.lon,
            currentCounty: 'Almeda',
            data: null,
        }

        this.getData = this.getData.bind(this);
        this.getUSGSdata = this.getUSGSdata.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.toggleFilterDiv = this.toggleFilterDiv.bind(this);
        this.changeCounty = this.changeCounty.bind(this);

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

        this.getUSGSdata(monthAgo, today);
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

        if(this.state.source === 'USGS'){
            this.getUSGSdata(startDate, endDate);
        }

    }


    getUSGSdata(start, end){
        var lat = this.state.lat;
        var lon = this.state.lon;

        fetch(prodUrl + '/api/getEarthExplorerData', {
            method: "POST",
            body: JSON.stringify({
                lat: lat,
                lon: lon,
                startDate: start,
                endDate: end,
            })
        })
        .then(res => res.json())
        .then(data => {
            var scenes = data['scenes'];

            var columnsToDisplay = ['startTime', 'endTime', 'acquisitionDate', 'cloudCover', 'displayId', 'entityId']

            var cols = [];
            var rows = [];

            for(const col of columnsToDisplay){
                var newColEntry = {
                    label: col,
                    field: col,
                    sort: 'asc',
                    width: 150,
                }
                cols.push(newColEntry);
            }

            for(var currentScene in scenes){
                var newRowEntry = {}
                for(var col of columnsToDisplay){
                    var val = scenes[currentScene][col];
                    if(val == null){
                        val = ''
                    }
                    newRowEntry[col] = val
                }
                rows.push(newRowEntry);
            }

            var data = {
                columns: cols,
                rows: rows,
            }

            this.setState({
                data: data
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
                        Satellite
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
                                <option value='USGS'>USGS</option>
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

export default SatelliteDataCollection;