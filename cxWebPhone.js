var ringingAnimation;

/** Call Elements */
var cxCallConnected = false;
var cxDestination = "";

/** UI Elements */
var uiBtnDeleteTimer;

var cxDestinationRequest = get('d');
if (typeof cxDestinationRequest !== "undefined") {
    cxDestination = cxDestinationRequest;
    keypadPress();
}

$(function() {
    Cloudonix.load();
    Cloudonix.setDebug();
    Cloudonix.init(myCloudonixDomain, myCloudonixSubscriber, myCloudonixPassword);
});

/** General functions */
function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

/** UI functions */
$("#btnDeleteDst").mouseup(function(){
    $("#btnDeleteDst").css("background-color", "transparent");
    clearTimeout(uiBtnDeleteTimer);
    return false;
}).mousedown(function(){
    $("#btnDeleteDst").css("background-color", "#c0c0c0");
    uiBtnDeleteTimer = window.setTimeout(function() {
        cxDestination = "";
        $("#cxDestination").text(cxDestination);
        $("#btnDeleteDst").css("display", "none");
        $("#btnDeleteDst").css("background-color", "transparent");
    }, 1000);
    return false;
});

function keypadPress(key) {
    if (!cxCallConnected) {
        if (key == "X") {
            cxDestination = cxDestination.substring(0, cxDestination.length - 1);
            $("#cxDestination").text(cxDestination);
            $("#btnDeleteDst").css("display", "none");
            if (cxDestination.length) {
                $("#btnDeleteDst").css("display", "block");
            }
        } else {

            if (cxDestination.length < 13) {

                if (typeof key !== "undefined") {
                    cxDestination += key;
                }

                if (cxDestination.length < 4) {
                    $("#cxDestination").removeClass('h3').removeClass('h5').addClass('h2');
                    $("#btnDeleteDst").removeClass('h4').removeClass('h6').addClass('h3');
                } else if (cxDestination.length < 8) {
                    $("#cxDestination").removeClass('h2').removeClass('h5').addClass('h3');
                    $("#btnDeleteDst").removeClass('h3').removeClass('h6').addClass('h4');
                } else {
                    $("#cxDestination").removeClass('h2').removeClass('h3').addClass('h5');
                    $("#btnDeleteDst").removeClass('h4').removeClass('h3').addClass('h6');
                }

                $("#cxDestination").text(cxDestination);
                $("#btnDeleteDst").css("display", "block");
            }
        }
    } else {
        Cloudonix.sipSendDtmfTone(key);
    }
}

function startCall() {
    if (cxDestination.length > 5) {
        Cloudonix.sipStartCall(cxDestination);
    } else {
        return false;
    }
}

function stopCall() {
    Cloudonix.sipStopCall();
    clearInterval(ringingAnimation);
    $("#btnCallIcon").removeClass('icon-bell-o');
    $("#btnCallIcon").removeClass('icon-volume-control-phone');
    $("#btnCallIcon").addClass('icon-phone');
    $("#btnCallIcon").css('color', '#FFFFFF');
    $("#btnCall").attr("onclick", "startCall()");
    $("#btnCall").css('background-color', '#006D64');
    $("#btnCall").css('transform', 'rotate(0deg)');
}

/** Utility Functions */
Cloudonix.sessionEvents.onSessionConnected(function (ev) {
    cxCallConnected = true;
    Cloudonix.stopRingbackTone();
    clearInterval(ringingAnimation);
    $("#btnCallIcon").removeClass('icon-phone');
    $("#btnCallIcon").removeClass('icon-bell-o');
    $("#btnCallIcon").addClass('icon-volume-control-phone');
    $("#btnCall").css('color', '#ffffff');
    $("#btnCall").css('background-color', '#FF0000');
    $("#btnCall").attr("onclick", "stopCall()");
    //uiActivityCall.className = 'cxWidgetButton cxWidgetButtonCallConnected';
    //uiActivityCall.setAttribute("onclick", "Cloudonix.sipStopCall()");
    //uiActivityCallIcon.src = iconSpeaker;
    //uiActivityCall.style.display = 'block';
});

Cloudonix.sessionEvents.onSessionConnecting(function (ev) {
    var index = 0;

    $("#btnCallIcon").removeClass('icon-phone');
    $("#btnCallIcon").addClass('icon-bell-o');
    $("#btnCallIcon").css('color', '#000000');
    $("#btnCall").css('background-color', '#F0FF02');
    $("#btnCall").attr("onclick", "stopCall()");

    ringingAnimation = setInterval(function () {
        if (!index) {
            $("#btnCall").css('transform', 'rotate(10deg)');
            $("#btnCall").css('transition', 'transform 0.16s linear 0s, opacity 0.08s linear 0s');
            index = true;
        } else {
            $("#btnCall").css('transform', 'rotate(-10deg)');
            $("#btnCall").css('transition', 'transform 0.16s linear 0s, opacity 0.08s linear 0s');
            index = false
        }
    }, 250);
});

Cloudonix.sessionEvents.onSessionTerminated(function (ev) {
    cxCallConnected = false;
    Cloudonix.stopRingbackTone();
    clearInterval(ringingAnimation);
    $("#btnCallIcon").removeClass('icon-bell-o');
    $("#btnCallIcon").removeClass('icon-volume-control-phone');
    $("#btnCallIcon").addClass('icon-phone');
    $("#btnCall").attr("onclick", "startCall()");
    $("#btnCall").css('color', '#FFFFFF');
    $("#btnCall").css('background-color', '#006D64');
    $("#btnCall").css('transform', 'rotate(0deg)');
});