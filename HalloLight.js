const screenshot = require('screenshot-desktop')
const exec = require('child_process').exec

function HalloLight(){
    screenshot({ filename: '/tmp/screenshot.jpg' });
    exec("convert  /tmp/screenshot.jpg  -scale 1x1\!  txt:-", (err, stdout, stderr) => {
        color = stdout.split(" ")[7].replace("#","").toLocaleLowerCase();
        color = colorOptimizer(color);
        console.log("Setting color: ", color);
        exec("zengge-lightcontrol local --host 192.168.0.23:5577 set-color " + color, (err, stdout, stderr) => {
            exec("zengge-lightcontrol local --host 192.168.0.23:5577 get-state", (err, stdout, stderr) => {
                HalloLight();
                console.log(stdout);
            });
        });
    });
}

function HalloLight_v2(){
    setInterval(function(){
        screenshot({ filename: '/tmp/screenshot.jpg' });
        exec("convert  /tmp/screenshot.jpg  -scale 1x1\!  txt:-", (err, stdout, stderr) => {
            color = stdout.split(" ")[7].replace("#","").toLocaleLowerCase();
            color = colorOptimizer(color);
            console.log("Setting color: ", color);
            exec("zengge-lightcontrol local --host 192.168.0.23:5577 set-color " + color, (err, stdout, stderr) => {
            });
        });
    },2000);
}

function colorOptimizer(color){
    r = parseInt(color.slice(0,2),16); g = parseInt(color.slice(2,4),16); b = parseInt(color.slice(4,6),16);
    if(r>(g+50)&&r>(b+50)){
        r+=50;
        b/=10;
        g/=10;
    }
    else if(g>(r+50)&&g>(b+50)){
        g+=50;
        b/=10;
        r/=10;
    }
    else if(b>(r+50)&&b>(g+50)){
        b+=50;
        r/=10;
        g/=10;
    }
    else if(r<(g-50) && r<(b-50)){
        dif=Math.abs(g-r)/25 + Math.abs(b-r)/25 + 1;
        r = parseInt(r/dif);
        if(Math.abs(b-g)>70){
            if(g>b){
                g+=50;
            }else{
                b+=50;
            }
        }else{
            g+=50;
            b+=50;
        }
    }
    else if(g<(r-50) && g<(b-50)){
        dif=Math.abs(g-r)/25 + Math.abs(g-b)/25 + 1;
        g = parseInt(g/dif);
        if(Math.abs(r-b)>70){
            if(r>b){
                r+=50;
            }else{
                b+=50;
            }
        }else{
            r+=50;
            b+=50;
        }
    }
    else if(b<(r-50) && b<(g-50)){
        dif=Math.abs(b-r)/25 + Math.abs(b-g)/25 + 1;
        b = parseInt(b/dif);
        if(Math.abs(r-g)+70){
            if(r>g){
                r+=50;
            }else{
                g-=50;
            }
        }else{
            r+=50;
            g+=50;
        }
    }
    r=parseInt(r); g=parseInt(g);b=parseInt(b);
    if(r>255) r=255;
    if(g>255) g=255;
    if(b>255) b=255;
    color = r.toString(16).padStart(2, '0')+g.toString(16).padStart(2, '0')+b.toString(16).padStart(2, '0');
    console.log(r,g,b);
    return color;
}

HalloLight_v2();
/*
    brew install imagemagick
*/