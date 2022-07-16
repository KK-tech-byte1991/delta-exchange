import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const ws = new WebSocket("wss://production-esocket.delta.exchange");

const Datatable = () => {
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    axios({
      url: "https://api.delta.exchange/v2/products",
      method: "GET"
    })
      .then((res) => {
        setRowData(res.data.result);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    let symboles = [];
    rowData.forEach((value) => {
      symboles.push(value.symbol);
    });
    // console.log(symboles)
    let data = {
      type: "subscribe",
      payload: {
        channels: [
          {
            name: "v2/ticker",
            symbols: symboles
          }
        ]
      }
    };

    // ws.onopen = () => {
    //     if (symboles.length>0)  {
    //     ws.send(JSON.stringify(data))   }
    // }

    // ws.onmessage = evt => {
    //     const message = JSON.parse(evt.data)
    //     // console.log(message)
    // }
  }, [rowData]);

  const [columnDefs] = useState([
    { field: "symbol" },
    { field: "description" },
    { field: "underlying_asset.symbol" },
    { field: "market" }
  ]);

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: 400, width: 800, margin: "auto" }}
    >
      {console.log(rowData)}
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
};
export default Datatable;
