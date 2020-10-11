import React from 'react';
import MyNavbar from './Components/MyNavbar/MyNavbar';

import WeatherDataCollection from './DataCollectionComponents/WeatherDataCollection';
import SatelliteDataCollection from './DataCollectionComponents/SatelliteDataCollection';
import FireHistoryDataCollection from './DataCollectionComponents/FireHistoryDataCollection';
import LandCoverDataCollection from './DataCollectionComponents/LandCoverDataCollection';

class DataCollection extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currentCounty: null,
            lat: 37.334665328,
            lon: -121.875329832,
            currentView: 'Weather',
            weatherComponent: null,
            satelliteComponent: null,
            fireHistoryComponent: null,
            landCoverComponent: null,
        }

        this.getCoordinates = this.getCoordinates.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);

    }

    componentDidMount(){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates);
        }
        else{
            alert("Geolocation is not supported by this browser.");
        }
        this.setState({
            weatherComponent: <WeatherDataCollection lat={this.state.lat} lon={this.state.lon}/>,
            satelliteComponent: <SatelliteDataCollection lat={this.state.lat} lon={this.state.lon}/>,
            fireHistoryComponent: <FireHistoryDataCollection lat={this.state.lat} lon={this.state.lon}/>,
            landCoverComponent: <LandCoverDataCollection lat={this.state.lat} lon={this.state.lon}/>,
        })
    }

    getCoordinates(position){
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }


    handleViewChange(event){
        this.setState({
            currentView: event.target.innerHTML
        });

    }

    render(){
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
                outline:'none'
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
                outline:'none'
            }
        }

        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>
                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Data Collection</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>
                        
                        <div style={{margin:'20px 0 0 20px', width:'calc(100vw - 280px)'}}>

                            {/* <div style={{margin:'0 0 20px 0'}}>
                                <h4>Your location: {this.state.latitude}, {this.state.longitude}</h4>
                                <p style={{color:'gray'}}>We use your browser location to provide the most accurate information.</p>
                            </div> */}

                            <div className="btn-group" style={{width:"100%", display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
                                {
                                    this.state.currentView === 'Weather'?
                                    <button style={styles.buttonGroupButtonActive}>Weather</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Weather</button>
                                }
                                {
                                    this.state.currentView === 'Fire History'?
                                    <button style={styles.buttonGroupButtonActive}>Fire History</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Fire History</button>
                                }
                                {
                                    this.state.currentView === 'Land Cover'?
                                    <button style={styles.buttonGroupButtonActive}>Land Cover</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Land Cover</button>
                                }
                                {
                                    this.state.currentView === 'Satellite'?
                                    <button style={styles.buttonGroupButtonActive}>Satellite</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Satellite</button>
                                }
                            </div>

                            {
                                this.state.currentView === 'Weather'?
                                this.state.weatherComponent
                                :
                                <div></div>
                            }
                            {
                                this.state.currentView === 'Satellite'?
                                this.state.satelliteComponent
                                :
                                <div></div>
                            }
                            {
                                this.state.currentView === 'Fire History'?
                                this.state.fireHistoryComponent
                                :
                                <div></div>
                            }
                            {
                                this.state.currentView === 'Land Cover'?
                                this.state.landCoverComponent
                                :
                                <div></div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataCollection;