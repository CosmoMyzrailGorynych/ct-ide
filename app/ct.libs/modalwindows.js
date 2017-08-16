ct.modalwindows = {
    'currentcallback' : function () {void(0) },
    'text': 0,
    'button': 0,
    'withtext': false,
    'opened': false,
    'show': function (one,two,three,four) {
        ct.modalwindows.opened = true;
        ct.modalwindows.withtext = false;
        document.getElementById('ct_modal_text').style.maxHeight = '250px';
        document.getElementById('ct_modal_input').style.display = 'none';
        if (four) { // заголовок, сообщение, кнопки, колбек
            document.getElementById('ct_modal_head').innerHTML = one;
            document.getElementById('ct_modal_text').innerHTML = two;
            if (typeof three == 'string') {
                document.getElementById('ct_button_1').innerHTML = three;
                document.getElementById('ct_button_2').style.display = 'none';
                document.getElementById('ct_button_3').style.display = 'none';
            } else {
                document.getElementById('ct_button_1').innerHTML = three[0];
                if (three[1]) {
                    document.getElementById('ct_button_2').innerHTML = three[1];
                    document.getElementById('ct_button_2').style.display = 'inline-block';
                } else {
                    document.getElementById('ct_button_2').style.display = 'none';
                }
                if (three[2]) {
                    document.getElementById('ct_button_3').innerHTML = three[2];
                    document.getElementById('ct_button_3').style.display = 'inline-block';
                } else {
                    document.getElementById('ct_button_3').style.display = 'none';
                }
            }
        } else if (three) { // сообщение, кнопки, колбек
            document.getElementById('ct_modal_head').innerHTML = '%defaulthead%';
            document.getElementById('ct_modal_text').innerHTML = one;
            if (typeof two == 'string') {
                document.getElementById('ct_button_1').innerHTML = two;
                document.getElementById('ct_button_2').style.display = 'none';
                document.getElementById('ct_button_3').style.display = 'none';
            } else {
                document.getElementById('ct_button_1').innerHTML = two[0];
                if (two[1]) {
                    document.getElementById('ct_button_2').innerHTML = two[1];
                    document.getElementById('ct_button_2').style.display = 'inline-block';
                } else {
                    document.getElementById('ct_button_2').style.display = 'none';
                }
                if (two[2]) {
                    document.getElementById('ct_button_3').innerHTML = two[2];
                    document.getElementById('ct_button_3').style.display = 'inline-block';
                } else {
                    document.getElementById('ct_button_3').style.display = 'none';
                }
            }
        } else { // сообщение[, колбек]
            document.getElementById('ct_modal_head').innerHTML = '%defaulthead%';
            document.getElementById('ct_modal_text').innerHTML = one;
            document.getElementById('ct_button_1').innerHTML = '%defaultbutton%';
            document.getElementById('ct_button_2').style.display = document.getElementById('ct_button_3').style.display = 'none';
        }
        if (two) {
            ct.modalwindows.currentcallback = arguments[arguments.length - 1];
        } else {
            ct.modalwindows.currentcallback = function () {
                void(0); 
            };
        }
        document.getElementById('ct_modal_overlay').style.visibility = "visible";
        document.getElementById('ct_modal_overlay').style.opacity = 1;
    }, 
    'prompt': function (one,two,three,four) {
        if (four) ct.modalwindows.show(one,two,three,four);
        else if (three) ct.modalwindows.show(one,two,three);
        else if (two) ct.modalwindows.show(one,two);
        else ct.modalwindows.show(one);
        ct.modalwindows.withtext = true;
        document.getElementById('ct_modal_input').style.display = 'block';
        document.getElementById('ct_modal_input').value = '';
        document.getElementById('ct_modal_text').style.maxHeight = '200px';
    },
    'execbutton' : function (id) {
        ct.modalwindows.button = id;
        ct.modalwindows.opened = false;
        if (document.getElementById('ct_modal_overlay').style.opacity) {
            document.getElementById('ct_modal_overlay').style.opacity = 0;
            setTimeout('document.getElementById("ct_modal_overlay").style.visibility = "hidden";',500);
        } else {
            document.getElementById('ct_modal_overlay').style.visibility = "hidden";
        }
        if (ct.modalwindows.withtext)
            ct.modalwindows.text = document.getElementById('ct_modal_input').value;
        ct.modalwindows.currentcallback();
    }
};

ct.libs += "modalwindows";