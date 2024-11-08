import React, { useEffect, useState } from 'react'
import data from '../Data.json';
import { Table } from '@mantine/core';
import "../Style/MaxMinCrop.css";

interface TotalData {
  Country: string,
  Year: string,
  "Crop Name": string,
  "Crop Production (UOM:t(Tonnes))": string | number,
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))":  string | number,
  "Area Under Cultivation (UOM:Ha(Hectares))":  string | number
}

interface MaxMinData{
  "year": number;
  "maxCrop": string;
  "minCrop": string;
}


interface AverageData{
  Crop: string;
  avgyield: number;
  avgarea: number;
}


const MaxMinCrop: React.FC = () => {
   const [YearlyData, setYearlyData] = useState<MaxMinData[]>([]);
   const [AverageCropData, setAverageCropData] = useState<AverageData[]>([]);

   useEffect(() => {
    handleMaxMinData();
   }, []);

   const handleMaxMinData = () =>{


    const yearly:MaxMinData[]  = [];
    const CropData: { [Crop: string]: { TotalYield: number; TotalArea: number; Count: number } } = {};

    


    data.forEach((item:TotalData) => {
      const year = parseInt(item.Year.split(",")[1].trim());
      const production = parseFloat(item["Crop Production (UOM:t(Tonnes))"] || "0");

      // Average yeild data
    const Area = parseFloat(item["Area Under Cultivation (UOM:Ha(Hectares))"] || "0");
    const YieldVal = parseFloat(item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] || "0"); 


      const yearlyEntry = yearly.find((item) => item.year === year);
      if (yearlyEntry) {

        if (production > data.find((d) => parseInt(d.Year.split(",")[1].trim()) === year && d["Crop Name"] === yearlyEntry.maxCrop )?.["Crop Production (UOM:t(Tonnes))"]) {
          yearlyEntry.maxCrop = item["Crop Name"];
        }

        if (production < data.find((d) => parseInt(d.Year.split(",")[1].trim()) === year && d["Crop Name"] === yearlyEntry.minCrop )?.["Crop Production (UOM:t(Tonnes))"]) {
          yearlyEntry.minCrop = item["Crop Name"];
        }
        
      }
      else{
        yearly.push({
          "year": year,
          "maxCrop": item["Crop Name"],
          "minCrop": item["Crop Name"]
        });
      }

      if(!CropData[item["Crop Name"]]){
        CropData[item["Crop Name"]] = {TotalYield: 0, TotalArea: 0, Count: 0}

      }
      CropData[item["Crop Name"]].TotalYield += YieldVal;
      CropData[item["Crop Name"]].TotalArea += Area;
      CropData[item["Crop Name"]].Count += 1;
    });
    const averages: AverageData[] = Object.keys(CropData).map(crop => ({
      crop,
      avgYield: parseFloat((CropData[crop].TotalYield / CropData[crop].Count).toFixed(3)),
      avgArea: parseFloat((CropData[crop].TotalArea / CropData[crop].Count).toFixed(3)),
    }));

  
    setYearlyData(yearly);
    setAverageCropData(averages);
   };

   console.log(AverageCropData);
   


    const rows = YearlyData.map((element) => (
        <Table.Tr key={element.year}>
          <Table.Td >{element.year}</Table.Td>
          <Table.Td>{element.maxCrop}</Table.Td>
          <Table.Td>{element.minCrop}</Table.Td>
        </Table.Tr>
      ));


    const Averagerows = AverageCropData.map((element) => (
        <Table.Tr key={element.crop}>
          <Table.Td >{element.crop}</Table.Td>
          <Table.Td>{element.avgYield}</Table.Td>
          <Table.Td>{element.avgArea}</Table.Td>
        </Table.Tr>
      ));
    
  return (
    // Aggregate data by year to find the crop with the maximum and minimum production for each year
    <div>

{/* Data to Show the Maximum and Minimum Crop of Every Year */}
        <Table.ScrollContainer minWidth={500}>
          <h3 className='table_Container'>Data to Show the Maximum and Minimum Crop of Every Year</h3>
      <Table className='table_Container'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Year</Table.Th>
            <Table.Th>Crop with Maximum Production in that Year</Table.Th>
            <Table.Th>Crop with Minimum Production in that Year</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>



    {/* Average Yield and Cultivated Area between the years  */}
    <Table.ScrollContainer minWidth={500}>
          <h3 className='table_Container'>Data to Show Average Yield and Cultivated Area between the years </h3>
      <Table className='table_Container'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Year</Table.Th>
            <Table.Th> Average Yield of the Crop between 1950-2020</Table.Th>
            <Table.Th> Average Cultivation Area of the Cropbetween 1950-2020</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{Averagerows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
      
    </div>
  )
}

export default MaxMinCrop
