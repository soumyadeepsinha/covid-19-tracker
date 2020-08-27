import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};


const LineGraph = () => {
  const [data, setData] = useState({})

  const url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=120'

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const chartData = buildChartData(data)
        setData(chartData)
        console.log(data)
      })
  }, [])

  return (
    <div>
      <h2>Graph will be shown here</h2>
      <Line
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: data,
            },
          ],
        }}
      // options={options}
      />
    </div>
  )
}

export default LineGraph