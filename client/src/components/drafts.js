import { useState } from "react";
import volcano from '../volcano.png';

const Drafts = (props) => {
    const [drafts, setDrafts] = useState([])
    if (props.drafts !== drafts) setDrafts(props.drafts)

    return <>
        <table className="main">
            {drafts.map(draft =>
                <tbody>
                    <tr>
                        <td>
                            <div className="leaguewrapper">
                                <img className="thumbnail" alt={draft.league_name} src={`https://sleepercdn.com/avatars/${draft.league_avatar}`} />
                                <p className="league">{draft.league_name}</p>
                                <p className="draft_status">{draft.draft.status.replace('_', '')}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            )}
        </table>
    </>
}

export default Drafts;