import { useState } from "react";
import volcano from '../volcano.png';
import Roster from "./roster";
import Search from "./search";
import allPlayers from '../allPlayers.json';

const Leagues = (props) => {
    const [tab, setTab] = useState('League')
    const [leagues, setLeagues] = useState([])
    const [drafts, setDrafts] = useState([])
    if (props.drafts !== drafts) setDrafts(props.drafts)
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

    const getSearched = (data) => {
        const l = leagues
        if (data) {
            l.map(league => {
                return league.isLeagueHidden = true
            })
            l.filter(x => x.name === data).map(league => {
                return league.isLeagueHidden = false
            })
        } else {
            l.map(leagues => {
                return leagues.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    return <>
        <div className="search_wrapper">
            <Search
                list={leagues.map(league => league.name)}
                placeholder="Search Leagues"
                sendSearched={getSearched}
            />
        </div>
        <table className="main">
            {leagues.filter(x => x.isLeagueHidden === false).sort((a, b) => a.name > b.name ? 1 : -1).map((league, index) =>
                <tbody className="slide_up" key={index}>
                    <tr
                        className={league.isRostersHidden ? 'hover2 clickable' : 'active2 clickable'}
                        onClick={() => showLeaguemates(league.league_id)}>
                        <td></td>
                        <td>
                            <div className="leaguewrapper">
                                <img
                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                    className="thumbnail"
                                    alt={league.name}
                                    src={`https://sleepercdn.com/avatars/${league.avatar}`}
                                />
                                <p className="league">{league.name}</p>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                    {league.isRostersHidden === true ? null :
                        <>
                            <tr>
                                <td colSpan={3}>
                                    <div className="league_draft">
                                        <button className={tab === 'League' ? "league_tab active clickable" : 'league_tab clickble'} onClick={() => setTab('League')}>League</button>
                                        <button className={tab === 'Draft' ? "league_tab active clickable" : 'league_tab clickble'} onClick={() => setTab('Draft')}>Draft</button>
                                    </div>
                                </td>
                            </tr>
                            {tab === 'League' ?
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
                                                    <th>Roster Value</th>
                                                </tr>
                                            </tbody>
                                            {league.rosters.sort((a, b) => b.settings.wins - a.settings.wins).map(roster =>
                                                <tbody key={roster.owner_id + '_' + roster.roster_id}>
                                                    <tr className={roster.isRosterHidden === true ? 'hover clickable slide_up' : 'active clickable slide_up'} onClick={() => showRoster(league.league_id, roster.roster_id)}>
                                                        <td>
                                                            <img
                                                                style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                                                className="thumbnail"
                                                                alt={roster.username}
                                                                src={roster.avatar === null ? volcano : `https://sleepercdn.com/avatars/${roster.avatar}`}
                                                            />
                                                        </td>
                                                        <td colSpan={2}>{roster.username}</td>
                                                        <td>{roster.settings.wins}-{roster.settings.losses}</td>
                                                        <td>{roster.settings.fpts_decimal === undefined ? 0 : roster.settings.fpts + '.' + roster.settings.fpts_decimal}</td>
                                                        <td>{roster.settings.fpts_against_decimal === undefined ? 0 : roster.settings.fpts_against + '.' + roster.settings.fpts_against_decimal}</td>
                                                        <td>{roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0).toLocaleString("en-US")}</td>
                                                    </tr>
                                                    {roster.isRosterHidden === true ? null :
                                                        <tr className="slide_up">
                                                            <td colSpan={7}>
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
                                : null
                            }
                            {tab === 'Draft' ?
                                <tr className="expanded">
                                    <td colSpan={3}>
                                        <table className="league_users">
                                            <tbody>
                                                <tr className="draft_picks slide_up">
                                                    <td>
                                                        {Array.from(Array(drafts.find(x => x.league_name === league.name).draft.settings.rounds).keys()).map(n => n + 1).map((round, index) =>
                                                            <div className="round_row" key={index}>
                                                                <table className="round">
                                                                    <tbody>
                                                                        {drafts.find(x => x.league_name === league.name).picks.filter(x => x.round === round).length > 0 ?
                                                                            <tr>
                                                                                <th>R</th>
                                                                                <th>P</th>
                                                                                <th colSpan={2}>Manager</th>
                                                                                <th>Pos</th>
                                                                                <th colSpan={2}>Player</th>
                                                                                <th>Value</th>
                                                                            </tr>
                                                                            : null
                                                                        }
                                                                        {drafts.find(x => x.league_name === league.name).picks.filter(x => x.round === round).map((pick, index) =>
                                                                            <tr className="hover" key={index}>
                                                                                <td>{pick.round}</td>
                                                                                <td>{(pick.pick_no % drafts.find(x => x.league_name === league.name).total_rosters) === 0 ? drafts.find(x => x.league_name === league.name).total_rosters : (pick.pick_no % drafts.find(x => x.league_name === league.name).total_rosters)}</td>
                                                                                <td><img className="thumbnail_small" alt="avatar" src={pick.picked_by_avatar === null ? volcano : `https://sleepercdn.com/avatars/${pick.picked_by_avatar}`} /></td>
                                                                                <td className="left">{pick.picked_by}</td>
                                                                                <td>{allPlayers[pick.player_id].position}</td>
                                                                                <td><img className="thumbnail_small" alt='headshot' src={`https://sleepercdn.com/content/nfl/players/thumb/${pick.player_id}.jpg`} onError={(e) => { return e.target.src = volcano }} /></td>
                                                                                <td className="left">
                                                                                    {allPlayers[pick.player_id].first_name + " " + allPlayers[pick.player_id].last_name +
                                                                                        " " + (allPlayers[pick.player_id].team === null ? 'FA' : allPlayers[pick.player_id].team)}
                                                                                </td>
                                                                                <td>
                                                                                    <em>{props.matchPlayer(pick.player_id)}</em>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                : null
                            }
                        </>
                    }

                </tbody>
            )}
        </table>
    </>
}
export default Leagues;