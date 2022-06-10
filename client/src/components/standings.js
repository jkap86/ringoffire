import { useState, useEffect } from "react";
import Roster from "./roster";
import volcano from '../volcano.png';
import Search from "./search";
import allPlayers from '../allPlayers.json';

const Standings = (props) => {
    const [leagues, setLeagues] = useState([])
    const [group_age, setGroup_age] = useState("All")

    useEffect(() => {
        setLeagues(props.leagues.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts ||
            b.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0) -
            a.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0)
        ))
    }, [props.leagues])

    const getAge = (username) => {
        let l = leagues
        l = l.find(x => x.username === username)
        let length;
        switch (group_age) {
            case "All":
                length = l.players.length
                l = l.players.reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                break;
            case "Starters":
                length = l.players.filter(x => l.starters.includes(x)).length
                l = l.players.filter(x => l.starters.includes(x)).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                break;
            case "Bench":
                length = l.players.filter(x => !l.starters.includes(x)).length
                l = l.players.filter(x => !l.starters.includes(x)).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                break;
            default:
                length = l.players.filter(x => allPlayers[x].position === group_age).length
                l = l = l.players.filter(x => allPlayers[x].position === group_age).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                break;
        }

        return (l / length).toFixed(2)
    }

    const sort = (sort_by) => {
        let l = leagues
        switch (sort_by) {
            case 'fpts':
                setLeagues([...l.sort((a, b) => b.fpts - a.fpts)])
                break;
            case 'record':
                setLeagues([...l.sort((a, b) => b.wins - a.wins || a.losses - b.losses || b.fpts - a.fpts)])
                break;
            case 'value':
                setLeagues([...l.sort((a, b) =>
                    b.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0) -
                    a.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0)
                )])
                break;
            case 'age':
                setLeagues([...l.sort((a, b) => getAge(a.username) - getAge(b.username))])
                break;
            case 'fpts_against':
                setLeagues([...l.sort((a, b) => b.fpts_against - a.fpts_against)])
                break;
        }
    }

    const getSearched = (data) => {
        const l = leagues
        if (data) {
            l.map(league => {
                return league.isLeagueHidden = true
            })
            l.filter(x => x.username === data).map(league => {
                return league.isLeagueHidden = false
            })
        } else {
            l.map(league => {
                return league.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    return <>
        <div className="search_wrapper">
            <Search
                list={props.leagues.map(league => league.username)}
                placeholder="Search Managers"
                sendSearched={getSearched}
            />
        </div>
        <table className='main'>
            <tbody>
                <tr>
                    <th></th>
                    <th colSpan={3}>Username</th>
                    <th></th>
                    <th colSpan={4}>League</th>
                    <th colSpan={2} onClick={() => sort('record')} className="clickable">Record</th>
                    <th colSpan={2} onClick={() => sort('fpts')} className="clickable">FP</th>
                    <th colSpan={2} onClick={() => sort('fpts_against')} className="clickable">FPA</th>
                    <th colSpan={2} onClick={() => sort('value')} className="clickable">Roster Value</th>
                    <th colSpan={2} onClick={() => sort('age')} className="clickable">
                        <select onChange={(e) => setGroup_age(e.target.value)}>
                            <option>All</option>
                            <option>Starters</option>
                            <option>Bench</option>
                            <option>QB</option>
                            <option>RB</option>
                            <option>WR</option>
                            <option>TE</option>
                        </select>
                        <p>Avg Age</p>
                    </th>
                </tr>
            </tbody>
            {leagues.filter(x => x.isLeagueHidden === false).map((league, index) =>
                <tbody
                    key={index}
                    className={league.isRosterHidden === true ? 'hover clickable slide_up' : 'active clickable slide_up'}
                >
                    <tr
                        className={league.isRosterHidden === true ? 'hover clickable' : 'active clickable'}
                        onClick={() => props.showRoster(league.owner_id)}
                    >
                        <td>
                            <img
                                style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                className='thumbnail'
                                alt={league.username}
                                src={league.user_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.user_avatar}`}
                            />
                        </td>
                        <td colSpan={3}>{league.username}</td>
                        <td>
                            <img
                                style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                className='thumbnail'
                                alt={league.league_name}
                                src={`https://sleepercdn.com/avatars/${league.league_avatar}`}
                            />
                        </td>
                        <td colSpan={4}>{league.league_name}</td>
                        <td colSpan={2}>{league.wins}-{league.losses}</td>
                        <td colSpan={2}>{league.fpts.toLocaleString("en-US")}</td>
                        <td colSpan={2}>{league.fpts_against.toLocaleString("en-US")}</td>
                        <td colSpan={2}>{league.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0).toLocaleString("en-US")}</td>
                        <td colSpan={2}>{getAge(league.username)}</td>
                    </tr>
                    {league.isRosterHidden === true ? null :
                        <tr className='expanded slide_up'>
                            <td colSpan={19}>
                                <Roster roster={league} matchPlayer={props.matchPlayer} matchPick={props.matchPick} />
                            </td>
                        </tr>
                    }
                </tbody>
            )}
        </table>
    </>
}

export default Standings;