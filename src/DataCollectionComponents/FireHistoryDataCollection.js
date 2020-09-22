import React from 'react';

const devUrl = '';
const prodUrl = 'https://wildfire-flask-backend.herokuapp.com/';

class FireHistoryDataCollection extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            source: 'USDA',
            lat: props.lat,
            lon: props.lon,
        }

        this.getData = this.getData.bind(this);
        this.getUSDAFireData = this.getUSDAFireData.bind(this);
        this.formatDate = this.formatDate.bind(this);

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

        if(this.state.source === 'USDA'){
            this.getUSDAFireData(startDate, endDate);
        }

    }


    getUSDAFireData(start, end){
        var lat = this.state.lat;
        var lon = this.state.lon;

        var resultElement = document.getElementById('dataResult');
        resultElement.innerHTML = 'Getting data ...';

        var startYear = start.slice(0, 4);
        var endYear = start.slice(0, 4);

        var features = ['OBJECTID', 'STATE_NAME', 'COUNTY_NAME', 'DISCOVER_YEAR', 'POO_LATITUDE', 'POO_LONGITUDE', 'FIRE_SIZE_CLASS']

        fetch(prodUrl + '/api/getUSDAFireData', {
            method: "POST",
            body: JSON.stringify({
                startYear: startYear,
                endYear: endYear,
            })
        })
        .then(res => res.json())
        .then(data => {
            var data = data['data'];

            if(data['features'].length == 0){
                resultElement.innerHTML = 'No data';
                return;
            }

            var table = '';
            table = `
            <div class='table-responsive'>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
            `;
            for(var feature of features){
                table += `<th score='col'>`+feature+'</th>'
            }
            table += `</tr> </thead> </tbody>`;

            var i = 0;
            for(i=0; i < 10; i++){
                table += '<tr> <th scope="row">'+i+'</th>'
                for(var feature of features){
                    table += '<td>' + data['features'][i]['attributes'][feature] + '</td>';
                }
                table += '</tr>';
            }
            table += '</tbody> </table> </div>';
            resultElement.innerHTML = table;

            var dataLength = data['features'].length;
            document.getElementById('dataTotalRows').innerHTML = 'Showing 10 of '+dataLength+' rows';
        })

    }

    render(){
        return(
            <div className="jumbotron" style={{margin:'10px 0 50px 0', paddingTop:'20px'}}>
                <div style={{width:'100%', height:'50px'}}>
                    <h4 style={{padding:'0 10px 0 0', float:'left', padding:'12px 0 0 0'}}>
                        Fire History
                    </h4>
                </div>
                <hr/>
                <div style={{width:'100%', height:'50px'}}>
                    <div style={{float:'left'}}>
                        Source: &nbsp;&nbsp;
                        <select id="dataSourceInput" style={{padding:'14px'}}>
                            <option value='USDA'>USDA</option>
                        </select>
                    </div>
                    <div style={{float:'right'}}>
                        From:&nbsp;
                        <input type='date' style={{padding:'10px'}} id="startDateInput"/>
                        &nbsp; - &nbsp;
                        <input type='date' style={{padding:'10px'}} id='endDateInput'/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button className='btn btn-primary' onClick={this.getData}>Get Data</button>
                    </div>
                </div>
                {
                    this.state.source === 'USDA'?
                        <p style={{color:'#d90000'}}><br/>Note: The USDA API only uses the YEAR from the start and end dates to get data.</p>
                    :
                    <div></div>
                }
                <hr/>
                <div>
                    <div>
                        <div id='dataResult'></div>
                        <p id='dataTotalRows'></p>
                    </div>
                </div>
            </div>

        );
    }
}

export default FireHistoryDataCollection;