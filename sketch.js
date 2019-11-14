// TODO -------------------
// ADDING NAVBAR WITH PROPERTIES -- 70%
// MAKE PROPERTIES WORK -- 50%
// MAKE NAVBAR AND SETTINGS PRETTY


//  DECLARE -------------------------------------------------------------------------------------------------------------------------------------
let joints = []
let SpaceNotAllowed = 50;

// MAIN -------------------------------------------------------------------------------------------------------------------------------------

// SETUP -------------------------------------------------------------------------------------------------------------------------------------
function setup(){
    createCanvas(window.innerWidth, window.innerHeight); // BG
    background(106,116,149); // BG COLOR
    for (let i = 0; i < 1000; i++) { // CREATE 1000 POSSIBLE LINE, MIGHT CHANGE THIS
        joints.push(new Joints());
              }

index = 0; // Z VALUE
locked = false;dragged = false; // VAR MOUSEACTIONS
isDrawing = false; // VAR ACTIONS
isEdit = {state: false, pnumber: 0, selectindex: 0, taked: false, p1pos:0, p2pos:0, pcenter:0};
Select = {state:false,p:0}; // --
DefaultColor = {r:255,g:255,b:0};
DefaultAlpha = 1;
DefaultE = 2; // DEFAULT VALUE

mspos = {x:0,y:0}; // CURSOS POSITION

// SET COLOR PICKER AND HISTORY COLOR
swatchescolor = [{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""}];
swatchesindex = {z:0, previous:0, checking: false};
$('#defaultcolor').minicolors({animationSpeed: 1,inline:true, opacity: true, theme:'draw',format: 'hex',swatches: swatchescolor}); // CREATE COLOR SCHEME FOR DEFAULT
$('#defaultcolor').minicolors('value','324650');

}


// DRAW -------------------------------------------------------------------------------------------------------------------------------------

function draw() {
    background(106,116,149); // RESET BG EVERYTIME
    for (let i = 0; i < index; i++){
        if (i === isEdit.selectindex){
            joints[i].set_pointsalpha(1);
            }
        if ((joints[i].get_pointsalpha() === 1) && (i != isEdit.selectindex)){
             joints[i].set_pointsalpha(0.75);
            }
             joints[i].display();
    } // DISPLAY ALL JOINTS CREATED
       
    // PROPERTIES SETTINGS  



    if (($('#defaultcolorval').is(":hover")) || ($('#defaultcolorval').is(":focus"))) { 
        $('#defaultcolor').minicolors('value',document.getElementById("defaultcolorval").value);
        
       
    }
    else {
        rgbval = $('#defaultcolor').minicolors('rgbObject');
        DefaultColor = rgbval;
        document.getElementById('directDcolor').style.backgroundColor = rgbToHex(rgbval.r,rgbval.g,rgbval.b);
        $('#defaultcolor').minicolors({
            change: document.getElementById("defaultcolorval").value = rgbToHex(rgbval.r,rgbval.g,rgbval.b).toUpperCase()
          });
    }

    if (($('#defaultalphaval').is(":hover")) || ($('#defaultalphaval').is(":focus"))) { 
        $('#defaultcolor').minicolors('opacity',document.getElementById("defaultalphaval").value);
        
    }
    else {
        DefaultAlpha = $('#defaultcolor').minicolors('opacity');
        document.getElementById('directDcolor').style.opacity = $('#defaultcolor').minicolors('opacity');
        $('#defaultcolor').minicolors({        
            change: document.getElementById("defaultalphaval").value = $('#defaultcolor').minicolors('opacity')
          });
    }

    DefaultE = document.getElementById('defaulteval').value;



    Cursoring(); // CURSOR FUNCTION
        Drawing(); // DRAWING FUNCTION 
            Editing(); // EDITING FUNCTION

   // console.log(); // FOR NOOB TESTING
    
        

}
     

// MOUSE FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function mousePressed() {

    if (document.getElementById("show-draw-settings").checked) {
        SpaceNotAllowed = 250;
    }
    else {
        SpaceNotAllowed = 50;
    }

    if (mouseX > SpaceNotAllowed) { // CANNOT DRAW IF MOUSE ON PARAMETERS
        locked = true;
    }
    else {
        locked = false;
    }
        mspos = {x:mouseX,y:mouseY}   
  } 

function mouseDragged(){
        if (locked){         
          
            mspos = {x:mouseX,y:mouseY};
            dragged = true;
            
        }
}
function mouseReleased() {     
    
        mspos = {x:mouseX,y:mouseY};
        locked = false;
        dragged = false;
  }

// FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function Drawing(){
    if (Select.state === false){
        if (mouseIsPressed){
            
            if (locked === true && dragged === false && isDrawing === false){

                    joints[index].set_color(DefaultColor.r,DefaultColor.g,DefaultColor.b); // DEFAULT SETTER
                    joints[index].set_alpha(DefaultAlpha);
                    joints[index].set_e(DefaultE);

                    joints[index].set_p1(mspos.x,mspos.y);
                    joints[index].set_p2(mspos.x,mspos.y);
                    joints[index].set_index(index)
                    isDrawing = true;
            }
            if (locked === true && dragged === true && isDrawing === true){
                    joints[index].set_p2(mspos.x,mspos.y);
                    joints[index].display(); // DISPLAY THE DRAWING ONE
                    
            }    
        }

        if (locked === false && dragged === false && isDrawing === true){
                    isEdit.selectindex = index;
                    isDrawing = false;
                    index += 1;

                    // HISTORY COLORS SET
        
                    if (swatchesindex.z === 0){
                        swatchesindex.previous = 6;
                    }
                    else {
                        swatchesindex.previous = swatchesindex.z-1;
                    }
                
                    if (swatchesindex.z > 6){
                        swatchesindex.z = 0;
                    }

                    for (i = 0; i < swatchescolor.length; i++) {
                        if (!(i === swatchesindex.z)){
                            if ((rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b) === swatchescolor[i].color)) {
                                swatchescolor.checking = false;
                                break;
                             }
                             else {
                                swatchescolor.checking = true;
                             }
                        }
                        
                    }

                    if (swatchescolor.checking === true) {
                        swatchescolor[swatchesindex.z] = {name: rgbToHex(rgbval.r,rgbval.g,rgbval.b).toUpperCase(), color: rgbToHex(rgbval.r,rgbval.g,rgbval.b)};
                        $('#defaultcolor').minicolors('settings',{swatches: swatchescolor});
                            swatchesindex.z++;
                    }
                            
                                             
                        
                       
                    
                    

                     
        } 
    }

}

function Cursoring() {
    // DETECT IF CURSOR ON A POINT
    if (isDrawing === false){
        for (let i = 0; i < index; i++){
            if (((mouseX > (joints[i].get_p1().x)-5) && (mouseX < (joints[i].get_p1().x)+5)) &&  (mouseY > (joints[i].get_p1().y)-5) && (mouseY < (joints[i].get_p1().y)+5)){
                Select.state = true;Select.p = 1;// P1 
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 1;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_p2().x)-5) && (mouseX < (joints[i].get_p2().x)+5)) &&  ((mouseY > (joints[i].get_p2().y)-5) && (mouseY < (joints[i].get_p2().y)+5))) {
                Select.state = true;Select.p = 2 // P2
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 2;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_pc().x)-5) && (mouseX < (joints[i].get_pc().x)+5)) &&  ((mouseY > (joints[i].get_pc().y)-5) && (mouseY < (joints[i].get_pc().y)+5))) {
                Select.state = true;Select.p = 12 // PCENTER
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 12;
                }
                break;
            }
            else {
                Select.state = false;
            }
        }
        // CHANGE CURSOR IF ON A POINT
        if ((Select.state === true) && (Select.p === 1 || Select.p === 2)){
            cursor(HAND);
        }
        else if ((Select.state === true) && (Select.p === 12)){
            cursor(MOVE);
        }
        else {
            cursor(ARROW);
        }  
    }
    
}

function Editing(){
    if (isEdit.state === true) {
        if (isEdit.pnumber === 1){ // MOVE P1
            joints[isEdit.selectindex].set_alpha(0.5);
            joints[isEdit.selectindex].set_p1(mspos.x,mspos.y);
            joints[isEdit.selectindex].display();
        }
        else if (isEdit.pnumber === 2){ // MOVE P2
            joints[isEdit.selectindex].set_alpha(0.5);
            joints[isEdit.selectindex].set_p2(mspos.x,mspos.y);
            joints[isEdit.selectindex].display();
        }
        else if (isEdit.pnumber === 12){ // MOVE P1 AND P2

            if (isEdit.taked === false){ // SAVE THE ORIGINAL POSITION
            isEdit.p1pos = joints[isEdit.selectindex].get_p1();
            isEdit.p2pos = joints[isEdit.selectindex].get_p2();
            isEdit.pcenter = joints[isEdit.selectindex].get_pc();
            isEdit.taked = true;
            }   // CALC THE GAP BETWEEN THE MOUSEPOS AND THE ORIGINAL POSITION
            joints[isEdit.selectindex].set_alpha(0.5);
            joints[isEdit.selectindex].set_p1(isEdit.p1pos.x-(isEdit.pcenter.x-+mspos.x),isEdit.p1pos.y-(isEdit.pcenter.y-mspos.y));
            joints[isEdit.selectindex].set_p2(isEdit.p2pos.x-(isEdit.pcenter.x-mspos.x),isEdit.p2pos.y-(isEdit.pcenter.y-mspos.y));
            joints[isEdit.selectindex].display();
        }
        if (locked === false){
            isEdit.state = false;isEdit.taked = false;
            joints[isEdit.selectindex].set_alpha(1);
        }
       
    }
}




// COLOR FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------

function rgbToHex(r, g, b) {
    return ("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
  }

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// CANVAS FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }



  function updateDefaulteInput(val) {
    document.getElementById('defaultevalin').value=val; 
  }

  function updateDefaulteSlider(val) {
    val = Number(val);
    if (!(Number.isInteger(val))){
        val = 2;
    }
      if (val > 260){
          val = 260;
      }
      else if (val < 1){
          val = 1;
      }
    document.getElementById('defaulteval').value=val; 
  }



// CLASS -------------------------------------------------------------------------------------------------------------------------------------------

  class Joints{
    constructor(){
        this.x1 = 0; this.y1 = 0;
        this.x2 = 0; this.y2 = 0;
        this.c = {r:0,g:0,b:0,a:1};
        this.e = 10;
        this.z = -1;
        this.pointsalpha = 0.75;
    }

    set_p1(x,y){
        this.x1 = x; this.y1 = y;
    }

    set_p2(x,y){
        this.x2 = x; this.y2 = y;
    }

    get_p1(){
        return {x:this.x1,y:this.y1};
    }

    get_p2(){
        return {x:this.x2,y:this.y2};
    }

    get_pc(){
        return {x:(this.x1+this.x2)/2,y:(this.y1+this.y2)/2};
    }
    
    set_index(index){
        this.z = index;
    }

    get_index(){
        return this.z;
    }

    set_pointsalpha(alpha){
        this.pointsalpha = alpha;
    }

    get_pointsalpha(){
        return this.pointsalpha;
    }

    set_color(r,g,b){
        this.c.r = r;        
        this.c.g = g;        
        this.c.b = b;        
    }

    set_alpha(alpha){
        this.c.a = alpha;
    }

    set_e(e){
        this.e = e;
    }
    display(){
        // DRAW LINE
        stroke(`rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`); 
        strokeWeight(this.e);
        line(this.x1,this.y1,this.x2,this.y2);
        // DRAW POINTS P1 P2
        stroke(`rgba(255,255,0,${this.pointsalpha})`); 
        strokeWeight(2);
        line(this.x1-5,this.y1,this.x1+5,this.y1);
        line(this.x1,this.y1-5,this.x1,this.y1+5);
        line(this.x2-5,this.y2,this.x2+5,this.y2);
        line(this.x2,this.y2-5,this.x2,this.y2+5);
        // DRAW POINTS PC
        stroke(`rgba(0,191,255,${this.pointsalpha})`); 
        strokeWeight(2);
        line(this.get_pc().x-5,this.get_pc().y,this.get_pc().x+5,this.get_pc().y);
        line(this.get_pc().x,this.get_pc().y-5,this.get_pc().x,this.get_pc().y+5);

    }


}