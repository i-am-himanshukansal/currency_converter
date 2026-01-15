import React, { useEffect, useState } from "react";
import axios from "axios";
import { currencies } from "./currencies";



const App = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);
  

  
  useEffect(()=>{
    const savedHistory = JSON.parse(localStorage.getItem("history")) || []; 
    setConversionHistory(savedHistory);
  },[]);

  const savedHistory=(entry)=>{
    const updatedHistory = [entry,...conversionHistory];
    setConversionHistory(updatedHistory)
    localStorage.setItem("history",JSON.stringify(updatedHistory));
  }
  const convertCurrencies = async() => {
    try {
      const {data}  = await axios.get(`http://localhost:4000/convert/?base_currency=${baseCurrency}&currencies=${selectedCurrency}`)
      let result = Object.values(data.data)[0]*amount;
      let roundOffResult = result.toFixed(2);
      const countryCode = currencies.find(elem=> elem.code===selectedCurrency);
      savedHistory({
        result : roundOffResult,
        flag : countryCode.flag,
        code : countryCode.code,
        symbol : countryCode.symbol,
        countryName : countryCode.name,
        date : new Date().toLocaleString(),
      });
    } catch (error) {
      alert("Error fetching conversion rates");
    }
  };
  const deleteHistoryItem=(index)=>{
    const updatedHistory = conversionHistory.filter((_,i)=> i!==index);
    localStorage.setItem("history",JSON.stringify(updatedHistory));
    setConversionHistory(updatedHistory);
  }

  return (
    <div className="h-screen bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center px-4 md:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[600px] min-h-[300px]">

        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Smart Currency Converter
        </h1>

        {/* Base Currency */}
        <div className="mb-4 px-1">
          <label className="block text-gray-700 font-semibold">
            Base Currency
          </label>
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="w-full border border-green-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1"
          >
            {currencies.map((element) => (
              <option key={element.code} value={element.code}>
                {element.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4 px-1">
          <label className="block text-gray-700 font-semibold">
            Amount
          </label>
          <input
            type="text"
            className="w-full border border-green-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            className="bg-pink-400 hover:bg-purple-600 text-white rounded-lg font-semibold text-xl w-52 py-2 transition duration-300"
            onClick={convertCurrencies}
          >
            Convert
          </button>
        </div>

        {/* Target Currency */}
        <div className="mb-4 px-1 mt-4">
          <label className="block text-gray-700 font-semibold">
            Currency To Convert
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full border border-green-300 bg-gray-200 font-semibold text-xl rounded-lg p-2 my-1"
          >
            {currencies.map((element) => (
              <option key={element.code} value={element.code}>
                {element.name}
              </option>
            ))}
          </select>
        </div>

        {/* History */}
        <div className="mt-6 px-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Conversion History
          </h2>
        </div>

        <div className="px-1 h-[400px]">
          <ul className="px-1">
            {conversionHistory.length>0 ? 
            (
              conversionHistory.map((element,index)=>{
                return(
                  <li key={index}
                   className="text-gray-700 mb-4 flex items-center justify-between ">
                    <div className="flex items-center gap-5">
                      <img src={`https://flagsapi.com/${(element.flag).toUpperCase()}/shiny/64.png`} alt="country flag" className="w-11 h-11 " />
                      <p className="flex flex-col gap-1 text-gray-500 font-medium ">
                        <span className="text-xl font-semibold text-black">{element.symbol}{element.result}</span>
                        <span>{element.code}-{element.countryName}</span>
                      </p>
                      </div>       
                      <span className="text-gray-500 font-bold text-xl hover:cursor-pointer" onClick={()=>deleteHistoryItem(index)}>x</span>             
                  </li>
                )
              })
            ):(<p className="flex flex-col gap-1 text-gray-500 font-medium">There is no history yet</p>)}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default App;