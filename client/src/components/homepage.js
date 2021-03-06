import axios from 'axios';
import { useState, useEffect, lazy, Suspense } from 'react';
import allPlayers from '../allPlayers.json';
import volcano from '../volcano.png';
const Standings = lazy(() => import('./standings'));
const Leagues = lazy(() => import('./leagues'));
const Drafts = lazy(() => import('./drafts'));
const Players = lazy(() => import('./players'));
const Transactions = lazy(() => import('./transactions'));



const Homepage = () => {
    const [leagues, setLeagues] = useState({ '2022': [], '2021': [] })
    const [standings, setStandings] = useState({ '2022': [], '2021': [] })
    const [drafts, setDrafts] = useState({ '2022': [], '2021': [] })
    const [transactions, setTransactions] = useState({ '2022': [], '2021': [] })
    const [season, setSeason] = useState('2022')
    const [tab, setTab] = useState('Standings')
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
                    isPlayerHidden: false,
                    wins: player.roster.settings.wins,
                    losses: player.roster.settings.losses,
                    ties: player.roster.settings.ties,
                    leagues: [{
                        league_id: player.league.league_id,
                        league_name: player.league.name,
                        league_avatar: player.league.avatar,
                        owner_name: player.roster.username,
                        owner_avatar: player.roster.avatar,
                        wins: player.roster.settings.wins,
                        losses: player.roster.settings.losses,
                        ties: player.roster.settings.ties,
                        roster: player.roster,
                        isRosterHidden: true
                    }]
                })
            } else {
                playersOccurences[index].count++
                playersOccurences[index].wins = playersOccurences[index].wins + player.roster.settings.wins
                playersOccurences[index].losses = playersOccurences[index].losses + player.roster.settings.losses
                playersOccurences[index].ties = playersOccurences[index].ties + player.roster.settings.ties
                playersOccurences[index].leagues.push({
                    league_id: player.league.league_id,
                    league_name: player.league.name,
                    league_avatar: player.league.avatar,
                    owner_name: player.roster.username,
                    owner_avatar: player.roster.avatar,
                    wins: player.roster.settings.wins,
                    losses: player.roster.settings.losses,
                    ties: player.roster.settings.ties,
                    roster: player.roster,
                    isRosterHidden: true
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
            const s = await getStandings('2022')
            const ps = await getStandings('2021')
            setStandings({ '2022': s, '2021': ps })
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
            const getTransactions = async (league_season) => {
                const t = await axios.get('/transactions', {
                    params: {
                        season: league_season
                    }
                })
                return t.data
            }

            const [d, pd, t, pt] = await Promise.all([
                await getDrafts('2022'),
                await getDrafts('2021'),
                await getTransactions('2022'),
                await getTransactions('2021')
            ])
            setDrafts({ '2022': d, '2021': pd })
            setTransactions({ '2022': t, '2021': pt })
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
            <h1>
                <div className='title_container'>
                    <img className='title_picture' alt='volcano' src={volcano} />
                    <p className='title'>Ring of Fire</p>
                </div>
            </h1>
            <div className='nav_container'>
                <button className={tab === 'Standings' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Standings')}>Standings</button>
                <button className={tab === 'Leagues' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Leagues')}>Leagues</button>
                <button className={tab === 'Players' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Players')}>Players</button>
                <button className={tab === 'Transactions' ? 'active_nav nav' : 'nav'} onClick={() => setTab('Transactions')}>Transactions</button>
            </div>

            {tab === 'Leagues' ?
                <div>
                    {leagues[season].length > 0 ?
                        <Suspense fallback={<h1>Loading...</h1>}>
                            <Leagues
                                leagues={leagues[season]}
                                drafts={drafts[season]}
                                matchPlayer={matchPlayer}
                                matchPick={matchPick}
                            />
                        </Suspense>
                        : <h1>Loading...</h1>
                    }
                </div>
                : null
            }
            {tab === 'Standings' ?
                <div hidden={tab === 'Standings' ? false : true}>
                    {standings[season].length > 0 ?
                        <Suspense fallback={<h1>Loading...</h1>}>
                            <Standings
                                leagues={standings[season]}
                                showRoster={showRoster}
                                matchPlayer={matchPlayer}
                                matchPick={matchPick}
                            />
                        </Suspense>
                        : <h1>Loading...</h1>
                    }
                </div>
                : null
            }
            {tab === 'Players' ?
                <div hidden={tab === 'Players' ? false : true}>
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <Players
                            players={players}
                            matchPlayer={matchPlayer}
                            matchPick={matchPick}
                        />
                    </Suspense>
                </div>
                : null
            }
            {tab === 'Transactions' ?
                <div>
                    <Suspense fallback={<h1>Loading...</h1>}>
                        {transactions[season].length > 0 ?
                            <Transactions
                                transactions={transactions[season]}
                            />
                            : <h1>Loading...</h1>
                        }
                    </Suspense>
                </div>
                : null
            }
        </div>
    </>
}

export default Homepage;