import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import aviao from "../Icons/aviao.png";
import '../Style/App.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import Aircraft from '../Models/aircraft';
import { BrakingLevel, RunwayCondition, UnitMeasurement } from '../Enuns/enuns';
import Calcular from '../Models/calcular';

type state = {
  weightTitle: string,
  windTitle: string,
  temperatureTitle: string,
  airportAltitudeTitle: string,
  result: string,
  unitMeasurementError: string,
  aircraftError: string,
  weightError: string,
  breakingError: string,
  temperatureError: string,
  windError: string,
  runwayError: string,
  altitudeError: string,
  slopeError: string,
  overspeedTitle: string
}

class Calculo extends Component<{}, state>{

  private aircraftSelected!: Aircraft;
  private aircraftWeight: number = 0;
  private wind: number = 0;
  private runwayCondition: RunwayCondition;
  private temperature: number = 0;
  private airportAltitude: number = 0;
  private slope: number = 0;
  private reversor: number = 0;
  private iceAccreation: boolean = false;
  private brakingLevel: BrakingLevel;
  private unitMeasurement: UnitMeasurement;
  private overspeed: number = 0;

  constructor(props) {
    super(props);
    this.state = {
      airportAltitudeTitle: "", temperatureTitle: "", weightTitle: "", windTitle: "",
      result: "", slopeError: "", aircraftError: "", altitudeError: "", breakingError: "", runwayError: "",
      temperatureError: "", unitMeasurementError: "", weightError: "", windError: "", overspeedTitle: ""
    }
    this.temperatureChange = this.temperatureChange.bind(this);
    this.windChange = this.windChange.bind(this);
    this.aircraftWeightChange = this.aircraftWeightChange.bind(this);
    this.unitMeasurementChange = this.unitMeasurementChange.bind(this);
    this.calculate = this.calculate.bind(this);
    this.slopeChange = this.slopeChange.bind(this);
    this.airportAltitudeChange = this.airportAltitudeChange.bind(this);
    this.brakingLevelChange = this.brakingLevelChange.bind(this);
    this.runwayConditionChange = this.runwayConditionChange.bind(this);
    this.iceAccreationChange = this.iceAccreationChange.bind(this);
    this.overspeedChange = this.overspeedChange.bind(this);
  }

  //#region eventos change
  unitMeasurementChange(event) {
    const target = event.target;
    if(this.state.result != "") this.setState({result: ""})
    if (target.value == 1) {
      this.unitMeasurement = UnitMeasurement.INTERNACIONAL;
      this.setState({
        weightTitle: "(Kg)",
        windTitle: "(Km/h)",
        airportAltitudeTitle: "(M)",
        temperatureTitle: "(ºC)",
        overspeedTitle: "(Km/h)"
      });
    } else if (target.value == 2) {
      this.unitMeasurement = UnitMeasurement.IMPERIAL;
      this.setState({
        weightTitle: "(Lb)",
        windTitle: "(Wt)",
        airportAltitudeTitle: "(Ft)",
        temperatureTitle: "(ºF)",
        overspeedTitle: "(Wt)"
      });
    } else {
      this.setState({
        weightTitle: "",
        windTitle: "",
        airportAltitudeTitle: "",
        temperatureTitle: "",
        overspeedTitle: ""
      });
      return;
    }
    if (this.state.unitMeasurementError.includes("Select")) {
      this.setState({unitMeasurementError: ""})
    }
  }

  temperatureChange(event) {
    const target = event.target;
    this.temperature = target.value;
    if (this.state.temperatureError.includes("required")) {
      this.setState({temperatureError: ""})
    }
    if(this.state.result != "") this.setState({result: ""})
  }

  overspeedChange(event) {
    const target = event.target;
    this.overspeed = target.value;
  }

  windChange(event) {
    const target = event.target;
    this.wind = target.value;
    if (this.state.windError.includes("required")) {
      this.setState({windError: ""})
    }
    if(this.wind == 0){
      this.setState({windError: "The wind must be different than 0"})
    }
    if(this.state.result != "") this.setState({result: ""})
  }

  aircraftWeightChange(event) {
    const target = event.target;
    this.aircraftWeight = target.value;
    if(this.aircraftWeight < 10000){
      this.setState({weightError: "The weight must be above 10000"})
    }
    
    if (this.state.weightError.includes("required") || this.state.weightError.includes("above") && this.aircraftWeight >= 10000) {
      this.setState({weightError: ""})
    }
    if(this.state.result != "") this.setState({result: ""})
  }
  slopeChange(event) {
    const target = event.target;
    this.slope = target.value;
    if (this.state.slopeError.includes("required")) {
      this.setState({slopeError: ""})
    }
    if(this.state.result != "") this.setState({result: ""})
  }

  airportAltitudeChange(event) {
    const target = event.target;
    this.airportAltitude = target.value;
    if (this.state.altitudeError.includes("required")) {
      this.setState({altitudeError: ""})
    }
    if(this.state.result != "") this.setState({result: ""})
  }

  brakingLevelChange(event) {
    const target = event.target;
    this.brakingLevel = target.value;
    if (this.state.breakingError.includes("Select")) {
      this.setState({breakingError: ""})
    }
    if(this.state.result != "") this.setState({result: ""})
  }

  runwayConditionChange(event) {
    const target = event.target;
    this.runwayCondition = target.value;
    if (this.state.runwayError.includes("Select")) {
      this.setState({runwayError: ""})
    }
    if(this.state.result != "") this.setState({result: ""})
  }

  iceAccreationChange(event) {
    const target = event.target;
    this.iceAccreation = target.value;
    if(this.state.result != "") this.setState({result: ""})
  }

  //#endregion

  calculate(event) {
    event.preventDefault()
    // if(this.aircraftSelected === undefined) return;

    const isValid = this.validate();

    if (isValid) {
      let calculado = this.teste();
      let convertido = this.converter(calculado)
      console.log((calculado == convertido ? convertido.toFixed(2) + " meters" : convertido.toFixed(2) + " fts"))
      this.setState({
        result: (calculado == convertido ? convertido.toFixed(2) + " meters" : convertido.toFixed(2) + " fts")
      });
    } else {
      this.setState({
        result: ""
      });
    }

  }

  converter(valor: number): number{
    if(this.unitMeasurement == UnitMeasurement.IMPERIAL){
      return valor * 3.281;
    }
    return valor;
  }

//#region validate
  validate = () => {
    let unitMeasurementError = ""; let aircraftError = ""; let weightError = "";
    let breakingError = ""; let temperatureError = ""; let windError = "";
    let runwayError = ""; let altitudeError = ""; let slopeError = "";

    if (!this.unitMeasurement) {
      unitMeasurementError = "Select an unit of measurement";
    } else {
      unitMeasurementError = ""
    }

    // if (!this.aircraftSelected) {
    //   aircraftError = "Select an aircraft";
    // }else{
    //   aircraftError = ""
    // }

    if (!this.aircraftWeight) {
      weightError = "The weight is required";
    } else if (this.aircraftWeight < 10000) {
      weightError = "The weight must be above 10000";
    } else {
      weightError = ""
    }

    if (!this.brakingLevel) {
      breakingError = "Select a braking level";
    } else {
      breakingError = ""
    }

    if (!this.temperature) {
      temperatureError = "The temperature is required";
    } else {
      temperatureError = ""
    }

    if (!this.wind) {
      windError = "The wind is required";
    } else if (this.wind == 0) {
      windError = "The wind must be different than 0";
    } else {
      windError = ""
    }

    if (!this.runwayCondition) {
      runwayError = "Select a runway condition";
    } else {
      runwayError = ""
    }

    if (!this.airportAltitude) {
      altitudeError = "The airport altitude is required";
    } else {
      altitudeError = ""
    }

    if (!this.slope) {
      slopeError = "The slope is required";
    } else {
      slopeError = ""
    }
    this.setState({
      aircraftError: aircraftError, altitudeError: altitudeError, breakingError: breakingError,
      runwayError: runwayError, slopeError: slopeError, temperatureError: temperatureError, weightError: weightError,
      unitMeasurementError: unitMeasurementError, windError: windError
    });
    if (aircraftError || altitudeError || breakingError || runwayError || slopeError || temperatureError || weightError || unitMeasurementError || windError) {
      return false;
    }

    return true;
  };

//#endregion
  teste(): number{

    let aircraft = new Aircraft("Modelo X", "Motor Y", "XXX", 0, 220, 2);
    let calcular = new Calcular(aircraft, this.unitMeasurement, this.aircraftWeight, this.airportAltitude, this.slope, this.temperature, this.wind,
      this.brakingLevel, this.iceAccreation, this.overspeed);
      let calculo = calcular.calcular();
      console.log(calculo);
    
      return calculo;
  }

  render() {
    return (
      <Container fluid className=" px-2 mb-5">
        <Container>
          <Row className="px-2 mb-5 mt-5">
            <img src={aviao} alt="Avião." className="img col-sm-5 col-md-3 col-lg-2"></img>
            <h1 className='text-center mt-5 col-sm-7 col-md-9'>Performance calculation</h1>
          </Row>
        </Container>

        <Container className="px-2">
          <Form onSubmit={(e) => this.calculate(e)} >
            <Row>
              <Col >
                <h5 className="card-title">Unit of measurement</h5>
                <select defaultValue="-1" className="text-select form-select form-select-sm form-control-sm custom-select select mb-3" id="btnMeasurement" onChange={this.unitMeasurementChange}>
                  <option value="-1" disabled>Select</option>
                  <option value="1">Internacional</option>
                  <option value="2">Imperial</option>
                </select>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.unitMeasurementError}
                </div>
              </Col>
              <Col >
                <h5 className="card-title">Aircraft</h5>
                <select defaultValue="-1" className="text-select form-select form-select-sm form-control-sm custom-select select mb-3">
                  <option value="-1" disabled>Select</option>
                  <option value="1">Model XPTO</option>
                  <option value="2">Model XXYY</option>
                </select>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.aircraftError}
                </div>
              </Col>
              <Col>
                <h5 className="card-title">Aircraft Weight {this.state.weightTitle}</h5>
                <input type='number' className='form-control form-control-lg inputGroup-sizing-sm' id="weight" placeholder="Aircraft Weight" onChange={this.aircraftWeightChange} />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.weightError}
                </div>
              </Col>
            </Row>

            <Row>
              <Col >
                <h5 className="card-title">Braking application level</h5>
                <select defaultValue="-1" className="text-select form-select form-select-sm form-control-sm select custom-select mb-3" id="brankingLevel" onChange={this.brakingLevelChange}>
                  <option value="-1" disabled>Select...</option>
                  <option value="1">Maximum Manual</option>
                  <option value="2">Autobrake High</option>
                  <option value="3">Autobrake Med.</option>
                  <option value="4">Autobrake Low</option>
                </select>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.breakingError}
                </div>
              </Col>
              <Col>
                <h5 className="card-title">Temperature bellow/above ISA {this.state.temperatureTitle}</h5>
                <input type='number' className='form-control form-control-lg inputGroup-sizing-sm' id="temperature" placeholder="Temperature" onChange={this.temperatureChange} />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.temperatureError}
                </div>
              </Col>
              <Col>
                <h5 className="card-title">Wind {this.state.windTitle}</h5>
                <input type='text' className='form-control form-control-lg inputGroup-sizing-sm' id="wind" placeholder="Wind" onChange={this.windChange} />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.windError}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <h5 className="card-title">Runway condition</h5>
                <select defaultValue="-1" className="text-select form-select form-select-sm select form-control-sm custom-select mb-3" id="btnCondition" onChange={this.runwayConditionChange}>
                  <option value="-1" disabled>Select...</option>
                  <option value="1">1 (Poor)</option>
                  <option value="2">2 (Medium to poor)</option>
                  <option value="3">3 (Medium)</option>
                  <option value="4">4 (Good to medium)</option>
                  <option value="5">5 (Good)</option>
                  <option value="6">6 (Dry)</option>
                </select>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.runwayError}
                </div>
              </Col>
              <Col>
                <h5 className="card-title">Airport altitude {this.state.airportAltitudeTitle}</h5>
                <input type='number' className='form-control form-control-lg inputGroup-sizing-sm' id="AirportAltitude" placeholder="Airport altitude" onChange={this.airportAltitudeChange} />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.altitudeError}
                </div>
              </Col>
              <Col>
                <h5 className="card-title">Slope of the runway</h5>
                <input type='number' className='form-control form-control-lg inputGroup-sizing-sm' id="slope" placeholder="Slope of the runway" onChange={this.slopeChange} />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.slopeError}
                </div>
              </Col>
            </Row>

            <Row className="px-2">
            <Col>
                <h5 className="card-title">Overspeed above VREF {this.state.overspeedTitle}</h5>
                <input type='number' className='form-control form-control-lg inputGroup-sizing-sm' id="overspeed" placeholder="Overspeed above VREF" onChange={this.overspeedChange} />
              </Col>
              <Col>
                <h5 className='card-tittle'>Has ice accreation?</h5>
                <BootstrapSwitchButton
                  onChange={(checked: boolean) => {
                    this.iceAccreation = checked
                  }}
                />
              </Col>
              <Col></Col>
            </Row>

            <Row className="px-2 mt-5">
              <Col />
              <Col><h5 className="card-title">Result:</h5></Col>
            </Row>
            <Row className="px-2">
              <Col>
                <Button type='submit' className="botao-resultado" size="lg" >Calculate</Button>
              </Col>
              <Col>
                <textarea className="text-area form-control" disabled value={this.state.result} />
              </Col>
            </Row>
          </Form>
        </Container>
      </Container>
    );
  }
}




export default Calculo;


// Caso seja necessário incluir o "Aditivo de velocidade" basta copiar abaixo e colocar no formulário.
/* <Form>
<Col style={{width: "33%"}}>
  <h5 className="card-title">Speed additive</h5>
  <input type='number' className='form-control form-control-lg inputGroup-sizing-sm' id="speedAdditive" placeholder="Speed additive" onChange={this.aircraftSpeedAdctiveChange} />
</Col>
</Form> */
