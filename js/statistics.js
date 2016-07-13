$(document).ready(function () {

    var path = window.location.pathname;
    var htmlName = path.split("/").pop();
    var chamber = "";
    if (htmlName === "house-starter-page.html" || htmlName === "house-attendance-starter-page.html" || htmlName === "house-party-loyalty-starter-page.html") {
        chamber = "house";
        //chamber = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/house/members/current.json";
    } else if (htmlName === "senate-starter-page.html" || htmlName === "senate-attendance-starter-page.html" || htmlName === "senate-party-loyalty-starter-page.html") {
        chamber = "senate";
        //chamber = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/senate/members/current.json";
    };

    var url = "https://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/" + chamber + "/members/current.json"
    url += '?' + $.param({
        'api-key': "8cd554dc2769412f9a4705f50a8a77ed"
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (data) {

        var members = data.results[0].members;

        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            member.name = names(member);
        }

        mostrarTablas(members);

    }).fail(function (err) {
        throw err;
    });

});

function mostrarTablas(members) {
    rellenaEstadisticasGlance(members);
    mostrarGlance();
    rellenaEstadisticasLeastMost(members);
    mostrarLeastMost()
};


var statistics = {

    glance: {
        republicans: {
            number: 0
            , votes_with_party_pct: 0
        }
        , democrats: {
            number: 0
            , votes_with_party_pct: 0
        }
        , independents: {
            number: 0
            , votes_with_party_pct: 0
        }
        , total: {
            number: 0
            , votes_with_party_pct: 0
        }
    },

    least_engaged_pct: []
    , most_engaged_pct: []
};

            //FUNCIONES
    //-------------------------------------------------------//



function names(member) {

    var name;

    if (member.middle_name !== null) {
        name = member.last_name + ", " + member.first_name + " " + member.middle_name;
    } else {
        name = member.last_name + ", " + member.first_name;
    }

    return name;
}


function rellenaEstadisticasGlance(members) {



    var pctRep = 0;
    var pctDem = 0;
    var pctInd = 0;

    for (var i = 0; i < members.length; i++) {

        var member = members[i];

        if (member.party === "R") {
            pctRep += parseFloat(member.votes_with_party_pct);
            statistics.glance.republicans.number++;
        } else if (member.party === "D") {
            pctDem += parseFloat(member.votes_with_party_pct);
            statistics.glance.democrats.number++;
        } else {
            pctInd += parseFloat(member.votes_with_party_pct);
            statistics.glance.independents.number++;
        }
    };

    var totalMembers = members.length;


    statistics.glance.total.number = totalMembers;
    var pctTotal = pctRep + pctDem + pctInd;

    //En base a los datos anteriores recojo el porcentaje de cada partido.


    statistics.glance.republicans.votes_with_party_pct = parseFloat((pctRep / (statistics.glance.republicans.number))).toFixed(1);

    statistics.glance.democrats.votes_with_party_pct = parseFloat((pctDem / (statistics.glance.democrats.number))).toFixed(1);

    statistics.glance.independents.votes_with_party_pct = parseFloat((pctInd / (statistics.glance.independents.number))).toFixed(1);

    statistics.glance.total.votes_with_party_pct = parseFloat((pctTotal / totalMembers)).toFixed(1);

};


function mostrarGlance() {
    var templateGlance = $('#data-template0').html();
    var infoGlance = Mustache.render(templateGlance, statistics.glance);
    $('#glance').html(infoGlance);
};


function arrayPCT(members) {

    var arrayPCT = [];

    for (var i = 0; i < members.length; i++) {

        var member = members[i];

        var name;
        if (member.middle_name !== null) {
            name = member.last_name + ", " + member.first_name + " " + member.middle_name;
        } else {
            name = member.last_name + ", " + member.first_name;
        }

        var membersObject = memberData(member, name);

        arrayPCT.push(membersObject);


    };

    arrayPCT.sort(function (a, b) {
        return a.pct - b.pct;
    });

    return arrayPCT;
};

function arrayPCT10(arrayPCT, members) {
    var k = Math.round(members.length * 0.10);
    var arrayPCT10 = [];

    //hago otro ciclo esta vez poniendo como limite i<k, y pusheo dentro de la nueva array.

    for (i = 0; i < k; i++) {
        arrayPCT10.push(arrayPCT[i]);

    }

    for (i = k; i < arrayPCT.length; i++) {
        if (arrayPCT[k - 1].pct == arrayPCT[i].pct) {
            arrayPCT10.push(arrayPCT[i])
        } else {
            break;
        }
    };
    return arrayPCT10;
};


function arrayInversePCT(arrayPCT, members) {
    var kk = Math.round(members.length * 0.90);
    var arrayInversePCT = [];

    for (i = arrayPCT.length - 1; i >= kk; i--) {
        arrayInversePCT.push(arrayPCT[i]);
    };


    for (i = kk; i > 0; i--) {
        if (arrayPCT[kk + 1].pct == arrayPCT[i].pct) {
            arrayInversePCT.push(arrayPCT[i])
        } else {
            break;
        }
    };
    return arrayInversePCT;
};


function rellenaEstadisticasLeastMost(members) {

    statistics.most_engaged_pct = arrayPCT10(arrayPCT(members), members);
    statistics.least_engaged_pct = arrayInversePCT(arrayPCT(members), members);

};


function mostrarLeastMost() {

    var templateLeast = $('#data-template').html();
    var templateMost = $('#data-template2').html();
    var mustacheData = {
        membersLeast: statistics.least_engaged_pct
        , membersMost: statistics.most_engaged_pct
    }
    var infoLeast = Mustache.render(templateLeast, mustacheData);
    $('#lE').html(infoLeast);
    var infoMost = Mustache.render(templateMost, mustacheData);
    $('#mE').html(infoMost);

};