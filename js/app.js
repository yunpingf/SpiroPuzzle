(function(window){
    'use strict';
    function define_library(){
        var Puzzle = {};
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var colorSchemes = [['#C7D8C6','#EFD9C1','#A9B7C0'], ['#494E6B','#985E6D','#99878F']];
        var borderWidth = 2;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var imageArray = [];
        var indexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var indexCache = [];
        var slices = 3;
        var len = windowWidth/slices;
        var colorIndex = 1;//generateRandom(0, colorSchemes.length-1);
        var infoArray = {};

        function swap(array, i, j){
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }

        function swapImage(imageArray, a, b){
            var i = a.i * slices + a.j;
            var j = b.i * slices + b.j;
            ctx.putImageData(imageArray[j], a.j*len, a.i*len);
            ctx.putImageData(imageArray[i], b.j*len, b.i*len);
            swap(indexArray, i, j);
            swap(imageArray, i, j);
        }

        function generateRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        Puzzle.init = function() {
            document.querySelector("body").style.backgroundColor=colorSchemes[colorIndex][0];
            ctx.canvas.width = windowWidth;
            ctx.canvas.height = windowWidth;
            var mask = document.getElementById("mask");
            var chosen = document.getElementById("chosen");

            var masks = document.getElementsByClassName("mask");
            for (var i = 0; i < masks.length; ++i){
                var m = masks[i];
                m.style.height = (len - borderWidth)+"px";
                m.style.width = (len - borderWidth)+"px";
            }
            
            function addMask(e){
                if(e.preventDefault) e.preventDefault();
                var x = e.clientX;
                var y = e.clientY;
                var i = Math.floor(x / len);
                var j = Math.floor(y / len);
                
                mask.style.top = (j * len + borderWidth)+"px";
                mask.style.left = (i * len + borderWidth)+"px";
            }
            function hideMask(e) {
                if (e.relatedTarget != canvas || e.toElement != canvas){
                    mask.style.display="none";
                }
            }
            function showMask(e) {
                if (e.relatedTarget != mask || e.fromElement != mask){
                    mask.style.display="block";
                }
            }
            function click(e) {
                var x = e.clientX;
                var y = e.clientY;
                var i = Math.floor(y / len);
                var j = Math.floor(x / len);

                if (indexCache.length == 0){
                    indexCache.push({'i':i, 'j':j});
                    chosen.style.top = (i * len + borderWidth)+"px";
                    chosen.style.left = (j * len + borderWidth)+"px";
                    chosen.style.display = "block";
                }
                else if (indexCache.length == 1) {
                    indexCache.push({'i':i, 'j':j});
                    swapImage(imageArray, indexCache[0], indexCache[1]);
                    indexCache = [];
                    chosen.style.display = "none";
                }

                if (Puzzle.isFinished()){

                }
            }
            canvas.addEventListener('mousemove', addMask);
            canvas.addEventListener('mouseenter', showMask);
            mask.addEventListener('mouseleave', hideMask);
            mask.addEventListener('click', click);
        }
        Puzzle.draw = function() {
            var basicShapes = [];
            var basicLines = [];
            var complexLines = [];
            var drawSquare = function(ctx){
                ctx.fillStyle = colorSchemes[colorIndex][1];
                ctx.fillRect (windowWidth/6, windowWidth/6, windowWidth/1.5, windowWidth/1.5);
            };
            var drawCircle = function(ctx) {
                ctx.fillStyle = colorSchemes[colorIndex][1];
                ctx.beginPath();
                ctx.arc(windowWidth/2, windowWidth/2, windowWidth/3, 0, Math.PI*2, true); 
                ctx.closePath();
                ctx.fill();
            }
            var drawHeart = function(ctx){
                var w = windowWidth;
                ctx.fillStyle = colorSchemes[colorIndex][1];
                ctx.beginPath();
                ctx.moveTo(w/2,4*w/15);
                ctx.bezierCurveTo(w/2,37*w/150,7*w/15,w/6,w/3,w/6);
                ctx.bezierCurveTo(2*w/15,w/6,2*w/15,5*w/12,2*w/15,5*w/12);
                ctx.bezierCurveTo(2*w/15,8*w/15,4*w/15,17*w/25,w/2,4*w/5);
                ctx.bezierCurveTo(11*w/15,17*w/25,13*w/15,8*w/15,13*w/15,5*w/12);
                ctx.bezierCurveTo(13*w/15,5*w/12,13*w/15,w/6,2*w/3,w/6);
                ctx.bezierCurveTo(17*w/30,w/6,w/2,37*w/150,w/2,4*w/15);
                ctx.fill();
            }
            function drawHypocycloids(ctx, x, y, R, r, a) {
                var w = windowWidth;
                ctx.save();
                ctx.translate(x, y);
                ctx.strokeStyle = colorSchemes[colorIndex][1];
                
                ctx.beginPath();
                ctx.moveTo(R-r+a,0);
                for (var i = 0; i < 20000; ++i) {
                    var t = (Math.PI / 180) * i;
                    var x = (R-r)*Math.cos(r*t/R) + a*Math.cos((1-r/R)*t);
                    var y = (R-r)*Math.sin(r*t/R) - a*Math.sin((1-r/R)*t);
                    ctx.lineTo(x,y);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.restore();
            }
            function drawEpicycloids(ctx) {
                var w = windowWidth;
                ctx.save();
                ctx.translate(w/2, w/2);
                var R = 200;
                var r = -70;
                var a = 20;
                ctx.strokeStyle = colorSchemes[colorIndex][1];
                ctx.beginPath();
                ctx.moveTo(R,0);
                for (var i = 0; i < 20000; ++i) {
                    var t = (Math.PI / 180) * i;
                    var x = (R+r)*Math.cos(r*t/R) - a*Math.cos((1+r/R)*t);
                    var y = (R+r)*Math.sin(r*t/R) - a*Math.sin((1+r/R)*t);
                    ctx.lineTo(x,y);

                }
                ctx.stroke();
                ctx.closePath();

                ctx.restore();
            }
            var drawSpiro = function(ctx) {
                var w = windowWidth;
                var pos = [{'x':w/2, 'y':w/2}, {'x':w/3, 'y':w/3}];
                
                for (var i = 0; i < pos.length; ++i) {
                    var x = pos[i].x;
                    var y = pos[i].y;
                    var R = x;
                    var r = generateRandom(40, (R * 0.75));
                    var a = generateRandom(35, r);
                    drawHypocycloids(ctx, x, y, R, r, a);
                }
                
                //drawEpicycloids(ctx);
            }
            /*basicShapes.push(drawSquare);
            basicShapes.push(drawCircle);
            basicShapes.push(drawHeart);
            basicShapes[2](ctx);*/
            drawSpiro(ctx);
        }
        Puzzle.drawGrid = function() {
            ctx.strokeStyle = colorSchemes[colorIndex][2];
            ctx.lineWidth=2*borderWidth;
            ctx.strokeRect(0, 0, windowWidth, windowWidth);
            
            ctx.lineWidth=borderWidth;
            for (var i = 1; i < slices; ++i) {
                ctx.beginPath();
                ctx.moveTo(i*len,0);
                ctx.lineTo(i*len,windowWidth);
                ctx.closePath();
                ctx.stroke();
            }

            for (var i = 1; i < slices; ++i) {
                ctx.beginPath();
                ctx.moveTo(0,i*len);
                ctx.lineTo(windowWidth,i*len);
                ctx.closePath();
                ctx.stroke();
            }
            
        }
        Puzzle.random = function() {
            for (var i = 0; i < slices; ++i) {
                for (var j = 0; j < slices; ++j) {
                    var imgData=ctx.getImageData(j*len,i*len,len,len);
                    imageArray.push(imgData);
                }
            }

            for (var k = 0; k < 0; ++k) {
                var i = generateRandom(0, slices*slices-1);
                var j = generateRandom(0, slices*slices-1);
                var x1 = Math.floor(i/slices), y1 = i - x1*slices;
                var x2 = Math.floor(j/slices), y2 = j - x2*slices;
                swapImage(imageArray, {'i':x1, 'j':y1}, {'i':x2, 'j':y2});
            }
        }
        Puzzle.isFinished = function() {
            for (var i = 0; i < slices*slices; ++i){
                if (indexArray[i] != i)
                    return false;
            }
            return true;
        }
        return Puzzle;
    }
    //define globally if it doesn't already exist
    if(typeof(Puzzle) === 'undefined'){
        window.Puzzle = define_library();
    }
    else{
        console.log("Library already defined.");
    }
})(window);

Puzzle.init();
Puzzle.draw();
Puzzle.drawGrid();
Puzzle.random();