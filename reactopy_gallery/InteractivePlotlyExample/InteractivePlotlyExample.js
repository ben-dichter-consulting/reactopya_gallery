import { PythonInterface } from 'reactopy';
import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import InputSlider from './InputSlider';

export default class InteractivePlotlyExample extends Component {
    static title = 'Interactive plotly example'
    constructor(props) {
        super(props);
        this.state = {
            noise_level: 1,
            num_points: 40,
            series: null
        }
        this.pythonInterface = new PythonInterface(this, 'reactopy_gallery', 'InteractivePlotlyExample');
        this.pythonInterface.syncStateToJavaScriptState(['noise_level', 'num_points']);
        this.pythonInterface.syncPythonStateToState(['series']);
    }
    componentDidMount() {
        this.pythonInterface.start();
        this._updateParams();
    }
    componentDidUpdate() {
        this.pythonInterface.update();
    }
    componentWillUnmount() {
        this.pythonInterface.stop();
    }
    _updateParams() {
    }
    render() {
        const { series } = this.state;
        if (!series) {
            return <div>Loading...</div>;
        }
        let data = [];
        let all_amplitudes = [];
        for (let i = 0; i < series.length; i++) {
            let S = series[i];
            let x = [];
            let y = [];
            let color = 'green';
            for (let j = 0; j < S.times.length; j++) {
                x.push(S.times[j]);
                y.push(S.amplitudes[j]);
                all_amplitudes.push(S.amplitudes[j]);
            }
            data.push({
                x: x, y: y,
                color: color,
                type: 'scatter',
                mode: 'markers',
                hoverinfo: 'none'
            })
        }

        // let yrange = [Math.min(...all_amplitudes), Math.max(...all_amplitudes)];
        // yrange = [Math.min(yrange[0], 0), Math.max(yrange[1], 0)];
        let yrange = [-50, 150];

        return (
            <div>
                <InputSlider
                    label={'Noise level'}
                    min={0} max={20}
                    defaultValue={1}
                    step={1}
                    onChange={(val) => {this.setState({noise_level: val})}}
                />
                <InputSlider
                    label={'Num. points'}
                    min={1} max={400}
                    defaultValue={40}
                    step={1}
                    onChange={(val) => {this.setState({num_points: val})}}
                />
                <Plot
                    data={data}
                    layout={{
                        width: '100%',
                        height: '100%',
                        title: '',
                        showlegend: false,
                        xaxis: {
                            autorange: true,
                            // range: [0, numTimepoints - 1],
                            showgrid: false,
                            zeroline: false,
                            showline: false,
                            ticks: '',
                            showticklabels: false
                        },
                        yaxis: {
                            autorange: false,
                            range: yrange,
                            showgrid: true,
                            zeroline: true,
                            showline: false,
                            // ticks: '',
                            showticklabels: true
                        },
                        margin: {
                            l: 50, r: 50, b: 50, t: 50
                        }
                    }}
                    config={(
                        {
                            displayModeBar: false,
                            responsive: true
                        }
                    )}
                />
            </div>
        )
    }
}