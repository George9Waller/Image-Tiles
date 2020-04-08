let warning = true;

function PageLoad(){
    document.getElementById("main-containor").style.opacity = "1";
    //document.getElementByID("sizeTable").style.opacity = "1";
    document.getElementById("loaded-images").style.opacity = "1";
    document.getElementById("github").style.opacity = "1";
}

function makeCanvas() {
    let c = document.getElementById("canvas");
    let width = parseInt(document.getElementById("width").value) * parseInt(document.getElementById("columns").value);
    let height = parseInt(document.getElementById("height").value) * parseInt(document.getElementById("rows").value);
    c.innerHTML = `<canvas id="HTMLCanvas" width="${width}" height=${height}" />`
    c.style.opacity = "1";
}

// Source from:  http://stackoverflow.com/questions/18480474/how-to-save-an-image-from-canvas

/* Canvas Download */
function download(canvas, filename) {
    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'), e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = filename;

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL("image/png;base64");

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);

        lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
    }
    //document.body.style.background = `#f3f3f3 url("${canvas.toDataURL}") no-repeat centre scroll`;
}

function DownloadCanvas()
{
    let time = Math.floor(Date.now() / 1000);

    let canvas = document.getElementById("HTMLCanvas");
    let filename = `Tile Image ${time}`;

    download(canvas, filename);
}

//source from: https://stackoverflow.com/questions/48560709/select-multiple-images-to-each-input-file

function imgToData(input) {
    srcarray = [];
        if (input.files) {

            var length = input.files.length;
            $.each(input.files, function (i, v) {
                var n = i;
                var File = new FileReader();
                File.onload = function (event) {
                    $('<img/>').attr({
                        src: event.target.result,
                        class: 'img',
                        id: 'img-' + n + '-preview',
                        width: parseInt(document.getElementById("width").value),
                        height: parseInt(document.getElementById("height").value)
                    }).appendTo($("#loaded-images"));

                    // $('<input/>').attr({
                    //     type: 'text',
                    //     value: event.target.result,
                    //     id: 'img-' + n + '-val'
                    // }).appendTo('body');

                    //console.log(event.target.result);
                    // var string = "" + event.target.result;
                    // srcarray.push(string)
                };

                File.readAsDataURL(input.files[i]);
            });
            //console.log("image to data done");
            //console.log(srcarray.length);


        }
        return srcarray;
}

function addImages(imgarray) {
    makeCanvas();

    let rows = parseInt(document.getElementById("rows").value);
    let columns = parseInt(document.getElementById("columns").value);
    let width = parseInt(document.getElementById("width").value);
    let height = parseInt(document.getElementById("height").value);
    //console.log(`${rows} rows by ${columns} columns, ${width} by ${height}`);

    let canvas = document.getElementById("HTMLCanvas");
    let context = canvas.getContext('2d');

    let x = 0;
    let y = 0;
    let v = -1;

    let length = document.getElementById("photos").files.length;

    for (let i = 0; i < columns; i++)
    {
        //console.log(`column ${i}`);
        //console.log(`x:${x} y:${y}`);

        for (let k = 0; k < rows; k++)
        {
            console.log(`random checkbox = ${document.getElementById("randomBool").value}`);
            if (document.getElementById("randomBool").checked === false)
            {
                if (v !== (length - 1))
                {v+= 1;}
                else
                {v = 0;}
            }
            else
            {
                v = Math.floor(Math.random() * length);     // returns a random integer from 0 to 9
            }

            //console.log(`Row: ${k}`);
            var imgel = document.getElementById(`img-${v}-preview`);
            //console.log(imgel);
            //console.log(imgarray);
            context.drawImage(imgel, x, y, width, height);

            y += height;

            //console.log(`image ${v}`);
        }
        x += width;
        y = 0;
    }
    //document.body.style.background = `#f3f3f3 url("${document.getElementById("photos").toDataURL}") no-repeat centre scroll`;
}

function deleteLoadedImages() {
    let length = document.getElementById("photos").files.length;
    console.log(`Length: ${length}`);

    try {
        for (let i = 0; i < length; i++) {
            let curImage = document.getElementById(`img-${i}-preview`);
            curImage.parentNode.removeChild(curImage);
            }
        }
    catch {
        return;
    }

}

function start() {
    let alert = document.getElementById("alertID");
    alert.innerHTML += `<div class="alert"><span class="closebtn" onclick="buttonFade()">&times;</span>
    Wait for all ${document.getElementById("photos").files.length} images to load at the bottom </div>`;
    buttonFade();

    let images = imgToData(document.getElementById("photos"));
    //console.log(images);
}

function sizeAlert() {
    if (warning) {
        let alert = document.getElementById("alertID");
        alert.innerHTML += `<div class="alert" id="warning"><span class="closebtn" onclick="buttonFade()">&times;</span>
    Clear and reload any images after changing image size </div>`;
        buttonFade();
        document.getElementById("warning").style.opacity = "1";
        warning = false;
    }
}

function buttonFade()
{
    var close = document.getElementsByClassName("closebtn");
    var i;

// Loop through all close buttons
    for (i = 0; i < close.length; i++) {
        // When someone clicks on a close button
        close[i].onclick = function(){

            // Get the parent of <span class="closebtn"> (<div class="alert">)
            var div = this.parentElement;

            // Set the opacity of div to 0 (transparent)
            div.style.opacity = "0";

            // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
            setTimeout(function(){ div.style.display = "none"; }, 600);

        }
    }
}