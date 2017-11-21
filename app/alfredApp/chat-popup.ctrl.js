app.controller('chatPopupCtrl',function() {
    var vm = this;

    vm.init=function(){

        vm.showChatIcon=true;
    }

    vm.loadChatbox=function(){
        vm.showChatIcon=false;
        var e=document.getElementById("minim-chat");
        e.style.display="block";
        var e=document.getElementById("maxi-chat");
        e.style.display="none";
        var e=document.getElementById("chatbox");
        e.style.margin="0";
    }

    vm.closeChatbox=function(){
        var e=document.getElementById("chatbox");
        e.style.margin="0 0 -1500px 0";
        vm.showChatIcon=true;
    }

    vm.minimChatbox=function(){
        var e=document.getElementById("minim-chat");
        e.style.display="none";
        var e=document.getElementById("maxi-chat");
        e.style.display="block";
        var e=document.getElementById("chatbox");
        e.style.margin="0 0 -390px 0";
    }

    vm.init();
});