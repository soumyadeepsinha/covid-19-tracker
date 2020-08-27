import React, { useState, useEffect } from 'react'
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import Infobox from './Infobox'
import Map from './Map'
import Table from './Table'
import { sortData } from './utli'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [countryTable, setCountryTable] = useState([])

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
      })
  }

  console.log('Country Info: ', countryInfo);

  return (
    <div className="app">
      <div className="app_leftside">
        <div className="app_header">
          <h1>Covd-19-Tracker</h1>
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
          <Infobox title="Corona Virus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <Infobox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <Infobox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        {/* Map */}
        <Map />
      </div>
      <Card className="app_rightside">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={countryTable} />
          {/* Table */}
          <h3>Worldwide new cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App
