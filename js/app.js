(function(window){
    'use strict';
    function define_library(){
        var Puzzle = {};
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var borderWidth = 2;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var imageArray = new Array();
        var indexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var infoArray = {};

        function swap(array, i, j){
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        Puzzle.init = function() {
            var len = windowWidth/3;
            ctx.canvas.width = windowWidth;
            ctx.canvas.height = windowWidth;
            var mask = document.getElementById("mask");

            mask.style.height = (len - borderWidth)+"px";
            mask.style.width = (len - borderWidth)+"px";

            function addMask(e){
                if(e.preventDefault) e.preventDefault();
                var x = e.layerX;
                var y = e.layerY;

                var i = Math.floor(x / len);
                var j = Math.floor(y / len);
                //System.out.println(i+" "+j);
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
            canvas.addEventListener('mousemove', addMask);
            canvas.addEventListener('mouseenter', showMask);
            mask.addEventListener('mouseleave', hideMask);
        }
        Puzzle.draw = function() {
            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect (windowWidth/6, windowWidth/6, windowWidth/1.5, windowWidth/1.5);
        }
        Puzzle.drawGrid = function() {
            var len = windowWidth/3;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth=2*borderWidth;
            ctx.strokeRect(0, 0, windowWidth, windowWidth);
            
            ctx.lineWidth=borderWidth;
            for (var i = 1; i <= 2; ++i) {
                ctx.beginPath();
                ctx.moveTo(i*len,0);
                ctx.lineTo(i*len,windowWidth);
                ctx.closePath();
                ctx.stroke();
            }

            for (var i = 1; i <= 2; ++i) {
                ctx.beginPath();
                ctx.moveTo(0,i*len);
                ctx.lineTo(windowWidth,i*len);
                ctx.closePath();
                ctx.stroke();
            }

            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    var imgData=ctx.getImageData(i*len,j*len,len,len);
                    imageArray.push(imgData);
                }
            }
        }
        Puzzle.random = function() {
            for (var k = 0; k < 100; ++k) {
                var i = random(0, 8);
                var j = random(0, 8);
                swap(indexArray, i, j);
                swap(imageArray, i, j);
            }

        }
        Puzzle.isFinished = function() {
            
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