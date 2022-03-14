import { useState } from "react";
import volcano from '../volcano.png';
import Roster from "./roster";

const Leagues = (props) => {
    const [leagues, setLeagues] = useState([])
    if (props.leagues !== leagues) setLeagues(props.leagues)

    const showLeaguemates = (league_id) => {
        let l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues([...l])
    }
    const showRoster = (league_id, roster_id) => {
        let l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            league.rosters.filter(x => x.roster_id === roster_id).map(roster => {
                roster.isRosterHidden = !roster.isRosterHidden
            })
        })
        setLeagues([...l])
    }


    return <>
        <table className="main">
            {leagues.sort((a, b) => a.name > b.name ? 1 : -1).map(league =>
                <tbody>
                    <tr className='clickable' onDoubleClick={() => showLeaguemates(league.league_id)}>
                        <td></td>
                        <td>
                            <div className="leaguewrapper">
                                <img className="thumbnail" alt={league.name} src={`https://sleepercdn.com/avatars/${league.avatar}`} />
                                <p>{league.name}</p>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                    {league.isRostersHidden === true ? null :
                        <tr className="expanded">
                            <td colSpan={3}>
                                <table className="leagues_users">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th colSpan={2}>Leaguemate</th>
                                            <th>Record</th>
                                            <th>FP</th>
                                            <th>FPA</th>
                                        </tr>
                                    </tbody>
                                    {league.rosters.sort((a, b) => b.settings.wins - a.settings.wins).map(roster =>
                                        <tbody key={roster.owner_id + '_' + roster.roster_id}>
                                            <tr className={roster.isRosterHidden === true ? 'hover clickable' : 'active clickable'} onDoubleClick={() => showRoster(league.league_id, roster.roster_id)}>
                                                <td><img className="thumbnail" alt={roster.username} src={roster.avatar === null ? volcano : `https://sleepercdn.com/avatars/${roster.avatar}`} /></td>
                                                <td colSpan={2}>{roster.username}</td>
                                                <td>{roster.settings.wins}-{roster.settings.losses}</td>
                                                <td>{roster.settings.fpts_decimal === undefined ? 0 : roster.settings.fpts + '.' + roster.settings.fpts_decimal}</td>
                                                <td>{roster.settings.fpts_against_decimal === undefined ? 0 : roster.settings.fpts_against + '.' + roster.settings.fpts_against_decimal}</td>
                                            </tr>
                                            {roster.isRosterHidden === true ? null :
                                                <tr>
                                                    <td colSpan={6}>
                                                        <Roster
                                                            roster={roster}
                                                            matchPlayer={props.matchPlayer}
                                                            matchPick={props.matchPick}
                                                        />
                                                    </td>
                                                </tr>

                                            }
                                        </tbody>
                                    )}
                                </table>
                            </td>
                        </tr>
                    }
                </tbody>
            )}
        </table>
    </>
}
export default Leagues;