import React, { useState, useEffect } from 'react';

import { AgGridReact } from 'ag-grid-react';
import axios from "axios";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// const socket = io('wss://production-esocket.delta.exchange')
const ws = new WebSocket('wss://production-esocket.delta.exchange')

const Datatable = () => {
    useEffect(() => {
        axios({
            // Endpoint to send files
            url: "https://api.delta.exchange/v2/products",
            method: "GET",


        })
            // Handle the response from backend here
            .then((res) => { setRowData(res.data.result) })

            // Catch errors if any
            .catch((err) => { console.log(err) });

        ws.onopen = () => {
            console.log("I m open")
            ws.send(JSON.stringify({ "name": "v2/ticker", "symbols": ["BTCUSD", "BTCUSDT"] }))
        }

        ws.onmessage = evt => {
            console.log("I m")
            // listen to data sent from the websocket server
            const message = JSON.parse(evt.data)
            // this.setState({dataFromServer: message})
            console.log(message)
        }
    }, [])
    // useEffect(()=>{
    //     ws.onmessage = evt => {
    //         // listen to data sent from the websocket server
    //         const message = JSON.parse(evt.data)
    //         // this.setState({dataFromServer: message})
    //         console.log(message)
    //     }
    // })
    const [rowData, setRowData] = useState([
    ]);

    const [columnDefs] = useState([
        { field: 'symbol' },
        { field: 'description' },
        { field: 'underlying_asset.symbol' }
    ])

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}>
            </AgGridReact>
        </div>
    );
};
export default Datatable;