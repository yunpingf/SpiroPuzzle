(function(window){
    'use strict';
    function define_library(){
        var Puzzle = {};
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var colorSchemes = [['#494E6B', '#DF744A','#FEDCD2','#BFD8D2','#DCB239','#f4f4f4'],
        ['#494E6B', '#6B7A8F','#F7882F','#F7C331','#DCC7AA','#f4f4f4'],
        ['#22252C', '#D7DD35','#575DA9','#E42D9F','#02558B','#f4f4f4']];
        var borderWidth = 1;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var imageArray = [];
        var indexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var indexCache = [];
        var slices = 3;
        var len = windowWidth/slices;
        var colorIndex = 2;//generateRandom(0, colorSchemes.length-1);
        var infoArray = {};
        var started = false;
        var steps = 0;
        var intervalId = 0;
        var drawIntervalId = 0;
        var previousImageData;
        var seconds = 0, minutes = 0, hours = 0;
        var w = windowWidth;
        var pos = [{'x':w/4,'y':w/4},
                {'x':w*3/4, 'y':w/4}, 
                {'x':w/4, 'y':w*3/4},
                {'x':w*3/4, 'y':w*3/4}];
        var posIndex = 0;


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
                    if (!(i == indexCache[0].i && j == indexCache[0].j)){
                        indexCache.push({'i':i, 'j':j});
                        swapImage(imageArray, indexCache[0], indexCache[1]);
                        steps ++;
                        console.log(steps);
                    }
                    indexCache = [];
                    chosen.style.display = "none";
                }

                if (Puzzle.isFinished()){
                    steps = 0;
                }
            }
            canvas.addEventListener('mousemove', addMask);
            canvas.addEventListener('mouseenter', showMask);
            mask.addEventListener('mouseleave', hideMask);
            mask.addEventListener('click', click);
            chosen.addEventListener('click', click);

            var hour = document.getElementById("hour");
            var minute = document.getElementById("minute");
            var second = document.getElementById("second");
            function start(){
                intervalId = window.setInterval(function(){
                    seconds ++;
                    if (seconds == 60){
                        minutes ++;
                        seconds = 0;
                    }
                    if (minutes == 60){
                        hours ++;
                        minutes = 0;
                    }
                    function toValidForm(num){
                        if (num.toString().length == 1)
                            num = "0"+num;
                        return num;
                    }
                    hour.innerHTML = toValidForm(hours);
                    minute.innerHTML = toValidForm(minutes);
                    second.innerHTML = toValidForm(seconds);
                }, 1000);
            }
            function reset() {
                clearInterval(intervalId);
                steps = 0;
                seconds = 0;
                minutes = 0;
                hours = 0;
            }
            function pause(){
                clearInterval(intervalId);
            }
            var startButton = document.getElementById("start");
            var resetButton = document.getElementById("reset");
            var pauseButton = document.getElementById("pause");
            var time = document.getElementById("time");

            startButton.addEventListener('click', start);
            resetButton.addEventListener('click', reset);
            pauseButton.addEventListener('click', pause);
        }
        Puzzle.draw = function() {
            for (var i = 0; i < 5; ++i){
                var j = generateRandom(1, 4);
                var k = generateRandom(1, 4);
                swap(colorSchemes[colorIndex],j, k);
            }

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
            
            /*basicShapes.push(drawSquare);
            basicShapes.push(drawCircle);
            basicShapes.push(drawHeart);
            basicShapes[2](ctx);*/
            //drawSpiro(ctx);
            //drawHeart(ctx);
            //previousImageData = ctx.getImageData(0, 0, windowWidth, windowWidth);
            drawIntervalId = window.setInterval(Puzzle.clearCanvas, 2000);
        }
        Puzzle.drawSpiro = function(){
            function drawHypocycloids(ctx, x, y, R, r, a, color) {
                var w = windowWidth;
                ctx.save();
                ctx.translate(x, y);
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(R-r+a,0);
                for (var i = 0; i < 10000; ++i) {
                    var t = (Math.PI / 150) * i;
                    var x = (R-r)*Math.cos(r*t/R) + a*Math.cos((1-r/R)*t);
                    var y = (R-r)*Math.sin(r*t/R) - a*Math.sin((1-r/R)*t);
                    ctx.lineTo(x,y);
                }
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

            var delta = generateRandom(-w*0.02, w*0.02);
            var x = pos[posIndex].x+ delta;
            var y = pos[posIndex].y+ delta;
            var R = 0.5*w + delta*10;
            var r = generateRandom(R*0.6, R*0.8);
            var a = generateRandom(0.3*r, 0.5*r);
            var color = colorSchemes[colorIndex][posIndex+1];
            drawHypocycloids(ctx, x, y, R, r, a, color);
        }
        Puzzle.drawGrid = function() {
            ctx.strokeStyle = colorSchemes[colorIndex][colorSchemes[colorIndex].length - 1];
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
        Puzzle.clearCanvas = function(){
            previousImageData = ctx.getImageData(0, 0, windowWidth, windowWidth);
            ctx.fillStyle = colorSchemes[colorIndex][0];
            ctx.fillRect (0, 0, windowWidth, windowWidth);
            ctx.putImageData(previousImageData, 0, 0);
            Puzzle.drawSpiro();
            Puzzle.drawGrid();

            var newImageArray = [];
            for (var i = 0; i < slices; ++i) {
                for (var j = 0; j < slices; ++j) {
                    var imgData=ctx.getImageData(j*len,i*len,len,len);
                    newImageArray.push(imgData);
                }
            }
            for(var i = 0; i < slices*slices; ++i) {
                var x = Math.floor(i/slices), y = i - x*slices;
                imageArray[i] = newImageArray[indexArray[i]];
                ctx.putImageData(imageArray[i], y*len, x*len);
            }
            if (posIndex == 3){
                clearInterval(drawIntervalId);
            }
            posIndex ++;
        }
        Puzzle.random = function() {
            for (var i = 0; i < slices; ++i) {
                for (var j = 0; j < slices; ++j) {
                    var imgData=ctx.getImageData(j*len,i*len,len,len);
                    imageArray.push(imgData);
                }
            }

            for (var k = 0; k < 1; ++k) {
                var i = generateRandom(0, slices*slices-1);
                var j = generateRandom(0, slices*slices-1);
                var x1 = Math.floor(i/slices), y1 = i - x1*slices;
                var x2 = Math.floor(j/slices), y2 = j - x2*slices;
                //swapImage(imageArray, {'i':x1, 'j':y1}, {'i':x2, 'j':y2});
                swap(indexArray, i, j);
            }
            for (var i = 0; i < slices*slices; ++i){
                console.log(indexArray[i]);
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
Puzzle.random();
Puzzle.draw();
Puzzle.drawGrid();

