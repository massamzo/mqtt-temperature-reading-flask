document.addEventListener("DOMContentLoaded", events);
window.addEventListener('resize', resizeMisure); // to check 

var checked = 0;
var checkedBoxes = 0;

// [0:andamento, 1:live, 2:intervallo]
var tab = -1;

var dataServer = {
    "classes": [],
    "date": "null",
    "choice":"null",
    "live":"null"
}

var realData = {
    "classes":[],
    "live":"yes"
}

margin = {
    top: 10,
    right:40,
    bottom: 65,
    left: 70
};

var width,height;

function resizeMisure(){
 

    // replace graph

    var graph = document.getElementById("graph-td");
    var hum = document.getElementById("hum-td")
    graph.innerHTML = " ";
    hum.innerHTML = " ";



    
    

}

function createHumChart(values){


    
    var div_w = $("#hum-td").innerWidth();
    var div_h = $("#hum-td").innerHeight();

    

    width = div_w - margin.left - margin.right;
    height = div_h - margin.top - margin.bottom;

    
    
    
    var svg = d3.select("#hum-td")
      .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    

    var sumstat = d3.nest()
      .key(function(d) { return d.name; })
      .entries(values);

    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(d3.extent(values, function(d) {return d.x}));

    var h = window.innerWidth;
     if(h < 700){
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class","axisRed")
        .call(d3.axisBottom(xScale).ticks(5));
     }else{
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class","axisRed")
        .call(d3.axisBottom(xScale));
     }
     

    yScale.domain([0, d3.max(values, function(d) {return d.y2;})]);

    svg.append("g")
     .attr("class","axisRed")
     .call(d3.axisLeft(yScale));

     svg.append('text')
        .attr('x', width/2 + 20)
        .attr('y', height + 55)
        .attr('text-anchor', 'middle')
        .style("fill","white")
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Tempo');


        svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-40,' + height/2 + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style("fill","white")
        .style('font-size', 20)
        .text('umidita %');



    var res = sumstat.map(function(d){ return d.key; });

    var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8']);

    var range = ['#e41a1c','#377eb8',"transparent"];
    var sel = 0;
    var sel2 = 0;
    
    

     

     

     /*var line = d3.line()
    .x(function(d) { return xScale(d.x); }) 
    .y( function(d) { return yScale(d.y); })
    */
    

   

    svg.selectAll(".line2")
        .data(sumstat)
        .enter()
        .append("path")
          .attr("fill","none")
          .attr("class","line2")
         .attr("stroke", function(d) { return color(d.key) })
         .attr("stroke-width", "2")
         .attr("d",function(d){
            return d3.line()
              .x(function(d) { return xScale(d.x); })
              .y(function(d) { return yScale(d.y2); })
              (d.values)
         });


         // legenda

         var legendSpace = width/sumstat.length;

    sumstat.forEach(function(d,i){

        svg.append("circle")
         .attr("r", 7)
         .attr("cx", (legendSpace/12)+i*80)  // space legend
         .attr("cy", height + (margin.bottom/2)+ 9)
         .attr("class", "legend-circle")    // style the legend
         .style("fill", function() { // Add the colours dynamically
             return d.color = color(d.key); })
         .text(d.key); 

        svg.append("text")
         .attr("x", ((legendSpace/12)+14+i*80))  // space legend
         .attr("y", height + (margin.bottom/2)+ 14)
         .attr("class", "legend")    // style the legend
         .style("fill", function() { // Add the colours dynamically
             return d.color = color(d.key); })
         .text(d.key); 


         

    });

    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");


    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line2")
        .style("stroke", "white")
        .style("stroke-width", "0.1vw")
        .style("opacity", "0");


    var lines = document.getElementsByClassName('line2');

    var mousePerLine = mouseG.selectAll('.mouse-per-line2')
        .data(values)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line2");

    mousePerLine.append("circle")
        .attr("r", 4)
        .style("stroke", function(d){
            sel++;
            return range[sel-1];
        })
        .style("fill", function(d){
            sel2++;
            return range[sel2-1];
        })
        .style("stroke-width", "0.1vw")
        .style("opacity", "0");
  
    mousePerLine.append("text")
        .attr("transform", "translate(10,3)")
        .style("fill","white");

    mousePerLine.append("text")
        .attr("transform", "translate(10,22)")
        .attr("id", "date_viewer")
        .style("fill","white");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
          d3.select(".mouse-line2")
            .style("opacity", "0");
          d3.selectAll(".mouse-per-line2 circle")
            .style("opacity", "0");
          d3.selectAll(".mouse-per-line2 text")
            .style("opacity", "0");
            d3.selectAll(".line2").style("stroke-width","2");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
          d3.select(".mouse-line2")
            .style("opacity", "0.5");
          d3.selectAll(".mouse-per-line2 circle")
            .style("opacity", "1");
          d3.selectAll(".mouse-per-line2 text")
            .style("opacity", "1");

          d3.selectAll(".line2").style("stroke-width","1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line2")
              .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
              });
    
            d3.selectAll(".mouse-per-line2")
              .attr("transform", function(d, i) {
                
                var xDate = xScale.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.x; }).right;
                    idx = bisect(d.x, xDate);
                
                var beginning = 0;
                var end;
                try{
                    end = lines[i].getTotalLength();
                }catch(e){
                        "";
                }
                        
                    
                var target = null;
                
                try{
                while (true){
                  target = Math.floor((beginning + end) / 2);
                  var pos;
                  
                  pos = lines[i].getPointAtLength(target);
                  
                  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                      break;
                  }
                  if (pos.x > mouse[0])      end = target;
                  else if (pos.x < mouse[0]) beginning = target;
                  else break; //position found
                }}catch{}
                
                try{
                d3.select(this).select('text')
                  .text(yScale.invert(pos.y).toFixed(0));
                d3.select(this).select("circle").style("opacity","1");

                d3.select(this).select("#date_viewer")
                   .text(function(){
                    var date = xScale.invert(pos.x);
                    var custom_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                    return custom_date;
                   });
                  
                return "translate(" + mouse[0] + "," + pos.y +")";
                }catch{}
              });
        });


   
}

function createChart(values){


    
    var div_w = $("#graph-td").innerWidth();
    var div_h = $("#graph-td").innerHeight();

    //console.log(values);

    width = div_w - margin.left - margin.right;
    height = div_h - margin.top - margin.bottom;

    
    
    var svg = d3.select("#graph-td")
      .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    /*vg.attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);*/

   
    /*var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");;*/

    var sumstat = d3.nest()
      .key(function(d) { return d.name; })
      .entries(values);

    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(d3.extent(values, function(d) {return d.x}));


     var h = window.innerWidth;
     if(h < 700){
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class","axisRed")
        .call(d3.axisBottom(xScale).ticks(5));
     }else{
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class","axisRed")
        .call(d3.axisBottom(xScale));
     }
     

    yScale.domain([0, d3.max(values, function(d) {return d.y;})]);

    svg.append("g")
     .attr("class","axisRed")
     .call(d3.axisLeft(yScale));

     svg.append('text')
        .attr('x', width/2 + 20)
        .attr('y', height + 65)
        .attr('text-anchor', 'middle')
        .style("fill","white")
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .style('margin-top',50)
        .text('Tempo');


        svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-40,' + height/2 + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style("fill","white")
        .style('font-size', 20)
        .text('Temperatura °C');



    var res = sumstat.map(function(d){ return d.key; });

    var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8']);

    var range = ['#e41a1c','#377eb8',"transparent"];
    var sel = 0;
    var sel2 = 0;
    
    

     

     

     /*var line = d3.line()
    .x(function(d) { return xScale(d.x); }) 
    .y( function(d) { return yScale(d.y); })
    */
    

   

    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
          .attr("fill","none")
          .attr("class","line")
         .attr("stroke", function(d) { return color(d.key) })
         .attr("stroke-width", "2")
         .attr("d",function(d){
            return d3.line()
              .x(function(d) { return xScale(d.x); })
              .y(function(d) { return yScale(d.y); })
              (d.values)
         });

    var legendSpace = width/sumstat.length;

    sumstat.forEach(function(d,i){

        svg.append("circle")
         .attr("r", 7)
         .attr("cx", (legendSpace/12)+i*80)  // space legend
         .attr("cy", height + (margin.bottom/2)+ 9)
         .attr("class", "legend-circle")    // style the legend
         .style("fill", function() { // Add the colours dynamically
             return d.color = color(d.key); })
         .text(d.key); 

        svg.append("text")
         .attr("x", (legendSpace/12)+14+i*80)  // space legend
         .attr("y", height + (margin.bottom/2)+ 14)
         .attr("class", "legend")    // style the legend
         .style("fill", function() { // Add the colours dynamically
             return d.color = color(d.key); })
         .text(d.key); 


         

    });
    

    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");


    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "white")
        .style("stroke-width", "0.1vw")
        .style("opacity", "0");


    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(values)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 4)
        .style("stroke", function(d){
            sel++;
            return range[sel-1];
        })
        .style("fill", function(d){
            sel2++;
            return range[sel2-1];
        })
        .style("stroke-width", "0.1vw")
        .style("opacity", "0");
  
    mousePerLine.append("text")
        .attr("transform", "translate(10,3)")
        .style("fill","white");

    mousePerLine.append("text")
    .attr("transform", "translate(10,22)")
    .attr("id", "date_viewer")
    .style("fill","white");

    

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
          d3.select(".mouse-line")
            .style("opacity", "0");
          d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
          d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
            d3.selectAll(".line").style("stroke-width","2");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
          d3.select(".mouse-line")
            .style("opacity", "1");
          d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
          d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");

          d3.selectAll(".line").style("stroke-width","1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
              .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
              });
    
            d3.selectAll(".mouse-per-line")
              .attr("transform", function(d, i) {
                
                var xDate = xScale.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.x; }).right;
                    idx = bisect(d.x, xDate);
                
                var beginning = 0;
                var end;
                try{
                    end = lines[i].getTotalLength();
                }catch(e){
                        "";
                }
                        
                    
                var target = null;
                
                try{
                while (true){
                  target = Math.floor((beginning + end) / 2);
                  var pos;
                 
                  pos = lines[i].getPointAtLength(target);
                  
                  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                      break;
                  }
                  if (pos.x > mouse[0])  end = target;
                  else if (pos.x < mouse[0]) beginning = target;
                  else break; //position found
                }}catch{}
                

             //non mostra cosi l'errore nella console nonostante funzioni
                

                try{
                d3.select(this).select('text')
                  .text(yScale.invert(pos.y).toFixed(0)+"°C");
                d3.select(this).select("circle").style("opacity","1");

                d3.select(this).select("#date_viewer")
                   .text(function(){
                    var date = xScale.invert(pos.x);
                    var custom_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                    return custom_date;
                   });
                  
                return "translate(" + mouse[0] + "," + pos.y +")";}catch{}
               
              });
        });


   
}



function searchClass(){

    var val = document.getElementById("search").value;
    var aule = document.getElementsByClassName('li');

    for(i=0; i< aule.length; i++){

        var txt = aule[i].getElementsByTagName("span")[0].textContent;

        // check if the value of searchbox is in txt

        if(!(txt.toUpperCase().indexOf(val.toUpperCase())  >= 0)){
            aule[i].style.display = "none";
        }else{
            aule[i].style.display = "block";
        }


    }
}

function checkBoxEvents(){

    var checkBox = document.getElementsByClassName("checkbox"); 
    
    for(i=0; i < checkBox.length; i++){
        
            checkBox[i].addEventListener("click", function(e){
                
                request_data(e);
            });

        
    }

}

function uncheckBoxes(startingPoint){
    var checkBox = document.getElementsByClassName("checkbox");
    for(i=startingPoint; i < checkBox.length; i++){
        if(checkBox[i].checked) checkBox[i].click();
    }
}

function selectedClasses(){
    var arr = [];
    var checkBox = document.getElementsByClassName("checkbox");

    for(i=0; i < checkBox.length; i++){
        if(checkBox[i].checked) arr.push(checkBox[i].parentNode.getElementsByTagName("span")[0].textContent);
    }

    return arr;
}
function istitutoVisibility(visibility){
    var ist = document.getElementsByClassName("li")[0];
    ist.style.display = visibility;
}
function request_data(e){
    if(tab == 0){
    
    graphTable();
    var span = e.target.parentNode.getElementsByTagName("span")[0];
    if(e.target.checked){
        
        checkedBoxes++;
        dataServer['classes'].push(span.textContent);
        // check if there are 2 or just 1
        if(checkedBoxes > 2){
            uncheckBoxes(0);
            
            e.target.click();
        }

        

        


        $.ajax({
            type:"POST",
            url: "/process_data",
            data: JSON.stringify(dataServer),
            contentType : "application/json",
            dataType: 'json',
            success:  function(result){
            makeGraph(result);
            }
        });
        
    }else{
        checkedBoxes--;
        var ind = dataServer['classes'].indexOf(span.textContent);
        dataServer['classes'].splice(ind, 1);

        if(dataServer['classes'].length != 0){
            // there is still 

            $.ajax({
                type:"POST",
                url: "/process_data",
                data: JSON.stringify(dataServer),
                contentType : "application/json",
                dataType: 'json',
                success:  function(result){
                makeGraph(result);
                }
            });

        }

        
    }

    //console.log(checkedBoxes);
    //console.log("data server: ");
    //console.log(dataServer);
}else{

    //append a div with send button

    if(e.target.checked){
        if(e.target.parentNode.getElementsByTagName("span")[0].textContent == "istituto"){
            //deselect all nodes

            uncheckBoxes(1);
        }else{
            // check if istituto is already selected
            var ist = document.getElementsByClassName("checkbox")[0];
            if(ist.checked){
                ist.click();
            }
        }
        realData.classes.push(e.target.parentNode.getElementsByTagName("span")[0].textContent);
    }else{
        var ind = realData['classes'].indexOf(e.target.parentNode.getElementsByTagName("span")[0].textContent);
        realData['classes'].splice(ind, 1);
    }

}
    
}



function askLiveData(){

    console.log(realData);
    $.ajax({
        type:"POST",
        url: "/process_data",
        data: JSON.stringify(realData),
        contentType : "application/json",
        dataType: 'json',
        success:  function(result){
        appendLiveData(result);
        }
    });
}

function appendLiveData(res){

    var viewBox = document.getElementById("temp_data");
    var data = res['data'];
    console.log(data);

    var mainBox= document.createElement("div");
    mainBox.setAttribute("id","temp_data");
    mainBox.setAttribute("class", "data_viewers");

    for(i=0; i < data.length; i++){
        var temp_class_info = document.createElement("div");
        temp_class_info.setAttribute("id", "temp_class_info");

        var aula = document.createElement("div");
        aula.setAttribute("id", "aula");

        var p = document.createElement("p");
        p.append(document.createTextNode(data[i].aula));

        aula.append(p);
        temp_class_info.append(aula);

        var giorno = document.createElement("date");
        giorno.setAttribute("id", "date");

        p = document.createElement("p");
        let date = new Date();
        
        p.append(document.createTextNode(date.toLocaleDateString()+"  "+date.getHours()+":"+date.getMinutes()));

        giorno.append(p);
        temp_class_info.append(giorno);

        var temp = document.createElement("div");
        temp.setAttribute("id","temp");

        var table = document.createElement("table");
        var tr = document.createElement("tr");

        var td = document.createElement("td");

        p = document.createElement("p");
        p.append(document.createTextNode(data[i].temp));

        td.append(p);
        tr.append(td);

        td = document.createElement("td");
        td.setAttribute("id", "img_td");

        var img = document.createElement("img");
        img.setAttribute("src", "/static/images/temp_normale.png");

        td.append(img);
        tr.append(td);

        td = document.createElement("td");
        p = document.createElement("p");

        p.append(document.createTextNode(data[i].hum));
        td.append(p);

        tr.append(td);

        td = document.createElement("td");
        td.setAttribute("id", "img_td");

        img = document.createElement("img");
        img.setAttribute("src", "/static/images/hum.png");

        td.append(img);
        tr.append(td);

        table.append(tr);

        temp.append(table);
        temp_class_info.append(temp);

        mainBox.append(temp_class_info);

    }

    viewBox.parentNode.replaceChild(mainBox, viewBox);


}

function reArangeData(data){

    
    data.forEach(element => {
        element['x'] = new Date(element['x']);
    });
}

function makeGraph(res){
    resizeMisure();
    // console.log(res);
    reArangeData(res['data']);
    createChart(res['data']);
    createHumChart(res['data']);
}

function tabsEvents(){
    var tabs = document.getElementsByClassName('tab');
    
    tabs[0].addEventListener("click", function(e){ historicData(e);});
    tabs[1].addEventListener("click", function(e){ liveData(e);});
}


function resetTabs(){
    var tabs = document.getElementsByClassName('tab');
    for(i=0;i<tabs.length; i++){
        tabs[i].style.backgroundColor = "rgb(51, 42, 50)";
        tabs[i].style.borderLeft = "0.01vw solid rgb(141, 141, 141)";
        tabs[i].style.borderBottom = "0.2vw solid #0d151cff";
    }
}

function clickingTabStyle(e){
    e.target.style.backgroundColor = "rgb(10, 8, 25)";
    e.target.style.border = "none";
}

function resetCheckBoxes(){


    var checkBox = document.getElementsByClassName("checkbox");
    for(i=0; i < checkBox.length; i++){
        if(checkBox[i].checked) checkBox[i].click();
    }

    
}

function reBuildViewBox(message){

    // clear the arrays that request data
    dataServer.classes = [];
    realData.classes = [];
    var viewBox = document.getElementById("temp_data");
    var mainBox = document.createElement("div");
    mainBox.setAttribute("id","temp_data");
    mainBox.setAttribute("class","data_viewers");
    var note = document.createElement("h2");
    note.setAttribute("id","note");
    note.append(document.createTextNode(message));
    mainBox.append(note);

    viewBox.parentNode.replaceChild(mainBox, viewBox);



}

function graphTable(){
    document.getElementById("temp_data").innerHTML= '<table id="graph-table"><tr id="temp-tr"><td id="graph-td"></td></tr><tr id="hum-tr"><td id="hum-td"></td></tr></table>';
}

function historicData(e){
    tab = 0;
    istitutoVisibility("none");
    resetTabs();
    clickingTabStyle(e);
    
    resetCheckBoxes();
    checkedBoxes=0;
    dataServer['classes'] = [];
    try{
        document.getElementById("askLiveData").remove();
    }catch{
        ""
    }

    reBuildViewBox("Scegli le classi per vedere l'andamento della temperatura \ne l'umidita ");



}

function liveData(e){
    tab = 1;
    istitutoVisibility("block");
    resetTabs();
    clickingTabStyle(e);
    checkedBoxes=0;
    resetCheckBoxes();
    createRichiediButton();
    reBuildViewBox("Scegli la classe per ottenere la temperatura e l'umidita al momento");
}


function createRichiediButton(){
    var div = document.createElement("div");
    div.setAttribute("id","askLiveData");

    var but = document.createElement("button");
    but.setAttribute("id","askData");
    but.setAttribute("onclick","askLiveData()");

    but.append(document.createTextNode("Richiedi Dati"));

    div.append(but);

    var classes = document.getElementById("classes");
    classes.append(div);
}

function showLiveData(){
    
}


function scrollDown(event){
    if(event.key == "ArrowDown"){
        var hum = document.getElementById("hum-td");
        hum.scrollIntoView({behavior: "smooth"});
    }else if(event.key == "ArrowUp"){
        var temp = document.getElementById("graph-td");
        temp.scrollIntoView({behavior: "smooth"});
    }
}

function graphPeriod(){

    var date = document.getElementById("period-date").value;
    alert(date);
}

document.addEventListener("keyup", function(event){ scrollDown(event); })

function events(){

    
    document.getElementById("search").addEventListener("keyup", searchClass);
    checkBoxEvents();
    tabsEvents();
    document.getElementsByClassName("tab")[0].click();


    //graph period

    document.getElementById("close").addEventListener("click", graphPeriod);


}
























/*document.addEventListener("DOMContentLoaded", events);

function events(){

    // richieste ajax per iniziare sostituire le temperature
    updateTemps()
    
    


}


function dataBuilder(){
    var nodes = document.getElementsByClassName('temp');
    var nodesVal = new Array();
    for(i=0; i < nodes.length; i++){
        nodesVal.push(nodes[i].id)
    }

    var data = [
        {"nodes": nodesVal}
    ];
    return data
}

function updateTemps(){

    nodes = dataBuilder();

   
    $.ajax({
        type:"POST",
        url: "/process_data",
        data: JSON.stringify(nodes),
        contentType : "application/json",
        dataType: 'json',
        success:  function(result){
           var nodes = document.getElementsByClassName('temp');
           var valori = result['valori'];

           for(i=0; i < nodes.length; i++){
            nodes[i].childNodes[3].innerHTML = valori[i];
           }
        }
    });
    
}*/