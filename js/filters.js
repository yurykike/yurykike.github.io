var template = $('#data-template').html();

$(document).ready(function(){
    
    
     $(".source").on("change", function() {
        getData(filterValue());
    });
   
  
getCacheData(urlNYT());
    
    

    
});



//--------------------FUNCIONES---------------------//
function getFromCache(name){
    var nameSTR = localStorage.getItem(name);
        return JSON.parse(nameSTR);
}

function putCache(name, data){
    //Transformamos el objeto en un string YA QUE LA CACHE SOLO GUARDA STRINGS.
    
    var dataSTR = JSON.stringify(data);
    localStorage.setItem(name, dataSTR);
    
};

function getCacheData(url){
    
    if (url === urlNYT()) {
        //esta en cache?
        var nytData = getFromCache("NYT");
        if (nytData) {

            var members = nytData.results[0].members;
            getDoneData(members);
        }
        else {

            callAjax(urlNYT());
        }    
    }
    if(url === urlSL()){
        var slData = getFromCache("SL");
        if (slData) {
            var membersSl = slData.results;
            getDoneData(membersSl);
      
        }
        else {
            callAjax(urlSL());
        }
    }
};

function callAjax(url){
    
    $.ajax({
        url: url
        , method: 'GET'
    , }).done(function (data) {

        var members;

        if (url === urlNYT()){

            members = data.results[0].members;
            putCache("NYT", data);

        }else {
            members = data.results;
            putCache("SL", data);
            
        }
//        console.log(getIdMember(members));
        getDoneData(members);
        
        
        

    }).fail(function (err) {
        throw err;
    });
};

function getDoneData(members){
    for(var i= 0; i<members.length; i++ ){
            var member = members[i];
            member.name = names(member);
            
       
    }
            
    var mustacheData = {
        members: members
    }

    var info = Mustache.render(template, mustacheData);

    $('#senate-data').html(info);

    filterColumns(filterValue());
    prepareFilters(members);

        
};

function compareIdMembers(identificador, members, url){
    
    var finalMixMembers = [];
        if (url === urlNYT()){
            for (var i = 0; i < members.length; i++){
                if (members.indexOf(identificador) > -1){
                finalMixMembers.push(members[i].birthday);
                }
            }
        }
    
}

function getIdMember(members){
    
    var members;
    var identificador = [];
    
    for (var i = 0; i < members.length; i++ ){
        var member = members[i];
        identificador.push(member.bioguide_id);
    }
    return identificador;
};

function prepareFilters(members) {
    dropdownStates(orderStates(members));
     
    $(".Filter").on("change", filter);
   

};

function filter() {
    var checkedFilters = filterValue();
    
    filterMembers(checkedFilters);
    console.log(checkedFilters);
};

function urlNYT (){
    var path = window.location.pathname;
    var htmlName = path.split("/").pop();
    var chamber = "";
    
    if (htmlName == "house-starter-page.html" || htmlName == "house-attendance-starter-page.html" || htmlName == "house-party-loyalty-starter-page.html") {
        chamber = "house";
        
    } else if (htmlName == "senate-starter-page.html" || htmlName == "senate-attendance-starter-page.html" || htmlName == "senate-party-loyalty-starter-page.html") {
        chamber = "senate";
    };

    var url = "https://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/" + chamber + "/members/current.json"
    url += '?' + $.param({
        'api-key': "8cd554dc2769412f9a4705f50a8a77ed"
    });
    return url;
    
};

function urlSL(){
    var url = "https://congress.api.sunlightfoundation.com/legislators?all_legislators=true&per_page=all&apikey=c42b9312d9894e318f88942e294e4880";
    
    return url;
};

function orderStates(members){
    
    var filterValues;
    var htmlStates = "";
    var statesArray = [];


    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        if (statesArray.indexOf(member.state) == -1) {
            statesArray.push(member.state);
        }
    };
   
    statesArray.sort();
    return statesArray;
    
};
   
function dropdownStates (statesArray){
    // Muestro el array ordenado y el All dentro del html  
var htmlStates = "";
    htmlStates += "<option>" + "All" + "</option>";

    for (var i = 0; i < statesArray.length; i++) {
    htmlStates += '<option class= "filterStates" >' + statesArray[i] + "</option>";
    };

    var bodyStates = document.getElementById("allStates");
    bodyStates.innerHTML = htmlStates;
};
   
function filterMembers(filterValues) {
    
    $(".memberFilter").each(function () {
        
        var member = $(this);
        var checK = member.find(".party").text();
        var state = member.find(".state").text();

            
        if (filterValues.checkBoxes.indexOf(checK) < 0) {
            member.hide();

        } else if (filterValues.state == state || filterValues.state == "All") {
            member.show();

        } else {
             member.hide();
        }
    })
};

function filterColumns(checkedFilters){
    
        if (checkedFilters.checkBoxes.indexOf("NYT") > -1){
            // Debemos mostrar las columnas
            $('.seniority').show();
            $('.votes').show();
            
        }
    
        else if (checkedFilters.checkBoxes.indexOf("NYT") < 0) {
            //Ocultar columnas
            $('.seniority').hide();
            $('.votes').hide();
        }
    
        if (checkedFilters.checkBoxes.indexOf("SL") > -1){
            $('.birthday').show();
        }
        else if (checkedFilters.checkBoxes.indexOf("SL") < 0){
            $('.birthday').hide();
        }
        
    
};

function getData(checkedFilters){
    
    
    if (checkedFilters.checkBoxes.indexOf("NYT") > -1){
            
            getCacheData(urlNYT());
    }else if (checkedFilters.checkBoxes.indexOf("SL") > -1){
        
            getCacheData(urlSL());
    }
    if (checkedFilters.checkBoxes.indexOf("NYT") == -1 && checkedFilters.checkBoxes.indexOf("SL") == -1){
        $('#tablaFiltros').hide();
    }else {
        $('#tablaFiltros').show();
    }
};

function filterValue(){
    
    var checK = document.getElementsByName("checK");

    filterValues = {};

    filterValues.checkBoxes = [];
    for (i = 0; i < checK.length; i++) {
        if (checK[i].checked == true) {
            filterValues.checkBoxes.push(checK[i].id)
        }
    }

    var allStates = document.getElementById("allStates");
    filterValues.state = allStates.value;
    
    return filterValues;
};
 
function names(member) {

    var name;

    if (member.middle_name !== null) {
        name = member.last_name + ", " + member.first_name + " " + member.middle_name;
    } else {
        name = member.last_name + ", " + member.first_name;
    }

    return name;
}

    








