// var defaultAdress = 'http://192.168.1.91/gpsv2/';
// var defaultAdress = 'http://localhost/gpsv2/';
var defaultAdress = 'http://haynhuthe.com/';
// function for sending geolocation to server 
function receive_location_ajax(){
    // setInterval(function(){ receiveGPS_ajax() }, 10000);

}

function autoSendGPS()
{
    setInterval(function(){
            receiveGPS_ajax();
    },10000);
}

function checkConnection(){
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN] ='UNKNOWN';
    states[Connection.ETHERNET] = 'ETHERNET';
    states[Connection.WIFI] = 'WIFI';
    states[Connection.CELL_2G] = '2G';
    states[Connection.CELL_3G] = '3G';
    states[Connection.CELL_4G] = '4G';
    states[Connection.NONE] = 'NONE';
    document.getElementById('connection').innerHTML = states[networkState];
    return states[networkState];
    
}

function receiveGPS_ajax(){
    navigator.geolocation.getCurrentPosition(function(position) {
        var d = new Date();
        var t = d.toLocaleTimeString();
        var user_id = 0;
        localStorage.longitude = position.coords.longitude;
        localStorage.latitude = position.coords.latitude;
        if(localStorage.user_id!=undefined)
            user_id = localStorage.user_id;
        setTimeout(function(){
            $.ajax({
                    url: defaultAdress + 'checkLocation',
                    type:'get',
                    dataType:'text',
                    data:{
                        user_id: user_id,
                        longitude:position.coords.longitude,
                        latitude: position.coords.latitude,
                        checkTime: getTimeStamp(position.timestamp),

                    },
                    success: function(result){
                        $('#result_ajax').html('Đã gửi tọa độ đến server');

                    },
                    error: function(){
                        $('#result_ajax').html('Không gửi được tọa độ');   
                    }
                });
            },
        500
        );

    });
}


function receiveGPS_ajax_and_notify(){
    navigator.geolocation.getCurrentPosition(function(position){
        var d = new Date();
        var t = d.toLocaleTimeString();
        var user_id = 0;
        if(localStorage.user_id!=undefined)
            user_id = localStorage.user_id;
        localStorage.longitude = position.coords.longitude;
        localStorage.latitude = position.coords.latitude;
        // document.getElementById("geolocation").innerHTML = 'Kinh độ: '+ position.coords.longitude + '<br/>'
        //                                                     + 'Vĩ độ: '+ position.coords.latitude + '<br/>'
        //                                                     + 'Thời gian gửi: '+ t + '<br/>'
        //                                                     + 'ID người gửi: '+ user_id;
        $.ajax({
                url: defaultAdress + 'checkLocation',
                type:'get',
                dataType:'text',
                data:{
                    user_id: user_id,
                    longitude:localStorage.longitude,
                    latitude: localStorage.latitude,
                    checkTime: getTimeStamp(position.timestamp),

                },
                success: function(result){
                    $('#result_ajax').html('Đã gửi tọa độ đến server');
                },
                error: function(){
                    $('#result_ajax').html('Không gửi được tọa độ');   
                }
            });
    });
}
function getTimeStamp(timestamp) {
   var now = new Date(timestamp);
   return ((now.getFullYear()) + '-' + ((now.getMonth()+1 < 10) ? ("0" + (now.getMonth()+1)) : (now.getMonth()+1)) + '-' + ((now.getDate() < 10) ? ("0" + now.getDate()) : (now.getDate())) + " " + ((now.getHours()<10) ? ("0" + now.getHours()) : (now.getHours()) ) + ':'
                 + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                 .getSeconds()) : (now.getSeconds())));
}


// function for getting token from server
function get_token_from_server(){
    var url = defaultAdress+'getToken';    
    var token='';
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
            },
        error:function(){ 
        }
    });
}
function post_login_ajax(){
    document.getElementById('loading').innerHTML = '<div class="sk-circle">'+
                    '<div class="sk-circle1 sk-child"></div>'+
                    '<div class="sk-circle2 sk-child"></div>'+
                    '<div class="sk-circle3 sk-child"></div>'+
                    '<div class="sk-circle4 sk-child"></div>'+
                    '<div class="sk-circle5 sk-child"></div>'+
                    '<div class="sk-circle6 sk-child"></div>'+
                    '<div class="sk-circle7 sk-child"></div>'+
                    '<div class="sk-circle8 sk-child"></div>'+
                    '<div class="sk-circle9 sk-child"></div>'+
                    '<div class="sk-circle10 sk-child"></div>'+
                    '<div class="sk-circle11 sk-child"></div>'+
                    '<div class="sk-circle12 sk-child"></div>'+
                  '</div>';
    var url = defaultAdress+'getToken';   
    var token='';
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                document.getElementById('loading').innerHTML = '';
                $('#_token').val(data);
                login_ajax();
            },
        error:function(){
            alert("Lỗi kết nối !");
        }
    }); 
}
//functio for login account
function login_ajax(){
    var url = defaultAdress+'loginMobile';  
    if($('#_token').val()!=''){
        $.ajax({
            url      : url,
            type     : "POST",
            data     : {
                        '_token':  $('#_token').val(),
                        'username': $('#username').val(),
                        'password': $('#password').val(),
                        'uuid': device.uuid,
                        'remember':1
                        },
            success  : function (data){
                if(data.code==200){
                    var user =  data.data;
                    saveInformation(user);
                    $('#_token').val('');
                    window.location = "main.html";
                }else{
                    $('#loading').html(data.message);
                }
            },
            error:function(){ 
                alert("Lỗi, vui lòng đăng nhập lại.");
            }
        });
    }
}


function post_login_latent(){
    var url = defaultAdress+'getToken';   
    var token='';
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
                login_latent();
            },
        error:function(){
            
        }
    }); 
}

function login_latent(){
    var url = defaultAdress+'loginMobile';  
    if($('#_token').val()!=''){
        $.ajax({
            url      : url,
            type     : "POST",
            data     : {
                        '_token':  $('#_token').val(),
                        'username': localStorage.username,
                        'remember_token': localStorage.remember_token,
                        'uuid': device.uuid,
                        },
            success  : function (data){
                    if(data.code==34)
                        window.location="login.html";
                    else if(data.code==200){
                        user = data.data;
                        localStorage.remember_token = user.rememberToken;
                        window.location="main.html";
                    }
                },
            error:function(){ 
                alert("Lỗi, vui lòng đăng nhập lại.");
            }
        });
    }
}




function post_register_ajax(){
    if(validateRegister()!=''){
        document.getElementById("resultRegister").innerHTML = validateRegister();
        setTimeout(function(){
            document.getElementById("resultRegister").innerHTML = '';
        },5000);
    }
    else
    {  
        var url = defaultAdress+'getToken';    

        $.ajax({
            url      : url,
            type     : "GET",
            data     : {
                        },
            success  : function (data){
                    $('#_token').val(data);
                    register_ajax();
                },
            error:function(){
                alert("Lỗi kết nối!");
            }
        });
    }
}

function register_ajax(){
    var url = defaultAdress+'register'; 
    if($('#_token').val()!=''){
        $.ajax({
            url      : url,
            type     : "POST",
            data     : {
                        '_token':  $('#_token').val(),
                        'uuid': device.uuid,
                        'username': $('#username').val(),
                        'email': $('#email').val(),
                        'password': $('#password').val(),
                        'password-again': $('#password-again').val(),
                        'phoneNumber': $('#phoneNumber').val(),
                        },
            success  : function (data){
                    if(data.code==200)
                    {
                        user = data.data;
                        saveInformation(user);
                        $('#_token').val('');
                        window.location = "main.html";
                    }else{
                        $('#resultRegister').html(data.data)
                    }

                },
            error:function(){ 
                alert("Lỗi, vui lòng đăng ký lại!");
            }
        });
    }
}

function validateRegister(){
    var validate='';
    if($('#username').val()=='')
        validate+="<p class='text-red'>Vui lòng nhập tên tài khoản. </p>";
    if($('#email').val()=='')
        validate+="<p class='text-red'>Vui lòng nhập địa chỉ email. </p>";
    if($('#password').val()=='')
        validate+="<p class='text-red'>Vui lòng nhập mật khẩu. </p>";
    if($('#password-again').val()!=$('#password').val())
        validate+="<p class='text-red'>Vui lòng xác nhận lại mật khẩu. </p>";
    if($('#phoneNumber').val()=='')
        validate+="<p class='text-red'>Vui lòng nhập số điện thoại. </p>";
    return validate;
}

function post_edit_user(){
    var url = defaultAdress+'getToken';    
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
                edit_user_ajax();
            },
        error:function(){
            alert("Lỗi kết nối!");
        }
    });
}

function edit_user_ajax(){
    var url = defaultAdress+'editUser'; 
    if($('#_token').val()!=''){
         if($('#gender-female').is(':checked'))
            gender = 'F';
        else
            gender = 'm';
        $.ajax({
            url      : url,
            type     : "POST",
            data     : {
                        '_token':  $('#_token').val(),
                        'uuid': device.uuid,
                        'phoneNumber': $('#phoneNumber').val(),
                        'firstName': $('#firstName').val(),
                        'lastName': $('#lastName').val(),
                        'dateOfBirth': $('#dob').val(),
                        'address': $('#address').val(),
                        'gender':gender
                        },
            success  : function (data){
                    alert(data.message);
                    if(data.code==200)
                    {
                        user = data.data;
                        saveInformation(user);
                        $('#_token').val('');
                    }
                    location.reload();
                },
            error:function(){ 
                alert("Lỗi, vui lòng kiểm tra kết nối !");
            }
        });
    }
}

function logout(){
    var url = defaultAdress + 'offline/';
    $.ajax({
            url: url,
            type:'get',
            dataType:'text',
            data:{
            },
            success: function(result){
                alert('Đã đăng xuất');
            },
            error: function(){
                alert('Lỗi ajax');
            }
        });

}


function post_create_pharmacy_ajax(){
    var url = defaultAdress+'getToken';    
    var token='';
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
                create_pharmacy_ajax();
            },
        error:function(){
            alert("Không lấy được token!");
        }
    });
}
// function for creating new pharmacy place
function create_pharmacy_ajax(){
    var url = defaultAdress + 'pharmacy/create';    
    if($('#_token').val()!='')
        navigator.geolocation.getCurrentPosition(function(position) {
            $.ajax({
                url      : url,
                type     : "POST",
                data     : {
                            '_token': $('#_token').val(),
                            'latitude': position.coords.latitude,
                            'longitude': position.coords.longitude,
                            'name': $('#name').val(),
                            'address': $('#address').val(),
                            'telephone': $('#telephone').val(),
                            },
                success  : function (data){
                        alert('Tạo địa điểm thành công.');
                    },
                error:function(){ 
                    alert("Lỗi, vui lòng thao tác lại");
                    }
                });
        });
}

