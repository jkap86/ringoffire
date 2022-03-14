import axios from 'axios';
import { useState, useEffect } from 'react';
import Standings from './standings';
import allPlayers from '../allPlayers.json';
import Leagues from './leagues';

const Homepage = () => {
    const [leagues, setLeagues] = useState({ '2022': [], '2021': [] })
    const [standings, setStandings] = useState({ '2022': [], '2021': [] })
    const [season, setSeason] = useState('2022')
    const [tab, setTab] = useState('Leagues')
    const [dv, setDv] = useState([])

    const showRoster = (e) => {
        let l = standings[season]
        l.filter(x => x.owner_id === e).map(league => {
            league.isRosterHidden = !league.isRosterHidden
        })
        setStandings({ ...standings, [season]: [...l] })
    }

    const matchPlayer = (player) => {
        if (player === '0') {
            return null
        } else {
            if (dv.find(x => x.searchName === allPlayers[player].search_full_name)) {
                return dv.find(x => x.searchName === allPlayers[player].search_full_name).value
            } else if (dv.find(x => allPlayers[player].search_full_name !== undefined && x.searchName.slice(-5, -2) === allPlayers[player].search_full_name.slice(-5, -2) && x.searchName.slice(0, 3) === allPlayers[player].search_full_name.slice(0, 3))) {
                return dv.find(x => x.searchName.slice(-5, -2) === allPlayers[player].search_full_name.slice(-5, -2) && x.searchName.slice(0, 3) === allPlayers[player].search_full_name.slice(0, 3)).value
            } else {
                return 0
            }
        }
    }
    const matchPick = (season, round) => {
        let value = dv.find(x => `${season}mid${round}` === x.searchName.slice(0, 8))
        value = value === undefined ? 0 : value.value
        return value
    }

    useEffect(() => {
        const fetchData = async () => {
            const getDynastyValues = async () => {
                const dv = await axios.get('/dynastyvalues')
                setDv(dv.data)
            }
            getDynastyValues()
            const getStandings = async (league_season) => {
                const s = await axios.get('/standings', {
                    params: {
                        season: league_season
                    }
                })
                return s.data
            }
            const getLeagues = async (league_season) => {
                const l = await axios.get('/leagues', {
                    params: {
                        season: league_season
                    }
                })
                return l.data
            }
            const [l, pl, s, ps] = await Promise.all([
                await getLeagues('2022'),
                await getLeagues('2021'),
                await getStandings('2022'),
                await getStandings('2021')
            ])
            setLeagues({ '2022': l, '2021': pl })
            setStandings({ '2022': s, '2021': ps })
        }
        fetchData()
    }, [])

    console.log(leagues)

    return <>
        <h1>Ring of Fire</h1>
        <div className='nav_container'>
            <button className={season === '2022' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2022')}>2022</button>
            <button className={season === '2021' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2021')}>2021</button>
        </div>
        <div className='nav_container'>
            <button className={tab === 'Leagues' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Leagues')}>Leagues</button>
            <button className={tab === 'Standings' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Standings')}>Standings</button>
        </div>
        <div hidden={tab === 'Leagues' ? false : true}>
            <Leagues
                leagues={leagues[season]}
                matchPlayer={matchPlayer}
                matchPick={matchPick}
            />
        </div>

        <div hidden={tab === 'Standings' ? false : true}>
            <Standings
                leagues={standings[season]}
                showRoster={showRoster}
                matchPlayer={matchPlayer}
                matchPick={matchPick}
            />
        </div>
    </>
}

export default Homepage;