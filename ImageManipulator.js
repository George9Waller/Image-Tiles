let warning = true;
let imgcount = 0;
let imgcountOver = 0;

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
    overlayToData();
    srcarray = [];
        if (input.files) {

            var length = input.files.length;
            $.each(input.files, function (i, v) {
                var n = i;
                var File = new FileReader();
                File.onload = function (event) {
                    $('<img/>').attr({
                        src: event.target.result,
                        class: 'resize',
                        id: 'img-' + imgcount + '-preview',
                        width: parseInt(document.getElementById("width").value),
                        height: parseInt(document.getElementById("height").value)
                    }).appendTo($("#loadedimagesbox"));
                    imgcount += 1;

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

function overlayToData() {
    if (document.getElementById("overlay").files) {

        var length = document.getElementById("overlay").files.length;
        $.each(document.getElementById("overlay").files, function (i, v) {
            var n = i;
            var File = new FileReader();
            File.onload = function (event) {
                $('<img/>').attr({
                    src: event.target.result,
                    class: 'resize',
                    id: 'imgOver-' + imgcountOver + '-preview'
                }).appendTo($("#overlaybox"));
                imgcountOver += 1;

            };

            File.readAsDataURL(document.getElementById("overlay").files[i]);
        });
}
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
    let cont = true;
    let length = imgcount;

    // while (cont)
    // {
    //     try
    //     {
    //         let temp = document.getElementById(`img-${length}-preview`);
    //         length += 1;
    //     }
    //     catch (e) {
    //         cont = false;
    //     }
    // }

    for (let i = 0; i < columns; i++)
    {
        //console.log(`column ${i}`);
        //console.log(`x:${x} y:${y}`);

        for (let k = 0; k < rows; k++)
        {
            //console.log(`random checkbox = ${document.getElementById("randomBool").value}`);
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
    try {
        let overlayfiles = document.getElementById(`imgOver-${imgcountOver - 1}-preview`);
        let scale = parseInt(document.getElementById("overlayscale").value);
        let width = overlayfiles.width;
        let height = overlayfiles.height;
        //console.log(`This image has a width of: ${width} and a height of: ${height}
        //The canvas has a width of: ${canvas.width} and a height of: ${canvas.height}`);
        //scales to canvas size
        if (width > height)
        {
            //console.log(`This is a landscape overlay`);
            let ratio = height * 1.0 / width;
            //console.log(`ratio calculated: ${ratio}`);
            width = canvas.width;
            height = width * 1.0 * ratio;
            //console.log(`resolution before re-scaling, width: ${width} height: ${height}`);
            width = Math.round(width * (scale / 100));
            height = Math.round(height * (scale / 100));
            //console.log(`The landscape image now has a width of: ${width} and a height of: ${height}`)
        }
        else
        {
            //console.log(`This is a portrait overlay`);
            let ratio = width * 1.0 / height;
            height = canvas.height;
            width = height * 1.0 * ratio;
            width = Math.round(width * (scale / 100));
            height = Math.round(height * (scale / 100));
        }

        let centreXCanv = canvas.width / 2;
        let centreYCanv = canvas.height / 2;

        let PosX = centreXCanv - width / 2;
        let PosY = centreYCanv - height / 2;

        //console.log(`Got to drawImage for overlay with imgOvercounter of ${imgcountOver - 1}`);
        context.drawImage(overlayfiles, PosX, PosY, width, height)
    }
    catch (e) {
        return
    }

}

function deleteLoadedImages() {
    deleteOverlays();
    let length = imgcount;
    console.log(`Length: ${length}`);

    try {
        for (let i = 0; i < length; i++) {
            let curImage = document.getElementById(`img-${i}-preview`);
            curImage.parentNode.removeChild(curImage);
            }
        }
    catch {

    }

}

function deleteOverlays()
{
    try
    {
        for (let i = 0; i < imgcountOver; i++)
        {
            let curImage = document.getElementById(`imgOver-${i}-preview`);
            curImage.parentNode.removeChild(curImage);
        }
    }
    catch (e) {

    }
}

function start() {
    let alert = document.getElementById("alertID");
    alert.innerHTML += `<div class="alert"><span class="closebtn" onclick="buttonFade()">&times;</span>
    Wait for all ${document.getElementById("photos").files.length} images to load at the bottom </div>`;
    buttonFade();
    window.scrollTo(0,0);

    let images = imgToData(document.getElementById("photos"));
    document.getElementById("photos").value = '';
    document.getElementById("overlay").value = '';
    //console.log(images);
}

function sizeAlert() {
    if (warning) {
        let alert = document.getElementById("alertID");
        alert.innerHTML += `<div class="alert" id="warning"><span class="closebtn" onclick="buttonFade()">&times;</span>
    Clear and reload any images after changing image size </div>`;
        buttonFade();
        window.scrollTo(0,0);
        document.getElementById("warning").style.opacity = "1";
        warning = false;
    }
}

function OverlayAlert() {
    let alert = document.getElementById("alertID");
    alert.innerHTML += `<div class="alert" id="overlaywarn"><span class="closebtn" onclick="buttonFade()">&times;</span>
    Overlay image must have a transparent background</div>`;
    buttonFade();
    window.scrollTo(0,0);
}

function ScaleAlert() {
    let alert = document.getElementById("alertID");
    alert.innerHTML += `<div class="alert" id="scalewarn"><span class="closebtn" onclick="buttonFade()">&times;</span>
    Scale of the overlay as a percentage, can go above 100 to increase overlay</div>`;
    buttonFade();
    window.scrollTo(0,0);
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