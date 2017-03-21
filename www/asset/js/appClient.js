// var defaultAdress = 'http://192.168.1.91/gpsv2/';
// var defaultAdress = 'http://localhost/gpsv2/';
var defaultAdress = 'http://haynhuthe.com/';
// save information of user
function saveInformation(user){
    localStorage.username= user.username;
    localStorage.user_id = user.id;
    localStorage.avatar = defaultAdress+'public/avatarUser/'+user.avatar;
    localStorage.firstName = user.firstName;
    localStorage.lastName = user.lastName;
    localStorage.phoneNumber = user.phoneNumber;
    localStorage.gender = user.gender;
    localStorage.email = user.email;
    localStorage.dateOfBirth = user.dateOfBirth;
    localStorage.address = user.address;
    localStorage.remember_token = user.rememberToken;
}

function defaultInformation(){
    var conf = confirm("Bạn muốn đăng xuất không ?");
    if(conf ==true)
    {
        var url = defaultAdress + 'offline';
        $.ajax({
                url: url,
                type:'get',
                dataType:'text',
                data:{
                },
                success: function(result){
                    alert('Đã đăng xuất');
                    localStorage.clear();
                    window.location = "login.html";
                },
                error: function(){
                    alert('Lỗi ajax');
                    localStorage.clear();
                    window.location = "login.html";
                }
            });
        // logout();
        // localStorage.clear();
        // window.location = "login.html";
    }
}

// check connection and decide cases to receive GPS location by ajax
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
    document.getElementById('connection').innerHTML =states[networkState];
    return states[networkState];
    
}

// close app 
function closeApp(){
    var conf = confirm("Bạn muốn thoát ứng dụng không ?");
    if(conf ==true)
    {
        logout();
        if (navigator.app) {
           navigator.app.exitApp();
        }
        else if (navigator.device) {
            navigator.device.exitApp();
        }
    }
}