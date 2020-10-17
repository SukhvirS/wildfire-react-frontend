import React from 'react';
import './reactPaginationStyle.css';
import { MDBDataTable } from 'mdbreact';
import CountySelector from '../Components/CountySelector';
import {Map, TileLayer, LayersControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Plot from 'react-plotly.js';
import FilterDiv from '../Components/FilterDiv';

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
            currentView: 'Table View',
            currentMarker: null,

        }

        this.getData = this.getData.bind(this);
        this.getNOAAdata = this.getNOAAdata.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.changeCounty = this.changeCounty.bind(this);
        this.toggleFilterDiv = this.toggleFilterDiv.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
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
        // document.getElementById('gettingData').style.display = '';

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
        fetch(devUrl + '/api/getNOAAdata', {
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

            // document.getElementById('gettingData').style.display = 'none';
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

    handleViewChange(event){
        console.log('changed to: '+event.target.innerHTML);
        this.setState({
            currentView: event.target.innerHTML,
        })
    }

    render(){

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });

        var dates = [];
        var tavg = [];
        var tmax = [];
        var tmin = [];
        if(this.state.data != null){
            for(var row of this.state.data['rows']){
                dates.push(row['DATE']);
                tavg.push(row['TAVG']);
                tmax.push(row['TMAX']);
                tmin.push(row['TMIN']);
            }
        }

        return(
            <div className="jumbotron" style={{margin:'10px 0 50px 0', paddingTop:'20px', overflow:'auto'}}>
                <FilterDiv 
                    dataType='weather'
                    getData={this.getData}
                    changeCounty={this.changeCounty}
                    toggleFilterDiv={this.toggleFilterDiv}
                    currentView={this.state.currentView}
                    handleViewChange={this.handleViewChange}
                />
                <div>
                    <h3 id='gettingData' style={{display:'none', margin:'10px 0 40px 0'}}>Getting data...</h3>
                    {
                        this.state.currentView === 'Table View'?
                        <div>
                            {
                                !this.state.data?
                                <div>Getting data...</div>
                                :
                                <div>
                                    <MDBDataTable responsive
                                    striped
                                    bordered
                                    data={this.state.data}
                                    />
                                    <br/>
                                    <hr/>

                                    <h4>Graphs</h4>
                                    <br/>
                                    <Plot
                                        style={{width:'100%', height:'400px'}}
                                        data = {[
                                            {
                                                x: dates,
                                                y: tavg,
                                                type: 'line'
                                            }
                                        ]}
                                        layout={{ title: 'TAVG over time'}}
                                    />
                                    <br/>
                                    <div>
                                        <Plot
                                            style={{float:'left', width:'49%', height:'300px'}}
                                            data={[
                                                {
                                                    x: dates,
                                                    y: tmin,
                                                    type: 'line',
                                                }
                                            ]}
                                            layout={{ title: 'TMIN over time' }}
                                        />
                                        <Plot
                                            style={{float:'right', width:'49%', height:'300px'}}
                                            data={[
                                                {
                                                    x: dates,
                                                    y: tmax,
                                                    type:'line'
                                                }
                                            ]}
                                            layout={{ title:'TMAX over time' }}
                                        />
                                    </div>

                                </div>
                                
                            }
                        </div>
                        :
                        <div>
                            <Map style={{height:'calc(100vh - 200px)', width:'calc(100vw - 600px)', border:'1px solid black', float:'left'}} zoom={6} center={[this.state.lat, this.state.lon]}>
                                <LayersControl position="topright">

                                    <LayersControl.BaseLayer name="Topology" checked>
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Street">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Satellite">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Terrain">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Dark">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                </LayersControl>

                                <MarkerClusterGroup>
                                    {
                                        this.state.data == null?
                                        <div>Waiting for data to load...</div>
                                        :
                                        <div></div>
                                    }
                                </MarkerClusterGroup>
                            </Map>
                            <div style={{float:'right', padding:'6px', width:'230px'}}>
                            {
                                this.state.currentMarker == null?
                                <h3>Select a marker for more info.</h3>
                                :
                                <div>
                                    <h3>Marker Information</h3>
                                    <hr/>
                                    {
                                        this.state.features.map(
                                            feature => {
                                                return (
                                                <div>
                                                    <strong>{feature}: </strong>{this.state.currentMarker[feature]}
                                                    <br/>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default WeatherDataCollection;