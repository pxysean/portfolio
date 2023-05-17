
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 600;
        canvas.height = 600;

        Tone.Transport.bpm.value = 120;
        Tone.Transport.start();

        var rows = Math.floor(canvas.height/10);
        var cols = Math.floor(canvas.width/10);
        var grid = new Array(rows);
        for (var i = 0; i < rows; i++) {
            grid[i] = new Array(cols);
            for (var j = 0; j < cols; j++) {
                grid[i][j] = (Math.random() > 0.3 ? 1 : 0);
            }
        }

        var synth = new Tone.Synth().toDestination();
        var notes = ["A2", "C3", "E3", "A4", "C5", "E5", "F5", "A5", "C6"];

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (grid[i][j] == 1) {
                        ctx.fillStyle = "#000";
                        ctx.fillRect(j*11, i*11, 10, 10);
                    }
                }
            }
            evolve();
        }

        function evolve() {
            var next = new Array(rows);
            for (var i = 0; i < rows; i++) {
                next[i] = new Array(cols);
                for (var j = 0; j < cols; j++) {
                    var neighbors = 0;
                    for (var k = -1; k <= 1; k++) {
                        for (var l = -1; l <= 1; l++) {
                            neighbors += grid[(i+k+rows)%rows][(j+l+cols)%cols];
                        }
                    }
                    neighbors -= grid[i][j];
                    if (grid[i][j] == 1 && (neighbors < 2 || neighbors > 3)) {
                        next[i][j] = 0;
                    } else if (grid[i][j] == 0 && neighbors == 3) {
                        next[i][j] = 1;
                        var note = notes[Math.floor(Math.random()*notes.length)];
                        synth.triggerAttackRelease(note, "16n");
                    } else {
                        next[i][j] = grid[i][j];
                    }
                }
            }
            grid = next;
        }

        function handleCanvasClick() {
            draw();
        }

        function drawSwich(){
            setInterval(function() {
                draw();
            }, 100);
        }

        function drawSwich2(){
            setInterval(function() {
                draw();
            }, 200);
        }

        canvas.addEventListener("click", handleCanvasClick);