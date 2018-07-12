function shouldSaveData(stashDetails) {
	return stashDetails.stash != null && 
		stashDetails.items.length > 0 && 
		stashDetails.accountName != null && 
		stashDetails.league === 'Incursion';
}

module.exports.process = function (data) {
	let nextId = JSON.parse(data).next_change_id;
	var stashes = JSON.parse(data).stashes;

	var charHash = {};
	for (var i = 0; i < stashes.length; i++) {
		if (shouldSaveData(stashes[i])) {
			var primaryId = stashes[i].accountName;
			if (charHash[primaryId] == null) {
				charHash[primaryId] = { stashes: [] }
			} else {
				charHash[primaryId].stashes.push(stashes[i]);
			}
		}
	}

	return { nextId: nextId, accountsHash: charHash };
}