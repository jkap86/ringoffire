import axios from 'axios';
import { useState, useEffect } from 'react';
import volcano from '../volcano.png';
import Roster from './roster';

const Homepage = () => {
    const [leagues, setLeagues] = useState([])
    const [season, setSeason] = useState('2022')

    const showRoster = (e) => {
        let l = leagues
        l.filter(x => x.owner_id === e).map(league => {
            league.isRosterHidden = !league.isRosterHidden
        })
        setLeagues([...l])
    }

    useEffect(() => {
        const fetchData = async () => {
            const getLeagues = async (league_season) => {
                const l = await axios.get('/leagues', {
                    params: {
                        season: league_season
                    }
                })
                return l.data
            }
            const l = await getLeagues(season)
            setLeagues(l)
        }
        fetchData()
    }, [season])

    console.log(leagues)
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
            {leagues.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts || b.fpts_against - a.fpts_against || b.owner_id - a.owner_id).map(league =>
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
                                <Roster roster={league} />
                            </td>
                        </tr>
                    }
                </tbody>
            )}
        </table>
    </>
}

export default Homepage;