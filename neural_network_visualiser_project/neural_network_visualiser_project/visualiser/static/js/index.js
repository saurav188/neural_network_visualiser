const drawing_pad=document.getElementsByClassName("input_canvas")[0];
var drawing_pad_content="";
var no_cols=28*4;
var no_rows=28*4;
//adding pixels in the canvas where the drawing takes place
for(var i=0;i<(no_rows);i++){
    drawing_pad_content=drawing_pad_content+'<div class="row">';
        for(var j=0;j<(no_cols);j++){
            drawing_pad_content=drawing_pad_content+'<div class="cell"></div>';
        };
    drawing_pad_content=drawing_pad_content+'</div>';
};
drawing_pad.innerHTML=drawing_pad_content;

function get_drawing(){
    var rows=Array.from(document.getElementsByClassName("row"));
    var drawing=[];
    for(var i=0;i<no_rows;i++){
        drawing.push([]);
        var current_row=rows[i].children;
        for(var j=0;j<no_cols;j++){
            if(current_row[j].classList.contains("active")){
                drawing[i].push(1);
            }else{
                drawing[i].push(0);
            }
        };
    };
    return drawing;
};

function get_max(array){
    var max=0;
    for(var i=0;i<array.length;i++){
        if(array[i]>max){
            max=array[i];
        };
    };
    return max;
}

function compress(matrix){
    no_rows=matrix.length;
    no_cols=matrix[0].length;
    output_matrix=matrix;
    temp_matrix=[];
    while(no_rows>28 && no_cols>28){
        for(var i=0;i<no_rows;i+=2){
            temp_matrix.push([]);
            for(var j=0;j<no_cols;j+=2){
                var temp=[]
                //top left
                temp.push(output_matrix[i][j])
                //top right
                temp.push(output_matrix[i][j+1])
                // bottom right
                temp.push(output_matrix[i+1][j+1])
                //bottom left
                temp.push(output_matrix[i+1][j])
                temp_matrix[(i/2)].push(get_max(temp))
            };
        };
        output_matrix=temp_matrix;
        temp_matrix=[];
        no_rows=output_matrix.length;
        no_cols=output_matrix[0].length;
    };
    return output_matrix;
};

//geting visual content 1st and 2nd layer output
function matrix_to_divs(matrix){
    var no_rows=matrix.length;
    var no_cols=matrix[0].length;
    var drawing='<div class="output_drawing">';
    for(var i=0;i<no_rows;i++){
        drawing+='<div class="output_row">';
        for(var j=0;j<no_cols;j++){
            if(matrix[i][j]==0){
                drawing+='<div class="output_cell"></div>'
            }else{
                drawing+='<div class="output_cell output_active"></div>'
            }
        };
        drawing+='</div>';
    };
    drawing+='</div>';
    return drawing;
};

//gets the div with the visualisation of all the layer matrix
function get_layer_drawing(matrixes){
    var drawing='';
    drawing+='<div class="matrix_visualised">';
    for(var i=0;i<matrixes.length;i++){
        drawing+=matrix_to_divs(matrixes[i]);
    };
    drawing+='</div>';
    return drawing;
};

//sending data the server and getting/showing the output
async function get_output(matrix) {
    const rawResponse = await fetch('http://localhost:8000/api/get_output/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"matrix":matrix})
    });
    const content = await rawResponse.json();
    const first_layer_output=await content.body.first_layer_output;
    const second_layer_output=await content.body.second_layer_ouput;
    const actual_output=await content.body.output;
    //displaying outputs
    setTimeout(()=>{
        show_first_layer(first_layer_output);
    },2.5*1000)
    setTimeout(()=>{
        show_second_layer(second_layer_output);
    },7.5*1000)
    //creating neural network
    create_neural_network(actual_output);
    //hidding
    document.getElementsByClassName("neural_output")[0].classList.add("neural_hidden");
    //showing after given time
    setTimeout(()=>{
        document.getElementsByClassName("neural_output")[0].classList.add("neural_animator");
        setTimeout(()=>{
            show_line();
        },4.2*1000)
    },12.5*1000);
};

//displays first layer output
function show_first_layer(first_layer_output){
    const first_layer_output_drawing=get_layer_drawing(first_layer_output);
    document.getElementsByClassName("first_layer_output")[0].innerHTML=first_layer_output_drawing;
    document.getElementsByClassName("first_layer_output")[0].classList.add("first_layer_animator");  
}

//displays second layer output
function show_second_layer(second_layer_output){
    const second_layer_output_drawing=get_layer_drawing(second_layer_output);
    document.getElementsByClassName("second_layer_output")[0].innerHTML=second_layer_output_drawing;
    document.getElementsByClassName("second_layer_output")[0].classList.add("second_layer_animator");
}

//draw line
function draw_line(point1,point2,i){
    //finding angle
    var slope=(point2[1]-point1[1])/(point2[0]-point1[0]);
    var angle=Math.atan(slope)*(180/3.14159);
    //finding length of the line
    var dist=Math.sqrt(((point2[0]-point1[0])**2)+((point2[1]-point1[1])**2));
    var line_id="line"+i;
    var line='<div class="line" id="'+line_id+'"></div>';
    document.getElementsByClassName("output_container")[0].innerHTML+=line;
    var line_component=document.getElementById(line_id);
    line_component.style.transformOrigin="left bottom";
    line_component.style.transform="rotate("+angle+"deg)";
    line_component.style.width=dist+"px";
    line_component.style.top=point1[1]+"px";
    line_component.style.left=point1[0]+"px";
};

//hides all neural network lines
function hide_line(){
    var lines=Array.from(document.getElementsByClassName("line"));
    lines.forEach(each=>{
        each.classList.add("line_hide");
    });
};

//shows all neural network lines
function show_line(){
    var lines=Array.from(document.getElementsByClassName("line"));
    lines.forEach(each=>{
        each.classList.remove("line_hide");
        if(Math.random()<0.5){
            each.classList.add("line_animate");
        }
    });
    document.getElementsByClassName("output_neuron_layer")[0].children[0].classList.add("output_number")
};

//creaates the neural_network
function create_neural_network(actual_output){
    var neural_container=document.getElementsByClassName("neural_output")[0];
    var screen_height=window.innerHeight*0.9;
    var no_neuron=Math.floor((screen_height/(20+30))*0.5);
    var neural_container_content='<div class="first_neuron_layer">';
    for(var i=0;i<no_neuron;i++){
        neural_container_content=neural_container_content+'<div class="neuron"></div>';
    };
    neural_container_content=neural_container_content+'</div>';
    //var no_neuron=Math.floor(no_neuron*0.7);
    var neural_container_content=neural_container_content+'<div class="second_neuron_layer">';
    for(var i=0;i<no_neuron;i++){
        neural_container_content=neural_container_content+'<div class="neuron"></div>';
    };
    neural_container_content=neural_container_content+'</div>';
    var no_neuron=10;
    var neural_container_content=neural_container_content+'<div class="number_neuron_layer">';
    for(var i=0;i<no_neuron;i++){
        neural_container_content=neural_container_content+'<div class="neuron">'+(i)+'</div>';
    };
    neural_container_content=neural_container_content+'</div>';
    var no_neuron=1;
    var neural_container_content=neural_container_content+'<div class="output_neuron_layer">';
    for(var i=0;i<no_neuron;i++){
        neural_container_content=neural_container_content+'<div class="neuron">'+actual_output+'</div>';
    };
    neural_container_content=neural_container_content+'</div>';
    neural_container.innerHTML=neural_container.innerHTML+neural_container_content;
    //drawing lines
    var first_layer_neurons=Array.from(document.getElementsByClassName("first_neuron_layer")[0].children);
    var second_layer_neurons=Array.from(document.getElementsByClassName("second_neuron_layer")[0].children);
    var number_layer_neurons=Array.from(document.getElementsByClassName("number_neuron_layer")[0].children);
    var output_layer_neurons=Array.from(document.getElementsByClassName("output_neuron_layer")[0].children);
    var first_layer_neurons_coordinate=[],second_layer_neurons_coordinate=[],
        number_layer_neurons_coordinate=[],output_layer_neurons_coordinate=[];
    //finding coordinates
    first_layer_neurons.forEach(each=>{
        first_layer_neurons_coordinate.push([each.offsetLeft+10,each.offsetTop+10]);
    });
    second_layer_neurons.forEach(each=>{
        second_layer_neurons_coordinate.push([each.offsetLeft+10,each.offsetTop+10]);
    });
    number_layer_neurons.forEach(each=>{
        number_layer_neurons_coordinate.push([each.offsetLeft+10,each.offsetTop+10]);
    });
    output_layer_neurons.forEach(each=>{
        output_layer_neurons_coordinate.push([each.offsetLeft+10,each.offsetTop+10]);
    });
    var index=0;
    for(var i=0;i<first_layer_neurons_coordinate.length;i++){
        for(var j=0;j<second_layer_neurons_coordinate.length;j++){
            draw_line(first_layer_neurons_coordinate[i],second_layer_neurons_coordinate[j],index);
            index+=1;
        };
    };
    for(var i=0;i<second_layer_neurons_coordinate.length;i++){
        for(var j=0;j<number_layer_neurons_coordinate.length;j++){
            draw_line(second_layer_neurons_coordinate[i],number_layer_neurons_coordinate[j],index);
            index+=1;
        };
    };
    for(var i=0;i<number_layer_neurons_coordinate.length;i++){
        for(var j=0;j<output_layer_neurons_coordinate.length;j++){
            draw_line(number_layer_neurons_coordinate[i],output_layer_neurons_coordinate[j],index);
            index+=1;
        };
    };
    hide_line();
};

//handling mouse click events to draw in the drawing pad
var rows=document.getElementsByClassName("rows");
var cells=Array.from(document.getElementsByClassName("cell"));
var can_draw=false;
cells.forEach((cell) => {
    cell.addEventListener("mouseover",()=>{
        if(can_draw){
            cell.classList.add("active");
            //show_neighbours(cell);
        };
    });
    cell.addEventListener("touchstart",()=>{
        cell.classList.add("active");
    });
    cell.addEventListener("touchmove",(event)=>{
        var x = event.touches[0].clientX;
        var y = event.touches[0].clientY;
        document.elementsFromPoint(x, y)[0].classList.add("active");
    });
});
drawing_pad.addEventListener("mousedown",()=>{
    can_draw=true;
});
document.addEventListener("mouseup",()=>{
    can_draw=false;
});
var visualise_btn=document.getElementById("visualise_btn");
visualise_btn.addEventListener("click",()=>{
    var drawing=get_drawing();
    var compressed_drawing=compress(drawing);
    var drawn_matrix=matrix_to_divs(compressed_drawing);
    document.getElementsByClassName("compressed_drawing")[0].innerHTML+=drawn_matrix;
    document.getElementsByClassName("compressed_drawing")[0].classList.add("compressed");
    drawing_pad.classList.add("compressing");
    get_output(compressed_drawing)
})
