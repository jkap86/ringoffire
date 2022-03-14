import axios from 'axios';
import { useState, useEffect } from 'react';
import volcano from '../volcano.png';
import Roster from './roster';
import allPlayers from '../allPlayers.json';

const Homepage = () => {
    const [leagues, setLeagues] = useState({ '2022': [], '2021': [] })
    const [season, setSeason] = useState('2022')
    const [dv, setDv] = useState([])

    const showRoster = (e) => {
        let l = leagues[season]
        l.filter(x => x.owner_id === e).map(league => {
            league.isRosterHidden = !league.isRosterHidden
        })
        setLeagues({ ...leagues, [season]: [...l] })
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
            const getLeagues = async (league_season) => {
                const l = await axios.get('/leagues', {
                    params: {
                        season: league_season
                    }
                })
                return l.data
            }
            const [l, pl] = await Promise.all([
                await getLeagues(season),
                await getLeagues('2021')
            ])
            setLeagues({ '2022': l, '2021': pl })
        }
        fetchData()
    }, [])

    console.log(dv)

    return <>
        <h1>Ring of Fire {season}</h1>
        <div className='nav_container'>
            <button className={season === '2022' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2022')}>2022</button>
            <button className={season === '2021' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2021')}>2021</button>
        </div>
        <table className='main'>
            <tbody>
                <tr>
                    <th></th>
                    <th colSpan={3}>Username</th>
                    <th></th>
                    <th colSpan={4}>League</th>
                    <th colSpan={2}>Record</th>
                    <th colSpan={2}>FP</th>
                    <th colSpan={2}>FPA</th>
                </tr>
            </tbody>
            {leagues[season].sort((a, b) => b.wins - a.wins || b.fpts - a.fpts || b.fpts_against - a.fpts_against || b.owner_id - a.owner_id).map(league =>
                <tbody key={league.owner_id}>
                    <tr className={league.isRosterHidden === true ? 'hover clickable' : 'active clickable'} onDoubleClick={() => showRoster(league.owner_id)}>
                        <td><img className='thumbnail' alt={league.username} src={league.user_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.user_avatar}`} /></td>
                        <td colSpan={3}>{league.username}</td>
                        <td><img className='thumbnail' alt={league.league_name} src={`https://sleepercdn.com/avatars/${league.league_avatar}`} /></td>
                        <td colSpan={4}>{league.league_name}</td>
                        <td colSpan={2}>{league.wins}-{league.losses}</td>
                        <td colSpan={2}>{league.fpts.toLocaleString("en-US")}</td>
                        <td colSpan={2}>{league.fpts_against.toLocaleString("en-US")}</td>
                    </tr>
                    {league.isRosterHidden === true ? null :
                        <tr className='expanded'>
                            <td colSpan={15}>
                                <Roster roster={league} matchPlayer={matchPlayer} matchPick={matchPick} />
                            </td>
                        </tr>
                    }
                </tbody>
            )}
        </table>
    </>
}

export default Homepage;