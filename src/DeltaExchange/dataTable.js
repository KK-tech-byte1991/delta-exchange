import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const ws = new WebSocket("wss://production-esocket.delta.exchange");

const Datatable = () => {
  const [rowData, setRowData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [symbolsList, setSymbolsList] = useState([]);
  useEffect(() => {
    axios({
      url: "https://api.delta.exchange/v2/products",
      method: "GET"
    })
      .then((res) => {
        setRowData(res.data.result);
        setUpdatedData(res.data.result);
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

    symboles.length > 0 && setSymbolsList(new Array([...symboles]));
  }, [rowData]);

  useEffect(() => {
    let data = {
      type: "subscribe",
      payload: {
        channels: [
          {
            name: "v2/ticker",
            symbols: symbolsList[0]
          }
        ]
      }
    };

    if (symbolsList[0] && symbolsList[0].length > 0) {
      ws.send(JSON.stringify(data));
    }
  }, [symbolsList[0]]);

  ws.onmessage = (evt) => {
    const message = JSON.parse(evt.data);
    let a = rowData.findIndex((val) => {
      return val.symbol === message.symbol;
    });
    let currencyData = rowData;
    if (a !== -1) {
      currencyData[a].market = message.mark_price;
      setUpdatedData([...currencyData]);
    }
  };

  const [columnDefs] = useState([
    { field: "symbol" },
    { field: "description" },
    { field: "underlying_asset.symbol" },
    { field: "market" }
  ]);

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "80vh", width: 800, margin: "auto", marginTop: "100px" }}
    >
      <AgGridReact rowData={updatedData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
};
export default Datatable;
