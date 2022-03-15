import { useState } from "react";
import volcano from '../volcano.png';
import allPlayers from '../allPlayers.json';


const Drafts = (props) => {
    const [drafts, setDrafts] = useState([])
    if (props.drafts !== drafts) setDrafts(props.drafts)

    const showPicks = (e) => {
        let d = drafts
        d.filter(x => x.draft.draft_id === e).map(draft => {
            draft.isPicksHidden = !draft.isPicksHidden
        })
        setDrafts([...d])
    }


    return <>
        <table className="main">
            {drafts.map(draft =>
                <tbody>
                    <tr className={draft.isPicksHidden ? 'hover2' : 'active2'}>
                        <td>
                            <div onDoubleClick={() => showPicks(draft.draft.draft_id)} className="leaguewrapper clickable">
                                <img className="thumbnail" alt={draft.league_name} src={`https://sleepercdn.com/avatars/${draft.league_avatar}`} />
                                <p className="league">{draft.league_name}</p>
                                <p className="draft_status">{draft.draft.status.replace('_', '')}</p>
                            </div>
                        </td>
                    </tr>
                    {draft.isPicksHidden === true || draft.picks.length < 1 ? null :
                        <tr className="draft_picks">
                            <td>
                                {Array.from(Array(draft.draft.settings.rounds).keys()).map(n => n + 1).map(round =>
                                    <div className="round_row">
                                        <table className="round">
                                            <tbody>
                                                {draft.picks.filter(x => x.round === round).length > 0 ?
                                                    <tr>
                                                        <th>R</th>
                                                        <th>P</th>
                                                        <th>Manager</th>
                                                        <th>Pos</th>
                                                        <th>Player</th>
                                                        <th>Value</th>
                                                    </tr>
                                                    : null
                                                }
                                                {draft.picks.filter(x => x.round === round).map(pick =>
                                                    <tr className="hover">
                                                        <td>{pick.round}</td>
                                                        <td>{(pick.pick_no % draft.total_rosters) === 0 ? draft.total_rosters : (pick.pick_no % draft.total_rosters)}</td>
                                                        <td>{pick.picked_by}</td>
                                                        <td>{allPlayers[pick.player_id].position}</td>
                                                        <td>
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
                    }
                </tbody>
            )}
        </table>
    </>
}

export default Drafts;