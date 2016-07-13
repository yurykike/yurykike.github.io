"use strict"

//Creo el archivo Json con los objetos de las tablas.


function memberData(member, name) {

    var membersObject = {};
    membersObject.votes = member.missed_votes;
    membersObject.pct = member.missed_votes_pct;
    membersObject.names = name;
    membersObject.url = member.url;
    return membersObject;
}