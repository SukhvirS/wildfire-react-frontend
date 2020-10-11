import React from 'react';
import CountySelector from '../Components/CountySelector';
import { MDBDataTable } from 'mdbreact';
import {Map, TileLayer, LayersControl, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";

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
            currentView: 'Table View',
            currentMarker: null,
            features: ['startTime', 'endTime', 'acquisitionDate', 'cloudCover', 'displayId', 'entityId', 'latitude', 'longitude'],
        }

        this.getData = this.getData.bind(this);
        this.getUSGSdata = this.getUSGSdata.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.toggleFilterDiv = this.toggleFilterDiv.bind(this);
        this.changeCounty = this.changeCounty.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleMarkerChange = this.handleMarkerChange.bind(this);

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
        .then(resData => {
            var scenes = resData['scenes'];

            // var columnsToDisplay = ['startTime', 'endTime', 'acquisitionDate', 'cloudCover', 'displayId', 'entityId', 'latitude', 'longitude']

            var cols = [];
            var rows = [];

            for(const col of this.state.features){
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
                for(var col of this.state.features){
                    var val = scenes[currentScene][col];
                    if(val == null){
                        if(col == 'latitude'){
                            val = lat
                        }
                        else if(col == 'longitude'){
                            val = lon
                        }
                        else{
                            val = ''
                        }
                    }
                    // if(val == null){
                    //     val = ''
                    // }
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

    handleViewChange(event){
        console.log('changed to: '+event.target.innerHTML);
        this.setState({
            currentView: event.target.innerHTML,
        })
    }

    handleMarkerChange(newMarker){
        this.setState({
            currentMarker: newMarker,
        })
    }

    render(){

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });

        return(
            <div className="jumbotron" style={{margin:'10px 0 50px 0', paddingTop:'20px', overflow:'auto'}}>
                <div style={{width:'100%', height:'50px'}}>
                    <h4 style={{padding:'12px 10px 0 0', float:'left'}}>
                        Satellite
                    </h4>
                    {
                        this.state.currentView === 'Table View'?
                        <button className='btn btn-success' onClick={this.handleViewChange} style={{float:'right', margin:'0 0 0 10px'}} >Map View</button>
                        :
                        <button className='btn btn-success' onClick={this.handleViewChange} style={{float:'right', margin:'0 0 0 10px'}} >Table View</button>
                    }
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
                        <button className='btn btn-primary' onClick={this.getData} style={{float:'right', marginRight:'16px'}}>
                            Get Data
                        </button>
                    </div>
                    <br/>
                    <br/>
                    <hr/>
                </div>
                <div>
                    <div>
                        {
                            this.state.currentView === 'Table View'?
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
                                            this.state.data.rows.map(
                                                marker => {
                                                    return (
                                                        <Marker position={[marker['latitude'], marker['longitude']]} key={marker['entityId']} onclick={() => this.handleMarkerChange(marker)}>
                                                            <Popup>
                                                                <p>Object ID: {marker['entityId']}</p>
                                                                <p>Lat: {marker['latitude']}</p>
                                                                <p>Lon: {marker['longitude']}</p>
                                                            </Popup>
                                                        </Marker>
                                                    )
                                                }
                                            )
                                        }
                                    </MarkerClusterGroup>
                                </Map>
                                <div style={{float:'right', padding:'6px', width:'230px'}}>
                                    {
                                        this.state.currentMarker == null?
                                        <h3>Select a fire for more info.</h3>
                                        :
                                        <div>
                                            <h3>Fire Information</h3>
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
            </div>

        );
    }
}

export default SatelliteDataCollection;