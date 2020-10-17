import React from 'react';
import CountySelector from './CountySelector';

class FilterDiv extends React.Component{
    render(){
        return(
            <div>
                <div style={{width:'100%', height:'50px'}}>
                    <h4 style={{padding:'0 10px 0 0', float:'left', padding:'12px 0 0 0'}}>
                        Fire History
                    </h4>
                    {
                        this.props.currentView === 'Table View'?
                        <button className='btn btn-success' onClick={this.props.handleViewChange} style={{float:'right', margin:'0 0 0 10px'}} >Map View</button>
                        :
                        <button className='btn btn-success' onClick={this.props.handleViewChange} style={{float:'right', margin:'0 0 0 10px'}} >Table View</button>
                    }
                    <button className='btn btn-dark' style={{float:'right'}} onClick={this.props.toggleFilterDiv}>
                        Filter 
                        &nbsp;
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-filter" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                </div>
                <hr/>
                <div style={{display:'none', height:'auto'}} id='filterDiv'>
                    <h1>{this.props.dataType}</h1>
                    <div style={{width:'100%'}}>
                        <div style={{float:'left'}}>
                            Source: &nbsp;&nbsp;
                            {
                                this.props.dataType === 'weather'?
                                <select id="dataSourceInput" style={{padding:'14px'}}>
                                    <option value='NOAA'>NOAA</option>
                                </select>
                                :
                                this.props.dataType === 'fireHistory'?
                                <select id="dataSourceInput" style={{padding:'14px'}}>
                                    <option value='USDA'>USDA</option>
                                </select>
                                :
                                this.props.dataType === 'landCover'?
                                <select id="dataSourceInput" style={{padding:'14px'}}>
                                    <option value='USGS'>USGS</option>
                                </select>
                                :
                                this.props.dataType === 'satellite'?
                                <select id="dataSourceInput" style={{padding:'14px'}}>
                                    <option value='USGS'>USGS</option>
                                </select>
                                :
                                <div></div>
                            }
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
                            <CountySelector parentCallback={this.props.changeCounty}/>
                        </div>
                        <button className='btn btn-primary' onClick={this.props.getData} style={{float:'right', marginRight:'16px'}}>Get Data</button>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <hr/>
                </div>
            </div>
        )
    }
}

export default FilterDiv;