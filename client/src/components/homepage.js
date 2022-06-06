import axios from 'axios';
import { useState, useEffect } from 'react';
import Standings from './standings';
import allPlayers from '../allPlayers.json';
import Leagues from './leagues';
import Drafts from './drafts';
import Players from './players';

const Homepage = () => {
    const [leagues, setLeagues] = useState({ '2022': [], '2021': [] })
    const [standings, setStandings] = useState({ '2022': [], '2021': [] })
    const [drafts, setDrafts] = useState({ '2022': [], '2021': [] })
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

    const findOccurences = (players) => {
        const playersOccurences = []
        players.forEach(player => {
            const index = playersOccurences.findIndex(obj => {
                return obj.player === player.player
            })
            if (index === -1) {
                playersOccurences.push({
                    player: player.player,
                    count: 1,
                    dynasty_value: matchPlayer(player.player),
                    isLeaguesHidden: true,
                    wins: player.roster.settings.wins,
                    losses: player.roster.settings.losses,
                    ties: player.roster.settings.ties,
                    leagues: [{
                        league_name: player.league.name,
                        league_avatar: player.league.avatar,
                        owner_name: player.roster.username,
                        owner_avatar: player.roster.avatar,
                        wins: player.roster.settings.wins,
                        losses: player.roster.settings.losses,
                        ties: player.roster.settings.ties
                    }]
                })
            } else {
                playersOccurences[index].count++
                playersOccurences[index].wins = playersOccurences[index].wins + player.roster.settings.wins
                playersOccurences[index].losses = playersOccurences[index].losses + player.roster.settings.losses
                playersOccurences[index].ties = playersOccurences[index].ties + player.roster.settings.ties
                playersOccurences[index].leagues.push({
                    league_name: player.league.name,
                    league_avatar: player.league.avatar,
                    owner_name: player.roster.username,
                    owner_avatar: player.roster.avatar,
                    wins: player.roster.settings.wins,
                    losses: player.roster.settings.losses,
                    ties: player.roster.settings.ties
                })
            }
        })

        return playersOccurences
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
            const l = await getLeagues('2022')
            const pl = await getLeagues('2021')
            setLeagues({ '2022': l, '2021': pl })
            const getDrafts = async (league_season) => {
                const d = await axios.get(`/drafts`, {
                    params: {
                        season: league_season
                    }
                })
                return d.data
            }
            const [s, ps, d, pd] = await Promise.all([
                await getStandings('2022'),
                await getStandings('2021'),
                await getDrafts('2022'),
                await getDrafts('2021')
            ])
            setStandings({ '2022': s, '2021': ps })
            setDrafts({ '2022': d, '2021': pd })
        }
        fetchData()
    }, [])
    let players = leagues[season].length <= 0 ? [] : leagues[season].map(league => {
        return league.rosters.map(roster => {
            return roster.players.map(player => {
                return {
                    league: league,
                    roster: roster,
                    player: player
                }
            })
        })
    }).flat(2)

    players = findOccurences(players)

    return <>
        <div className='table_container'>
        <div className='nav_container'>
            <button className={season === '2022' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2022')}>2022</button>
            <button className={season === '2021' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2021')}>2021</button>
        </div>
        <h1>Ring of Fire</h1>
        <div className='nav_container'>
            <button className={tab === 'Leagues' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Leagues')}>Leagues</button>
            <button className={tab === 'Standings' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Standings')}>Standings</button>
            <button className={tab === 'Players' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Players')}>Players</button>
            <button className={tab === 'Drafts' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Drafts')}>Drafts</button>
        </div>

        <div hidden={tab === 'Leagues' ? false : true}>
            {leagues[season].length > 0 ?
                <Leagues
                    leagues={leagues[season]}
                    matchPlayer={matchPlayer}
                    matchPick={matchPick}
                />
                : <h1>Loading...</h1>
            }
        </div>

        <div hidden={tab === 'Standings' ? false : true}>
            {standings[season].length > 0 ?
                <Standings
                    leagues={standings[season]}
                    showRoster={showRoster}
                    matchPlayer={matchPlayer}
                    matchPick={matchPick}
                />
                : <h1>Loading...</h1>
            }
        </div>

        <div hidden={tab === 'Players' ? false : true}>
            <Players players={players} />
        </div>

        <div hidden={tab === 'Drafts' ? false : true}>
            {drafts[season].length > 0 ?
                <Drafts drafts={drafts[season]} matchPlayer={matchPlayer} />
                : <h1>Loading...</h1>
            }
        </div>
        </div>
    </>
}

export default Homepage;