(() => {
    document.addEventListener("DOMContentLoaded", main, false);

    var audioCtx = new AudioContext();
    //正弦波の音を作成
    var osciillator = audioCtx.createOscillator();

    async function main() {
        // MediaPipeの初期化
        initialize();



        const btn = document.getElementById("play");
        btn.addEventListener("click", ()=> {
            play(440);
        });



    
        //ヘルツ（周波数）指定
        osciillator.frequency.setValueAtTime(440, audioCtx.currentTime);


        //音の出力先
        var audioDestination = audioCtx.destination;
    
    
        //出力先のスピーカーに接続
        osciillator.connect(audioDestination);
    
    
        osciillator.start();

    

        console.log(hz[5]);
        console.log(getClosestNum(456, hz));

    }

    function getClosestNum(needle, haystack) {
        return haystack.reduce((a, b) => {
            let aDiff = Math.abs(a - needle);
            let bDiff = Math.abs(b - needle);
    
            if (aDiff == bDiff) {
                // 大きい方 vs 小さいほう (> vs <) を指定する
                return a > b ? a : b;
            } else {
                return bDiff < aDiff ? b : a;
            }
        });
    }


    function initialize() {
        // カメラの初期化
        const video = document.getElementById("video");
        const camera = new Camera(video, {
            onFrame: async () => {
                await hands.send({ image: video });
            },
            width: 672,
            height: 504
        });
        camera.start()


        // handsの初期化
        const hands = new Hands({
            locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
            selfieMode: true,
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(recvResults);
    }


    function recvResults(results) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        ctx.rect(0, 0, canvas.width, 48);
        ctx.fillStyle = "rgba(0, 0, 0, .5)";
        ctx.fill();

        ctx.font = "16px sans-serif"; 
        ctx.fillStyle = "White";
        ctx.fillText("手の距離:", 24, 30);


        if (results.multiHandLandmarks) {
            results.multiHandLandmarks.forEach(marks => {
                drawConnectors(ctx, marks, HAND_CONNECTIONS, { color: "#0f0" });
                drawLandmarks(ctx, marks, { color: "#f00" });

                const calc = Math.floor(getDistance(marks) * -5000);

                ctx.fillText(getClosestNum(calc, hz), 120, 30);
                osciillator.frequency.setValueAtTime(getClosestNum(calc, hz), audioCtx.currentTime);

            })
        }

    }



    function getDistance(marks){
        let total = 0;
        for(let i=0; i<marks.length; i++){
            total += marks[i].z;
        }
        return total/marks.length;
    }




    //引数のヘルツの高さの音を出す関数
    function play(hz) {
        //正弦波の音を作成
        var osciillator = audioCtx.createOscillator();
        //ヘルツ（周波数）指定
        osciillator.frequency.setValueAtTime(hz, audioCtx.currentTime);


        //音の出力先
        var audioDestination = audioCtx.destination;
    
    
        //出力先のスピーカーに接続
        osciillator.connect(audioDestination);
    
    
        osciillator.start();

    }




    const hz = [
        27.625,
        29.26766798,
        31.00801408,
        32.85184655,
        34.805319,
        36.87495097,
        39.06764966,
        41.390733,
        43.85195406,
        46.45952694,
        49.22215418,
        52.14905578,
        55.25,
        58.53533596,
        62.01602817,
        65.7036931,
        69.61063801,
        73.74990194,
        78.13529932,
        82.781466,
        87.70390812,
        92.91905389,
        98.44430835,
        104.2981116,
        110.5,
        117.0706719,
        124.0320563,
        131.4073862,
        139.221276,
        147.4998039,
        156.2705986,
        165.562932,
        175.4078162,
        185.8381078,
        196.8886167,
        208.5962231,
        221,
        234.1413439,
        248.0641127,
        262.8147724,
        278.442552,
        294.9996078,
        312.5411973,
        331.125864,
        350.8156325,
        371.6762155,
        393.7772334,
        417.1924462,
        442,
        468.2826877,
        496.1282254,
        525.6295448,
        556.8851041,
        589.9992155,
        625.0823946,
        662.251728,
        701.631265,
        743.3524311,
        787.5544668,
        834.3848924,
        884,
        936.5653754,
        992.2564507,
        1051.25909,
        1113.770208,
        1179.998431,
        1250.164789,
        1324.503456,
        1403.26253,
        1486.704862,
        1575.108934,
        1668.769785,
        1768,
        1873.130751,
        1984.512901,
        2102.518179,
        2227.540416,
        2359.996862,
        2500.329578,
        2649.006912,
        2806.52506,
        2973.409724,
        3150.217867,
        3337.53957,
        3536,
        3746.261502,
        3969.025803,
        4205.036359
    ]
    


})()

