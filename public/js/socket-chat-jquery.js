var divUsers = $("#divUsuarios");
var formSend = $("#formSendMsg");
var formMessage = $("#txtMessage")
var chatBox = $("#divChatbox");

function fnRenderUsers(nameChat, people) {

    var htmlChat = '';
    htmlChat += '<li>';
    htmlChat += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + nameChat + '</span></a>';
    htmlChat += '</li>';

    for (var i = 0; i < people.length; i++) {
        var person = people[i];
        htmlChat += '<li id="' + person.id + '">';
        htmlChat += '<a data-id="' + person.id + '" href="javascript:void(0)"><img src="assets/images/users/' + (i + 1) + '.jpg" alt="user-img" class="img-circle">';
        htmlChat += '<span>' + person.name + '<small class="text-success">online</small></span></a>';
        htmlChat += '</li>';
    }

    divUsers.html(htmlChat);

}

function fnAddUser(user) {

    var li = '<li id="' + user.id + '">';
    li += '<a data-id="' + user.id + '" href="javascript:void(0)"><img src="assets/images/users/' + $("#divUsuarios li").length + '.jpg" alt="user-img" class="img-circle">';
    li += '<span>' + user.name + '<small class="text-success">online</small></span></a>';
    li += '</li>';

    divUsers.append(li);
}

function fnByeUser(user) {
    $("#" + user.id).remove()
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function renderMessage(response, receive) {
    var html = '';
    var show_date = formatAMPM(new Date(response.date));
    if (receive) {
        html += '<li class="animated fadeIn">';
        html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '<div class="chat-content">';
        html += '<h5>' + response.user.name + '</h5>';
        html += '<div class="box bg-light-info">' + response.message + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + show_date + '</div>';
        html += '</li>';
    } else {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + response.user.name + '</h5>';
        html += '<div class = "box bg-light-inverse" > ' + response.message + '</div>';
        html += '</div>';
        html += '<div class = "chat-img"> <img src="assets/images/users/5.jpg" alt="user" /> </div>';
        html += '<div class = "chat-time" > ' + show_date + '</div>';
        html += '</li>';
    }

    chatBox.append(html);
}

function wellcomeBye(response, welcome = true) {

    var html = '';

    if (welcome) {
        html += '<li class="animated fadeIn"><h5 style="color: green; display: inline; text-align: center; padding-left: 10px;">';
        html += response.user.name + '- se unió </h5><div class="chat-time">' + formatAMPM(new Date(response.date)) + '</div></li>';
    } else {
        html += '<li class="animated fadeIn"><h5 style="color: red; display: inline; text-align: center; padding-left: 10px;">';
        html += response.user.name + ' - se fue </h5><div class="chat-time">' + formatAMPM(new Date(response.date)) + '</div></li>';
    }
    chatBox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = chatBox.children('li:last-child');

    // heights
    var clientHeight = chatBox.prop('clientHeight');
    var scrollTop = chatBox.prop('scrollTop');
    var scrollHeight = chatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        chatBox.scrollTop(scrollHeight);
    }
}

divUsers.on('click', 'a', function() {
    var id = $(this).attr('data-id');
    console.log(id);
})

formSend.on('submit', function(event) {
    event.preventDefault();
    if (formMessage.val().trim().length) {
        //console.log("Ready", formMessage.val());
        socket.emit('sendMessage', {
            model: window.toUser,
            message: formMessage.val()
        }, function(r) {
            if (r.success == true) {
                console.log(r.response);
                renderMessage(r.response, false);
                scrollBottom();
                return formMessage.val("").focus();
            }
            alert("Error", r);

        });
    }

})