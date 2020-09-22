import React from 'react';

const devUrl = '';
const prodUrl = 'https://wildfire-flask-backend.herokuapp.com/';

class WeatherDataCollection extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            source: 'NOAA',
            lat: props.lat,
            lon: props.lon,
        }

        this.getData = this.getData.bind(this);
        this.getNOAAdata = this.getNOAAdata.bind(this);
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

        if(this.state.source === 'NOAA'){
            this.getNOAAdata(startDate, endDate);
        }

    }

    getNOAAdata(start, end){
        var resultElement = document.getElementById('dataResult');
        resultElement.innerHTML = 'Getting Data ...';

        fetch(prodUrl + '/api/getNOAAdata', {
            method:'POST',
            body: JSON.stringify({
                startDate: start,
                endDate: end
            })
        })
        .then(res => res.json())
        .then(data => {
            var rawData = data['rawData'];
            var totalDataLength = data['totalDataLength'];

            var parsedData = JSON.parse(rawData);

            var table = ''
            table = `
            <div class='table-responsive'>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>`;
            for(const key in parsedData){
                table += `<th score='col'>`+key+'</th>'
            }
            table += `
                        </tr>
                    </thead>
                    <tbody>`
            for(var i=0; i<Object.keys(parsedData['DATE']).length; i++){            
                table += '<tr> <th scope="row">'+i+'</th>';    
                for(const key in parsedData){
                    table += '<td>'+parsedData[key][i] + '</td>';
                }
                table += '</tr>';
            }
            table += '</tbody> </table> </div>';
            resultElement.innerHTML = table;

            if(totalDataLength > 10){
                document.getElementById('dataTotalRows').innerHTML = 'Showing 10 of '+totalDataLength+' rows';
            }
            else{
                document.getElementById('dataTotalRows').innerHTML = 'Showing '+totalDataLength+' of '+totalDataLength + ' rows';
            }
        })
    }

    render(){
        return(
            <div className="jumbotron" style={{margin:'10px 0 50px 0', paddingTop:'20px'}}>
                <div style={{width:'100%', height:'50px'}}>
                    <h4 style={{padding:'0 10px 0 0', float:'left', padding:'12px 0 0 0'}}>
                        Weather
                    </h4>
                </div>
                <hr/>
                <div style={{width:'100%', height:'50px'}}>
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
                        <button className='btn btn-primary' onClick={this.getData}>Get Data</button>
                    </div>
                </div>
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

export default WeatherDataCollection;