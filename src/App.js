import React, { useState, useEffect } from 'react'
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import Infobox from './Infobox'
import Map from './Map'
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'
import Table from './Table'
import { sortData, prettyPrintStat } from './utli'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [countryTable, setCountryTable] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 28.65381, lng: 77.22897 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)
      })
  }, [])

  const countryList = 'https://disease.sh/v3/covid-19/countries'

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch(countryList)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,          // India, United States
            value: country.countryInfo.iso2 // IND, USA, UK
          }))
          const sortedData = sortData(data)
          setMapCountries(data)
          setCountryTable(sortedData)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode)

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountryInfo(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  }

  console.log('Country Info: ', countryInfo);

  return (
    <div className="app">
      <div className="app_leftside">
        <div className="app_header">
          <h1>COVID-19-TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <Infobox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title="Corona Virus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <Infobox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <Infobox
            isRed
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_rightside">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={countryTable} />
          <h3 className="app_graphTitle">Worldwide new {casesType}</h3>
          <LineGraph
            className="app_graph"
            casesType={casesType}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App
