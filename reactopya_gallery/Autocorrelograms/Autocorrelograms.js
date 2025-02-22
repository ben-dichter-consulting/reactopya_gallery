import { PythonInterface } from 'reactopya';
import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Plot from 'react-plotly.js';

export default class Autocorrelograms extends Component {
    static title = 'Autocorrelograms'
    constructor(props) {
        super(props);
        this.state = {
            firingsPath: 'sha1dir://ed0fe4de4ef2c54b7c9de420c87f9df200721b24.synth_visapy/mea_c30/set1/firings_true.mda',
            samplerate: 30000,
            download_from: 'spikeforest.public',
            status: '',
            status_message: '',
            output: null
        }
    }
    componentDidMount() {
        this.pythonInterface = new PythonInterface(this, require('./Autocorrelograms.json'));
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
        const { output } = this.state;

        return (
            <RespectStatus {...this.state}>
                <Grid container>
                    {
                        ((output || {}).autocorrelograms || []).map((ac) => (
                            <Grid item key={ac.unit_id}>
                                <CorrelogramPlot
                                    key={ac.unit_id}
                                    bin_counts={ac.bin_counts}
                                    bin_edges={ac.bin_edges}
                                    title={`Unit ${ac.unit_id}`}
                                    width={250}
                                    height={250}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            </RespectStatus>
        )
    }
}

class RespectStatus extends Component {
    state = {}
    render() {
        switch (this.props.status) {
            case 'running':
                return <div>Running: {this.props.status_message}</div>
            case 'error':
                return <div>Error: {this.props.status_message}</div>
            case 'finished':
                return this.props.children;
            default:
                return <div>Unknown status: {this.props.status}</div>
        }
    }
}

class CorrelogramPlot extends Component {
    state = {}
    render() {
        const { bin_edges, bin_counts, title, width, height } = this.props;
        return (
            <Plot
                data={[{
                    x: bin_edges.slice(0, bin_edges.length - 1),
                    y: bin_counts,
                    type: 'bar'
                }]}
                layout={{
                    width: width,
                    height: height,
                    title: title,
                    showlegend: false,
                    bargap: 0,
                    xaxis: {
                        autorange: false,
                        range: [bin_edges[0], bin_edges[bin_edges.length - 1]],
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        ticks: '',
                        showticklabels: false
                    },
                    yaxis: {
                        autorange: true,
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        ticks: '',
                        showticklabels: false
                    },
                    margin: {
                        l: 20, r: 20, b: 0, t: 0
                    }
                }}
                config={(
                    {
                        displayModeBar: false,
                        responsive: false
                    }
                )}
            />
        );
    }
}