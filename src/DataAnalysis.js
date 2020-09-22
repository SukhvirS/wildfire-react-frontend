import React from 'react';
import MyNavbar from './MyNavbar/MyNavbar';
import {Map, GeoJSON, TileLayer, LayersControl, FeatureGroup, Marker, Popup, Circle} from 'react-leaflet';
import counties from './counties.json';

class DataAnalysis extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currentCounty: null,
            currentView: 'Weather'
        }

        this.onCountyClick = this.onCountyClick.bind(this);
        this.onEachCounty = this.onEachCounty.bind(this);
        this.onCountyMouseover = this.onCountyMouseover.bind(this);
        this.onCountyMouseout = this.onCountyMouseout.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
    }

    onCountyClick(event){
        console.log(event.target.feature.properties.name + ' clicked.');
        this.setState({
            currentCounty: event.target.feature.properties.name,
        })
    }

    onCountyMouseover(event){
        event.target.setStyle({
            fillOpacity: 0.9,
        });
    }

    onCountyMouseout(event){
        event.target.setStyle({
            fillOpacity: 0.3,
        });
    }

    onEachCounty(county, layer){
        var countyName = county.properties.name;
        layer.bindPopup(countyName);

        layer.on({
            click: this.onCountyClick,
            mouseover: this.onCountyMouseover,
            mouseout: this.onCountyMouseout,
        })
    }

    handleViewChange(event){
        this.setState({
            currentView: event.target.innerHTML
        });
        console.log(document.getElementsByClassName('leaflet-control-layers')[0]);
    }
    render(){
        var position = [37.334665328, -121.875329832];
        var countyStyle = {
            color: '#4a83ec',
            weight: 1,
            fillColor: "#AED7FF",
            fillOpacity: 0.3,
        }

        var styles = {
            buttonGroupButton: {
                width: '20%',
                backgroundColor: '#f0f0f0', 
                border: '1px solid grey',
                padding: '10px 24px', 
                float: 'left',
                margin:'0 20px 0 0',
                borderRadius: '20px',
                color:'black',
                outline:'none',
                height:'46px'
            },
            buttonGroupButtonActive: {
                width: '20%',
                backgroundColor: '#1580fb', 
                border: '1px solid #1580fb',
                color: 'white', 
                padding: '10px 24px', 
                float: 'left',
                margin:'0 20px 0 0',
                borderRadius:'20px',
                outline:'none',
                height:'46px'
            }
        }

        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>

                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Data Analysis</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>

                        <div style={{width:'100%'}}>

                            <div style={{width:'calc(100vw - 500px)', float:'left'}}>

                                <div style={{height:'70px', display:'flex', justifyContent:'center', padding:'12px 0 0 0'}}>
                                    {
                                        this.state.currentView === 'Weather'?
                                        <button style={styles.buttonGroupButtonActive}>Weather</button>
                                        :
                                        <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Weather</button>
                                    }
                                    {
                                        this.state.currentView === 'Historical'?
                                        <button style={styles.buttonGroupButtonActive}>Historical</button>
                                        :
                                        <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Historical</button>
                                    }
                                    {
                                        this.state.currentView === 'Vegetation'?
                                        <button style={styles.buttonGroupButtonActive}>Vegetation</button>
                                        :
                                        <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Vegetation</button>
                                    }
                                    {
                                        this.state.currentView === 'Satellite'?
                                        <button style={styles.buttonGroupButtonActive}>Satellite</button>
                                        :
                                        <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Satellite</button>
                                    }
                                </div>

                                <Map style={{height:'calc(100vh - 142px)', width:'calc(100vw - 500px)', float:'left'}} zoom={8} center={position}>

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

                                        <LayersControl.Overlay name="Show Counties" >
                                            <GeoJSON data={counties.features}  style={countyStyle} onEachFeature={this.onEachCounty}/>
                                        </LayersControl.Overlay>

                                    </LayersControl>
                                </Map>
                            </div>

                            <div style={{width:'260px', float:'right', borderLeft:'1px solid #d9dadb'}}>
                                <div style={{marginTop:'16px'}}>
                                    <form onSubmit={this.handleCitySearch}>
                                        <div className="col-lg-10 mb-3">
                                            <div className="input-group" style={{width:'226px'}}>
                                                <input type="text" className="form-control rounded-0" id="citySearchInput" placeholder="City Name" required />
                                                <div className="input-group-prepend">
                                                    <input type="submit" value="Search" className="btn btn-primary btn-sm rounded-0" id="inputGroupPrepend2" style={{backgroundColor:'#1580fb'}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <hr style={{margin:'16px'}}/>

                                <div style={{height:'100%', overflow:'auto', margin:'16px'}}>
                                    <h4>Select date:</h4>
                                    <div >
                                        <input type='date' className='input-group' style={{padding:'10px'}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataAnalysis;