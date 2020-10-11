import React from 'react';
import MyNavbar from './Components/MyNavbar/MyNavbar';

class ModelEvaluation extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currentView: 'Ensemble Model',
        }

        this.handleViewChange = this.handleViewChange.bind(this);
    }

    handleViewChange(event){
        this.setState({
            currentView: event.target.innerHTML
        });
    }

    render(){

        var styles = {
            buttonGroupButton: {
                width: '30%',
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
                width: '30%',
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
                        <h1 className='mt-2'>Model Evaluation</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>
                        <div style={{margin:'20px 0 0 20px', width:'calc(100vw - 280px)'}}>
                            <div className="btn-group" style={{width:"100%", display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
                                {
                                    this.state.currentView === 'Ensemble Model'?
                                    <button style={styles.buttonGroupButtonActive}>Ensemble Model</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Ensemble Model</button>
                                }
                                {
                                    this.state.currentView === 'LSTM model'?
                                    <button style={styles.buttonGroupButtonActive}>LSTM model</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>LSTM model</button>
                                }
                                {
                                    this.state.currentView === 'Comparison'?
                                    <button style={styles.buttonGroupButtonActive}>Comparison</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleViewChange}>Comparison</button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModelEvaluation;