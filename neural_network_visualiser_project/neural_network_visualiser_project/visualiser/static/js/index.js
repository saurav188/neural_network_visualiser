const drawing_pad=document.getElementById("input_canvas");
var drawing_pad_content="";
var no_cols=28*2;
var no_rows=28*2;
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
    console.log(rows[0].children)
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
  
    console.log(content);
    return content
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
    var output_received= get_output(compressed_drawing)
    console.log(output_received)
})