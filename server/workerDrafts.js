const workerpool = require('workerpool')
const axios = require('axios')

const getDrafts = async (season) => {
    const leagues = await axios.get(`https://api.sleeper.app/v1/user/435483482039250944/leagues/nfl/${season}`)
    const leaguesROF = leagues.data.filter(x => x.name.includes('Ring of Fire: '))
    const draftsROF = []
    await Promise.all(leaguesROF.map(async league => {
        const league_drafts = await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/drafts`)
        await Promise.all(league_drafts.data.map(async draft => {
            const [draft_info, draft_picks] = await Promise.all([
                await axios.get(`https://api.sleeper.app/v1/draft/${draft.draft_id}`),
                await axios.get(`https://api.sleeper.app/v1/draft/${draft.draft_id}/picks`)
            ])
            draftsROF.push({
                league_id: league.league_id,
                league_avatar: league.avatar,
                league_name: league.name,
                total_rosters: league.total_rosters,
                draft: draft_info.data,
                picks: draft_picks.data,
                isPicksHidden: true
            })
        }))
    }))
    return draftsROF
}


workerpool.worker({
    getDrafts: getDrafts
})