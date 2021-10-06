var database = firebase.database();
const color_db = "color";
const timer_db = "timer";
const timer = document.getElementById("timer_text");
let finish_time
let pause_start
let pause_stop
let timer_count_down_flag;

// window.onload = function(){
//     database.ref(timer_db).once("value").then(function(snapshot) {
//         finish_time = snapshot.child("finish_time").val()
//         now_time = Date.now()
//         if (now_time < finish_time){
//         timer_count_down_flag = setInterval("CountDown(finish_time)", 1000);
//         start_button.innerText = "停止"
//         }
//     });
// };

// //送信処理
const SetTime = function(second){               // 選択した時間をタイマーにセットする
    timer.value = `${Math.floor(second/60)}:${second%60}`;
}

const CountDown = function(){        // １秒ずつ時間を減らす関数
    now_time = Date.now()
    SetTime(Math.ceil((finish_time - now_time)/1000, 10));
    let [minute, second] = (timer.value).split(':')
    if(second == 00){
        if(minute != 00){
            minute -= 1; second = 59;
        }else{
            clearInterval(timer_count_down_flag);
        }
    }else{
        second -= 1;
    }
    minute = ("0" + minute).slice(-2); second = ("0" + second).slice(-2);
    timer.value = `${minute}:${second}`;
};

const Start = function(){
    now_time = Date.now()
    if (now_time < finish_time){
        timer_count_down_flag = setInterval("CountDown(finish_time)", 1000);
    }
}

const Restart = function(){
    timer_count_down_flag = setInterval("CountDown(finish_time)", 1000);
}

const Pause = function(){
    clearInterval(timer_count_down_flag)
}

const Stop = function(){
    clearInterval(timer_count_down_flag)
    timer.value = "00:00";
}

database.ref(timer_db).on('value', function(snapshot){
    finish_time = snapshot.child("finish_time").val();
    if(snapshot.child("start").val() == true){
        Start()
    }else if(snapshot.child("pause").val() == true){
        Pause()
    }else if(snapshot.child("restart").val() == true){
        finish_time = snapshot.child("finish_time").val();
        Restart()
    }else if(snapshot.child("stop").val() == true){
        Stop()
    }
});

database.ref(color_db).on('value', function(snapshot){
    if(snapshot.child("red").val() == true){
        timer.style.borderColor = "#ff6600"
    }else if(snapshot.child("blue").val() == true){
        timer.style.borderColor = "#3366ff"
    }else if(snapshot.child("green").val() == true){
        timer.style.borderColor = "#33cc00"
    }else if(snapshot.child("black").val() == true){
        timer.style.borderColor = "#262626"
    }
});