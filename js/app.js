// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
    theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
    id: 'com.app.sayvers',
    root: '#app',
    theme: 'md',
    data: function () {
        return {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },
        };
    },
    methods: {
        helloWorld: function () {
            app.dialog.alert('Hello World!');
        },
    },
    routes: routes,
    popup: {
        closeOnEscape: true,
    },
    sheet: {
        closeOnEscape: true,
    },
    popover: {
        closeOnEscape: true,
    },
    actions: {
        closeOnEscape: true,
    },

    smartSelect: {
        pageTitle: 'Select Option',
        openIn: 'popup',
    }

});

let user_data_var = JSON.parse(localStorage.getItem('user_data'));
if(user_data_var != null){
    let pin = localStorage.getItem('pin');
    if( pin != 0){
        app.views.main.router.navigate('/verifypin/');
    } else{ 
        app.views.main.router.navigate('/homepage/');
    }
}else{
    $('.loader-screen').show();
}

setTimeout(function () {
    $('.loader-screen').hide();
}, 2000);

// check for updates
// checkUpdates(appVersion).then(res => {
//     if(res.status){
//         app.dialog.alert(res.message, 'Update Required!', () => {
//             // open google playstore
//             window.open('https://skycombabs.com/assets/skycombabs.apk', '_system');
//         })
//     }
// })

$('#logout').click(function(e){
    localStorage.clear();
    app.views.main.router.navigate('/signin/');
})

//$('.introduction').css('min-height', 'calc(100vh - 58px)' )

$$(document).on('page:init', function (e) {
    /* background image to cover */
    $('.background').each(function () {
        var imagewrap = $(this);
        var imagecurrent = $(this).find('img').attr('src');
        if (imagecurrent != undefined || imagecurrent != null) {
            imagewrap.css('background-image', 'url("' + imagecurrent + '")');
            $(this).find('img').remove();
        }

    });


    $('.page-content').on('scroll', function () {
        /* header active on scroll more than 50 px*/
        if ($(this).scrollTop() >= 30) {
            $('.navbar').addClass('active');
        } else {
            $('.navbar').removeClass('active')
        }
    });


});

$$(document).on('page:init', '.page[data-name="thankyou"]', function (e) {
    setTimeout(function() {
        app.views.main.router.navigate('/homepage/');
    }, 2000)

});

$$(document).on('page:init', '.page[data-name="signin"]', function(e){

    $(document).off("click", "#loginButton").on("click", "#loginButton", function(e) {
        e.preventDefault();
        var email = $("#loginEmail").val();
        var password = $("#loginPassword").val();
        let req = {email, password}
        if( email && password ) 
        {
            login(req);
        }else
        {
            app.dialog.alert("Please enter your username and password", "Login Errors");
        }
    });
})

$$(document).on('page:init', '.page[data-name="resetpassword"]', function(e){
    $(document).off("click", "#resetPassword").on("click", "#resetPassword", function(e) {
        var email = $("#emailAddress").val();
        let req = {email}
        if(email)
        {
            app.preloader.show();
            promiseTimeout(30000, resetPassword(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Success!", () => {
                            app.views.main.router.navigate('/resetpassword/')
                        });
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("Please enter your registered email address", "Oops!");
        }
    });
})

$$(document).on('page:init', '.page[data-name="resetpwd"]', function(e){
    $(document).off("click", "#resetPasswordBtn").on("click", "#resetPasswordBtn", function(e) {
        var password = $("#password2").val();
        var confirmPwd = $("#confirmPassword2").val();
        var resetcode = $("#resetcode").val();
        var email = $("#email2").val();

        let req = {password, confirmPwd, resetcode, email}
        if(password && confirmPwd && resetcode && email)
        {
            app.preloader.show();
            promiseTimeout(30000, changePasswordReset(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Success!", () => {
                            app.views.main.router.navigate('/signin/')
                        });
                    }else{
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Oops!");
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("All fields are required", "Oops!");
        }
    });
})

$$(document).on('page:init', '.page[data-name="notifications"]', function (e) {
    app.preloader.show('multi');
    let userData = JSON.parse(localStorage.getItem('user_data'));
    fetchNotifications(userData.uuid, userData.sess_token)
        .then(res => {
            let item = '';
            if(res.status){
                let notifications = res.data;
                if(notifications.length >= 1){
                    for(let i = 0; i < notifications.length; i++){
                        item += `<li style="border-bottom: 1px solid #000">
                                        <a class="item-content">
                                            <div class="item-inner">
                                                <div class="row">
                                                    <div class="col pl-0">
                                                        <div class="item-title-row">
                                                            <div class="item-title">${notifications[i].title}</div>
                                                            <div class="item-after">${notifications[i].created_at}</div>
                                                        </div>
                                                        <div class="item-text">${notifications[i].message}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>`;
                    }
                }else{
                    item += `<li>
                                <div class="row mx-0 width-100 align-items-center">
                                    <div class="col-auto px-0">
                                        <div class="avatar avatar-50 no-shadow border-0">
                                        </div>
                                    </div>
                                    <div class="col align-self-center pr-0">
                                        <h6 class="font-weight-normal mb-1 mt-0">No notifications found</h6>
                                    </div>
                                    <div class="col text-align-right align-self-center">
                                        <!-- <h6 class="text-color-red mt-0">-$154.0</h6> -->
                                    </div>
                                </div>
                            </li>`
                }

            }else{
                if(res.message === 'Unauthorized access'){
                    localStorage.clear();
                    app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                        app.views.main.router.navigate('/signin/');
                    })
                }

                item += `<li>
                            <div class="row mx-0 width-100 align-items-center">
                                <div class="col-auto px-0">
                                    <div class="avatar avatar-50 no-shadow border-0">
                                    </div>
                                </div>
                                <div class="col align-self-center pr-0">
                                    <h6 class="font-weight-normal mb-1 mt-0">No notifications found</h6>
                                </div>
                                <div class="col text-align-right align-self-center">
                                    <!-- <h6 class="text-color-red mt-0">-$154.0</h6> -->
                                </div>
                            </div>
                        </li>`
               
                
            }
            $('#notificationLists').html(item);
            app.preloader.hide();
        })
});
// bankaccount
$$(document).on('page:init', '.page[data-name="bankaccount"]', function(e){

    //get bank data 
    let account_details = JSON.parse(localStorage.getItem('account_details'));
    if(account_details == null || account_details == undefined){
        console.log("No Primary accout set");
        $$('#current_account').html('No account added');
    }
    else{
        let saved_acccount_no = account_details.account_number;
        let saved_bank_name = account_details.bank_name;
        $$('#current_account').html('<span>'+saved_acccount_no+'</span> (<span>'+ saved_bank_name+ '</span>)');
    }
      //Fetch banck details from server
      let userData = JSON.parse(localStorage.getItem('user_data')); 
      promiseTimeout(5000, fetchBankAccount(userData.uuid, userData.sess_token))
      .then(res => {
           if(res.status){
                $$('#current_account').html('<span>'+res.data.account_number +'</span> (<span>'+ res.data.bank_name+ '</span>)'); 
                var bank_list_nk = res.data.bank_list;
                //console.log(bank_list_nk)
                /**populate account form */
                var $secondChoice = $("#bank_name");
                //$secondChoice.empty();
                $.each(bank_list_nk, function(index, value) {
                    //console.log(value.code + " ... " +value.name)
                    $secondChoice.append("<option value='"+value.code+"'>" + value.name + "</option>");
                });

                // for(var i=0;i>=bank_list_nk.length;i++){
                //     $("#bank_name").append("<option value='"+bank_list_nk[i]["code"]+"'>"+bank_list_nk[i]["name"]+"    </option>");
                //     console.log("<option value='"+bank_list_nk[i]["code"]+"'>"+bank_list_nk[i]["name"]+"    </option>");
                // }              
            }
          
              
      }).catch((err) => {
          app.preloader.hide();
          app.dialog.alert(err, 'Time Out');
       })



    $(document).off("click", "#changeaccount_number").on("click", "#changeaccount_number", function(e) {
        let userData = JSON.parse(localStorage.getItem('user_data')); 
        var account_no = $("#account_number").val();
        var bank_account_name = $("#bank_account_name").val();
        var bank_name =  $('#bank_name').find(":selected").val() + '|' + $('#bank_name').find(":selected").text();
        var tranx_pin = $("#tranx_pin").val();
        if(account_no && bank_name && tranx_pin)
        {
        let req = {uuid: userData.uuid, sess_token:userData.sess_token, bank_account_name, account_no, bank_name, tranx_pin}

            app.preloader.show();
            promiseTimeout(5000, changeBankAccount(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert("Account updated successfully", "Success", () => {
                        $$('#current_account').html('<span>'+res.data.account_number +'</span> (<span>'+ res.data.bank_name+ '</span>)');

                            $("#account_number").val('');
                            $("#bank_name").val('');
                            $("#tranx_pin").val('');
                        });
                    }else{
                        if(res.message === 'Unauthorized access'){
                            localStorage.clear();
                            app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                                app.views.main.router.navigate('/signin/');
                            })
                        }
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Error")
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("Please enter all details", "Empty Field");
        }
    });
})
$$(document).on('page:init', '.page[data-name="changepassword"]', function(e){
    $(document).off("click", "#changePassword").on("click", "#changePassword", function(e) {
        let userData = JSON.parse(localStorage.getItem('user_data'));
        
        var password = $("#password22").val();
        var newPassword = $("#newpassword22").val();
        var confirmPwd = $("#confirmpassword22").val();

        let req = {uuid: userData.uuid, sess_token:userData.sess_token, password, newPassword, confirmPwd}
        if(password && newPassword && confirmPwd)
        {
            app.preloader.show();
            promiseTimeout(30000, changePassword(req))
                .then(res => {
                    if(res.status){
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Password Changed", () => {
                            localStorage.clear();
                        app.views.main.router.navigate('/signin/');
                        });
                    }else{
                        if(res.message === 'Unauthorized access'){
                            localStorage.clear();
                            app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                                app.views.main.router.navigate('/signin/');
                            })
                        }
                        app.preloader.hide();
                        app.dialog.alert(res.message, "Password Changed")
                    }
                }).catch(err => {
                    app.preloader.hide();
                    app.dialog.alert(err, "Timed Out");
                });
        }else
        {
            app.dialog.alert("Please enter your username and password", "Login Errors");
        }
    });
})
$$(document).on('page:init', '.page[data-name="signup"]', function(e){
    $(document).off("click", "#registerBtn").on("click", "#registerBtn", function(e) {
        let email = $("#reg_email").val();
        let password = $("#reg_password").val();
        let confirmpwd = $("#reg_confirmpwd").val();
        let firstname = $("#reg_firstname").val();
        let lastname = $("#reg_lastname").val();
        let phone = $("#reg_phone").val();
        let terms = $("#terms").val();
        let errMsg = "";
        let req = {email, password, confirmpwd, firstname, lastname, phone};
        if( email && password && confirmpwd && firstname && lastname && phone && terms ) 
        {
            if(confirmpwd === password){
                register(req);
            }else{
                errMsg = 'Passwords do not match';
            }
        }else
        {
            errMsg = 'All fields are required';
        }

        if(errMsg != ""){
            app.dialog.alert(errMsg, "Registration Errors");
        }
    });
});

$$(document).on('page:init', '.page[data-name="transactionpin"]', function (e) {
    $(".item-pin input").keyup(function() {
        if($(this).val().length == 1) {
            var input_flds = $(this).closest('form').find(':input');
            input_flds.eq(input_flds.index(this) + 1).focus();
        }
    });

    $('#changePin').click(function(e){
        let userData = JSON.parse(localStorage.getItem('user_data'));
        let pin1 = $('#pin1').val();
        let pin2 = $('#pin2').val()
        let pin3 = $('#pin3').val() 
        let pin4 = $('#pin4').val();
        let password = $('#password').val()
        let pin = pin1 + pin2 + pin3 + pin4;
        app.preloader.show();
        console.log(userData.sess_token);
        let req = {uuid: userData.uuid, sess_token: userData.sess_token, pin, password};
        if(pin1 && pin2 && pin3 && pin4 && password){
            changePin(req).then(res => {
                if(res.status){
                    app.preloader.hide();
                    app.dialog.alert(res.message, 'Operation Successful', () => {

                        localStorage.setItem('pin', 1111 )
                        app.views.main.router.navigate('/homepage/');
                    })
                }else{
                    app.preloader.hide();
                    app.dialog.alert(res.message, 'Operation Failed');
                    if(res.message === 'Unauthorized access'){
                        localStorage.clear();
                        app.dialog.alert('Session timeout, please login again', 'Session timeout', () => {
                            app.views.main.router.navigate('/signin/');
                        })
                    }
                }
            })

        }else{
            app.preloader.hide();

            app.dialog.alert('All fields are required', 'Error')
        }
    })
})


$$(document).on('page:init', '.page[data-name="verifypin"]', function (e) {
    $(".item-pin input").keyup(function() {
        if($(this).val().length == 1) {
            var input_flds = $(this).closest('form').find(':input');
            input_flds.eq(input_flds.index(this) + 1).focus();
        }
    });

    $('#verifyPin').click(function(e){ 

        let userData = JSON.parse(localStorage.getItem('user_data'));
        console.log("i am here! 1")
        var u_pin = localStorage.getItem('pin') ;
        var pintry = localStorage.getItem('pintry') ;
        pintry = (pintry *1) + 1; 

        if( pintry >= 10){
            console.log("i am here! 3")

            localStorage.clear();
            app.dialog.alert('You have provided invalid pin 10 times, please login or reset password', 'Session timeout', () => {
                app.preloader.hide(); 
                app.views.main.router.navigate('/signin/');
            })
        }
        localStorage.setItem('pintry', pintry );
        let pin1 = $('#pin1').val();
        let pin2 = $('#pin2').val()
        let pin3 = $('#pin3').val() 
        let pin4 = $('#pin4').val(); 
        let pin = pin1 + pin2 + pin3 + pin4;
        app.preloader.show(); 
        console.log("i am here! 2")

        let req = {uuid: userData.uuid, sess_token: userData.sess_token, pin};
        if(pin1 && pin2 && pin3 && pin4 ){ 
                
            verifyPin(req).then(res => {
                if( res.status ){
                    console.log("i am here! 3.5")

                    app.preloader.hide(); 
                    localStorage.setItem('pintry', 0)
                        app.views.main.router.navigate('/homepage/'); 
                }else{
                    console.log("i am here! 4")
                     $('#pin1').val("");
                     $('#pin2').val("")
                     $('#pin3').val("") 
                     $('#pin4').val("");
                    app.preloader.hide();
                    app.dialog.alert( 'Incorrect Pin, Try Again', 'Failed');
                   
                }
            })

        }else{
            app.preloader.hide();

            app.dialog.alert('All fields are required', 'Error')
        }
    })
})


$$(document).on('page:init', '.page[data-name="assets"]',function (e) {
    let page_param = app.view.main.router.currentRoute.params;
    let isWithdrawPage = page_param.withdraw;
    let wallet_list = document.getElementById("wallet-list");
    let wallet_data = JSON.parse(localStorage.getItem('wallet_data'));
    if(isWithdrawPage == "true"){
        $$(".title").html("Withdraw");
    }
    var returnData = '';
    if(wallet_data.wallet != undefined){
        wallet_data.wallet.forEach(function(result) {
            // console.log(result);
            //result = ["asset": '$1,000', "profit": '$100', "asset_id": '294898798498', ]
            if(isWithdrawPage == "true"){
                returnData += '<li class="item-content card shadow border-2" style="margin-top: 20px; margin: 20px">  ' +
                '<div class="item-inner text-align-left  list-asset-single" data-id="' + result.id + '"data-asset="' + result.asset + '"data-earnings="' + result.earnings + '">' +
                '<div class="item-title-row row">' +
                '<div class="item-title col">$' + to_NGN(result.asset) + '</div>' +
                '<div class="item-subtitle col text-align-right " style="font-size: 70%;">$' + to_NGN(result.earnings)  + '</div> </div>' +
                '<div class="item-subtitle text-align-right"></div>' +
                '</div> </li> ';
            }
            else{
                returnData += '<li class="item-content card shadow border-2" style="margin-top: 20px; margin: 20px">  ' +
                '<div class="item-inner text-align-left" data-id="' + result.id + '">' +
                '<div class="item-title-row row">' +
                '<div class="item-title col">$' + to_NGN(result.asset)  + '</div>' +
                '<div class="item-subtitle col text-align-right " style="font-size: 70%;">$' + to_NGN(result.earnings)  + '</div> </div>' +
                '<div class="item-subtitle text-align-right"><a href="/withdraw/" class="withdraw_opt withdraw-asset-btn" data-id="' + result.id +
                 '"data-asset="' + to_NGN(result.asset)  + '"data-earnings="' + result.earnings + '">withdraw</a></div>' +
                '</div> </li> ';
                }
            
        });
            
        // console.log(returnData);
        wallet_list.innerHTML = returnData;
    }
    
	console.log("indice");
	var $ptrContent = $$('.ptr-content');
		// Add 'refresh' listener on it
	$ptrContent.on('ptr:refresh', function (e) {
			// Emulate 2s loading
		setTimeout(function () {	
            // When loading done, we need to reset it
            // app.pullToRefreshDone();
           let userData = JSON.parse(localStorage.getItem('user_data'));
           fetchBalance(userData.uuid,  userData.sess_token).then(response => {
            if(response.status){
               if(response.data != undefined){
                returnData = '';
                response.data.wallet.forEach(function(result) {
                    // console.log(result);
                    //result = ["asset": '$1,000', "profit": '$100', "asset_id": '294898798498', ]
                    if(isWithdrawPage == "true"){
                        returnData += '<li class="item-content card shadow border-2" style="margin-top: 20px; margin: 20px">  ' +
                        '<div class="item-inner text-align-left list-asset-single" data-id="' + result.id + '"data-asset="' + result.asset + '"data-earnings="' + result.earnings +  '">' +
                        '<div class="item-title-row row">' +
                        '<div class="item-title col">$' + to_NGN(result.asset)  + '</div>' +
                        '<div class="item-subtitle col text-align-right " style="font-size: 70%;">$' + to_NGN(result.earnings)  + '</div> </div>' +
                        '<div class="item-subtitle text-align-right "></div>' +
                        '</div> </li> ';
                    }
                    else{
                        returnData += '<li class="item-content card shadow border-2" style="margin-top: 20px; margin: 20px">  ' +
                        '<div class="item-inner text-align-left" data-id="' + result.id + '">' +
                        '<div class="item-title-row row">' +
                        '<div class="item-title col">$' + to_NGN(result.asset)  + '</div>' +
                        '<div class="item-subtitle col text-align-right " style="font-size: 70%;">$' + to_NGN(result.earnings)  + '</div> </div>' +
                        '<div class="item-subtitle text-align-right "><a href="/withdraw/" class="withdraw_opt withdraw-asset-btn" data-id="' + result.id + '"data-asset="' + result.asset + '"data-earnings="' + result.earnings + '">withdraw</a></div>' +
                        '</div> </li> ';
                    }
                });
                    
                // console.log(returnData);
                wallet_list.innerHTML = returnData;
                   
               } 
                    
           }else{
               if(response.message == "No active wallet"){
                   document.getElementById("account_balance").innerHTML = 0.00.toLocaleString('en-US', {
                       style: 'currency',
                       currency: 'USD',
                     });
                   document.getElementById("account_gain").innerHTML = 0;
                   document.getElementById("account_loss").innerHTML = 0;
                   console.log(response.message);
               }                  
           }
               
       }).catch((err) => {
          console.log("error timout");
        })
			console.log("refresh! Index");
			app.ptr.done(); // or e.detail();
		}, 3000);
    });
    $(document).off("click", ".list-asset-single").on("click", ".list-asset-single", function(e) {
        console.log('withdraw')
        var walletId = this.dataset.id;
        var asset = this.dataset.asset;
        var earnings = this.dataset.earnings;
        localStorage.removeItem('withdraw_wallet');
        console.log(walletId + '"'+ asset + '"' + earnings);
        localStorage.setItem('withdraw_wallet', JSON.stringify({ walletId: walletId, asset: asset, earnings: earnings}));
        app.views.main.router.navigate('/withdraw/');
 
     });
    
    $(document).off("click", ".withdraw-asset-btn").on("click", ".withdraw-asset-btn", function(e) {
       console.log('withdraw')
       var walletId = this.dataset.id;
       var asset = this.dataset.asset;
       var earnings = this.dataset.earnings;
       localStorage.removeItem('withdraw_wallet');
       console.log(walletId + '"'+ asset + '"' + earnings);

       localStorage.setItem('withdraw_wallet', JSON.stringify({ walletId: walletId, asset: asset, earnings: earnings}));
    //    console.log(walletId);

    });

});
$$(document).on('page:init', '.page[data-name="withdraw"]', function(e){
    // let walletId = app.view.main.router.currentRoute.params.walletId;
})

$$(document).on('page:init', '.page[data-name="homepage"]', function (e) {
    // let wallet_block = document.getElementById("wallet-block");
    // let wallet_data = JSON.parse(localStorage.getItem('wallet_data'));
    // console.log(wallet_data.wallet);
    
    // $('#asset-details-btn').on('click', function (e) {
    //     $( "#details-btn-block" ).addClass( 'hidden-asset-block');
    //     $( "#withdraw-asset-block").removeClass( 'hidden-asset-block'); 
    // });
    // $('.single-wallet-block').on('click', function (e) {
    //     console.log('yayaya');
    //     $( "#withdraw-btn-block" ).addClass( 'hidden-asset-block');
    //     $( "#details-asset-block").removeClass( 'hidden-asset-block'); 
    // });
    //Fetch acccount wallet
    let userData = JSON.parse(localStorage.getItem('user_data'));
    console.log(userData);
    let uuid = userData.uuid;
    let sess_token = userData.sess_token;
    // app.preloader.show();
        promiseTimeout(5000, fetchBalance(uuid, sess_token))
        .then(response => { 
             if(response.status){
                if(response.data != undefined){
                    //Render wallet Data to page
                    response.data.total_funds = to_NGN(response.data.total_funds) * 1
                    document.getElementById("account_balance").innerHTML = response.data.total_funds.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      });
                    document.getElementById("account_gain").innerHTML = to_NGN(response.data.gain);
                    document.getElementById("account_loss").innerHTML = to_NGN(response.data.loss);
                    // app.preloader.hide();
                } 
                     
            }else{
                if(response.message == "No active wallet"){
                    document.getElementById("account_balance").innerHTML = 0.00.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      });
                    document.getElementById("account_gain").innerHTML = 0;
                    document.getElementById("account_loss").innerHTML = 0;
                    console.log(response.message);
                }                  
            }
                
        }).catch((err) => {
            app.preloader.hide();
            app.dialog.alert(err, 'Time Out');
         })

         
         
    /* chart js */
    var ctx = document.getElementById("linechart").getContext('2d');

    var gradient2 = ctx.createLinearGradient(0, 0, 0, 200);
    gradient2.addColorStop(0, 'rgba(151, 94, 251, 0.40)');
    gradient2.addColorStop(1, 'rgba(91, 168, 255, 0.40)');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            datasets: [{
                label: ' Used MB',
                backgroundColor: gradient2,
                data: [65, 70, 60, 90, 75, 100, 130, 120, 150],
                borderColor: "rgba(151, 94, 251, 0.40)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderWidth: 2,
                borderDashOffset: 1,
                borderJoinStyle: 'bevel',
                pointBorderColor: "#ffffff",
                pointBackgroundColor: "#7b65f4",
                pointBorderWidth: 1,
                pointHoverRadius: 2,
                pointHoverBackgroundColor: "#000000",
                pointHoverBorderColor: "#ffffff",
                pointHoverBorderWidth: 0,
                pointRadius: 2,
                pointHitRadius: 6,
                    }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: 'Chart.js  Line Chart',
            },
            legend: {
                display: false,
                labels: {
                    fontColor: "#888888"
                }
            },
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        fontColor: "#888888",
                        beginAtZero: true,
                    },
                    gridLines: {
                        color: "rgba(160,160,160,0.1",
                        zeroLineColor: "rgba(160,160,160,0.15)"
                    }
                        }],
                xAxes: [{
                    display: false,
                    ticks: {
                        fontColor: "#888888"
                    },
                    gridLines: {
                        color: "rgba(160,160,160,0.1)",
                        zeroLineColor: "rgba(160,160,160,0.15)"
                    }
                        }]
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        }
    });
    

    promiseTimeout(8000, fetchBankAccount(userData.uuid, userData.sess_token))
    .then(res => {
         if(res.status){
              console.log("account updated")            
          }
            
    }).catch((err) => {
        console.log("account not updated")         
     })
  

});
