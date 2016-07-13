"use strict"


function memberData(member, name) {
        
    var membersObject = {};
    membersObject.votes = member.total_votes;
    membersObject.pct = member.votes_with_party_pct;
    membersObject.names = name;
    membersObject.url = member.url;
    return membersObject;
}
    


