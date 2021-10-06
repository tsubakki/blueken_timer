var database = firebase.database();
const color_db = "color";
const timer_db = "timer";
const timer = document.getElementById("timer_text");
const time_selector = document.getElementById("time_selector");
const start_button = document.getElementById("start_button");
const stop_button = document.getElementById("stop_button");
const logout_button = document.getElementById("logout_button");
const red_button = document.getElementById("red_button");
const blue_button = document.getElementById("blue_button");
const green_button = document.getElementById("green_button");

let finish_time
let pause_start
let pause_stop
let timer_count_down_flag;
let color_flag;

window.onload = function(){
    database.ref(timer_db).once("value").then(function(snapshot) {
        finish_time = snapshot.child("finish_time").val()
        now_time = Date.now()
        if ((now_time < finish_time) && (snapshot.child("start").val() == true)){
            timer_count_down_flag = setInterval("CountDown(finish_time)", 1000);
            start_button.className = "start_button fas fa-pause-circle"
        }
    });
    database.ref(color_db).set({
        black: true,
        red: false,
        blue: false,
        green: false
    });
};

//送信処理

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
            database.ref(timer_db).set({
                finish_time: null,
                start: false,
                restart: false,
                pause: false,
                stop: true
            });
            start_button.className = "start_button far fa-play-circle"
        }
    }else{
        second -= 1;
    }
    minute = ("0" + minute).slice(-2); second = ("0" + second).slice(-2);
    timer.value = `${minute}:${second}`;
};

const Start = function(){
    timer.value = time_selector.value;
    let [minute, second] = (time_selector.value).split(':')
    finish_time = Date.now() + minute * 60 * 1000 + second * 1000 + 1000
    database.ref(timer_db).set({
        finish_time: finish_time,
        start: true,
        restart: false,
        pause: false,
        stop: false
    });
    timer_count_down_flag = setInterval("CountDown(finish_time)", 1000);
    start_button.className = "start_button fas fa-pause-circle"
}

const Restart = function(){
    let [minute, second] = (timer.value).split(':')
    finish_time = Date.now() + minute * 60 * 1000 + second * 1000 + 1000
    database.ref(timer_db).set({
        finish_time: finish_time,
        start: false,
        restart: true,
        pause: false,
        stop: false
    });
    timer_count_down_flag = setInterval("CountDown(finish_time)", 1000);
    start_button.className = "start_button fas fa-pause-circle"
}

const Pause = function(){
    clearInterval(timer_count_down_flag)
    start_button.className = "start_button fas fa-play-circle"
    database.ref(timer_db).set({
        finish_time: finish_time,
        start: false,
        restart: false,
        pause: true,
        stop: false
    });
}

const Stop = function(){
    clearInterval(timer_count_down_flag)
    timer.value = "00:00";
    start_button.className = "start_button far fa-play-circle"
    database.ref(timer_db).set({
        finish_time: null,
        start: false,
        restart: false,
        pause: false,
        stop: true,
    });
}

start_button.addEventListener('click', function() {
    if(start_button.className == "start_button far fa-play-circle"){
        Start();
    }else if(start_button.className == "start_button fas fa-play-circle"){
        pause_stop = Date.now()
        Restart()
    }else if(start_button.className == "start_button fas fa-pause-circle"){
        pause_start = Date.now()
        Pause();
    }
}, false);

stop_button.addEventListener('click', function() {
    if(start_button.className == "start_button fas fa-play-circle" || start_button.className == "start_button fas fa-pause-circle"){
        Stop();
    }
}, false);

const Black = function(){
    database.ref(color_db).set({
        black: true,
        red: false,
        blue: false,
        green: false
    });
}

const Red = function(){
    clearTimeout(color_flag);
    database.ref(color_db).set({
        black: false,
        red: true,
        blue: false,
        green: false
    });
    color_flag = setTimeout(Black, 3000)
}

const Blue = function(){
    clearTimeout(color_flag);
    database.ref(color_db).set({
        black: false,
        red: false,
        blue: true,
        green: false
    });
    color_flag = setTimeout(Black, 3000)
}

const Green = function(){
    clearTimeout(color_flag);
    database.ref(color_db).set({
        black: false,
        red: false,
        blue: false,
        green: true
    });
    color_flag = setTimeout(Black, 3000)
}

red_button.addEventListener('click', function() {
    Red();
}, false);

blue_button.addEventListener('click', function() {
    Blue();
}, false);

green_button.addEventListener('click', function() {
    Green();
}, false);

logout_button.addEventListener('click', function() {
    firebase.auth().signOut().then(()=>{
        location.href="../html/login.html";
      })
      .catch( (error)=>{
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
    }, false);

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
