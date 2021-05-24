const drawing_pad=document.getElementById("input_canvas");
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

//activate 8 neighbours
function show_neighbours(cell){
    var x_index=Array.from(cell.parent).indexOf(cell);
    var y_index=Array.from(cell.parent.parent).indexOf(cell.parent);
    //top
    if(y_index>0){
        drawing_pad.children[y_index-1][x_index].classList.add("active");
    };
    //top right
    if(y_index>0 && x_index<no_cols){
        drawing_pad.children[y_index-1][x_index+1].classList.add("active");
    };
    //right
    if(x_index<no_cols){
        drawing_pad.children[y_index][x_index+1].classList.add("active");
    };
    //right bottom
    if(y_index<no_rows && x_index<no_cols){
        drawing_pad.children[y_index+1][x_index+1].classList.add("active");
    };
    //bottom
    if(y_index<no_rows){
        drawing_pad.children[y_index+1][x_index].classList.add("active");
    };
    //bottom left
    if(y_index<no_rows && x_index>0){
        drawing_pad.children[y_index+1][x_index-1].classList.add("active");
    };
    //left
    if(x_index>0){
        drawing_pad.children[y_index][x_index-1].classList.add("active");
    };
    //left top
    if(y_index>0 && x_index>0){
        drawing_pad.children[y_index+1][x_index-1].classList.add("active");
    };
    return;
};

//handling mouse click events to draw in the drawing pad
var rows=document.getElementsByClassName("rows");
var cells=Array.from(document.getElementsByClassName("cell"));
var can_draw=false;
cells.forEach((cell) => {
    cell.addEventListener("mouseover",()=>{
        if(can_draw){
            cell.classList.add("active");
            show_neighbours(cell);
        };
    });
});

drawing_pad.addEventListener("mousedown",()=>{
    can_draw=true;
});
document.addEventListener("mouseup",()=>{
    can_draw=false;
});